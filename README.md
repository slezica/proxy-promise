# ProxyPromise

A `ProxyPromise` is a `Promise` that can be manually settled and inspected. It
decouples the creation of the `ProxyPromise` object from the conditions that will
resolve or reject it.

For example, a function dispatching tasks to background workers can create a
`ProxyPromise` and return it immediately. A worker can later grab the `ProxyPromise`
and settle it, while the original caller is waiting.

```
npm install proxy-promise
```

The package includes Typescript definitions.


### Usage

The `ProxyPromise` constructor takes no parameters:

```javascript
const promise = new ProxyPromise()
```

You can invoke `.resolve(value)` or `.reject(error)` to settle the `ProxyPromise`
at any later time:

```javascript
const p1 = new ProxyPromise()
p1.resolve(10)

const p2 = new ProxyPromise()
p2.reject(new Error("ouch"))
```

Like a regular `Promise`, a `ProxyPromise` will ignore any calls to `resolve`
or `reject` after the first one.

Calling `then` or `catch` on the `ProxyPromise` will return a regular `Promise`.

```javascript
new ProxyPromise()
  .then(result => console.log(result)) // now a regular `Promise`

new ProxyPromise()
  .catch(error => console.error(error)) // now also a regular `Promise`
```

Only the original `ProxyPromise` object has the `resolve` and `reject` methods.
You can prevent other actors from settling the promise by calling `then`,
giving them a regular `Promise`.


### Inspection

You can inspect a `ProxyPromise` by looking at its `state` property. The `state`
is set to `'pending'` at creation, then to `'resolved'` or `'rejected'`.

- When `state` is `'resolved'`, the `ProxyPromise` will have a `value` property.

- When `state` is `'rejected'`, the `ProxyPromise` will have an `error` property.


### Extras

The `resolve` and `reject` methods of a `ProxyPromise` are already bound, so they
can be passed as arguments without using `.bind()`.

The `ProxyPromise` also comes with a `callback` property, a classic-style `function(error, value)`
that will invoke `reject(error)` or `resolve(value)`, depending on whether `error == null`.

```javascript
const promise = new ProxyPromise()

promise.then(value => console.log(value))

fs.readFile('README.md', promise.callback)
```
