//下面的例子则是利用get拦截，实现一个生成各种 DOM 节点的通用函数dom
const dom = new Proxy(
  {},
  {
    get (target, property) {
      return function (attrs = {}, ...children) {
        const el = document.createElement(property);
        for (let prop of Object.keys(attrs)) {
          el.setAttribute(prop, attrs[prop]);
        }
        for (let child of children) {
          if (typeof child === 'string') {
            child = document.createTextNode(child);
          }
          el.appendChild(child);
        }
        return el;
      };
    }
  }
);

const el = dom.div(
  {},
  'Hello, my name is ',
  dom.a({ href: '//example.com' }, 'Mark'),
  '. I like:',
  dom.ul({}, dom.li({}, 'The web'), dom.li({}, 'Food'), dom.li({}, "…actually that's it"))
);
document.body.appendChild(el);
