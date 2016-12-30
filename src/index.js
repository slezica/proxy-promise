
export default class ProxyPromise {
  constructor() {
    this.state = 'pending'

    const promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })

    this.underlyingPromise = promise
      .then(value => {
        this.state = 'resolved'
        this.value = value
        return value
      })
      .catch(error => {
        this.state = 'rejected'
        this.error = error
        throw error
      })

    this.callback = (err, value) => {
      (err == null) ? this.resolve(err) : this.reject(value)
    }
  }

  then(...args) {
    return this.underlyingPromise.then(...args)
  }

  catch(...args) {
    return this.underlyingPromise.catch(...args)
  }
}
