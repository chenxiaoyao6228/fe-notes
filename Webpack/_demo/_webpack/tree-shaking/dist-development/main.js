(() => {
  // webpackBootstrap
  "use strict";
  var __webpack_modules__ = {
    /***/ "./src/math.js":
      /*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ sum: () => /* binding */ sum,
          /* harmony export */
        });
        /* unused harmony export minus */
        function sum(a, b) {
          return a + b;
        }

        function minus(a, b) {
          return a - b;
        }

        /***/
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
  /* webpack/runtime/define property getters */
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

  /* webpack/runtime/hasOwnProperty shorthand */
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
    /* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(/*! ./math */ "./src/math.js");

    function component() {
      const element = document.createElement("button");
      element.innerHTML = "Hello webpack";

      element.addEventListener("click", () => {
        console.log((0, _math__WEBPACK_IMPORTED_MODULE_0__.sum)(1, 2));
      });

      return element;
    }

    document.body.appendChild(component());
  })();
})();
//# sourceMappingURL=main.js.map
