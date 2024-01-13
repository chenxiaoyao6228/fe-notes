define('lib-a-dep-dep', [], function() {

  console.log("factory执行： lib-a-dep-dep");
  
  var baz = "baz";

  var libADepDep = {
    baz: baz,
  };

  return libADepDep;
});