import Timer from '../utilities/Timer'
import assert from 'assert'
import domino from 'domino'
import pagelib from '../../build/wikimedia-page-library-transform'

describe('EventThrottle', function Test() {
  const EventThrottle = pagelib.test.EventThrottle
  const SCROLL_EVENT_TYPE = 'scroll'
  const THROTTLED_EVENT = new domino.impl.CustomEvent('scroll:throttled')

  beforeEach(() => {
    this.window = new Timer()
    this.window.scroll = undefined
    this.window.addEventListener = (eventType, scroll) => { this.window.scroll = scroll }
    this.window.removeEventListener = () => { this.window.scroll = undefined }

    this.eventThrottle = new EventThrottle(this.window, 0)
  })

  describe('register()', () => {
    describe('when unregistered', () => {
      it('unregistered is reported', () => assert.ok(!this.eventThrottle.registered()))
      it('no event is posted', () => assert.ok(!this.window.timeout))
      it('no event is subscribed', () => assert.ok(!this.window.scroll))
    })

    describe('when registered', () => {
      beforeEach(() =>
        this.eventThrottle.register(this.window, SCROLL_EVENT_TYPE, THROTTLED_EVENT.type))
      afterEach(() => { this.eventThrottle.deregister() })

      it('registered is reported', () => assert.ok(this.eventThrottle.registered()))

      it('no event is posted', () => assert.ok(!this.window.timeout))

      it('events are subscribed', () => assert.ok(this.window.scroll))

      it('and not scrolled, no event is posted', () => assert.ok(!this.window.timeout))

      it('and scrolled, no event is posted', () => {
        this.window.dispatchEvent = assert.fail
        this.window.scroll()
      })

      describe('and scrolled', () => {
        beforeEach(() => this.window.scroll())

        it('and a timeout, an event is posted', done => {
          this.window.dispatchEvent = () => done()
          this.window.timeout()
        })

        it('and a timeout, one event is posted', () => {
          this.window.dispatchEvent = () => {}
          this.window.timeout()
          assert.ok(this.window.sets === 1)
        })

        describe('and scrolled again', () => {
          beforeEach(() => this.window.scroll())

          it('and a timeout, an event is posted', done => {
            this.window.dispatchEvent = () => done()
            this.window.timeout()
          })

          it('and a timeout, one event is posted', () => {
            this.window.dispatchEvent = () => {}
            this.window.timeout()
            assert.ok(this.window.sets === 1)
          })
        })

        describe('and deregistered and registered', () => {
          beforeEach(() => {
            this.eventThrottle.deregister()
            this.eventThrottle.register(this.window, SCROLL_EVENT_TYPE, THROTTLED_EVENT.type)
          })

          it('registered is reported', () => assert.ok(this.eventThrottle.registered()))

          it('no event is posted', () => assert.ok(this.window.sets === 1))

          it('events are subscribed', () => assert.ok(this.window.scroll))

          it('and scrolled, no event is posted', () => {
            this.window.dispatchEvent = assert.fail
            this.window.scroll()
          })

          it('and a timeout, an event is posted', done => {
            this.window.dispatchEvent = () => done()
            this.window.timeout()
          })

          it('and a timeout, one event is posted', () => {
            this.window.dispatchEvent = () => {}
            this.window.timeout()
            assert.ok(this.window.sets === 1)
          })
        })
      })
    })
  })

  describe('deregister()', () => {
    describe('when registered', () => {
      beforeEach(() =>
        this.eventThrottle.register(this.window, SCROLL_EVENT_TYPE, THROTTLED_EVENT.type))

      describe('and deregistered', () => {
        beforeEach(() => this.eventThrottle.deregister())

        it('unregistered is reported', () => assert.ok(!this.eventThrottle.registered()))
        it('no event is posted', () => assert.ok(!this.window.timeout))
        it('no event is subscribed', () => assert.ok(!this.window.scroll))
      })

      describe('and scrolled and deregistered', () => {
        beforeEach(() => {
          this.window.scroll()
          this.eventThrottle.deregister()
        })

        it('unregistered is reported', () => assert.ok(!this.eventThrottle.registered()))
        it('no event is posted', () => assert.ok(this.window.sets === this.window.clears))
        it('no event is subscribed', () => assert.ok(!this.window.scroll))
      })
    })
  })
})