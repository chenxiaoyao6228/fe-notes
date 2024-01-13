import libA from "./lib-a.mjs";

function logMsg() {
  var a = libA.foo; // "foo"
  console.log(a + "-" + libA.bar);
}

logMsg()