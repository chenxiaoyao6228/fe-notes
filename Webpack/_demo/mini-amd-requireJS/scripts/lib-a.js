define('lib-a', ['lib-a-dep'], function(libADep) {

  console.log("factory执行： lib-a");
  
  var foo = "foo";

  var libA = {
    foo: foo,
    bar: libADep.bar,
    baz: libADep.baz,
  };

  return libA;
});