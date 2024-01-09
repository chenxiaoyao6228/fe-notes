define('lib-a-dep', ['lib-a-dep-dep'], function(libADepDep) {

  console.log("factory执行： lib-a-dep");
  
  var bar = "bar";

  var libADep = {
    bar: bar,
    baz: libADepDep.baz,
  };

  return libADep;
});