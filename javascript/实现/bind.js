//特性： 返回一个函数、传参、new的话指向失效
Function.prototype.mybind = function (context) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
  }
  const bindArgs = [...arguments].slice(1);
  const self = this;
  const newFn = function () {};
  const Fn = function () {
    return self.apply(this instanceof Fn ? this : context, bindArgs.concat([...arguments]));
  };
  //原型继承
  newFn.prototype = this.prototype;
  Fn.prototype = new newFn();
  return Fn;
};
function fn () {
  console.log(this.a);
}
let object = {
  a: 1,
  b: 2
};

console.log('----1----');
fn();
console.log('----2----');
fn.bind(object)();
console.log('----3----');
fn.mybind(object)();
console.log('----4----');
const fn2 = fn.mybind(object);
new fn2();
