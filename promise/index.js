const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(executor) {
  this.status = PENDING;
  this.data = undefined;
  this.callbacks = [];

  try {
    executor(resolve.bind(this), reject.bind(this));
  } catch (e) {
    reject(e);
  }
}

function resolve(value) {
  setTimeout(() => {
    if (this.status === PENDING) {
      this.status = RESOLVED;
      this.data = value;

      this.callbacks.forEach(({ onResolved }) => onResolved(value));
    }
  });
}

function reject(reason) {
  setTimeout(() => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.data = reason;

      this.callbacks.forEach(({ onRejected }) => onRejected(reason));
    }
  });
}

MyPromise.prototype.then = function then(onResolved, onRejected) {
  onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
  onRejected =
    typeof onRejected === "function" ? onRejected : (reason) => reason;

  let promise = new MyPromise((resolve, reject) => {
    if (this.status === PENDING) {
      this.callbacks.push({
        onResolved: (value) => {
          parse.call(this, promise, onResolved(value), resolve, reject);
        },
        onRejected: (reason) => {
          parse.call(this, promise, onRejected(reason), resolve, reject);
        },
      });
    }

    if (this.status === RESOLVED) {
      parse.call(this, promise, onResolved(this.data), resolve, reject);
    }

    if (this.status === REJECTED) {
      parse.call(this, promise, onRejected(this.data), resolve, reject);
    }
  });

  return promise;
};

function parse(promise, result, resolve, reject) {
  if (promise === result) {
    throw new TypeError("Chaining cycle detected for promise");
  }

  setTimeout(() => {
    try {
      if (result instanceof MyPromise) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (e) {
      reject(e);
    }
  });
}

MyPromise.resolve = function resolve(value) {
  return new MyPromise((resolve, reject) => {
    if (value instanceof MyPromise) {
      value.then(resolve, reject);
    } else {
      resolve(value);
    }
  });
};

MyPromise.reject = function reject(reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

MyPromise.all = function all(promises) {
  const resolves = [];

  return new MyPromise((resolve, reject) => {
    promises.forEach((p) => {
      p.then(
        (value) => {
          resolves.push(value);

          if (resolves.length === promises.length) {
            resolve(resolves);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};

MyPromise.race = function race(promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((p) => {
      p.then(
        (value) => resolve(value),
        (reason) => reject(reason)
      );
    });
  });
};

module.exports = MyPromise;
