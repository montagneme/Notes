# script标签相关
### defer属性
这个属性表示脚本在执行时不会改变页面结构，脚本会被延迟到整个页面解析完成后再执行（立即下载，延迟执行）。多个加了defer属性的脚本之间是按照放置顺序执行的，加了defer属性的脚本一般都会在DOMContentLoaded事件之前执行。只适用于外部脚本
### async属性
这个属性表示脚本会立即下载，不会阻塞页面的加载。如果有多个脚本都加了async属性，不能保证他们之间的执行顺序，并且一旦脚本可用，就会异步执行，所以不应该在这个脚本里面修改dom。保证会在load事件前执行完毕，但是可能会在DOMContentLoaded事件之前或者之后
### 动态加载脚本
默认这种情况是以异步方式加载的，相当于添加了async属性，但不是所有浏览器都支持async，所以如果要使用动态加载脚本最好把async手动设置为false
```javascript
let script = document.createElement('script');
script.src = 'gibberish.js';
script.async = false;
document.head.appendChild(script);
```
这种方式获取资源最好是在文档头部显示声明他们，因为这种资源对浏览器与加载器是不可见的，会严重影响资源获取队列中的优先级，可能会严重影响性能。
```html
<link rel="preload" href="gibberish.js">
```
