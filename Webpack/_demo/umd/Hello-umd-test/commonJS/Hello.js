
(function (root, factory) {
  if(typeof exports === 'object' && typeof module !== 'undefined') {
    console.log("-----commonJS环境--------" );
    module.exports = factory();
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
