/**
 * This file will contain any polyfills needed to
 * maintain reasonable cross browser functionality.
 * I have no intentions to go out of my way very far
 * to support IE, but other major browsers should be supported.
 */

// Polyfill forEach on NodeList objects
if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = (cb, thisArg) => {
    if (typeof cb === "function") {
      for (let i = 0; i < this.length; i++) {
        cb(this[i], i, this, thisArg);
      }
    }
  }
}