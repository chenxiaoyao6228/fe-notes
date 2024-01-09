define('lib-a',function(require, exports, module) {
  var libADep = require('lib-a-dep');
  var foo = "foo";

  var libA = {
    foo: foo,
    bar: libADep.bar,
  };

  module.exports = libA;
});