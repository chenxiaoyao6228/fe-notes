define('my-script',['lib-a'], function(libA) {

  console.error("factory执行： my-script");

  alert(libA.foo + '-' + libA.bar + '-' + libA.baz);
});