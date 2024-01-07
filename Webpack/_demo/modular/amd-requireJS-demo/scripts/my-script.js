define('my-script',['lib-a'], function(libA) {
  var a = libA.foo; // "bar"
  alert(a + '-' + libA.bar);
});