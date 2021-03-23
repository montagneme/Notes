# ES6
### Number
+ `Number.isFinite()`和`Number.isNaN()`与传统的全局方法`isFinite()`和`isNaN()`的区别在于，传统方法先调用`Number()`将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，`Number.isFinite()`对于非数值一律返回`false`, `Number.isNaN()`只有对于NaN才返回`true`，非`NaN`一律返回`false`。
+ `Number.isInteger`判断是否为整数，不会进行隐式转换，因为在js内部整数和浮点数采用的是同样的储存方法，所以例如25和25.0视为同一个值都会返回true；另外js采用IEEE754标准，数值存储为64为双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位），如果数值的精度超过这个限度，第54位及后面的位就会被丢弃，这种情况下，可能会误判，例如：
  ```javascript
  Number.isInteger(3.0000000000000002) // true
  ```
这是因为这个小数的精度达到了小数点后16个十进制位，转成二进制位超过了53个二进制位，导致最后的那个2被丢弃了。
+ js内部中能表示最大的整数范围在`-2^53`到`2^53`之间，也就是`-9007199254740991`和`9007199254740991`之间，在js中用`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`表示，`Number.isSafeInteger`用于检测一个整数是否是安全的（在最大和最小之间）。另外，`9007199254740993 === 9007199254740992`会返回true，这时因为如果一个整数超出了最大整数，那么在计算机内部会以`9007199254740992`的形式储存，所以返回true
+ `BigInt`类型数值可以使用`-`号，不能使用`+`号，因为会与`asm.js`冲突
+ `BigInt`类型表示为在数值后面加上`n`，例如：`123n`；`BigInt('123n')`会报错，因为无法解析成Number，所以报错了；如果参数为小数，也会报错
### Symbol
+ 如果`Symbol`的参数是一个对象，就会调用该对象的`toString`方法将其转化为字符串
+ `Symbol`可以转换为布尔值，但是不能转换为数值
+ Symbol值作为对象属性名时，不能使用点运算符，例如：
  ```javascript
  const mySymbol = Symbol();
  const a = {};
  a.mySymbol = 'Hello!';
  a[mySymbol] // undefined
  a['mySymbol'] // "Hello!"
  ```
+ Symbol作为属性名，遍历对象时，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。但是它不是私有属性，而是有一个`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有`Symbol`属性名。新的API`Reflect.ownKeys()`可以返回所有类型的键名，包括常规键名和Symbol键名
+ `Symbol.for()`与`Symbol()`这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。`Symbol.for()`不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。并且`Symbol.for()`为Symbol值登记的名字，是全局环境的，不管有没有在全局环境运行
+ `Symbol.for()`的这个全局登记特性，可以用在不同的 iframe 或 service worker 中取到同一个值，例如：
  ```javascript
  iframe = document.createElement('iframe');
  iframe.src = String(window.location);
  document.body.appendChild(iframe);
  iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
  // true
  ```
上面代码中，iframe 窗口生成的 Symbol 值，可以在主页面得到
### Proxy
+ Proxy所有支持截拦的属性：
  + `get(target, propKey, receiver)`：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
  + `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
  + `has(target, propKey)`：拦截`propKey in proxy`的操作，返回一个布尔值。
  + `deleteProperty(target, propKey)`：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
  + `ownKeys(target)`：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
  + `getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
  + `defineProperty(target, propKey, propDesc)`：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
  + `preventExtensions(target)`：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
  + `getPrototypeOf(target)`：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
  + `isExtensible(target)`：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
  + `setPrototypeOf(target, proto)`：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
  + `apply(target, object, args)`：拦截 `Proxy` 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
  + `construct(target, args)`：拦截 `Proxy` 实例作为构造函数调用的操作，比如`new proxy(...args)`。
+ 如果一个属性配置为不可配置(configurable)、不可写(writable)，则Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错
+ `has()`拦截对`for...in`循环不生效
+ `construct()`方法拦截的必须是函数，并且返回的必须是一个对象，否则会报错。
+ `construct()`方法中的`this`指向的是`handler`，而不是实例对象
+ `isExtensible()`方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误，也就是说必须返回`true`
+ `ownKeys()`方法只能返回数组，并且数组内部只能是字符串或者`Symbol`值，否则就会报错。如果目标对象自身包含不可配置的属性，则该属性必须被`ownKeys()`方法返回，否则会报错。如果目标对象是不可扩展的（non-extensible），这时`ownKeys()`方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则会报错
+ `preventExtensions()`这个方法有一个限制，只有目标对象不可扩展时（即`Object.isExtensible(proxy)`为false），`proxy.preventExtensions`才能返回true，否则会报错
+ 如果目标对象不可扩展（non-extensible），`setPrototypeOf()`方法不得改变目标对象的原型
+ Proxy代理会使this指向handler，例如：
  ```javascript
  const target = {
    m: function () {
      console.log(this === proxy);
    }
  };
  const handler = {};
  const proxy = new Proxy(target, handler);
  target.m() // false
  proxy.m()  // true
  ```
  解决方法：通过bind进行this绑定：
  ```javascript
  const target = new Date('2021-01-01');
  const handler = {
    get(target, prop) {
      if (prop === 'getDate') {
        return target.getDate.bind(target);
      }
      return Reflect.get(target, prop);
    }
  };
  const proxy = new Proxy(target, handler);
  proxy.getDate() // 1
  ```