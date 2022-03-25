"use strict";
self["webpackHotUpdategame_programming_createjs_webpack"]("main",{

/***/ "./src/Snake.ts":
/*!**********************!*\
  !*** ./src/Snake.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snake = void 0;
const Character_1 = __webpack_require__(/*! ./Character */ "./src/Character.ts");
class Snake extends Character_1.Character {
    constructor(stage, assetManager) {
        super(stage, assetManager, "snake/alive");
        this.eventKilled = new createjs.Event("snakeKilled", true, false);
    }
    killMe() {
        this._state = Character_1.Character.STATE_DEAD;
        this.stopMe();
        this._sprite.on("animationend", function () {
            this._sprite.stop();
        }, this, true);
        this._sprite.gotoAndPlay("snake/dead");
        this._sprite.dispatchEvent(this.eventKilled);
    }
}
exports.Snake = Snake;


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("a1f5db965e600a4aeb59")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=main.b0b541194e955f296f47.hot-update.js.map