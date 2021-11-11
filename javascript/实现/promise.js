//未实现完
class MyPromise {
  constructor (fn) {
    this.state = 'padding';
    this.result;
    this.tasks = [];
    fn(this.resolve, this.reject);
  }
  resolve (result) {
    this.state = 'resolve';
    this.result = result;
  }
  reject () {}
  then (fn) {
    if (this.state === 'padding') {
      this.tasks.push(fn);
    } else {
      const newResult = fn(this.result);
      if (newResult) {
        this.result = newResult;
      }
    }
    return this;
  }
}

const promise = new MyPromise((res, rej) => {
  setTimeout(() => {
    res('ok');
  }, 2000);
});
const result = promise.then(result => {
  console.log('then', result);
});
console.log('over', result);
