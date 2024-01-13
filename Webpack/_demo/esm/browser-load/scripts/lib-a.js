import libADep from "./lib-a-dep.js";

let foo = "foo";

let libA = {
  foo: foo,
  bar: libADep.bar,
};

export default libA;
