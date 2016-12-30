
export default class ProxyPromise {
  constructor() {
    this.state = 'pending'

    this.underlyingPromise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        this.state = 'resolved'
        this.value = value
        resolve(value)
      }

      this.reject = (error) => {
        this.state = 'rejected'
        this.error = error
        reject(error)
      }
    })

    this.callback = (error, value) => {
      (error == null) ? this.resolve(value) : this.reject(error)
    }
  }

  then(...args) {
    return this.underlyingPromise.then(...args)
  }

  catch(...args) {
    return this.underlyingPromise.catch(...args)
  }
}
