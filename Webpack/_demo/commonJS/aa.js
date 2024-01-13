// 为什么直接修改 _exports 不会影响到 _module._exports

var _exports = {
  a: 1,
};
const _module = {
  _exports: _exports,
};

function change(_exports, _module) {
  _exports = {
    a: 2,
  };

  _module._exports.a = 3;

  console.log("_module in change function", _module);

  console.log("_exports in change function", _exports);
}

change(_exports, _module);

console.log("_module outside change function", _module);
console.log("_exports outside change function", _exports);