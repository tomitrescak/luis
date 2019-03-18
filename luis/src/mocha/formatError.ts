/* eslint-disable no-param-reassign */
/**
 * NOTE:
 * This file is was copied from https://github.com/mochajs/mocha/blob/master/lib/reporters/base.js#L167
 * Ideally we should have a better way of formatting the errors.
 */

// eslint-disable-next-line
const utils = require('mocha/lib/utils');
const df = require('jest-diff');

const colors: any = {
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31
};

/**
 * Object#toString reference.
 */
const objToString = Object.prototype.toString;

/**
 * Check that a / b have the same type.
 *
 * @api private
 * @param {Object} a
 * @param {Object} b
 * @return {boolean}
 */
const sameType = (a: any, b: any) => objToString.call(a) === objToString.call(b);

const colored = (type: any, str: string) => `\u001b[${colors[type]}m${str}\u001b[0m`;

const formatMochaError = (test: Mocha.Test) => {
  // msg
  let msg;
  const err: any = test.err;

  let message;
  if (err.message && typeof err.message.toString === 'function') {
    message = `${err.message}`;
  } else if (typeof err.inspect === 'function') {
    message = `${err.inspect()}`;
  } else {
    message = '';
  }
  let stack = err.stack || message;
  let index = message ? stack.indexOf(message) : -1;
  let actual = err.actual;
  let expected = err.expected;

  if (index === -1) {
    msg = message;
  } else {
    index += message.length;
    msg = stack.slice(0, index);
    // remove msg from stack
    stack = stack.slice(index + 1);
  }

  // uncaught
  if (err.uncaught) {
    msg = `Uncaught ${msg}`;
  }
  // explicitly show diff
  if (
    err.showDiff !== false &&
    (err.message.indexOf('to equal') > 0 || err.message.indexOf('Snapshot') >= 0) &&
    sameType(actual, expected) &&
    expected !== undefined
  ) {
    if (!(utils.isString(actual) && utils.isString(expected))) {
      err.actual = actual = utils.stringify(actual);
      err.expected = expected = utils.stringify(expected);
    }

    const match = message.match(/^([^:]+): expected/);
    msg = match ? match[1] : msg;

    msg += '\n' + df(err.expected, err.actual).replace(/\[\d+m/g, '');
  }

  return [test.fullTitle(), msg, stack].join('\n');
};

export { formatMochaError, colored };
