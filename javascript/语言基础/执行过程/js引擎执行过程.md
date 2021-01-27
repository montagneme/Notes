# js引擎执行过程
+ js执行的三个阶段：
语法分析、预编译阶段、执行阶段
+ js的运行环境：
全局环境、函数环境、eval环境（有安全问题、性能问题）
+ js创建执行上下文
创建变量对象、建立作用域链、确定this的指向
+ js创建执行上下文 - 创建变量对象
  1.创建`arguments`对象
  检查当前上下文中的参数，建立该对象的属性与属性值，仅在函数环境中进行（箭头函数中没有`arguments`对象），箭头函数中和全局环境没有此过程
  ```javascript
  arguments:{
    a:undefined,
    b:undefined,
    length:2
  }
  ```
  2.创建`函数声明`
  按代码顺序查找，将找到的函数提前声明，如果当前上下文的变量对象没有该函数名属性，则在该变量对象以函数名建立一个属性，属性值则为指向该函数所在堆内存地址的引用，如果存在，则会被新的引用覆盖
  3.创建`变量声明`
  按代码顺序查找，将找到的变量提前声明，如果当前上下文的变量对象没有该变量名属性，则在该变量对象以变量名建立一个属性，属性值为`undefined`；如果存在，则忽略该变量声明
  *例子*：
  ```javascript
  function fun(a, b) {
    var num = 1;
    function test() {
        console.log(num)
    }
  }
  fun(2, 3)
  ```
  创建执行上下文：
  ```javascript
  funEC = {
    //变量对象
    VO: {
      //arguments对象
      arguments: {
          a: undefined,
          b: undefined,
          length: 2
      },
      //test函数
      test: '<test reference>', 
      //num变量
      num: undefined
    },
    //作用域链
    scopeChain:[],
    //this指向
    this: window
  }
  ```
+ js创建执行上下文 - 建立作用域链