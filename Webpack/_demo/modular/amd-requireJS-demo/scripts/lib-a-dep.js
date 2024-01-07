define('lib-a-dep', [], function() {
  var bar = "bar";

  var libADep = {
    bar: bar,
  };

  return libADep;
});