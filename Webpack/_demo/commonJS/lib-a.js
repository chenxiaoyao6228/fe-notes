// 注意这里没有写 .js 后缀
const libADep = require("./lib-a-dep");

let foo = "foo";

let libA = {
  foo: foo,
  bar: libADep.bar,
};

module.exports = libA;
