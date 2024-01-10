define('lib-a-dep',function(require, exports, module) {
  var bar = "bar";

  var libADep = {
    bar: bar,
  };

  module.exports = libADep;
});
