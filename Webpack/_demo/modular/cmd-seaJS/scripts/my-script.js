define('my-script',function(require, exports, module) {
  var libA = require('lib-a');
  var a = libA.foo; // "foo"
  alert(a + '-' + libA.bar);
});