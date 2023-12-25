(() => {
  "use strict";
  var __webpack_modules__ = {
    "./src/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      debugger
      eval(
        "__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sum */ \"./src/sum.js\");\n\n\nfunction component() {\n  const element = document.createElement('button');\n\n  element.innerHTML = 'Hello webpack';\n\n  element.addEventListener('click', ()=> {\n    console.log('click');\n    console.log((0,_sum__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(1,2));\n  })\n\n  return element;\n}\n\ndocument.body.appendChild(component());\n\n//# sourceURL=webpack://webpack-basic-bundle/./src/index.js?"
      );
    },

    "./src/sum.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ sum)\n/* harmony export */ });\nfunction sum (a,b) {\n    return a + b;\n}\n\n//# sourceURL=webpack://webpack-basic-bundle/./src/sum.js?'
      );
    },
  };
  /************************************************************************/
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  /************************************************************************/

  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  /************************************************************************/

  // startup
  // Load entry module and return exports
  // This entry module can't be inlined because the eval devtool is used.
  var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
