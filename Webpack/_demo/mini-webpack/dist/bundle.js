
    (function(modules){
      function require(id) {
        const [fn, mapping] = modules[id];

        function locateRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };
        fn(locateRequire, module, module.exports);
        return module.exports;
      }
      require(0);
    })({0: [
      function(require, module, exports) { "use strict";

var _a = _interopRequireDefault(require("./a.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _a["default"])(); },
      {"./a.js":1}
    ],1: [
      function(require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _b = _interopRequireDefault(require("./b.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function logA() {
  console.log('logA');
  (0, _b["default"])();
}
var _default = exports["default"] = logA; },
      {"./b.js":2}
    ],2: [
      function(require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _c = _interopRequireDefault(require("./c.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function logB() {
  console.log('b');
  (0, _c["default"])();
}
var _default = exports["default"] = logB; },
      {"./c.js":3}
    ],3: [
      function(require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function logC() {
  console.log('c');
}
var _default = exports["default"] = logC; },
      {}
    ],})
  