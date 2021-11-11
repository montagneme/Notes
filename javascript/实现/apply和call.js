//fn.apply(object,arg1,arg2)
Function.prototype.myapply = function (context, args) {
  context = Object(context) || window;
  const name = Symbol('fn');
  context[name] = this;
  const result = context[name](...args);
  delete context[name];
  return result;
};
Function.prototype.mycall = function (context) {
  const args = [...arguments].slice(1);
  context = Object(context) || window;
  const name = Symbol('fn');
  context[name] = this;
  const result = context[name](...args);
  delete context[name];
  return result;
};

let object = {
  a: 1,
  b: 2
};
function fn (a, c) {
  console.log(this.a, a, c);
}
fn();
fn.call(object, 3, 2);
fn.mycall(object, 3, 2);
fn.apply(object, [1, 2]);
fn.myapply(object, [1, 2]);
