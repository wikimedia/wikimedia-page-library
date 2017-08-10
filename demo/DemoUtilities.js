/*
Note: This file is only meant to be used by demo js. It may contain ES6 and other more bleeding edge
bits which we don't want to ship with the page lib build product.
 */

/**
 * Flattens array of arrays.
 * @param {!Array<Array>} array
 * @return {!Array}
 */
const flattenArrayOfArrays = array => [].concat(...array) // eslint-disable-line no-unused-vars
