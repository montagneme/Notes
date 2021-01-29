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
  作用域链由当前执行环境的变量对象（未进入执行阶段之前）与上层环境的一系列活动对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问
  例子：
  ```javascript
  var num = 30;
  function test() {
    var a = 10;
    function innerTest() {
      var b = 20;
      return a + b
    }
    innerTest()
  }
  test()
  ```
  在上面的例子中，当执行到调用innerTest函数，进入innerTest函数环境。全局执行上下文和test函数执行上下文已进入执行阶段，innerTest函数执行上下文在预编译阶段创建变量对象，所以他们的活动对象和变量对象分别是AO(global)，AO(test)和VO(innerTest)，而innerTest的作用域链由当前执行环境的变量对象（未进入执行阶段前）与上层环境的一系列活动对象组成，如下：
  ```javascript
  innerTestEC = {
    //变量对象
    VO: {b: undefined}, 
    //作用域链
    scopeChain: [VO(innerTest), AO(test), AO(global)],
    //this指向
    this: window
  }
  ```
+ `js`是单线程的，但是并不是js执行过程的线程就只有一个，一共包含四个线程
  1. `js引擎线程`：也称为js内核，负责解析执行javascript脚本程序的主线程
  2. `事件触发线程`：归属于浏览器内核进程，不受js引擎线程控制。主要用于控制事件（鼠标、键盘等），当该事件被触发的时候，事件触发线程就会把该事件的处理函数推进`事件队列`，等待js引擎线程执行
  3. `定时器触发线程`：主要控制计时器`setInterval`和延时器`setTimeout`，用于定时器的计时，计时完毕，满足定时器的触发条件，则将定时器的处理函数推进事件队列中，等待js引擎线程执行
  ⚠️注意：W3C在HTML标准中规定setTimeout低于4ms的时间间隔算为4ms
  4. `HTTP异步请求线程`：通过XMLHttpRequest连接后，通过浏览器新开一个线程，监控readyState状态变更时，如果设置了该状态的回调函数，则将该状态的处理函数推进事件队列中，等待JS引擎线程执行
  ⚠️注意：浏览器对通一域名请求的并发连接数是有限制的，Chrome和Firefox限制数为6个，ie8则为10个。
  **总结：永远只有JS引擎线程在执行JS脚本程序，其他三个线程只负责将满足触发条件的处理函数推进事件队列，等待JS引擎线程执行**
+ js引擎执行顺序：
  `宏任务（同步任务）` -> `微任务` -> `宏任务（异步任务）`
  1. 执行宏任务中的同步任务，执行结束
  2. 检查是否存在可执行的微任务，有的话执行所有微任务，然后读取任务队列的任务事件，推进主线程形成新的宏任务；没有的话则直接读取任务队列的任务事件，推进主线程形成新的宏任务
  3. 执行新宏任务的事件任务，再检查是否存在可执行的微任务，如此不断的重复循环
