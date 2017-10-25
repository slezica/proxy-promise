
export type OnResolve<T, R> =
  ((value: T) => R | PromiseLike<R>)
  | null
  | undefined

export type OnReject<R> =
  ((error: any) => R | PromiseLike<R>)
  | null
  | undefined


export default class ProxyPromise<T> implements PromiseLike<T> {
  public state: 'pending' | 'resolved' | 'rejected'

  public value?: T
  public error?: Error

  public resolve  : (value: T) => void
  public reject   : (error: Error) => void
  public callback : (error?: Error, value?: T) => void

  private _promise: Promise<T>

  constructor() {
    this.state = 'pending'

    this._promise = new Promise<T>((resolve, reject) => {
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

  then<R1, R2>(onResolve?: OnResolve<T, R1>, onReject?: OnReject<R2>) {
    return this._promise.then(onResolve, onReject)
  }

  catch<R>(onReject?: OnReject<R>) {
    return this._promise.catch(onReject)
  }
}
