import { spy } from 'sinon'
import { expect, assert } from 'chai'

import ProxyPromise from '../src'


describe('ProxyPromise', function() {

  it("should start in 'pending' state", function() {
    expect(new ProxyPromise().state).to.equal('pending')
  })

  it("should move to 'resolved' state and have value when resolved", function() {
    const p = new ProxyPromise()
    const value = 1010
    p.resolve(value)

    expect(p.state).to.equal('resolved')
    expect(p.value).to.equal(value)
    expect(p.error).to.equal(undefined)
  })

  it("should move to 'rejected' state and have an error when rejected", function() {
    const p = new ProxyPromise()
    const error = new Error()
    p.reject(error)

    expect(p.state).to.equal('rejected')
    expect(p.value).to.equal(undefined)
    expect(p.error).to.equal(error)

    p.catch(nop) // the unhandled rejection terminates modern Node
  })

  it("should return a regular Promise from `then`", function() {
    expect(new ProxyPromise().then(nop)).to.be.instanceof(Promise)
  })

  it("should return a regular Promise from `catch`", function() {
    expect(new ProxyPromise().catch(nop)).to.be.instanceof(Promise)
  })

  it("should invoke onThen handlers after resolve is invoked", function(done) {
    const p = new ProxyPromise()

    const h1 = spy()
    const h2 = spy(x => x)
    const h3 = spy()

    p.then(h1)
    p.then(h2).then(h3)

    const value = 1010

    p.resolve(value)

    setImmediate(function() {
      assert(h1.calledOnce)
      assert(h2.calledWithExactly(value))

      assert(h2.calledOnce)
      assert(h2.calledWithExactly(value))

      assert(h3.calledOnce)
      assert(h3.calledWithExactly(value))

      done()
    })
  })

  it("should invoke onCatch handlers after reject is invoked", function(done) {
    const p = new ProxyPromise()

    const h1 = spy()
    const h2 = spy()

    p.catch(h1)
    p.then(x => x).catch(h2)

    const error = new Error('oops')

    p.reject(error)

    setImmediate(function() {
      assert(h1.calledOnce)
      assert(h2.calledWithExactly(error))

      assert(h2.calledOnce)
      assert(h2.calledWithExactly(error))

      done()
    })
  })

  it("should be resolved by its callback", function() {
    const p1 = new ProxyPromise()
    const value = 1010

    p1.resolve = spy(p1.resolve)
    p1.callback(null, value)

    assert(p1.resolve.calledOnce)
    assert(p1.resolve.calledWithExactly(value))
  })

  it("should be rejected by its callback", function() {
    const p2 = new ProxyPromise()
    const error = new Error()

    p2.catch(nop) // the unhandled rejection terminates modern Node
    p2.reject = spy(p2.reject)
    p2.callback(error)

    assert(p2.reject.calledOnce)
    assert(p2.reject.calledWithExactly(error))
  })

  it("should have a self-bound callback", function() {
    const p = new ProxyPromise()
    p.resolve = spy(p.resolve)

    const value = 1010
    const callback = p.callback // would break with an unbound function
    callback(null, value)

    assert(p.resolve.calledWithExactly(value))
  })
})


function nop() {}
