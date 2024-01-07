define('lib-a', ['lib-a-dep'], function(libADep) {
  var foo = "foo";

  var libA = {
    foo: foo,
    bar: libADep.bar,
  };

  return libA;
});