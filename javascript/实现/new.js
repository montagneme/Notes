function newFn () {
  var obj = {},
    Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}
function fn () {
  this.a = 1;
  this.b = 1;
}
console.log(new fn());
console.log(newFn(fn));
