'use strict'

/* global Feature, Scenario, Given, When, Then */
const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

Feature('Test promise-readable module with stream1 API', () => {
  const PromiseReadable = require('../lib/promise-readable')
  const EventEmitter = require('events')

  class MockStream extends EventEmitter {
    constructor () {
      super()
      this.readable = true
    }
    pause () {}
    resume () {}
  }

  Scenario('Read chunks from stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk1'))
    })

    Then('promise returns chunk', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk1'))
    })

    When('I call read method again', () => {
      this.promise = this.promiseReadable.read()
    })

    When('another data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk2'))
    })

    Then('promise returns another chunk', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk2'))
    })
  })

  Scenario('Read empty stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('close event is emitted', () => {
      this.stream.emit('end')
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Read ended stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promiseReadable.read()
    })

    When('close event is emitted', () => {
      this.stream.emit('end')
    })

    When('I call read method again', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Read stream with error', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('error event is emitted', () => {
      this.stream.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Read all from stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call readAll method', () => {
      this.promise = this.promiseReadable.readAll()
    })

    When('data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk1'))
    })

    When('another data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk2'))
    })

    When('close event is emitted', () => {
      this.stream.emit('end')
    })

    Then('promise returns all chunks in one buffer', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk1chunk2'))
    })
  })

  Scenario('Read all from ended stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promiseReadable.read()
    })

    When('close event is emitted', () => {
      this.stream.emit('end')
    })

    When('I call readAll method', () => {
      this.promise = this.promiseReadable.readAll()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Read all from stream with error', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call readAll method', () => {
      this.promise = this.promiseReadable.readAll()
    })

    When('data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk1'))
    })

    When('error event is emitted', () => {
      this.stream.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Wait for open from stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call open method', () => {
      this.promise = this.promiseReadable.onceOpen()
    })

    When('open event is emitted', () => {
      this.stream.emit('open', 42)
    })

    Then('promise returns result with fd argument', () => {
      return this.promise.should.eventually.equal(42)
    })
  })

  Scenario('Wait for open from ended stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call open method', () => {
      this.promise = this.promiseReadable.onceOpen()
    })

    When('end event is emitted', () => {
      this.stream.emit('end')
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Wait for open from stream with error', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call open method', () => {
      this.promise = this.promiseReadable.onceOpen()
    })

    When('error event is emitted', () => {
      this.stream.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Wait for close from stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call close method', () => {
      this.promise = this.promiseReadable.onceClose()
    })

    When('close event is emitted', () => {
      this.stream.emit('close')
    })

    Then('promise returns result with fd argument', () => {
      return this.promise.should.eventually.be.undefined
    })
  })

  Scenario('Wait for close from ended stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call end method', () => {
      this.promiseReadable.end()
    })

    When('end event is emitted', () => {
      this.stream.emit('end')
    })

    When('I call close method', () => {
      this.promise = this.promiseReadable.onceClose()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Wait for close from stream with error', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call end method', () => {
      this.promise = this.promiseReadable.onceClose()
    })

    When('error event is emitted', () => {
      this.stream.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Wait for end from stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call end method', () => {
      this.promise = this.promiseReadable.end()
    })

    When('data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk1'))
    })

    When('another data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk2'))
    })

    When('close event is emitted', () => {
      this.stream.emit('end')
    })

    Then('promise returns no result', () => {
      return this.promise.should.eventually.be.null
    })
  })

  Scenario('Wait for end from ended stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promiseReadable.read()
    })

    When('close event is emitted', () => {
      this.stream.emit('end')
    })

    When('I call end method', () => {
      this.promise = this.promiseReadable.end()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Wait for end from stream with error', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call end method', () => {
      this.promise = this.promiseReadable.end()
    })

    When('data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk1'))
    })

    When('error event is emitted', () => {
      this.stream.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Read non-Readable stream', function () {
    Given('Non-Readable object', () => {
      this.stream = new MockStream()
      this.stream.readable = false
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('data event is emitted', () => {
      this.stream.emit('data', new Buffer('chunk1'))
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })
})