const { Card } = require("@tabletop-playground/api");

exports.monkeyPatch = function () {
  /** @type {Card['forEach']} */
  Card.prototype.forEach = function (callbackFn, thisArg) {
    if (this === null) {
      throw new TypeError("Card.prototype.forEach called on null or undefined");
    }

    if (typeof callbackFn !== "function") {
      throw new TypeError(callbackFn + " is not a function");
    }

    let T;
    if (arguments.length > 1) {
      T = thisArg;
    }

    const len = this.getStackSize() >>> 0;
    for (let i = 0; i < len; i++) {
      const cardDetails = this.getCardDetails(i);
      if (cardDetails !== undefined) {
        callbackFn.call(T, cardDetails, i, this);
      }
    }
  };

  /** @type {Card['map']} */
  Card.prototype.map = function (callbackFn, thisArg) {
    if (this === null) {
      throw new TypeError("Card.prototype.map called on null or undefined");
    }

    if (typeof callbackFn !== "function") {
      throw new TypeError(callbackFn + " is not a function");
    }

    let T;
    if (arguments.length > 1) {
      T = thisArg;
    }

    const len = this.getStackSize() >>> 0;
    const mappedArray = new Array(len);
    for (let i = 0; i < len; i++) {
      const cardDetails = this.getCardDetails(i);
      if (cardDetails !== undefined) {
        const mappedValue = callbackFn.call(T, cardDetails, i, this);
        mappedArray[i] = mappedValue;
      }
    }

    return mappedArray;
  };
};
