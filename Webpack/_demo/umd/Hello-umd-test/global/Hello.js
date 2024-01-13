(function (root, factory) {
  console.log('-----global环境--------');
  root.Hello = factory();
})(this, function () {
  function sayHello() {
    console.log("Hello!");
  }
  return {
    sayHello: sayHello,
  };
});
