import assert from 'assert'
import domino from 'domino'
import pagelib from '../../build/wikimedia-page-library-transform'

describe('ThrottledScrollEventEmitter', () => {
  const ThrottledScrollEventEmitter = pagelib.test.ThrottledScrollEventEmitter

  // Add expected browser CustomEvent type to environment.
  global.CustomEvent = domino.impl.CustomEvent

  beforeEach(function Test() {
    const window = domino.createWindow()

    // Domino doesn't implement Window.scroll*(), requestAnimationFrame(), or cancelAnimationFrame()
    // methods.
    this.scroll = () => window.dispatchEvent(new domino.impl.Event('scroll'))

    this.callbacks = []
    window.requestAnimationFrame = callback => { this.callbacks.push(callback); return 1 }
    window.cancelAnimationFrame = () => this.callbacks.pop()
    this.issueAnimationFrame = () => {
      this.callbacks.forEach(callback => {
        callback()
      })
      this.callbacks = []
    }

    this.registerEventCallback = callback =>
      window.addEventListener(ThrottledScrollEventEmitter.DEFAULT_EVENT_TYPE, callback)
    this.deregisterEventCallback = callback =>
      window.removeEventListener(ThrottledScrollEventEmitter.DEFAULT_EVENT_TYPE, callback)

    this.subject = new ThrottledScrollEventEmitter(window)
  })

  describe('register()', () => {
    it('when unregistered, no event is emitted', function Test() {
      this.registerEventCallback(assert.fail)
      this.scroll()
      this.issueAnimationFrame()
      this.deregisterEventCallback(assert.fail)
    })

    describe('when registered', () => {
      beforeEach(function Test() { this.subject.register() })
      afterEach(function Test() { this.subject.deregister() })

      it('and scrolled, no event is emitted', function Test() {
        this.registerEventCallback(assert.fail)
        this.scroll()
        this.deregisterEventCallback(assert.fail)
      })

      it('and a new frame, no event is emitted', function Test() {
        this.registerEventCallback(assert.fail)
        this.issueAnimationFrame()
        this.deregisterEventCallback(assert.fail)
      })

      // eslint-disable-next-line max-len
      it('and deregistered after a scroll and reregistered with a scroll and new frame, an event is emitted', function Test(done) {
        this.scroll()
        this.subject.deregister()
        this.subject.register()
        this.scroll()

        const callback = () => done() // eslint-disable-line require-jsdoc
        this.registerEventCallback(callback)
        this.issueAnimationFrame()
        this.deregisterEventCallback(callback)
      })

      it('and scrolled and a new frame, an event is emitted', function Test(done) {
        this.scroll()

        const callback = () => done() // eslint-disable-line require-jsdoc
        this.registerEventCallback(callback)
        this.issueAnimationFrame()
        this.deregisterEventCallback(callback)
      })

      describe('and an event is emitted', () => {
        beforeEach(function Test() {
          this.scroll()
          this.issueAnimationFrame()
        })

        it('and scrolled, no event is emitted', function Test() {
          this.registerEventCallback(assert.fail)
          this.scroll()
          this.deregisterEventCallback(assert.fail)
        })

        it('and a new frame, no event is emitted', function Test() {
          this.registerEventCallback(assert.fail)
          this.issueAnimationFrame()
          this.deregisterEventCallback(assert.fail)
        })

        it('and scrolled and a new frame, an event is emitted', function Test(done) {
          this.scroll()

          const callback = () => done() // eslint-disable-line require-jsdoc
          this.registerEventCallback(callback)
          this.issueAnimationFrame()
          this.deregisterEventCallback(callback)
        })
      })
    })
  })

  describe('deregister()', () => {
    describe('when registered', () => {
      beforeEach(function Test() {
        this.subject.register()
      })

      it('and deregistered, no event is emitted', function Test() {
        this.subject.deregister()

        this.registerEventCallback(assert.fail)
        this.scroll()
        this.issueAnimationFrame()
        this.deregisterEventCallback(assert.fail)
      })

      it('and scrolled then deregistered, no event is emitted', function Test() {
        this.scroll()
        this.subject.deregister()

        this.registerEventCallback(assert.fail)
        this.issueAnimationFrame()
        this.deregisterEventCallback(assert.fail)
      })
    })
  })
})