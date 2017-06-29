/** A rectangle. */
export default class {
  /**
   * @param {!number} top
   * @param {!number} right
   * @param {!number} bottom
   * @param {!number} left
   */
  constructor(top, right, bottom, left) {
    this._top = top
    this._right = right
    this._bottom = bottom
    this._left = left
  }

  /** @return {!number} */
  get top() { return this._top }

  /** @return {!number} */
  get right() { return this._right }

  /** @return {!number} */
  get bottom() { return this._bottom }

  /** @return {!number} */
  get left() { return this._left }

  // eslint-disable-next-line require-jsdoc
  toString() { return `(${this.left}, ${this.top}), (${this.right}, ${this.bottom})` }
}