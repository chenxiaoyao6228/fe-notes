define('lib-a-dep', ['lib-a-dep-dep'], function(libADepDep) {
  var bar = "bar";

  var libADep = {
    bar: bar,
    baz: libADepDep.baz,
  };

  return libADep;
});