(function (root, factory) {
  if(typeof exports === 'object' && typeof module !== 'undefined') {
    console.log("-----commonJS环境, 如nodeJS--------" );
    module.exports = factory();
  } else if(typeof define === 'function' && define.cmd) {
    console.log('-----CMD环境, 如seaJS--------');
    define([], factory);
  }else if(typeof define === 'function' && define.amd) {
    console.log('-----AMD环境, 如requireJS--------');
    define([], factory);
  }else {
    console.log('-----global环境--------');
    root.Hello = factory();
  }
})(this, function () {
  function sayHello() {
    console.log("Hello!");
  }
  return {
    sayHello: sayHello,
  };
});
