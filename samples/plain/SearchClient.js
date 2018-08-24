(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('search-client', ['exports'], factory) :
	(factory((global.SearchClient = {})));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var keys = createCommonjsModule(function (module, exports) {
	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	});
	var keys_1 = keys.shim;

	var is_arguments = createCommonjsModule(function (module, exports) {
	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}
	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	}});
	var is_arguments_1 = is_arguments.supported;
	var is_arguments_2 = is_arguments.unsupported;

	var deepEqual_1 = createCommonjsModule(function (module) {
	var pSlice = Array.prototype.slice;



	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	};

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (is_arguments(a)) {
	    if (!is_arguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = keys(a),
	        kb = keys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}
	});

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = Object.setPrototypeOf ||
	    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = Object.assign || function __assign(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }
	    return t;
	};

	var global$1 = (typeof global !== "undefined" ? global :
	            typeof self !== "undefined" ? self :
	            typeof window !== "undefined" ? window : {});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	Buffer.isBuffer = isBuffer;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read$$1 (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read$$1(arr, i + j) !== read$$1(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	Object.defineProperty(exports, '__esModule', { value: true });

	// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
	// (MIT licensed)

	const BUFFER = Symbol('buffer');
	const TYPE = Symbol('type');

	class Blob {
		constructor() {
			this[TYPE] = '';

			const blobParts = arguments[0];
			const options = arguments[1];

			const buffers = [];

			if (blobParts) {
				const a = blobParts;
				const length = Number(a.length);
				for (let i = 0; i < length; i++) {
					const element = a[i];
					let buffer;
					if (element instanceof Buffer) {
						buffer = element;
					} else if (ArrayBuffer.isView(element)) {
						buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
					} else if (element instanceof ArrayBuffer) {
						buffer = Buffer.from(element);
					} else if (element instanceof Blob) {
						buffer = element[BUFFER];
					} else {
						buffer = Buffer.from(typeof element === 'string' ? element : String(element));
					}
					buffers.push(buffer);
				}
			}

			this[BUFFER] = Buffer.concat(buffers);

			let type = options && options.type !== undefined && String(options.type).toLowerCase();
			if (type && !/[^\u0020-\u007E]/.test(type)) {
				this[TYPE] = type;
			}
		}
		get size() {
			return this[BUFFER].length;
		}
		get type() {
			return this[TYPE];
		}
		slice() {
			const size = this.size;

			const start = arguments[0];
			const end = arguments[1];
			let relativeStart, relativeEnd;
			if (start === undefined) {
				relativeStart = 0;
			} else if (start < 0) {
				relativeStart = Math.max(size + start, 0);
			} else {
				relativeStart = Math.min(start, size);
			}
			if (end === undefined) {
				relativeEnd = size;
			} else if (end < 0) {
				relativeEnd = Math.max(size + end, 0);
			} else {
				relativeEnd = Math.min(end, size);
			}
			const span = Math.max(relativeEnd - relativeStart, 0);

			const buffer = this[BUFFER];
			const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
			const blob = new Blob([], { type: arguments[2] });
			blob[BUFFER] = slicedBuffer;
			return blob;
		}
	}

	Object.defineProperties(Blob.prototype, {
		size: { enumerable: true },
		type: { enumerable: true },
		slice: { enumerable: true }
	});

	Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
		value: 'Blob',
		writable: false,
		enumerable: false,
		configurable: true
	});

	/**
	 * fetch-error.js
	 *
	 * FetchError interface for operational errors
	 */

	/**
	 * Create FetchError instance
	 *
	 * @param   String      message      Error message for human
	 * @param   String      type         Error type for machine
	 * @param   String      systemError  For Node.js system error
	 * @return  FetchError
	 */
	function FetchError(message, type, systemError) {
	  Error.call(this, message);

	  this.message = message;
	  this.type = type;

	  // when err.type is `system`, err.code contains system error code
	  if (systemError) {
	    this.code = this.errno = systemError.code;
	  }

	  // hide custom error implementation details from end-users
	  Error.captureStackTrace(this, this.constructor);
	}

	FetchError.prototype = Object.create(Error.prototype);
	FetchError.prototype.constructor = FetchError;
	FetchError.prototype.name = 'FetchError';

	/**
	 * body.js
	 *
	 * Body interface provides common methods for Request and Response
	 */

	const Stream = require('stream');

	var _require = require('stream');

	const PassThrough = _require.PassThrough;


	let convert;
	try {
		convert = require('encoding').convert;
	} catch (e) {}

	const INTERNALS = Symbol('Body internals');

	/**
	 * Body mixin
	 *
	 * Ref: https://fetch.spec.whatwg.org/#body
	 *
	 * @param   Stream  body  Readable stream
	 * @param   Object  opts  Response options
	 * @return  Void
	 */
	function Body(body) {
		var _this = this;

		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref$size = _ref.size;

		let size = _ref$size === undefined ? 0 : _ref$size;
		var _ref$timeout = _ref.timeout;
		let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

		if (body == null) {
			// body is undefined or null
			body = null;
		} else if (typeof body === 'string') ; else if (isURLSearchParams(body)) ; else if (body instanceof Blob) ; else if (isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') ; else if (body instanceof Stream) ; else {
			// none of the above
			// coerce to string
			body = String(body);
		}
		this[INTERNALS] = {
			body,
			disturbed: false,
			error: null
		};
		this.size = size;
		this.timeout = timeout;

		if (body instanceof Stream) {
			body.on('error', function (err) {
				_this[INTERNALS].error = new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			});
		}
	}

	Body.prototype = {
		get body() {
			return this[INTERNALS].body;
		},

		get bodyUsed() {
			return this[INTERNALS].disturbed;
		},

		/**
	  * Decode response as ArrayBuffer
	  *
	  * @return  Promise
	  */
		arrayBuffer() {
			return consumeBody.call(this).then(function (buf) {
				return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
			});
		},

		/**
	  * Return raw response as Blob
	  *
	  * @return Promise
	  */
		blob() {
			let ct = this.headers && this.headers.get('content-type') || '';
			return consumeBody.call(this).then(function (buf) {
				return Object.assign(
				// Prevent copying
				new Blob([], {
					type: ct.toLowerCase()
				}), {
					[BUFFER]: buf
				});
			});
		},

		/**
	  * Decode response as json
	  *
	  * @return  Promise
	  */
		json() {
			var _this2 = this;

			return consumeBody.call(this).then(function (buffer) {
				try {
					return JSON.parse(buffer.toString());
				} catch (err) {
					return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
				}
			});
		},

		/**
	  * Decode response as text
	  *
	  * @return  Promise
	  */
		text() {
			return consumeBody.call(this).then(function (buffer) {
				return buffer.toString();
			});
		},

		/**
	  * Decode response as buffer (non-spec api)
	  *
	  * @return  Promise
	  */
		buffer() {
			return consumeBody.call(this);
		},

		/**
	  * Decode response as text, while automatically detecting the encoding and
	  * trying to decode to UTF-8 (non-spec api)
	  *
	  * @return  Promise
	  */
		textConverted() {
			var _this3 = this;

			return consumeBody.call(this).then(function (buffer) {
				return convertBody(buffer, _this3.headers);
			});
		}

	};

	// In browsers, all properties are enumerable.
	Object.defineProperties(Body.prototype, {
		body: { enumerable: true },
		bodyUsed: { enumerable: true },
		arrayBuffer: { enumerable: true },
		blob: { enumerable: true },
		json: { enumerable: true },
		text: { enumerable: true }
	});

	Body.mixIn = function (proto) {
		for (const name of Object.getOwnPropertyNames(Body.prototype)) {
			// istanbul ignore else: future proof
			if (!(name in proto)) {
				const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
				Object.defineProperty(proto, name, desc);
			}
		}
	};

	/**
	 * Consume and convert an entire Body to a Buffer.
	 *
	 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
	 *
	 * @return  Promise
	 */
	function consumeBody() {
		var _this4 = this;

		if (this[INTERNALS].disturbed) {
			return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
		}

		this[INTERNALS].disturbed = true;

		if (this[INTERNALS].error) {
			return Body.Promise.reject(this[INTERNALS].error);
		}

		// body is null
		if (this.body === null) {
			return Body.Promise.resolve(Buffer.alloc(0));
		}

		// body is string
		if (typeof this.body === 'string') {
			return Body.Promise.resolve(Buffer.from(this.body));
		}

		// body is blob
		if (this.body instanceof Blob) {
			return Body.Promise.resolve(this.body[BUFFER]);
		}

		// body is buffer
		if (isBuffer(this.body)) {
			return Body.Promise.resolve(this.body);
		}

		// body is buffer
		if (Object.prototype.toString.call(this.body) === '[object ArrayBuffer]') {
			return Body.Promise.resolve(Buffer.from(this.body));
		}

		// istanbul ignore if: should never happen
		if (!(this.body instanceof Stream)) {
			return Body.Promise.resolve(Buffer.alloc(0));
		}

		// body is stream
		// get ready to actually consume the body
		let accum = [];
		let accumBytes = 0;
		let abort = false;

		return new Body.Promise(function (resolve, reject) {
			let resTimeout;

			// allow timeout on slow response body
			if (_this4.timeout) {
				resTimeout = setTimeout(function () {
					abort = true;
					reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
				}, _this4.timeout);
			}

			// handle stream error, such as incorrect content-encoding
			_this4.body.on('error', function (err) {
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			});

			_this4.body.on('data', function (chunk) {
				if (abort || chunk === null) {
					return;
				}

				if (_this4.size && accumBytes + chunk.length > _this4.size) {
					abort = true;
					reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
					return;
				}

				accumBytes += chunk.length;
				accum.push(chunk);
			});

			_this4.body.on('end', function () {
				if (abort) {
					return;
				}

				clearTimeout(resTimeout);

				try {
					resolve(Buffer.concat(accum));
				} catch (err) {
					// handle streams that have accumulated too much data (issue #414)
					reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
				}
			});
		});
	}

	/**
	 * Detect buffer encoding and convert to target encoding
	 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
	 *
	 * @param   Buffer  buffer    Incoming buffer
	 * @param   String  encoding  Target encoding
	 * @return  String
	 */
	function convertBody(buffer, headers) {
		if (typeof convert !== 'function') {
			throw new Error('The package `encoding` must be installed to use the textConverted() function');
		}

		const ct = headers.get('content-type');
		let charset = 'utf-8';
		let res, str;

		// header
		if (ct) {
			res = /charset=([^;]*)/i.exec(ct);
		}

		// no charset in content type, peek at response body for at most 1024 bytes
		str = buffer.slice(0, 1024).toString();

		// html5
		if (!res && str) {
			res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
		}

		// html4
		if (!res && str) {
			res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

			if (res) {
				res = /charset=(.*)/i.exec(res.pop());
			}
		}

		// xml
		if (!res && str) {
			res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
		}

		// found charset
		if (res) {
			charset = res.pop();

			// prevent decode issues when sites use incorrect encoding
			// ref: https://hsivonen.fi/encoding-menu/
			if (charset === 'gb2312' || charset === 'gbk') {
				charset = 'gb18030';
			}
		}

		// turn raw buffers into a single utf-8 buffer
		return convert(buffer, 'UTF-8', charset).toString();
	}

	/**
	 * Detect a URLSearchParams object
	 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
	 *
	 * @param   Object  obj     Object to detect by type or brand
	 * @return  String
	 */
	function isURLSearchParams(obj) {
		// Duck-typing as a necessary condition.
		if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
			return false;
		}

		// Brand-checking and more duck-typing as optional condition.
		return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
	}

	/**
	 * Clone body given Res/Req instance
	 *
	 * @param   Mixed  instance  Response or Request instance
	 * @return  Mixed
	 */
	function clone(instance) {
		let p1, p2;
		let body = instance.body;

		// don't allow cloning a used body
		if (instance.bodyUsed) {
			throw new Error('cannot clone body after it is used');
		}

		// check that body is a stream and not form-data object
		// note: we can't clone the form-data object without having it as a dependency
		if (body instanceof Stream && typeof body.getBoundary !== 'function') {
			// tee instance body
			p1 = new PassThrough();
			p2 = new PassThrough();
			body.pipe(p1);
			body.pipe(p2);
			// set instance body to teed body and return the other teed body
			instance[INTERNALS].body = p1;
			body = p2;
		}

		return body;
	}

	/**
	 * Performs the operation "extract a `Content-Type` value from |object|" as
	 * specified in the specification:
	 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
	 *
	 * This function assumes that instance.body is present.
	 *
	 * @param   Mixed  instance  Response or Request instance
	 */
	function extractContentType(instance) {
		const body = instance.body;

		// istanbul ignore if: Currently, because of a guard in Request, body
		// can never be null. Included here for completeness.

		if (body === null) {
			// body is null
			return null;
		} else if (typeof body === 'string') {
			// body is string
			return 'text/plain;charset=UTF-8';
		} else if (isURLSearchParams(body)) {
			// body is a URLSearchParams
			return 'application/x-www-form-urlencoded;charset=UTF-8';
		} else if (body instanceof Blob) {
			// body is blob
			return body.type || null;
		} else if (isBuffer(body)) {
			// body is buffer
			return null;
		} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
			// body is array buffer
			return null;
		} else if (typeof body.getBoundary === 'function') {
			// detect form data input from form-data module
			return `multipart/form-data;boundary=${body.getBoundary()}`;
		} else {
			// body is stream
			// can't really do much about this
			return null;
		}
	}

	/**
	 * The Fetch Standard treats this as if "total bytes" is a property on the body.
	 * For us, we have to explicitly get it with a function.
	 *
	 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
	 *
	 * @param   Body    instance   Instance of Body
	 * @return  Number?            Number of bytes, or null if not possible
	 */
	function getTotalBytes(instance) {
		const body = instance.body;

		// istanbul ignore if: included for completion

		if (body === null) {
			// body is null
			return 0;
		} else if (typeof body === 'string') {
			// body is string
			return Buffer.byteLength(body);
		} else if (isURLSearchParams(body)) {
			// body is URLSearchParams
			return Buffer.byteLength(String(body));
		} else if (body instanceof Blob) {
			// body is blob
			return body.size;
		} else if (isBuffer(body)) {
			// body is buffer
			return body.length;
		} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
			// body is array buffer
			return body.byteLength;
		} else if (body && typeof body.getLengthSync === 'function') {
			// detect form data input from form-data module
			if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
			body.hasKnownLength && body.hasKnownLength()) {
				// 2.x
				return body.getLengthSync();
			}
			return null;
		} else {
			// body is stream
			// can't really do much about this
			return null;
		}
	}

	/**
	 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
	 *
	 * @param   Body    instance   Instance of Body
	 * @return  Void
	 */
	function writeToStream(dest, instance) {
		const body = instance.body;


		if (body === null) {
			// body is null
			dest.end();
		} else if (typeof body === 'string') {
			// body is string
			dest.write(body);
			dest.end();
		} else if (isURLSearchParams(body)) {
			// body is URLSearchParams
			dest.write(Buffer.from(String(body)));
			dest.end();
		} else if (body instanceof Blob) {
			// body is blob
			dest.write(body[BUFFER]);
			dest.end();
		} else if (isBuffer(body)) {
			// body is buffer
			dest.write(body);
			dest.end();
		} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
			// body is array buffer
			dest.write(Buffer.from(body));
			dest.end();
		} else {
			// body is stream
			body.pipe(dest);
		}
	}

	// expose Promise
	Body.Promise = global$1.Promise;

	/**
	 * headers.js
	 *
	 * Headers class offers convenient helpers
	 */

	const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
	const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

	function validateName(name) {
		name = `${name}`;
		if (invalidTokenRegex.test(name)) {
			throw new TypeError(`${name} is not a legal HTTP header name`);
		}
	}

	function validateValue(value) {
		value = `${value}`;
		if (invalidHeaderCharRegex.test(value)) {
			throw new TypeError(`${value} is not a legal HTTP header value`);
		}
	}

	/**
	 * Find the key in the map object given a header name.
	 *
	 * Returns undefined if not found.
	 *
	 * @param   String  name  Header name
	 * @return  String|Undefined
	 */
	function find(map, name) {
		name = name.toLowerCase();
		for (const key in map) {
			if (key.toLowerCase() === name) {
				return key;
			}
		}
		return undefined;
	}

	const MAP = Symbol('map');
	class Headers {
		/**
	  * Headers class
	  *
	  * @param   Object  headers  Response headers
	  * @return  Void
	  */
		constructor() {
			let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

			this[MAP] = Object.create(null);

			if (init instanceof Headers) {
				const rawHeaders = init.raw();
				const headerNames = Object.keys(rawHeaders);

				for (const headerName of headerNames) {
					for (const value of rawHeaders[headerName]) {
						this.append(headerName, value);
					}
				}

				return;
			}

			// We don't worry about converting prop to ByteString here as append()
			// will handle it.
			if (init == null) ; else if (typeof init === 'object') {
				const method = init[Symbol.iterator];
				if (method != null) {
					if (typeof method !== 'function') {
						throw new TypeError('Header pairs must be iterable');
					}

					// sequence<sequence<ByteString>>
					// Note: per spec we have to first exhaust the lists then process them
					const pairs = [];
					for (const pair of init) {
						if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
							throw new TypeError('Each header pair must be iterable');
						}
						pairs.push(Array.from(pair));
					}

					for (const pair of pairs) {
						if (pair.length !== 2) {
							throw new TypeError('Each header pair must be a name/value tuple');
						}
						this.append(pair[0], pair[1]);
					}
				} else {
					// record<ByteString, ByteString>
					for (const key of Object.keys(init)) {
						const value = init[key];
						this.append(key, value);
					}
				}
			} else {
				throw new TypeError('Provided initializer must be an object');
			}
		}

		/**
	  * Return combined header value given name
	  *
	  * @param   String  name  Header name
	  * @return  Mixed
	  */
		get(name) {
			name = `${name}`;
			validateName(name);
			const key = find(this[MAP], name);
			if (key === undefined) {
				return null;
			}

			return this[MAP][key].join(', ');
		}

		/**
	  * Iterate over all headers
	  *
	  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
	  * @param   Boolean   thisArg   `this` context for callback function
	  * @return  Void
	  */
		forEach(callback) {
			let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

			let pairs = getHeaders(this);
			let i = 0;
			while (i < pairs.length) {
				var _pairs$i = pairs[i];
				const name = _pairs$i[0],
				      value = _pairs$i[1];

				callback.call(thisArg, value, name, this);
				pairs = getHeaders(this);
				i++;
			}
		}

		/**
	  * Overwrite header values given name
	  *
	  * @param   String  name   Header name
	  * @param   String  value  Header value
	  * @return  Void
	  */
		set(name, value) {
			name = `${name}`;
			value = `${value}`;
			validateName(name);
			validateValue(value);
			const key = find(this[MAP], name);
			this[MAP][key !== undefined ? key : name] = [value];
		}

		/**
	  * Append a value onto existing header
	  *
	  * @param   String  name   Header name
	  * @param   String  value  Header value
	  * @return  Void
	  */
		append(name, value) {
			name = `${name}`;
			value = `${value}`;
			validateName(name);
			validateValue(value);
			const key = find(this[MAP], name);
			if (key !== undefined) {
				this[MAP][key].push(value);
			} else {
				this[MAP][name] = [value];
			}
		}

		/**
	  * Check for header name existence
	  *
	  * @param   String   name  Header name
	  * @return  Boolean
	  */
		has(name) {
			name = `${name}`;
			validateName(name);
			return find(this[MAP], name) !== undefined;
		}

		/**
	  * Delete all header values given name
	  *
	  * @param   String  name  Header name
	  * @return  Void
	  */
		delete(name) {
			name = `${name}`;
			validateName(name);
			const key = find(this[MAP], name);
			if (key !== undefined) {
				delete this[MAP][key];
			}
		}

		/**
	  * Return raw headers (non-spec api)
	  *
	  * @return  Object
	  */
		raw() {
			return this[MAP];
		}

		/**
	  * Get an iterator on keys.
	  *
	  * @return  Iterator
	  */
		keys() {
			return createHeadersIterator(this, 'key');
		}

		/**
	  * Get an iterator on values.
	  *
	  * @return  Iterator
	  */
		values() {
			return createHeadersIterator(this, 'value');
		}

		/**
	  * Get an iterator on entries.
	  *
	  * This is the default iterator of the Headers object.
	  *
	  * @return  Iterator
	  */
		[Symbol.iterator]() {
			return createHeadersIterator(this, 'key+value');
		}
	}
	Headers.prototype.entries = Headers.prototype[Symbol.iterator];

	Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
		value: 'Headers',
		writable: false,
		enumerable: false,
		configurable: true
	});

	Object.defineProperties(Headers.prototype, {
		get: { enumerable: true },
		forEach: { enumerable: true },
		set: { enumerable: true },
		append: { enumerable: true },
		has: { enumerable: true },
		delete: { enumerable: true },
		keys: { enumerable: true },
		values: { enumerable: true },
		entries: { enumerable: true }
	});

	function getHeaders(headers) {
		let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

		const keys = Object.keys(headers[MAP]).sort();
		return keys.map(kind === 'key' ? function (k) {
			return k.toLowerCase();
		} : kind === 'value' ? function (k) {
			return headers[MAP][k].join(', ');
		} : function (k) {
			return [k.toLowerCase(), headers[MAP][k].join(', ')];
		});
	}

	const INTERNAL = Symbol('internal');

	function createHeadersIterator(target, kind) {
		const iterator = Object.create(HeadersIteratorPrototype);
		iterator[INTERNAL] = {
			target,
			kind,
			index: 0
		};
		return iterator;
	}

	const HeadersIteratorPrototype = Object.setPrototypeOf({
		next() {
			// istanbul ignore if
			if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
				throw new TypeError('Value of `this` is not a HeadersIterator');
			}

			var _INTERNAL = this[INTERNAL];
			const target = _INTERNAL.target,
			      kind = _INTERNAL.kind,
			      index = _INTERNAL.index;

			const values = getHeaders(target, kind);
			const len = values.length;
			if (index >= len) {
				return {
					value: undefined,
					done: true
				};
			}

			this[INTERNAL].index = index + 1;

			return {
				value: values[index],
				done: false
			};
		}
	}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

	Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
		value: 'HeadersIterator',
		writable: false,
		enumerable: false,
		configurable: true
	});

	/**
	 * Export the Headers object in a form that Node.js can consume.
	 *
	 * @param   Headers  headers
	 * @return  Object
	 */
	function exportNodeCompatibleHeaders(headers) {
		const obj = Object.assign({ __proto__: null }, headers[MAP]);

		// http.request() only supports string as Host header. This hack makes
		// specifying custom Host header possible.
		const hostHeaderKey = find(headers[MAP], 'Host');
		if (hostHeaderKey !== undefined) {
			obj[hostHeaderKey] = obj[hostHeaderKey][0];
		}

		return obj;
	}

	/**
	 * Create a Headers object from an object of headers, ignoring those that do
	 * not conform to HTTP grammar productions.
	 *
	 * @param   Object  obj  Object of headers
	 * @return  Headers
	 */
	function createHeadersLenient(obj) {
		const headers = new Headers();
		for (const name of Object.keys(obj)) {
			if (invalidTokenRegex.test(name)) {
				continue;
			}
			if (Array.isArray(obj[name])) {
				for (const val of obj[name]) {
					if (invalidHeaderCharRegex.test(val)) {
						continue;
					}
					if (headers[MAP][name] === undefined) {
						headers[MAP][name] = [val];
					} else {
						headers[MAP][name].push(val);
					}
				}
			} else if (!invalidHeaderCharRegex.test(obj[name])) {
				headers[MAP][name] = [obj[name]];
			}
		}
		return headers;
	}

	/**
	 * response.js
	 *
	 * Response class provides content decoding
	 */

	var _require$1 = require('http');

	const STATUS_CODES = _require$1.STATUS_CODES;


	const INTERNALS$1 = Symbol('Response internals');

	/**
	 * Response class
	 *
	 * @param   Stream  body  Readable stream
	 * @param   Object  opts  Response options
	 * @return  Void
	 */
	class Response {
		constructor() {
			let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			Body.call(this, body, opts);

			const status = opts.status || 200;

			this[INTERNALS$1] = {
				url: opts.url,
				status,
				statusText: opts.statusText || STATUS_CODES[status],
				headers: new Headers(opts.headers)
			};
		}

		get url() {
			return this[INTERNALS$1].url;
		}

		get status() {
			return this[INTERNALS$1].status;
		}

		/**
	  * Convenience property representing if the request ended normally
	  */
		get ok() {
			return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
		}

		get statusText() {
			return this[INTERNALS$1].statusText;
		}

		get headers() {
			return this[INTERNALS$1].headers;
		}

		/**
	  * Clone this response
	  *
	  * @return  Response
	  */
		clone() {
			return new Response(clone(this), {
				url: this.url,
				status: this.status,
				statusText: this.statusText,
				headers: this.headers,
				ok: this.ok
			});
		}
	}

	Body.mixIn(Response.prototype);

	Object.defineProperties(Response.prototype, {
		url: { enumerable: true },
		status: { enumerable: true },
		ok: { enumerable: true },
		statusText: { enumerable: true },
		headers: { enumerable: true },
		clone: { enumerable: true }
	});

	Object.defineProperty(Response.prototype, Symbol.toStringTag, {
		value: 'Response',
		writable: false,
		enumerable: false,
		configurable: true
	});

	/**
	 * request.js
	 *
	 * Request class contains server only options
	 *
	 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
	 */

	var _require$2 = require('url');

	const format_url = _require$2.format;
	const parse_url = _require$2.parse;


	const INTERNALS$2 = Symbol('Request internals');

	/**
	 * Check if a value is an instance of Request.
	 *
	 * @param   Mixed   input
	 * @return  Boolean
	 */
	function isRequest(input) {
		return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
	}

	/**
	 * Request class
	 *
	 * @param   Mixed   input  Url or Request instance
	 * @param   Object  init   Custom options
	 * @return  Void
	 */
	class Request {
		constructor(input) {
			let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			let parsedURL;

			// normalize input
			if (!isRequest(input)) {
				if (input && input.href) {
					// in order to support Node.js' Url objects; though WHATWG's URL objects
					// will fall into this branch also (since their `toString()` will return
					// `href` property anyway)
					parsedURL = parse_url(input.href);
				} else {
					// coerce input to a string before attempting to parse
					parsedURL = parse_url(`${input}`);
				}
				input = {};
			} else {
				parsedURL = parse_url(input.url);
			}

			let method = init.method || input.method || 'GET';
			method = method.toUpperCase();

			if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
				throw new TypeError('Request with GET/HEAD method cannot have body');
			}

			let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

			Body.call(this, inputBody, {
				timeout: init.timeout || input.timeout || 0,
				size: init.size || input.size || 0
			});

			const headers = new Headers(init.headers || input.headers || {});

			if (init.body != null) {
				const contentType = extractContentType(this);
				if (contentType !== null && !headers.has('Content-Type')) {
					headers.append('Content-Type', contentType);
				}
			}

			this[INTERNALS$2] = {
				method,
				redirect: init.redirect || input.redirect || 'follow',
				headers,
				parsedURL
			};

			// node-fetch-only options
			this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
			this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
			this.counter = init.counter || input.counter || 0;
			this.agent = init.agent || input.agent;
		}

		get method() {
			return this[INTERNALS$2].method;
		}

		get url() {
			return format_url(this[INTERNALS$2].parsedURL);
		}

		get headers() {
			return this[INTERNALS$2].headers;
		}

		get redirect() {
			return this[INTERNALS$2].redirect;
		}

		/**
	  * Clone this request
	  *
	  * @return  Request
	  */
		clone() {
			return new Request(this);
		}
	}

	Body.mixIn(Request.prototype);

	Object.defineProperty(Request.prototype, Symbol.toStringTag, {
		value: 'Request',
		writable: false,
		enumerable: false,
		configurable: true
	});

	Object.defineProperties(Request.prototype, {
		method: { enumerable: true },
		url: { enumerable: true },
		headers: { enumerable: true },
		redirect: { enumerable: true },
		clone: { enumerable: true }
	});

	/**
	 * Convert a Request to Node.js http request options.
	 *
	 * @param   Request  A Request instance
	 * @return  Object   The options object to be passed to http.request
	 */
	function getNodeRequestOptions(request) {
		const parsedURL = request[INTERNALS$2].parsedURL;
		const headers = new Headers(request[INTERNALS$2].headers);

		// fetch step 1.3
		if (!headers.has('Accept')) {
			headers.set('Accept', '*/*');
		}

		// Basic fetch
		if (!parsedURL.protocol || !parsedURL.hostname) {
			throw new TypeError('Only absolute URLs are supported');
		}

		if (!/^https?:$/.test(parsedURL.protocol)) {
			throw new TypeError('Only HTTP(S) protocols are supported');
		}

		// HTTP-network-or-cache fetch steps 2.4-2.7
		let contentLengthValue = null;
		if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
			contentLengthValue = '0';
		}
		if (request.body != null) {
			const totalBytes = getTotalBytes(request);
			if (typeof totalBytes === 'number') {
				contentLengthValue = String(totalBytes);
			}
		}
		if (contentLengthValue) {
			headers.set('Content-Length', contentLengthValue);
		}

		// HTTP-network-or-cache fetch step 2.11
		if (!headers.has('User-Agent')) {
			headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
		}

		// HTTP-network-or-cache fetch step 2.15
		if (request.compress) {
			headers.set('Accept-Encoding', 'gzip,deflate');
		}
		if (!headers.has('Connection') && !request.agent) {
			headers.set('Connection', 'close');
		}

		// HTTP-network fetch step 4.2
		// chunked encoding is handled by Node.js

		return Object.assign({}, parsedURL, {
			method: request.method,
			headers: exportNodeCompatibleHeaders(headers),
			agent: request.agent
		});
	}

	/**
	 * index.js
	 *
	 * a request API compatible with window.fetch
	 *
	 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
	 */

	const http = require('http');
	const https = require('https');

	var _require$3 = require('stream');

	const PassThrough$1 = _require$3.PassThrough;

	var _require2 = require('url');

	const resolve_url = _require2.resolve;

	const zlib = require('zlib');

	/**
	 * Fetch function
	 *
	 * @param   Mixed    url   Absolute url or Request instance
	 * @param   Object   opts  Fetch options
	 * @return  Promise
	 */
	function fetch(url, opts) {

		// allow custom promise
		if (!fetch.Promise) {
			throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
		}

		Body.Promise = fetch.Promise;

		// wrap http.request into fetch
		return new fetch.Promise(function (resolve, reject) {
			// build request object
			const request = new Request(url, opts);
			const options = getNodeRequestOptions(request);

			const send = (options.protocol === 'https:' ? https : http).request;

			// send request
			const req = send(options);
			let reqTimeout;

			function finalize() {
				req.abort();
				clearTimeout(reqTimeout);
			}

			if (request.timeout) {
				req.once('socket', function (socket) {
					reqTimeout = setTimeout(function () {
						reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
						finalize();
					}, request.timeout);
				});
			}

			req.on('error', function (err) {
				reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
				finalize();
			});

			req.on('response', function (res) {
				clearTimeout(reqTimeout);

				const headers = createHeadersLenient(res.headers);

				// HTTP fetch step 5
				if (fetch.isRedirect(res.statusCode)) {
					// HTTP fetch step 5.2
					const location = headers.get('Location');

					// HTTP fetch step 5.3
					const locationURL = location === null ? null : resolve_url(request.url, location);

					// HTTP fetch step 5.5
					switch (request.redirect) {
						case 'error':
							reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
							finalize();
							return;
						case 'manual':
							// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
							if (locationURL !== null) {
								headers.set('Location', locationURL);
							}
							break;
						case 'follow':
							// HTTP-redirect fetch step 2
							if (locationURL === null) {
								break;
							}

							// HTTP-redirect fetch step 5
							if (request.counter >= request.follow) {
								reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
								finalize();
								return;
							}

							// HTTP-redirect fetch step 6 (counter increment)
							// Create a new Request object.
							const requestOpts = {
								headers: new Headers(request.headers),
								follow: request.follow,
								counter: request.counter + 1,
								agent: request.agent,
								compress: request.compress,
								method: request.method,
								body: request.body
							};

							// HTTP-redirect fetch step 9
							if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
								reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
								finalize();
								return;
							}

							// HTTP-redirect fetch step 11
							if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
								requestOpts.method = 'GET';
								requestOpts.body = undefined;
								requestOpts.headers.delete('content-length');
							}

							// HTTP-redirect fetch step 15
							resolve(fetch(new Request(locationURL, requestOpts)));
							finalize();
							return;
					}
				}

				// prepare response
				let body = res.pipe(new PassThrough$1());
				const response_options = {
					url: request.url,
					status: res.statusCode,
					statusText: res.statusMessage,
					headers: headers,
					size: request.size,
					timeout: request.timeout
				};

				// HTTP-network fetch step 12.1.1.3
				const codings = headers.get('Content-Encoding');

				// HTTP-network fetch step 12.1.1.4: handle content codings

				// in following scenarios we ignore compression support
				// 1. compression support is disabled
				// 2. HEAD request
				// 3. no Content-Encoding header
				// 4. no content response (204)
				// 5. content not modified response (304)
				if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
					resolve(new Response(body, response_options));
					return;
				}

				// For Node v6+
				// Be less strict when decoding compressed responses, since sometimes
				// servers send slightly invalid responses that are still accepted
				// by common browsers.
				// Always using Z_SYNC_FLUSH is what cURL does.
				const zlibOptions = {
					flush: zlib.Z_SYNC_FLUSH,
					finishFlush: zlib.Z_SYNC_FLUSH
				};

				// for gzip
				if (codings == 'gzip' || codings == 'x-gzip') {
					body = body.pipe(zlib.createGunzip(zlibOptions));
					resolve(new Response(body, response_options));
					return;
				}

				// for deflate
				if (codings == 'deflate' || codings == 'x-deflate') {
					// handle the infamous raw deflate response from old servers
					// a hack for old IIS and Apache servers
					const raw = res.pipe(new PassThrough$1());
					raw.once('data', function (chunk) {
						// see http://stackoverflow.com/questions/37519828
						if ((chunk[0] & 0x0F) === 0x08) {
							body = body.pipe(zlib.createInflate());
						} else {
							body = body.pipe(zlib.createInflateRaw());
						}
						resolve(new Response(body, response_options));
					});
					return;
				}

				// otherwise, use response as-is
				resolve(new Response(body, response_options));
			});

			writeToStream(req, request);
		});
	}

	/**
	 * Redirect code matching
	 *
	 * @param   Number   code  Status code
	 * @return  Boolean
	 */
	fetch.isRedirect = function (code) {
		return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
	};

	// Needed for TypeScript.
	fetch.default = fetch;

	// expose Promise
	fetch.Promise = global$1.Promise;

	module.exports = exports = fetch;
	exports.Headers = Headers;
	exports.Request = Request;
	exports.Response = Response;
	exports.FetchError = FetchError;

	var D__src_INTS_searchClient_node_modules_nodeFetch_lib = /*#__PURE__*/Object.freeze({

	});

	var nodePonyfill = createCommonjsModule(function (module, exports) {
	var realFetch = D__src_INTS_searchClient_node_modules_nodeFetch_lib.default || D__src_INTS_searchClient_node_modules_nodeFetch_lib;

	var fetch = function (url, options) {
	  // Support schemaless URIs on the server for parity with the browser.
	  // Ex: //github.com/ -> https://github.com/
	  if (/^\/\//.test(url)) {
	    url = 'https:' + url;
	  }
	  return realFetch.call(this, url, options);
	};

	fetch.polyfill = false;

	module.exports = exports = fetch;
	exports.fetch = fetch;
	exports.Headers = D__src_INTS_searchClient_node_modules_nodeFetch_lib.Headers;
	exports.Request = D__src_INTS_searchClient_node_modules_nodeFetch_lib.Request;
	exports.Response = D__src_INTS_searchClient_node_modules_nodeFetch_lib.Response;

	// Needed for TypeScript.
	exports.default = fetch;
	});
	var nodePonyfill_1 = nodePonyfill.fetch;
	var nodePonyfill_2 = nodePonyfill.Headers;
	var nodePonyfill_3 = nodePonyfill.Request;
	var nodePonyfill_4 = nodePonyfill.Response;

	/*
	 * jwt-simple
	 *
	 * JSON Web Token encode and decode module for node.js
	 *
	 * Copyright(c) 2011 Kazuhito Hokamura
	 * MIT Licensed
	 */

	/**
	 * module dependencies
	 */
	var crypto = require('crypto');


	/**
	 * support algorithm mapping
	 */
	var algorithmMap = {
	  HS256: 'sha256',
	  HS384: 'sha384',
	  HS512: 'sha512',
	  RS256: 'RSA-SHA256'
	};

	/**
	 * Map algorithm to hmac or sign type, to determine which crypto function to use
	 */
	var typeMap = {
	  HS256: 'hmac',
	  HS384: 'hmac',
	  HS512: 'hmac',
	  RS256: 'sign'
	};


	/**
	 * expose object
	 */
	var jwt = module.exports;


	/**
	 * version
	 */
	jwt.version = '0.5.1';

	/**
	 * Decode jwt
	 *
	 * @param {Object} token
	 * @param {String} key
	 * @param {Boolean} noVerify
	 * @param {String} algorithm
	 * @return {Object} payload
	 * @api public
	 */
	jwt.decode = function jwt_decode(token, key, noVerify, algorithm) {
	  // check token
	  if (!token) {
	    throw new Error('No token supplied');
	  }
	  // check segments
	  var segments = token.split('.');
	  if (segments.length !== 3) {
	    throw new Error('Not enough or too many segments');
	  }

	  // All segment should be base64
	  var headerSeg = segments[0];
	  var payloadSeg = segments[1];
	  var signatureSeg = segments[2];

	  // base64 decode and parse JSON
	  var header = JSON.parse(base64urlDecode(headerSeg));
	  var payload = JSON.parse(base64urlDecode(payloadSeg));

	  if (!noVerify) {
	    var signingMethod = algorithmMap[algorithm || header.alg];
	    var signingType = typeMap[algorithm || header.alg];
	    if (!signingMethod || !signingType) {
	      throw new Error('Algorithm not supported');
	    }

	    // verify signature. `sign` will return base64 string.
	    var signingInput = [headerSeg, payloadSeg].join('.');
	    if (!verify(signingInput, key, signingMethod, signingType, signatureSeg)) {
	      throw new Error('Signature verification failed');
	    }

	    // Support for nbf and exp claims.
	    // According to the RFC, they should be in seconds.
	    if (payload.nbf && Date.now() < payload.nbf*1000) {
	      throw new Error('Token not yet active');
	    }

	    if (payload.exp && Date.now() > payload.exp*1000) {
	      throw new Error('Token expired');
	    }
	  }

	  return payload;
	};


	/**
	 * Encode jwt
	 *
	 * @param {Object} payload
	 * @param {String} key
	 * @param {String} algorithm
	 * @param {Object} options
	 * @return {String} token
	 * @api public
	 */
	jwt.encode = function jwt_encode(payload, key, algorithm, options) {
	  // Check key
	  if (!key) {
	    throw new Error('Require key');
	  }

	  // Check algorithm, default is HS256
	  if (!algorithm) {
	    algorithm = 'HS256';
	  }

	  var signingMethod = algorithmMap[algorithm];
	  var signingType = typeMap[algorithm];
	  if (!signingMethod || !signingType) {
	    throw new Error('Algorithm not supported');
	  }

	  // header, typ is fixed value.
	  var header = { typ: 'JWT', alg: algorithm };
	  if (options && options.header) {
	    assignProperties(header, options.header);
	  }

	  // create segments, all segments should be base64 string
	  var segments = [];
	  segments.push(base64urlEncode(JSON.stringify(header)));
	  segments.push(base64urlEncode(JSON.stringify(payload)));
	  segments.push(sign(segments.join('.'), key, signingMethod, signingType));

	  return segments.join('.');
	};

	/**
	 * private util functions
	 */

	function assignProperties(dest, source) {
	  for (var attr in source) {
	    if (source.hasOwnProperty(attr)) {
	      dest[attr] = source[attr];
	    }
	  }
	}

	function verify(input, key, method, type, signature) {
	  if(type === "hmac") {
	    return (signature === sign(input, key, method, type));
	  }
	  else if(type == "sign") {
	    return crypto.createVerify(method)
	                 .update(input)
	                 .verify(key, base64urlUnescape(signature), 'base64');
	  }
	  else {
	    throw new Error('Algorithm type not recognized');
	  }
	}

	function sign(input, key, method, type) {
	  var base64str;
	  if(type === "hmac") {
	    base64str = crypto.createHmac(method, key).update(input).digest('base64');
	  }
	  else if(type == "sign") {
	    base64str = crypto.createSign(method).update(input).sign(key, 'base64');
	  }
	  else {
	    throw new Error('Algorithm type not recognized');
	  }

	  return base64urlEscape(base64str);
	}

	function base64urlDecode(str) {
	  return new Buffer(base64urlUnescape(str), 'base64').toString();
	}

	function base64urlUnescape(str) {
	  str += new Array(5 - str.length % 4).join('=');
	  return str.replace(/\-/g, '+').replace(/_/g, '/');
	}

	function base64urlEncode(str) {
	  return base64urlEscape(new Buffer(str).toString('base64'));
	}

	function base64urlEscape(str) {
	  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	}

	var jwt$1 = /*#__PURE__*/Object.freeze({

	});

	var jwtSimple = jwt$1;
	var jwtSimple_1 = jwtSimple.decode;

	var validUrl = createCommonjsModule(function (module) {
	(function(module) {

	    module.exports.is_uri = is_iri;
	    module.exports.is_http_uri = is_http_iri;
	    module.exports.is_https_uri = is_https_iri;
	    module.exports.is_web_uri = is_web_iri;
	    // Create aliases
	    module.exports.isUri = is_iri;
	    module.exports.isHttpUri = is_http_iri;
	    module.exports.isHttpsUri = is_https_iri;
	    module.exports.isWebUri = is_web_iri;


	    // private function
	    // internal URI spitter method - direct from RFC 3986
	    var splitUri = function(uri) {
	        var splitted = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
	        return splitted;
	    };

	    function is_iri(value) {
	        if (!value) {
	            return;
	        }

	        // check for illegal characters
	        if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return;

	        // check for hex escapes that aren't complete
	        if (/%[^0-9a-f]/i.test(value)) return;
	        if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;

	        var splitted = [];
	        var scheme = '';
	        var authority = '';
	        var path = '';
	        var query = '';
	        var fragment = '';
	        var out = '';

	        // from RFC 3986
	        splitted = splitUri(value);
	        scheme = splitted[1]; 
	        authority = splitted[2];
	        path = splitted[3];
	        query = splitted[4];
	        fragment = splitted[5];

	        // scheme and path are required, though the path can be empty
	        if (!(scheme && scheme.length && path.length >= 0)) return;

	        // if authority is present, the path must be empty or begin with a /
	        if (authority && authority.length) {
	            if (!(path.length === 0 || /^\//.test(path))) return;
	        } else {
	            // if authority is not present, the path must not start with //
	            if (/^\/\//.test(path)) return;
	        }

	        // scheme must begin with a letter, then consist of letters, digits, +, ., or -
	        if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase()))  return;

	        // re-assemble the URL per section 5.3 in RFC 3986
	        out += scheme + ':';
	        if (authority && authority.length) {
	            out += '//' + authority;
	        }

	        out += path;

	        if (query && query.length) {
	            out += '?' + query;
	        }

	        if (fragment && fragment.length) {
	            out += '#' + fragment;
	        }

	        return out;
	    }

	    function is_http_iri(value, allowHttps) {
	        if (!is_iri(value)) {
	            return;
	        }

	        var splitted = [];
	        var scheme = '';
	        var authority = '';
	        var path = '';
	        var port = '';
	        var query = '';
	        var fragment = '';
	        var out = '';

	        // from RFC 3986
	        splitted = splitUri(value);
	        scheme = splitted[1]; 
	        authority = splitted[2];
	        path = splitted[3];
	        query = splitted[4];
	        fragment = splitted[5];

	        if (!scheme)  return;

	        if(allowHttps) {
	            if (scheme.toLowerCase() != 'https') return;
	        } else {
	            if (scheme.toLowerCase() != 'http') return;
	        }

	        // fully-qualified URIs must have an authority section that is
	        // a valid host
	        if (!authority) {
	            return;
	        }

	        // enable port component
	        if (/:(\d+)$/.test(authority)) {
	            port = authority.match(/:(\d+)$/)[0];
	            authority = authority.replace(/:\d+$/, '');
	        }

	        out += scheme + ':';
	        out += '//' + authority;
	        
	        if (port) {
	            out += port;
	        }
	        
	        out += path;
	        
	        if(query && query.length){
	            out += '?' + query;
	        }

	        if(fragment && fragment.length){
	            out += '#' + fragment;
	        }
	        
	        return out;
	    }

	    function is_https_iri(value) {
	        return is_http_iri(value, true);
	    }

	    function is_web_iri(value) {
	        return (is_http_iri(value) || is_https_iri(value));
	    }

	})(module);
	});

	/**
	 * A common service base-class for the descending Autocomplete, Categorize and Find classes.
	 *
	 * @param TDataType Defines the data-type that the descendant service-class needs to return on lookups.
	 */
	var BaseCall = /** @class */ (function () {
	    function BaseCall() {
	        this.deferUpdate = false;
	    }
	    /**
	     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution.
	     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
	     * @param state Turns on or off deferring of updates.
	     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
	     */
	    BaseCall.prototype.deferUpdates = function (state, skipPending) {
	        if (skipPending === void 0) { skipPending = false; }
	        this.deferUpdate = state;
	        if (!state && this.deferredQuery) {
	            var query = this.deferredQuery;
	            this.deferredQuery = null;
	            if (!skipPending) {
	                this.update(query);
	            }
	        }
	    };
	    /**
	     * Sets up the Request that is to be executed, with headers and auth as needed.
	     */
	    BaseCall.prototype.requestObject = function () {
	        var headers = {
	            'Content-Type': 'application/json',
	        };
	        if (this.auth && this.auth.authenticationToken) {
	            headers.Authorization = "Bearer " + this.auth.authenticationToken;
	        }
	        return {
	            cache: 'default',
	            credentials: 'include',
	            headers: headers,
	            method: 'GET',
	            mode: 'cors',
	        };
	    };
	    BaseCall.prototype.update = function (query) {
	        if (this.deferUpdate) {
	            // Save the query, so that when the deferUpdate is again false we can then execute it.
	            this.deferredQuery = query;
	        }
	        else {
	            // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
	            clearTimeout(this.delay);
	            //if (query !== null) {
	            this.fetch(query);
	            //}
	        }
	    };
	    BaseCall.prototype.clientCategoryFiltersChanged = function (oldValue, value) { };
	    BaseCall.prototype.clientIdChanged = function (oldValue, query) { };
	    BaseCall.prototype.categorizationTypeChanged = function (oldValue, query) { };
	    BaseCall.prototype.dateFromChanged = function (oldValue, query) { };
	    BaseCall.prototype.dateToChanged = function (oldValue, query) { };
	    BaseCall.prototype.filtersChanged = function (oldValue, query) { };
	    BaseCall.prototype.matchGenerateContentChanged = function (oldValue, query) { };
	    BaseCall.prototype.matchGenerateContentHighlightsChanged = function (oldValue, query) { };
	    BaseCall.prototype.matchGroupingChanged = function (oldValue, query) { };
	    BaseCall.prototype.matchOrderByChanged = function (oldValue, query) { };
	    BaseCall.prototype.matchPageChanged = function (oldValue, query) { };
	    BaseCall.prototype.matchPageSizeChanged = function (oldValue, query) { };
	    BaseCall.prototype.maxSuggestionsChanged = function (oldValue, query) { };
	    BaseCall.prototype.queryTextChanged = function (oldValue, query) { };
	    BaseCall.prototype.searchTypeChanged = function (oldValue, query) { };
	    BaseCall.prototype.uiLanguageCodeChanged = function (oldValue, query) { };
	    /**
	     * Sets up a the common base handling for services, such as checking that the url is valid and handling the authentication.
	     *
	     * @param baseUrl - The base url for the service to be setup.
	     * @param settings - The base url for the service to be setup.
	     * @param auth - The auth-object that controls authentication for the service.
	     */
	    BaseCall.prototype.init = function (baseUrl, settings, auth) {
	        // Strip off any slashes at the end of the baseUrl
	        var path = settings && settings.path ? settings.path : '';
	        baseUrl = baseUrl.replace(/\/+$/, '') + "/" + path;
	        // Verify the authenticity
	        if (!validUrl.isWebUri(baseUrl)) {
	            throw new Error('Error: No baseUrl is defined. Please supply a valid baseUrl in the format: http[s]://<domain.com>[:port][/path]');
	        }
	        this.baseUrl = baseUrl;
	        this.settings = settings;
	        this.auth = auth;
	    };
	    BaseCall.prototype.cbRequest = function (suppressCallbacks, url, reqInit) {
	        if (!this.settings) {
	            throw new Error('Settings cannot be empty.');
	        }
	        if (this.settings.cbRequest && !suppressCallbacks) {
	            return this.settings.cbRequest(url, reqInit);
	        }
	        // If no request-callback is set up we return true to allow the fetch to be executed
	        return true;
	    };
	    BaseCall.prototype.cbError = function (suppressCallbacks, error, url, reqInit) {
	        if (!this.settings) {
	            throw new Error('Settings cannot be empty.');
	        }
	        if (this.settings.cbSuccess && !suppressCallbacks) {
	            this.settings.cbError(error);
	        }
	    };
	    BaseCall.prototype.cbSuccess = function (suppressCallbacks, data, url, reqInit) {
	        if (!this.settings) {
	            throw new Error('Settings cannot be empty.');
	        }
	        if (this.settings.cbSuccess && !suppressCallbacks) {
	            this.settings.cbSuccess(data);
	        }
	    };
	    return BaseCall;
	}());

	/**
	 * Defines the different categorizationtypes that can be used (modes).
	 * @default All
	 */
	(function (CategorizationType) {
	    /**
	     * Returns categories with hits only.
	     */
	    CategorizationType[CategorizationType["All"] = 0] = "All";
	    /**
	     * Returns all categories (even for categories that has no hits).
	     */
	    CategorizationType[CategorizationType["DocumentHitsOnly"] = 1] = "DocumentHitsOnly";
	})(exports.CategorizationType || (exports.CategorizationType = {}));

	/**
	 * Ordering algorithm options. Allowed values: "Date", "Relevance"
	 * @default "Relevance"
	 */
	(function (OrderBy) {
	    /**
	     * Order results by Relevance, highest first.
	     */
	    OrderBy[OrderBy["Relevance"] = 0] = "Relevance";
	    /**
	     * Order results by date, newest first.
	     */
	    OrderBy[OrderBy["Date"] = 1] = "Date";
	})(exports.OrderBy || (exports.OrderBy = {}));

	/**
	 * Defines the different searchtypes that can be used (modes).
	 * @default Keywords
	 */
	(function (SearchType) {
	    /**
	     * Find results via keywords mode (AND-search)
	     */
	    SearchType[SearchType["Keywords"] = 0] = "Keywords";
	    /**
	     * Find results via relevance-mode (OR-search)
	     */
	    SearchType[SearchType["Relevance"] = 1] = "Relevance";
	})(exports.SearchType || (exports.SearchType = {}));

	var Query = /** @class */ (function () {
	    /**
	     * Instantiates a Query object, based on Query defaults and the overrides provided as a param.
	     *
	     * @param query - The Query object with override values.
	     */
	    function Query(query) {
	        if (query === void 0) { query = {}; }
	        /**
	         * Any string that you want to identify the client with. Can be used in the categories configuration and in the relevance tuning.
	         */
	        this.clientId = '';
	        /**
	         * Used to specify whether categorize calls should always return all categories or just categories that has matches.
	         */
	        this.categorizationType = exports.CategorizationType.All;
	        /**
	         * Used to specify the start date-range.
	         */
	        this.dateFrom = null;
	        /**
	         * Used to specify the end date-range.
	         */
	        this.dateTo = null;
	        /**
	         * Use one of this query parameter to specify the filters to apply. Each filter should contain its group name
	         * followed by category names, representing complete hierarchy of the category. The names specified here is derived from category Name
	         * property and not its display name. When specifying multiple filters, separate them either by comma or semicolon.
	         * For example: &f=Authors|Sam;FileTypes|docx
	         * Note the above names are case sensitive.
	         */
	        this.filters = [];
	        /**
	         * Decides whether or not to request content to be generated in the response matches.
	         *
	         * Note: Only available for v4+.
	         */
	        this.matchGenerateContent = false;
	        /**
	         * Decides whether or not to request highlight-tags to be included in the generated the response matches.
	         *
	         * Note: Requires `matchGenerateContent` to be `true` to be effective.
	         * Note: Only available for v4+.
	         */
	        this.matchGenerateContentHighlights = true;
	        /**
	         * Decides whether or not to use the parent-grouping feature to group results.
	         */
	        this.matchGrouping = false;
	        /**
	         * Decides which ordering algorithm to use.
	         */
	        this.matchOrderBy = exports.OrderBy.Relevance;
	        /**
	         * The actual page to fetch. Expects a number >= 1.
	         */
	        this.matchPage = 1;
	        /**
	         * The number of results per page to fetch. Expects a number >= 1.
	         */
	        this.matchPageSize = 10;
	        /**
	         * The maximum number of query-suggestions to fetch.
	         */
	        this.maxSuggestions = 10;
	        /**
	         * The queryText that is to be used for autocomplete/find/categorize.
	         */
	        this.queryText = '';
	        /**
	         * The type of search to perform.
	         */
	        this.searchType = exports.SearchType.Keywords;
	        /**
	         * The UI language of the client (translates i.e. categories to the client language).
	         */
	        this.uiLanguageCode = '';
	        Object.assign(this, query);
	    }
	    return Query;
	}());

	//import { VersionPathSettings } from './VersionPathSettings';
	/**
	 * A common settings base-class for the descending Autocomplete, Categorize and Find settings classes.
	 *
	 * @param TDataType Defines the data-type that the descendant settings-class needs to return on lookups.
	 */
	var BaseSettings = /** @class */ (function () {
	    /**
	     * Handles the construction of the base-settings class with its properties.
	     *
	     * @param settings The settings that are to be set up for the base settings class.
	     */
	    function BaseSettings(settings) {
	        /**
	         * A notifier method to call whenever the lookup fails.
	         * @param error - An error object as given by the fetch operation.
	         */
	        this.cbError = undefined;
	        /**
	         * A notifier method that is called just before the fetch operation is started. When the request
	         * is finished either cbSuccess or cbError will be called to indicate success or failure.
	         * This callback is typically used for setting loading indicators and/or debugging purposes.
	         *
	         * Note: If the callback returns false then the fetch operation is skipped. This can then be used
	         * to conditionally drop requests from being made.
	         *
	         * @param url - This is the url that is/was fetched. Good for debugging purposes.
	         * @param reqInit - This is the RequestInit object that was used for the fetch operation.
	         */
	        this.cbRequest = undefined;
	        /**
	         * A notifier method to call whenever the lookup results have been received.
	         * @param data - The lookup results.
	         */
	        this.cbSuccess = undefined;
	        /**
	         * Whether or not this setting-feature is enabled or not.
	         */
	        this.enabled = true;
	        /**
	         * You can use this path to override the path to the rest-service.
	         * If not set, it will default to "RestService/v" and whatever `this.version` is set to.
	         * If it is set it will use the set path verbatim, without appending `this.version`.
	         */
	        this.path = 'RestService/v4';
	        if (settings) {
	            this.enabled = typeof settings.enabled !== 'undefined' ? settings.enabled : this.enabled;
	            this.cbError = typeof settings.cbError !== 'undefined' ? settings.cbError : this.cbError;
	            this.cbRequest = typeof settings.cbRequest !== 'undefined' ? settings.cbRequest : this.cbRequest;
	            this.cbSuccess = typeof settings.cbSuccess !== 'undefined' ? settings.cbSuccess : this.cbSuccess;
	            this.path = typeof settings.path !== 'undefined' ? settings.path.replace(/(^\/+)|(\/+$)/g, '') : this.path;
	        }
	    }
	    return BaseSettings;
	}());

	/**
	 * These are the triggers that define when and when not to trigger an authentication lookup.
	 */
	var AuthenticationTriggers = /** @class */ (function () {
	    /**
	     * Creates an AuthenticationTrigger object for you.
	     * @param expiryOverlap - Defines how long in seconds before expiry we should request a new auth token.
	     */
	    function AuthenticationTriggers(expiryOverlap) {
	        if (expiryOverlap === void 0) { expiryOverlap = 60; }
	        this.expiryOverlap = expiryOverlap;
	    }
	    return AuthenticationTriggers;
	}());

	/**
	 * These are all the settings that can affect the use of jwt authentication in the search-client.
	 */
	var AuthenticationSettings = /** @class */ (function (_super) {
	    __extends(AuthenticationSettings, _super);
	    /**
	     * Creates an AuthenticationSettings object for you, based on AuthenticationSettings defaults and the overrides provided as a param.
	     * @param settings - The settings defined here will override the default AuthenticationSettings.
	     */
	    function AuthenticationSettings(settings) {
	        var _this = _super.call(this, settings) || this;
	        /**
	         * Whether or not this setting-feature is enabled or not.
	         *
	         * @override Overrides base-settings and sets the automatic authentication off by default.
	         */
	        _this.enabled = false;
	        /**
	         * This is the token, if you need to set an initial value (i.e. if you already have the token)
	         */
	        _this.token = undefined;
	        /**
	         * This is the path to the value returned by the authentication-call.
	         * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
	         */
	        _this.tokenPath = ['jwtToken'];
	        /**
	         * The trigger-settings for when a new auth-token is to be reqeusted.
	         */
	        _this.triggers = new AuthenticationTriggers();
	        /**
	         * The endpoint to do authentication lookups on.
	         */
	        _this.url = 'auth/token';
	        if (settings) {
	            _this.enabled = typeof settings.enabled !== 'undefined' ? settings.enabled : _this.enabled;
	            _this.token = typeof settings.token !== 'undefined' ? settings.token : _this.token;
	            _this.tokenPath = typeof settings.tokenPath !== 'undefined' ? settings.tokenPath : _this.tokenPath;
	            _this.triggers = typeof settings.triggers !== 'undefined' ? new AuthenticationTriggers(settings.triggers.expiryOverlap) : _this.triggers;
	            _this.url = typeof settings.url !== 'undefined' ? settings.url.replace(/(^\/+)|(\/+$)/g, '') : _this.url;
	        }
	        return _this;
	    }
	    return AuthenticationSettings;
	}(BaseSettings));

	/**
	 * This class defines the auth-token that all the services in the SearchClient instance passes along it's serverside lookups.
	 */
	var AuthToken = /** @class */ (function () {
	    function AuthToken() {
	        /**
	         * When defined will contain the Json Web Token that is to be used to authenticate the rest-calls to the search-service.
	         */
	        this.authenticationToken = undefined;
	    }
	    return AuthToken;
	}());

	/**
	 * The Authentication service is a supporting feature for the other services.
	 * Typically used via the [[SearchClient.constructor]] and by providing [[AuthenticationSettings]] settings in
	 * the [[Settings.authentication]] property.
	 *
	 * The authentication system is based on JWT and needs an end-point to be configured from where it will get its
	 * authentication-token. This service will be monitoring the token-value to see if it is either missing or
	 * expired. When that happens a new token will be fetched from the end-point. The [[AuthenticationSettings.expiryOverlap]]
	 * object controls how long before expiration the new token is to be fetched.
	 */
	var Authentication = /** @class */ (function (_super) {
	    __extends(Authentication, _super);
	    /**
	     * Creates an Authentication object that knows where to get the auth-token and when to refresh it.
	     * @param baseUrl - The baseUrl that the authentication is to operate from.
	     * @param settings - The settings for the authentication object.
	     * @param auth - An object that controls the authentication for the lookups.
	     */
	    function Authentication(baseUrl, settings, auth) {
	        var _this = _super.call(this) || this;
	        _this.settings = settings;
	        settings = new AuthenticationSettings(settings);
	        auth = auth || new AuthToken();
	        _super.prototype.init.call(_this, baseUrl, settings, auth);
	        if (_this.settings.token) {
	            _this.auth.authenticationToken = _this.settings.token;
	            _this.settings.token = undefined;
	            _this.setupRefresh();
	        }
	        else if (_this.settings.enabled) {
	            // We authenticate immediately in order to have the token in place when the first calls come in.
	            _this.update(null);
	        }
	        return _this;
	    }
	    /**
	     * Fetches the authentication-token from the server.
	     * @param query - For the Authentication service this parameter is ignored.
	     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
	     * @returns a promise that when resolved returns a jwt token.
	     */
	    Authentication.prototype.fetch = function (query, suppressCallbacks) {
	        var _this = this;
	        if (query === void 0) { query = new Query(); }
	        if (suppressCallbacks === void 0) { suppressCallbacks = false; }
	        var url = this.baseUrl + "/" + this.settings.url;
	        var reqInit = this.requestObject();
	        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
	            return nodePonyfill(url, reqInit)
	                .then(function (response) {
	                if (!response.ok) {
	                    throw Error(response.status + " " + response.statusText + " for request url '" + url + "'");
	                }
	                return response.json();
	            })
	                .then(function (data) {
	                // Find the auth token by using the settings for where it is in the structure.
	                for (var _i = 0, _a = _this.settings.tokenPath; _i < _a.length; _i++) {
	                    var i = _a[_i];
	                    data = data[i];
	                }
	                // Update the token
	                _this.auth.authenticationToken = data;
	                // Set up a timer for refreshing the token before/if it expires.
	                _this.setupRefresh();
	                _this.cbSuccess(suppressCallbacks, _this.auth.authenticationToken, url, reqInit);
	                return _this.auth.authenticationToken;
	            })
	                .catch(function (error) {
	                _this.cbError(suppressCallbacks, error, url, reqInit);
	                return Promise.reject(error);
	            });
	        }
	        else {
	            return Promise.resolve(null);
	        }
	    };
	    Authentication.prototype.setupRefresh = function () {
	        var _this = this;
	        try {
	            if (this.auth && this.auth.authenticationToken) {
	                var token = jwtSimple_1(this.auth.authenticationToken, null, true);
	                var expiration = token.exp ? new Date(token.exp * 1000) : undefined;
	                if (expiration) {
	                    var remainingSeconds = (expiration.valueOf() - new Date().valueOf()) / 1000;
	                    remainingSeconds = Math.max(remainingSeconds - this.settings.triggers.expiryOverlap, 0);
	                    //console.log(`Setting up auth-refresh in ${remainingSeconds} seconds, at ${expiration}.`, token);
	                    setTimeout(function () {
	                        _this.update(null);
	                    }, remainingSeconds);
	                }
	            }
	        }
	        catch (e) {
	            console.error("Unable to parse the provided token '" + this.auth.authenticationToken + "': " + e);
	        }
	    };
	    return Authentication;
	}(BaseCall));

	var moment = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory();
	}(commonjsGlobal, (function () {
	    var hookCallback;

	    function hooks () {
	        return hookCallback.apply(null, arguments);
	    }

	    // This is done to register the method called with moment()
	    // without creating circular dependencies.
	    function setHookCallback (callback) {
	        hookCallback = callback;
	    }

	    function isArray(input) {
	        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
	    }

	    function isObject(input) {
	        // IE8 will treat undefined and null as object if it wasn't for
	        // input != null
	        return input != null && Object.prototype.toString.call(input) === '[object Object]';
	    }

	    function isObjectEmpty(obj) {
	        if (Object.getOwnPropertyNames) {
	            return (Object.getOwnPropertyNames(obj).length === 0);
	        } else {
	            var k;
	            for (k in obj) {
	                if (obj.hasOwnProperty(k)) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    }

	    function isUndefined(input) {
	        return input === void 0;
	    }

	    function isNumber(input) {
	        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
	    }

	    function isDate(input) {
	        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	    }

	    function map(arr, fn) {
	        var res = [], i;
	        for (i = 0; i < arr.length; ++i) {
	            res.push(fn(arr[i], i));
	        }
	        return res;
	    }

	    function hasOwnProp(a, b) {
	        return Object.prototype.hasOwnProperty.call(a, b);
	    }

	    function extend(a, b) {
	        for (var i in b) {
	            if (hasOwnProp(b, i)) {
	                a[i] = b[i];
	            }
	        }

	        if (hasOwnProp(b, 'toString')) {
	            a.toString = b.toString;
	        }

	        if (hasOwnProp(b, 'valueOf')) {
	            a.valueOf = b.valueOf;
	        }

	        return a;
	    }

	    function createUTC (input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, true).utc();
	    }

	    function defaultParsingFlags() {
	        // We need to deep clone this object.
	        return {
	            empty           : false,
	            unusedTokens    : [],
	            unusedInput     : [],
	            overflow        : -2,
	            charsLeftOver   : 0,
	            nullInput       : false,
	            invalidMonth    : null,
	            invalidFormat   : false,
	            userInvalidated : false,
	            iso             : false,
	            parsedDateParts : [],
	            meridiem        : null,
	            rfc2822         : false,
	            weekdayMismatch : false
	        };
	    }

	    function getParsingFlags(m) {
	        if (m._pf == null) {
	            m._pf = defaultParsingFlags();
	        }
	        return m._pf;
	    }

	    var some;
	    if (Array.prototype.some) {
	        some = Array.prototype.some;
	    } else {
	        some = function (fun) {
	            var t = Object(this);
	            var len = t.length >>> 0;

	            for (var i = 0; i < len; i++) {
	                if (i in t && fun.call(this, t[i], i, t)) {
	                    return true;
	                }
	            }

	            return false;
	        };
	    }

	    function isValid(m) {
	        if (m._isValid == null) {
	            var flags = getParsingFlags(m);
	            var parsedParts = some.call(flags.parsedDateParts, function (i) {
	                return i != null;
	            });
	            var isNowValid = !isNaN(m._d.getTime()) &&
	                flags.overflow < 0 &&
	                !flags.empty &&
	                !flags.invalidMonth &&
	                !flags.invalidWeekday &&
	                !flags.weekdayMismatch &&
	                !flags.nullInput &&
	                !flags.invalidFormat &&
	                !flags.userInvalidated &&
	                (!flags.meridiem || (flags.meridiem && parsedParts));

	            if (m._strict) {
	                isNowValid = isNowValid &&
	                    flags.charsLeftOver === 0 &&
	                    flags.unusedTokens.length === 0 &&
	                    flags.bigHour === undefined;
	            }

	            if (Object.isFrozen == null || !Object.isFrozen(m)) {
	                m._isValid = isNowValid;
	            }
	            else {
	                return isNowValid;
	            }
	        }
	        return m._isValid;
	    }

	    function createInvalid (flags) {
	        var m = createUTC(NaN);
	        if (flags != null) {
	            extend(getParsingFlags(m), flags);
	        }
	        else {
	            getParsingFlags(m).userInvalidated = true;
	        }

	        return m;
	    }

	    // Plugins that add properties should also add the key here (null value),
	    // so we can properly clone ourselves.
	    var momentProperties = hooks.momentProperties = [];

	    function copyConfig(to, from) {
	        var i, prop, val;

	        if (!isUndefined(from._isAMomentObject)) {
	            to._isAMomentObject = from._isAMomentObject;
	        }
	        if (!isUndefined(from._i)) {
	            to._i = from._i;
	        }
	        if (!isUndefined(from._f)) {
	            to._f = from._f;
	        }
	        if (!isUndefined(from._l)) {
	            to._l = from._l;
	        }
	        if (!isUndefined(from._strict)) {
	            to._strict = from._strict;
	        }
	        if (!isUndefined(from._tzm)) {
	            to._tzm = from._tzm;
	        }
	        if (!isUndefined(from._isUTC)) {
	            to._isUTC = from._isUTC;
	        }
	        if (!isUndefined(from._offset)) {
	            to._offset = from._offset;
	        }
	        if (!isUndefined(from._pf)) {
	            to._pf = getParsingFlags(from);
	        }
	        if (!isUndefined(from._locale)) {
	            to._locale = from._locale;
	        }

	        if (momentProperties.length > 0) {
	            for (i = 0; i < momentProperties.length; i++) {
	                prop = momentProperties[i];
	                val = from[prop];
	                if (!isUndefined(val)) {
	                    to[prop] = val;
	                }
	            }
	        }

	        return to;
	    }

	    var updateInProgress = false;

	    // Moment prototype object
	    function Moment(config) {
	        copyConfig(this, config);
	        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	        if (!this.isValid()) {
	            this._d = new Date(NaN);
	        }
	        // Prevent infinite loop in case updateOffset creates new moment
	        // objects.
	        if (updateInProgress === false) {
	            updateInProgress = true;
	            hooks.updateOffset(this);
	            updateInProgress = false;
	        }
	    }

	    function isMoment (obj) {
	        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
	    }

	    function absFloor (number) {
	        if (number < 0) {
	            // -0 -> 0
	            return Math.ceil(number) || 0;
	        } else {
	            return Math.floor(number);
	        }
	    }

	    function toInt(argumentForCoercion) {
	        var coercedNumber = +argumentForCoercion,
	            value = 0;

	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	            value = absFloor(coercedNumber);
	        }

	        return value;
	    }

	    // compare two arrays, return the number of differences
	    function compareArrays(array1, array2, dontConvert) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if ((dontConvert && array1[i] !== array2[i]) ||
	                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }

	    function warn(msg) {
	        if (hooks.suppressDeprecationWarnings === false &&
	                (typeof console !==  'undefined') && console.warn) {
	            console.warn('Deprecation warning: ' + msg);
	        }
	    }

	    function deprecate(msg, fn) {
	        var firstTime = true;

	        return extend(function () {
	            if (hooks.deprecationHandler != null) {
	                hooks.deprecationHandler(null, msg);
	            }
	            if (firstTime) {
	                var args = [];
	                var arg;
	                for (var i = 0; i < arguments.length; i++) {
	                    arg = '';
	                    if (typeof arguments[i] === 'object') {
	                        arg += '\n[' + i + '] ';
	                        for (var key in arguments[0]) {
	                            arg += key + ': ' + arguments[0][key] + ', ';
	                        }
	                        arg = arg.slice(0, -2); // Remove trailing comma and space
	                    } else {
	                        arg = arguments[i];
	                    }
	                    args.push(arg);
	                }
	                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
	                firstTime = false;
	            }
	            return fn.apply(this, arguments);
	        }, fn);
	    }

	    var deprecations = {};

	    function deprecateSimple(name, msg) {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(name, msg);
	        }
	        if (!deprecations[name]) {
	            warn(msg);
	            deprecations[name] = true;
	        }
	    }

	    hooks.suppressDeprecationWarnings = false;
	    hooks.deprecationHandler = null;

	    function isFunction(input) {
	        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	    }

	    function set (config) {
	        var prop, i;
	        for (i in config) {
	            prop = config[i];
	            if (isFunction(prop)) {
	                this[i] = prop;
	            } else {
	                this['_' + i] = prop;
	            }
	        }
	        this._config = config;
	        // Lenient ordinal parsing accepts just a number in addition to
	        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
	        // TODO: Remove "ordinalParse" fallback in next major release.
	        this._dayOfMonthOrdinalParseLenient = new RegExp(
	            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
	                '|' + (/\d{1,2}/).source);
	    }

	    function mergeConfigs(parentConfig, childConfig) {
	        var res = extend({}, parentConfig), prop;
	        for (prop in childConfig) {
	            if (hasOwnProp(childConfig, prop)) {
	                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                    res[prop] = {};
	                    extend(res[prop], parentConfig[prop]);
	                    extend(res[prop], childConfig[prop]);
	                } else if (childConfig[prop] != null) {
	                    res[prop] = childConfig[prop];
	                } else {
	                    delete res[prop];
	                }
	            }
	        }
	        for (prop in parentConfig) {
	            if (hasOwnProp(parentConfig, prop) &&
	                    !hasOwnProp(childConfig, prop) &&
	                    isObject(parentConfig[prop])) {
	                // make sure changes to properties don't modify parent config
	                res[prop] = extend({}, res[prop]);
	            }
	        }
	        return res;
	    }

	    function Locale(config) {
	        if (config != null) {
	            this.set(config);
	        }
	    }

	    var keys;

	    if (Object.keys) {
	        keys = Object.keys;
	    } else {
	        keys = function (obj) {
	            var i, res = [];
	            for (i in obj) {
	                if (hasOwnProp(obj, i)) {
	                    res.push(i);
	                }
	            }
	            return res;
	        };
	    }

	    var defaultCalendar = {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    };

	    function calendar (key, mom, now) {
	        var output = this._calendar[key] || this._calendar['sameElse'];
	        return isFunction(output) ? output.call(mom, now) : output;
	    }

	    var defaultLongDateFormat = {
	        LTS  : 'h:mm:ss A',
	        LT   : 'h:mm A',
	        L    : 'MM/DD/YYYY',
	        LL   : 'MMMM D, YYYY',
	        LLL  : 'MMMM D, YYYY h:mm A',
	        LLLL : 'dddd, MMMM D, YYYY h:mm A'
	    };

	    function longDateFormat (key) {
	        var format = this._longDateFormat[key],
	            formatUpper = this._longDateFormat[key.toUpperCase()];

	        if (format || !formatUpper) {
	            return format;
	        }

	        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	            return val.slice(1);
	        });

	        return this._longDateFormat[key];
	    }

	    var defaultInvalidDate = 'Invalid date';

	    function invalidDate () {
	        return this._invalidDate;
	    }

	    var defaultOrdinal = '%d';
	    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

	    function ordinal (number) {
	        return this._ordinal.replace('%d', number);
	    }

	    var defaultRelativeTime = {
	        future : 'in %s',
	        past   : '%s ago',
	        s  : 'a few seconds',
	        ss : '%d seconds',
	        m  : 'a minute',
	        mm : '%d minutes',
	        h  : 'an hour',
	        hh : '%d hours',
	        d  : 'a day',
	        dd : '%d days',
	        M  : 'a month',
	        MM : '%d months',
	        y  : 'a year',
	        yy : '%d years'
	    };

	    function relativeTime (number, withoutSuffix, string, isFuture) {
	        var output = this._relativeTime[string];
	        return (isFunction(output)) ?
	            output(number, withoutSuffix, string, isFuture) :
	            output.replace(/%d/i, number);
	    }

	    function pastFuture (diff, output) {
	        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	    }

	    var aliases = {};

	    function addUnitAlias (unit, shorthand) {
	        var lowerCase = unit.toLowerCase();
	        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	    }

	    function normalizeUnits(units) {
	        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	    }

	    function normalizeObjectUnits(inputObject) {
	        var normalizedInput = {},
	            normalizedProp,
	            prop;

	        for (prop in inputObject) {
	            if (hasOwnProp(inputObject, prop)) {
	                normalizedProp = normalizeUnits(prop);
	                if (normalizedProp) {
	                    normalizedInput[normalizedProp] = inputObject[prop];
	                }
	            }
	        }

	        return normalizedInput;
	    }

	    var priorities = {};

	    function addUnitPriority(unit, priority) {
	        priorities[unit] = priority;
	    }

	    function getPrioritizedUnits(unitsObj) {
	        var units = [];
	        for (var u in unitsObj) {
	            units.push({unit: u, priority: priorities[u]});
	        }
	        units.sort(function (a, b) {
	            return a.priority - b.priority;
	        });
	        return units;
	    }

	    function zeroFill(number, targetLength, forceSign) {
	        var absNumber = '' + Math.abs(number),
	            zerosToFill = targetLength - absNumber.length,
	            sign = number >= 0;
	        return (sign ? (forceSign ? '+' : '') : '-') +
	            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	    }

	    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

	    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	    var formatFunctions = {};

	    var formatTokenFunctions = {};

	    // token:    'M'
	    // padded:   ['MM', 2]
	    // ordinal:  'Mo'
	    // callback: function () { this.month() + 1 }
	    function addFormatToken (token, padded, ordinal, callback) {
	        var func = callback;
	        if (typeof callback === 'string') {
	            func = function () {
	                return this[callback]();
	            };
	        }
	        if (token) {
	            formatTokenFunctions[token] = func;
	        }
	        if (padded) {
	            formatTokenFunctions[padded[0]] = function () {
	                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	            };
	        }
	        if (ordinal) {
	            formatTokenFunctions[ordinal] = function () {
	                return this.localeData().ordinal(func.apply(this, arguments), token);
	            };
	        }
	    }

	    function removeFormattingTokens(input) {
	        if (input.match(/\[[\s\S]/)) {
	            return input.replace(/^\[|\]$/g, '');
	        }
	        return input.replace(/\\/g, '');
	    }

	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens), i, length;

	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }

	        return function (mom) {
	            var output = '', i;
	            for (i = 0; i < length; i++) {
	                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
	            }
	            return output;
	        };
	    }

	    // format date using native date object
	    function formatMoment(m, format) {
	        if (!m.isValid()) {
	            return m.localeData().invalidDate();
	        }

	        format = expandFormat(format, m.localeData());
	        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

	        return formatFunctions[format](m);
	    }

	    function expandFormat(format, locale) {
	        var i = 5;

	        function replaceLongDateFormatTokens(input) {
	            return locale.longDateFormat(input) || input;
	        }

	        localFormattingTokens.lastIndex = 0;
	        while (i >= 0 && localFormattingTokens.test(format)) {
	            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	            localFormattingTokens.lastIndex = 0;
	            i -= 1;
	        }

	        return format;
	    }

	    var match1         = /\d/;            //       0 - 9
	    var match2         = /\d\d/;          //      00 - 99
	    var match3         = /\d{3}/;         //     000 - 999
	    var match4         = /\d{4}/;         //    0000 - 9999
	    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
	    var match1to2      = /\d\d?/;         //       0 - 99
	    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
	    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
	    var match1to3      = /\d{1,3}/;       //       0 - 999
	    var match1to4      = /\d{1,4}/;       //       0 - 9999
	    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

	    var matchUnsigned  = /\d+/;           //       0 - inf
	    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

	    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

	    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	    // any word (or two) characters or numbers including two/three word month in arabic.
	    // includes scottish gaelic two word and hyphenated months
	    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

	    var regexes = {};

	    function addRegexToken (token, regex, strictRegex) {
	        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
	            return (isStrict && strictRegex) ? strictRegex : regex;
	        };
	    }

	    function getParseRegexForToken (token, config) {
	        if (!hasOwnProp(regexes, token)) {
	            return new RegExp(unescapeFormat(token));
	        }

	        return regexes[token](config._strict, config._locale);
	    }

	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	    function unescapeFormat(s) {
	        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	            return p1 || p2 || p3 || p4;
	        }));
	    }

	    function regexEscape(s) {
	        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }

	    var tokens = {};

	    function addParseToken (token, callback) {
	        var i, func = callback;
	        if (typeof token === 'string') {
	            token = [token];
	        }
	        if (isNumber(callback)) {
	            func = function (input, array) {
	                array[callback] = toInt(input);
	            };
	        }
	        for (i = 0; i < token.length; i++) {
	            tokens[token[i]] = func;
	        }
	    }

	    function addWeekParseToken (token, callback) {
	        addParseToken(token, function (input, array, config, token) {
	            config._w = config._w || {};
	            callback(input, config._w, config, token);
	        });
	    }

	    function addTimeToArrayFromToken(token, input, config) {
	        if (input != null && hasOwnProp(tokens, token)) {
	            tokens[token](input, config._a, config, token);
	        }
	    }

	    var YEAR = 0;
	    var MONTH = 1;
	    var DATE = 2;
	    var HOUR = 3;
	    var MINUTE = 4;
	    var SECOND = 5;
	    var MILLISECOND = 6;
	    var WEEK = 7;
	    var WEEKDAY = 8;

	    // FORMATTING

	    addFormatToken('Y', 0, 0, function () {
	        var y = this.year();
	        return y <= 9999 ? '' + y : '+' + y;
	    });

	    addFormatToken(0, ['YY', 2], 0, function () {
	        return this.year() % 100;
	    });

	    addFormatToken(0, ['YYYY',   4],       0, 'year');
	    addFormatToken(0, ['YYYYY',  5],       0, 'year');
	    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	    // ALIASES

	    addUnitAlias('year', 'y');

	    // PRIORITIES

	    addUnitPriority('year', 1);

	    // PARSING

	    addRegexToken('Y',      matchSigned);
	    addRegexToken('YY',     match1to2, match2);
	    addRegexToken('YYYY',   match1to4, match4);
	    addRegexToken('YYYYY',  match1to6, match6);
	    addRegexToken('YYYYYY', match1to6, match6);

	    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	    addParseToken('YYYY', function (input, array) {
	        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	    });
	    addParseToken('YY', function (input, array) {
	        array[YEAR] = hooks.parseTwoDigitYear(input);
	    });
	    addParseToken('Y', function (input, array) {
	        array[YEAR] = parseInt(input, 10);
	    });

	    // HELPERS

	    function daysInYear(year) {
	        return isLeapYear(year) ? 366 : 365;
	    }

	    function isLeapYear(year) {
	        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	    }

	    // HOOKS

	    hooks.parseTwoDigitYear = function (input) {
	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	    };

	    // MOMENTS

	    var getSetYear = makeGetSet('FullYear', true);

	    function getIsLeapYear () {
	        return isLeapYear(this.year());
	    }

	    function makeGetSet (unit, keepTime) {
	        return function (value) {
	            if (value != null) {
	                set$1(this, unit, value);
	                hooks.updateOffset(this, keepTime);
	                return this;
	            } else {
	                return get(this, unit);
	            }
	        };
	    }

	    function get (mom, unit) {
	        return mom.isValid() ?
	            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
	    }

	    function set$1 (mom, unit, value) {
	        if (mom.isValid() && !isNaN(value)) {
	            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
	            }
	            else {
	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	            }
	        }
	    }

	    // MOMENTS

	    function stringGet (units) {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units]();
	        }
	        return this;
	    }


	    function stringSet (units, value) {
	        if (typeof units === 'object') {
	            units = normalizeObjectUnits(units);
	            var prioritized = getPrioritizedUnits(units);
	            for (var i = 0; i < prioritized.length; i++) {
	                this[prioritized[i].unit](units[prioritized[i].unit]);
	            }
	        } else {
	            units = normalizeUnits(units);
	            if (isFunction(this[units])) {
	                return this[units](value);
	            }
	        }
	        return this;
	    }

	    function mod(n, x) {
	        return ((n % x) + x) % x;
	    }

	    var indexOf;

	    if (Array.prototype.indexOf) {
	        indexOf = Array.prototype.indexOf;
	    } else {
	        indexOf = function (o) {
	            // I know
	            var i;
	            for (i = 0; i < this.length; ++i) {
	                if (this[i] === o) {
	                    return i;
	                }
	            }
	            return -1;
	        };
	    }

	    function daysInMonth(year, month) {
	        if (isNaN(year) || isNaN(month)) {
	            return NaN;
	        }
	        var modMonth = mod(month, 12);
	        year += (month - modMonth) / 12;
	        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
	    }

	    // FORMATTING

	    addFormatToken('M', ['MM', 2], 'Mo', function () {
	        return this.month() + 1;
	    });

	    addFormatToken('MMM', 0, 0, function (format) {
	        return this.localeData().monthsShort(this, format);
	    });

	    addFormatToken('MMMM', 0, 0, function (format) {
	        return this.localeData().months(this, format);
	    });

	    // ALIASES

	    addUnitAlias('month', 'M');

	    // PRIORITY

	    addUnitPriority('month', 8);

	    // PARSING

	    addRegexToken('M',    match1to2);
	    addRegexToken('MM',   match1to2, match2);
	    addRegexToken('MMM',  function (isStrict, locale) {
	        return locale.monthsShortRegex(isStrict);
	    });
	    addRegexToken('MMMM', function (isStrict, locale) {
	        return locale.monthsRegex(isStrict);
	    });

	    addParseToken(['M', 'MM'], function (input, array) {
	        array[MONTH] = toInt(input) - 1;
	    });

	    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	        var month = config._locale.monthsParse(input, token, config._strict);
	        // if we didn't find a month name, mark the date as invalid.
	        if (month != null) {
	            array[MONTH] = month;
	        } else {
	            getParsingFlags(config).invalidMonth = input;
	        }
	    });

	    // LOCALES

	    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
	    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	    function localeMonths (m, format) {
	        if (!m) {
	            return isArray(this._months) ? this._months :
	                this._months['standalone'];
	        }
	        return isArray(this._months) ? this._months[m.month()] :
	            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
	    }

	    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	    function localeMonthsShort (m, format) {
	        if (!m) {
	            return isArray(this._monthsShort) ? this._monthsShort :
	                this._monthsShort['standalone'];
	        }
	        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
	            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
	    }

	    function handleStrictParse(monthName, format, strict) {
	        var i, ii, mom, llc = monthName.toLocaleLowerCase();
	        if (!this._monthsParse) {
	            // this is not used
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	            for (i = 0; i < 12; ++i) {
	                mom = createUTC([2000, i]);
	                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
	                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeMonthsParse (monthName, format, strict) {
	        var i, mom, regex;

	        if (this._monthsParseExact) {
	            return handleStrictParse.call(this, monthName, format, strict);
	        }

	        if (!this._monthsParse) {
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	        }

	        // TODO: add sorting
	        // Sorting makes sure if one month (or abbr) is a prefix of another
	        // see sorting in computeMonthsParse
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, i]);
	            if (strict && !this._longMonthsParse[i]) {
	                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	            }
	            if (!strict && !this._monthsParse[i]) {
	                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	                return i;
	            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	                return i;
	            } else if (!strict && this._monthsParse[i].test(monthName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function setMonth (mom, value) {
	        var dayOfMonth;

	        if (!mom.isValid()) {
	            // No op
	            return mom;
	        }

	        if (typeof value === 'string') {
	            if (/^\d+$/.test(value)) {
	                value = toInt(value);
	            } else {
	                value = mom.localeData().monthsParse(value);
	                // TODO: Another silent failure?
	                if (!isNumber(value)) {
	                    return mom;
	                }
	            }
	        }

	        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	        return mom;
	    }

	    function getSetMonth (value) {
	        if (value != null) {
	            setMonth(this, value);
	            hooks.updateOffset(this, true);
	            return this;
	        } else {
	            return get(this, 'Month');
	        }
	    }

	    function getDaysInMonth () {
	        return daysInMonth(this.year(), this.month());
	    }

	    var defaultMonthsShortRegex = matchWord;
	    function monthsShortRegex (isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsShortStrictRegex;
	            } else {
	                return this._monthsShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsShortRegex')) {
	                this._monthsShortRegex = defaultMonthsShortRegex;
	            }
	            return this._monthsShortStrictRegex && isStrict ?
	                this._monthsShortStrictRegex : this._monthsShortRegex;
	        }
	    }

	    var defaultMonthsRegex = matchWord;
	    function monthsRegex (isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsStrictRegex;
	            } else {
	                return this._monthsRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                this._monthsRegex = defaultMonthsRegex;
	            }
	            return this._monthsStrictRegex && isStrict ?
	                this._monthsStrictRegex : this._monthsRegex;
	        }
	    }

	    function computeMonthsParse () {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var shortPieces = [], longPieces = [], mixedPieces = [],
	            i, mom;
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, i]);
	            shortPieces.push(this.monthsShort(mom, ''));
	            longPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.monthsShort(mom, ''));
	        }
	        // Sorting makes sure if one month (or abbr) is a prefix of another it
	        // will match the longer piece.
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);
	        for (i = 0; i < 12; i++) {
	            shortPieces[i] = regexEscape(shortPieces[i]);
	            longPieces[i] = regexEscape(longPieces[i]);
	        }
	        for (i = 0; i < 24; i++) {
	            mixedPieces[i] = regexEscape(mixedPieces[i]);
	        }

	        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._monthsShortRegex = this._monthsRegex;
	        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	    }

	    function createDate (y, m, d, h, M, s, ms) {
	        // can't just apply() to create a date:
	        // https://stackoverflow.com/q/181348
	        var date = new Date(y, m, d, h, M, s, ms);

	        // the date constructor remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
	            date.setFullYear(y);
	        }
	        return date;
	    }

	    function createUTCDate (y) {
	        var date = new Date(Date.UTC.apply(null, arguments));

	        // the Date.UTC function remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
	            date.setUTCFullYear(y);
	        }
	        return date;
	    }

	    // start-of-first-week - start-of-year
	    function firstWeekOffset(year, dow, doy) {
	        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	            fwd = 7 + dow - doy,
	            // first-week day local weekday -- which local weekday is fwd
	            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	        return -fwdlw + fwd - 1;
	    }

	    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	        var localWeekday = (7 + weekday - dow) % 7,
	            weekOffset = firstWeekOffset(year, dow, doy),
	            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	            resYear, resDayOfYear;

	        if (dayOfYear <= 0) {
	            resYear = year - 1;
	            resDayOfYear = daysInYear(resYear) + dayOfYear;
	        } else if (dayOfYear > daysInYear(year)) {
	            resYear = year + 1;
	            resDayOfYear = dayOfYear - daysInYear(year);
	        } else {
	            resYear = year;
	            resDayOfYear = dayOfYear;
	        }

	        return {
	            year: resYear,
	            dayOfYear: resDayOfYear
	        };
	    }

	    function weekOfYear(mom, dow, doy) {
	        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	            resWeek, resYear;

	        if (week < 1) {
	            resYear = mom.year() - 1;
	            resWeek = week + weeksInYear(resYear, dow, doy);
	        } else if (week > weeksInYear(mom.year(), dow, doy)) {
	            resWeek = week - weeksInYear(mom.year(), dow, doy);
	            resYear = mom.year() + 1;
	        } else {
	            resYear = mom.year();
	            resWeek = week;
	        }

	        return {
	            week: resWeek,
	            year: resYear
	        };
	    }

	    function weeksInYear(year, dow, doy) {
	        var weekOffset = firstWeekOffset(year, dow, doy),
	            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	    }

	    // FORMATTING

	    addFormatToken('w', ['ww', 2], 'wo', 'week');
	    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	    // ALIASES

	    addUnitAlias('week', 'w');
	    addUnitAlias('isoWeek', 'W');

	    // PRIORITIES

	    addUnitPriority('week', 5);
	    addUnitPriority('isoWeek', 5);

	    // PARSING

	    addRegexToken('w',  match1to2);
	    addRegexToken('ww', match1to2, match2);
	    addRegexToken('W',  match1to2);
	    addRegexToken('WW', match1to2, match2);

	    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	        week[token.substr(0, 1)] = toInt(input);
	    });

	    // HELPERS

	    // LOCALES

	    function localeWeek (mom) {
	        return weekOfYear(mom, this._week.dow, this._week.doy).week;
	    }

	    var defaultLocaleWeek = {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    };

	    function localeFirstDayOfWeek () {
	        return this._week.dow;
	    }

	    function localeFirstDayOfYear () {
	        return this._week.doy;
	    }

	    // MOMENTS

	    function getSetWeek (input) {
	        var week = this.localeData().week(this);
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    function getSetISOWeek (input) {
	        var week = weekOfYear(this, 1, 4).week;
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    // FORMATTING

	    addFormatToken('d', 0, 'do', 'day');

	    addFormatToken('dd', 0, 0, function (format) {
	        return this.localeData().weekdaysMin(this, format);
	    });

	    addFormatToken('ddd', 0, 0, function (format) {
	        return this.localeData().weekdaysShort(this, format);
	    });

	    addFormatToken('dddd', 0, 0, function (format) {
	        return this.localeData().weekdays(this, format);
	    });

	    addFormatToken('e', 0, 0, 'weekday');
	    addFormatToken('E', 0, 0, 'isoWeekday');

	    // ALIASES

	    addUnitAlias('day', 'd');
	    addUnitAlias('weekday', 'e');
	    addUnitAlias('isoWeekday', 'E');

	    // PRIORITY
	    addUnitPriority('day', 11);
	    addUnitPriority('weekday', 11);
	    addUnitPriority('isoWeekday', 11);

	    // PARSING

	    addRegexToken('d',    match1to2);
	    addRegexToken('e',    match1to2);
	    addRegexToken('E',    match1to2);
	    addRegexToken('dd',   function (isStrict, locale) {
	        return locale.weekdaysMinRegex(isStrict);
	    });
	    addRegexToken('ddd',   function (isStrict, locale) {
	        return locale.weekdaysShortRegex(isStrict);
	    });
	    addRegexToken('dddd',   function (isStrict, locale) {
	        return locale.weekdaysRegex(isStrict);
	    });

	    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	        var weekday = config._locale.weekdaysParse(input, token, config._strict);
	        // if we didn't get a weekday name, mark the date as invalid
	        if (weekday != null) {
	            week.d = weekday;
	        } else {
	            getParsingFlags(config).invalidWeekday = input;
	        }
	    });

	    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	        week[token] = toInt(input);
	    });

	    // HELPERS

	    function parseWeekday(input, locale) {
	        if (typeof input !== 'string') {
	            return input;
	        }

	        if (!isNaN(input)) {
	            return parseInt(input, 10);
	        }

	        input = locale.weekdaysParse(input);
	        if (typeof input === 'number') {
	            return input;
	        }

	        return null;
	    }

	    function parseIsoWeekday(input, locale) {
	        if (typeof input === 'string') {
	            return locale.weekdaysParse(input) % 7 || 7;
	        }
	        return isNaN(input) ? null : input;
	    }

	    // LOCALES

	    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	    function localeWeekdays (m, format) {
	        if (!m) {
	            return isArray(this._weekdays) ? this._weekdays :
	                this._weekdays['standalone'];
	        }
	        return isArray(this._weekdays) ? this._weekdays[m.day()] :
	            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
	    }

	    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	    function localeWeekdaysShort (m) {
	        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
	    }

	    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	    function localeWeekdaysMin (m) {
	        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
	    }

	    function handleStrictParse$1(weekdayName, format, strict) {
	        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._minWeekdaysParse = [];

	            for (i = 0; i < 7; ++i) {
	                mom = createUTC([2000, 1]).day(i);
	                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
	                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
	                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeWeekdaysParse (weekdayName, format, strict) {
	        var i, mom, regex;

	        if (this._weekdaysParseExact) {
	            return handleStrictParse$1.call(this, weekdayName, format, strict);
	        }

	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._minWeekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._fullWeekdaysParse = [];
	        }

	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already

	            mom = createUTC([2000, 1]).day(i);
	            if (strict && !this._fullWeekdaysParse[i]) {
	                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
	                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
	                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
	            }
	            if (!this._weekdaysParse[i]) {
	                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
	                return i;
	            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
	                return i;
	            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
	                return i;
	            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function getSetDayOfWeek (input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	        if (input != null) {
	            input = parseWeekday(input, this.localeData());
	            return this.add(input - day, 'd');
	        } else {
	            return day;
	        }
	    }

	    function getSetLocaleDayOfWeek (input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	        return input == null ? weekday : this.add(input - weekday, 'd');
	    }

	    function getSetISODayOfWeek (input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }

	        // behaves the same as moment#day except
	        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	        // as a setter, sunday should belong to the previous week.

	        if (input != null) {
	            var weekday = parseIsoWeekday(input, this.localeData());
	            return this.day(this.day() % 7 ? weekday : weekday - 7);
	        } else {
	            return this.day() || 7;
	        }
	    }

	    var defaultWeekdaysRegex = matchWord;
	    function weekdaysRegex (isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysStrictRegex;
	            } else {
	                return this._weekdaysRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                this._weekdaysRegex = defaultWeekdaysRegex;
	            }
	            return this._weekdaysStrictRegex && isStrict ?
	                this._weekdaysStrictRegex : this._weekdaysRegex;
	        }
	    }

	    var defaultWeekdaysShortRegex = matchWord;
	    function weekdaysShortRegex (isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysShortStrictRegex;
	            } else {
	                return this._weekdaysShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	            }
	            return this._weekdaysShortStrictRegex && isStrict ?
	                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
	        }
	    }

	    var defaultWeekdaysMinRegex = matchWord;
	    function weekdaysMinRegex (isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysMinStrictRegex;
	            } else {
	                return this._weekdaysMinRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	            }
	            return this._weekdaysMinStrictRegex && isStrict ?
	                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
	        }
	    }


	    function computeWeekdaysParse () {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
	            i, mom, minp, shortp, longp;
	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, 1]).day(i);
	            minp = this.weekdaysMin(mom, '');
	            shortp = this.weekdaysShort(mom, '');
	            longp = this.weekdays(mom, '');
	            minPieces.push(minp);
	            shortPieces.push(shortp);
	            longPieces.push(longp);
	            mixedPieces.push(minp);
	            mixedPieces.push(shortp);
	            mixedPieces.push(longp);
	        }
	        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	        // will match the longer piece.
	        minPieces.sort(cmpLenRev);
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);
	        for (i = 0; i < 7; i++) {
	            shortPieces[i] = regexEscape(shortPieces[i]);
	            longPieces[i] = regexEscape(longPieces[i]);
	            mixedPieces[i] = regexEscape(mixedPieces[i]);
	        }

	        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._weekdaysShortRegex = this._weekdaysRegex;
	        this._weekdaysMinRegex = this._weekdaysRegex;

	        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
	    }

	    // FORMATTING

	    function hFormat() {
	        return this.hours() % 12 || 12;
	    }

	    function kFormat() {
	        return this.hours() || 24;
	    }

	    addFormatToken('H', ['HH', 2], 0, 'hour');
	    addFormatToken('h', ['hh', 2], 0, hFormat);
	    addFormatToken('k', ['kk', 2], 0, kFormat);

	    addFormatToken('hmm', 0, 0, function () {
	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('hmmss', 0, 0, function () {
	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2);
	    });

	    addFormatToken('Hmm', 0, 0, function () {
	        return '' + this.hours() + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('Hmmss', 0, 0, function () {
	        return '' + this.hours() + zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2);
	    });

	    function meridiem (token, lowercase) {
	        addFormatToken(token, 0, 0, function () {
	            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	        });
	    }

	    meridiem('a', true);
	    meridiem('A', false);

	    // ALIASES

	    addUnitAlias('hour', 'h');

	    // PRIORITY
	    addUnitPriority('hour', 13);

	    // PARSING

	    function matchMeridiem (isStrict, locale) {
	        return locale._meridiemParse;
	    }

	    addRegexToken('a',  matchMeridiem);
	    addRegexToken('A',  matchMeridiem);
	    addRegexToken('H',  match1to2);
	    addRegexToken('h',  match1to2);
	    addRegexToken('k',  match1to2);
	    addRegexToken('HH', match1to2, match2);
	    addRegexToken('hh', match1to2, match2);
	    addRegexToken('kk', match1to2, match2);

	    addRegexToken('hmm', match3to4);
	    addRegexToken('hmmss', match5to6);
	    addRegexToken('Hmm', match3to4);
	    addRegexToken('Hmmss', match5to6);

	    addParseToken(['H', 'HH'], HOUR);
	    addParseToken(['k', 'kk'], function (input, array, config) {
	        var kInput = toInt(input);
	        array[HOUR] = kInput === 24 ? 0 : kInput;
	    });
	    addParseToken(['a', 'A'], function (input, array, config) {
	        config._isPm = config._locale.isPM(input);
	        config._meridiem = input;
	    });
	    addParseToken(['h', 'hh'], function (input, array, config) {
	        array[HOUR] = toInt(input);
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmmss', function (input, array, config) {
	        var pos1 = input.length - 4;
	        var pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('Hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	    });
	    addParseToken('Hmmss', function (input, array, config) {
	        var pos1 = input.length - 4;
	        var pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	    });

	    // LOCALES

	    function localeIsPM (input) {
	        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	        // Using charAt should be more compatible.
	        return ((input + '').toLowerCase().charAt(0) === 'p');
	    }

	    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	    function localeMeridiem (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'pm' : 'PM';
	        } else {
	            return isLower ? 'am' : 'AM';
	        }
	    }


	    // MOMENTS

	    // Setting the hour should keep the time, because the user explicitly
	    // specified which hour they want. So trying to maintain the same hour (in
	    // a new timezone) makes sense. Adding/subtracting hours does not follow
	    // this rule.
	    var getSetHour = makeGetSet('Hours', true);

	    var baseConfig = {
	        calendar: defaultCalendar,
	        longDateFormat: defaultLongDateFormat,
	        invalidDate: defaultInvalidDate,
	        ordinal: defaultOrdinal,
	        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
	        relativeTime: defaultRelativeTime,

	        months: defaultLocaleMonths,
	        monthsShort: defaultLocaleMonthsShort,

	        week: defaultLocaleWeek,

	        weekdays: defaultLocaleWeekdays,
	        weekdaysMin: defaultLocaleWeekdaysMin,
	        weekdaysShort: defaultLocaleWeekdaysShort,

	        meridiemParse: defaultLocaleMeridiemParse
	    };

	    // internal storage for locale config files
	    var locales = {};
	    var localeFamilies = {};
	    var globalLocale;

	    function normalizeLocale(key) {
	        return key ? key.toLowerCase().replace('_', '-') : key;
	    }

	    // pick the locale from the array
	    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	    function chooseLocale(names) {
	        var i = 0, j, next, locale, split;

	        while (i < names.length) {
	            split = normalizeLocale(names[i]).split('-');
	            j = split.length;
	            next = normalizeLocale(names[i + 1]);
	            next = next ? next.split('-') : null;
	            while (j > 0) {
	                locale = loadLocale(split.slice(0, j).join('-'));
	                if (locale) {
	                    return locale;
	                }
	                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                    //the next array item is better than a shallower substring of this one
	                    break;
	                }
	                j--;
	            }
	            i++;
	        }
	        return globalLocale;
	    }

	    function loadLocale(name) {
	        var oldLocale = null;
	        // TODO: Find a better way to register and load all the locales in Node
	        if (!locales[name] && ('object' !== 'undefined') &&
	                module && module.exports) {
	            try {
	                oldLocale = globalLocale._abbr;
	                var aliasedRequire = commonjsRequire;
	                aliasedRequire('./locale/' + name);
	                getSetGlobalLocale(oldLocale);
	            } catch (e) {}
	        }
	        return locales[name];
	    }

	    // This function will load locale and then set the global locale.  If
	    // no arguments are passed in, it will simply return the current global
	    // locale key.
	    function getSetGlobalLocale (key, values) {
	        var data;
	        if (key) {
	            if (isUndefined(values)) {
	                data = getLocale(key);
	            }
	            else {
	                data = defineLocale(key, values);
	            }

	            if (data) {
	                // moment.duration._locale = moment._locale = data;
	                globalLocale = data;
	            }
	            else {
	                if ((typeof console !==  'undefined') && console.warn) {
	                    //warn user if arguments are passed but the locale could not be set
	                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
	                }
	            }
	        }

	        return globalLocale._abbr;
	    }

	    function defineLocale (name, config) {
	        if (config !== null) {
	            var locale, parentConfig = baseConfig;
	            config.abbr = name;
	            if (locales[name] != null) {
	                deprecateSimple('defineLocaleOverride',
	                        'use moment.updateLocale(localeName, config) to change ' +
	                        'an existing locale. moment.defineLocale(localeName, ' +
	                        'config) should only be used for creating a new locale ' +
	                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
	                parentConfig = locales[name]._config;
	            } else if (config.parentLocale != null) {
	                if (locales[config.parentLocale] != null) {
	                    parentConfig = locales[config.parentLocale]._config;
	                } else {
	                    locale = loadLocale(config.parentLocale);
	                    if (locale != null) {
	                        parentConfig = locale._config;
	                    } else {
	                        if (!localeFamilies[config.parentLocale]) {
	                            localeFamilies[config.parentLocale] = [];
	                        }
	                        localeFamilies[config.parentLocale].push({
	                            name: name,
	                            config: config
	                        });
	                        return null;
	                    }
	                }
	            }
	            locales[name] = new Locale(mergeConfigs(parentConfig, config));

	            if (localeFamilies[name]) {
	                localeFamilies[name].forEach(function (x) {
	                    defineLocale(x.name, x.config);
	                });
	            }

	            // backwards compat for now: also set the locale
	            // make sure we set the locale AFTER all child locales have been
	            // created, so we won't end up with the child locale set.
	            getSetGlobalLocale(name);


	            return locales[name];
	        } else {
	            // useful for testing
	            delete locales[name];
	            return null;
	        }
	    }

	    function updateLocale(name, config) {
	        if (config != null) {
	            var locale, tmpLocale, parentConfig = baseConfig;
	            // MERGE
	            tmpLocale = loadLocale(name);
	            if (tmpLocale != null) {
	                parentConfig = tmpLocale._config;
	            }
	            config = mergeConfigs(parentConfig, config);
	            locale = new Locale(config);
	            locale.parentLocale = locales[name];
	            locales[name] = locale;

	            // backwards compat for now: also set the locale
	            getSetGlobalLocale(name);
	        } else {
	            // pass null for config to unupdate, useful for tests
	            if (locales[name] != null) {
	                if (locales[name].parentLocale != null) {
	                    locales[name] = locales[name].parentLocale;
	                } else if (locales[name] != null) {
	                    delete locales[name];
	                }
	            }
	        }
	        return locales[name];
	    }

	    // returns locale data
	    function getLocale (key) {
	        var locale;

	        if (key && key._locale && key._locale._abbr) {
	            key = key._locale._abbr;
	        }

	        if (!key) {
	            return globalLocale;
	        }

	        if (!isArray(key)) {
	            //short-circuit everything else
	            locale = loadLocale(key);
	            if (locale) {
	                return locale;
	            }
	            key = [key];
	        }

	        return chooseLocale(key);
	    }

	    function listLocales() {
	        return keys(locales);
	    }

	    function checkOverflow (m) {
	        var overflow;
	        var a = m._a;

	        if (a && getParsingFlags(m).overflow === -2) {
	            overflow =
	                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
	                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
	                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
	                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
	                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
	                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
	                -1;

	            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	                overflow = DATE;
	            }
	            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	                overflow = WEEK;
	            }
	            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	                overflow = WEEKDAY;
	            }

	            getParsingFlags(m).overflow = overflow;
	        }

	        return m;
	    }

	    // Pick the first defined of two or three arguments.
	    function defaults(a, b, c) {
	        if (a != null) {
	            return a;
	        }
	        if (b != null) {
	            return b;
	        }
	        return c;
	    }

	    function currentDateArray(config) {
	        // hooks is actually the exported moment object
	        var nowValue = new Date(hooks.now());
	        if (config._useUTC) {
	            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
	        }
	        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	    }

	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function configFromArray (config) {
	        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

	        if (config._d) {
	            return;
	        }

	        currentDate = currentDateArray(config);

	        //compute day of the year from weeks and weekdays
	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	            dayOfYearFromWeekInfo(config);
	        }

	        //if the day of the year is set, figure out what it is
	        if (config._dayOfYear != null) {
	            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
	                getParsingFlags(config)._overflowDayOfYear = true;
	            }

	            date = createUTCDate(yearToUse, 0, config._dayOfYear);
	            config._a[MONTH] = date.getUTCMonth();
	            config._a[DATE] = date.getUTCDate();
	        }

	        // Default to current date.
	        // * if no year, month, day of month are given, default to today
	        // * if day of month is given, default month and year
	        // * if month is given, default only year
	        // * if year is given, don't default anything
	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
	            config._a[i] = input[i] = currentDate[i];
	        }

	        // Zero out whatever was not defaulted, including time
	        for (; i < 7; i++) {
	            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	        }

	        // Check for 24:00:00.000
	        if (config._a[HOUR] === 24 &&
	                config._a[MINUTE] === 0 &&
	                config._a[SECOND] === 0 &&
	                config._a[MILLISECOND] === 0) {
	            config._nextDay = true;
	            config._a[HOUR] = 0;
	        }

	        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

	        // Apply timezone offset from input. The actual utcOffset can be changed
	        // with parseZone.
	        if (config._tzm != null) {
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	        }

	        if (config._nextDay) {
	            config._a[HOUR] = 24;
	        }

	        // check for mismatching day of week
	        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
	            getParsingFlags(config).weekdayMismatch = true;
	        }
	    }

	    function dayOfYearFromWeekInfo(config) {
	        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

	        w = config._w;
	        if (w.GG != null || w.W != null || w.E != null) {
	            dow = 1;
	            doy = 4;

	            // TODO: We need to take the current isoWeekYear, but that depends on
	            // how we interpret now (local, utc, fixed offset). So create
	            // a now version of current config (take local/utc/offset flags, and
	            // create now).
	            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
	            week = defaults(w.W, 1);
	            weekday = defaults(w.E, 1);
	            if (weekday < 1 || weekday > 7) {
	                weekdayOverflow = true;
	            }
	        } else {
	            dow = config._locale._week.dow;
	            doy = config._locale._week.doy;

	            var curWeek = weekOfYear(createLocal(), dow, doy);

	            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

	            // Default to current week.
	            week = defaults(w.w, curWeek.week);

	            if (w.d != null) {
	                // weekday -- low day numbers are considered next week
	                weekday = w.d;
	                if (weekday < 0 || weekday > 6) {
	                    weekdayOverflow = true;
	                }
	            } else if (w.e != null) {
	                // local weekday -- counting starts from begining of week
	                weekday = w.e + dow;
	                if (w.e < 0 || w.e > 6) {
	                    weekdayOverflow = true;
	                }
	            } else {
	                // default to begining of week
	                weekday = dow;
	            }
	        }
	        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	            getParsingFlags(config)._overflowWeeks = true;
	        } else if (weekdayOverflow != null) {
	            getParsingFlags(config)._overflowWeekday = true;
	        } else {
	            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	            config._a[YEAR] = temp.year;
	            config._dayOfYear = temp.dayOfYear;
	        }
	    }

	    // iso 8601 regex
	    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
	    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

	    var isoDates = [
	        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	        ['YYYY-DDD', /\d{4}-\d{3}/],
	        ['YYYY-MM', /\d{4}-\d\d/, false],
	        ['YYYYYYMMDD', /[+-]\d{10}/],
	        ['YYYYMMDD', /\d{8}/],
	        // YYYYMM is NOT allowed by the standard
	        ['GGGG[W]WWE', /\d{4}W\d{3}/],
	        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	        ['YYYYDDD', /\d{7}/]
	    ];

	    // iso time formats and regexes
	    var isoTimes = [
	        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	        ['HH:mm', /\d\d:\d\d/],
	        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	        ['HHmmss', /\d\d\d\d\d\d/],
	        ['HHmm', /\d\d\d\d/],
	        ['HH', /\d\d/]
	    ];

	    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	    // date from iso format
	    function configFromISO(config) {
	        var i, l,
	            string = config._i,
	            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	            allowTime, dateFormat, timeFormat, tzFormat;

	        if (match) {
	            getParsingFlags(config).iso = true;

	            for (i = 0, l = isoDates.length; i < l; i++) {
	                if (isoDates[i][1].exec(match[1])) {
	                    dateFormat = isoDates[i][0];
	                    allowTime = isoDates[i][2] !== false;
	                    break;
	                }
	            }
	            if (dateFormat == null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[3]) {
	                for (i = 0, l = isoTimes.length; i < l; i++) {
	                    if (isoTimes[i][1].exec(match[3])) {
	                        // match[2] should be 'T' or space
	                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                        break;
	                    }
	                }
	                if (timeFormat == null) {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            if (!allowTime && timeFormat != null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[4]) {
	                if (tzRegex.exec(match[4])) {
	                    tzFormat = 'Z';
	                } else {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	            configFromStringAndFormat(config);
	        } else {
	            config._isValid = false;
	        }
	    }

	    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
	    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

	    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
	        var result = [
	            untruncateYear(yearStr),
	            defaultLocaleMonthsShort.indexOf(monthStr),
	            parseInt(dayStr, 10),
	            parseInt(hourStr, 10),
	            parseInt(minuteStr, 10)
	        ];

	        if (secondStr) {
	            result.push(parseInt(secondStr, 10));
	        }

	        return result;
	    }

	    function untruncateYear(yearStr) {
	        var year = parseInt(yearStr, 10);
	        if (year <= 49) {
	            return 2000 + year;
	        } else if (year <= 999) {
	            return 1900 + year;
	        }
	        return year;
	    }

	    function preprocessRFC2822(s) {
	        // Remove comments and folding whitespace and replace multiple-spaces with a single space
	        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	    }

	    function checkWeekday(weekdayStr, parsedInput, config) {
	        if (weekdayStr) {
	            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
	            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
	                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
	            if (weekdayProvided !== weekdayActual) {
	                getParsingFlags(config).weekdayMismatch = true;
	                config._isValid = false;
	                return false;
	            }
	        }
	        return true;
	    }

	    var obsOffsets = {
	        UT: 0,
	        GMT: 0,
	        EDT: -4 * 60,
	        EST: -5 * 60,
	        CDT: -5 * 60,
	        CST: -6 * 60,
	        MDT: -6 * 60,
	        MST: -7 * 60,
	        PDT: -7 * 60,
	        PST: -8 * 60
	    };

	    function calculateOffset(obsOffset, militaryOffset, numOffset) {
	        if (obsOffset) {
	            return obsOffsets[obsOffset];
	        } else if (militaryOffset) {
	            // the only allowed military tz is Z
	            return 0;
	        } else {
	            var hm = parseInt(numOffset, 10);
	            var m = hm % 100, h = (hm - m) / 100;
	            return h * 60 + m;
	        }
	    }

	    // date and time from ref 2822 format
	    function configFromRFC2822(config) {
	        var match = rfc2822.exec(preprocessRFC2822(config._i));
	        if (match) {
	            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
	            if (!checkWeekday(match[1], parsedArray, config)) {
	                return;
	            }

	            config._a = parsedArray;
	            config._tzm = calculateOffset(match[8], match[9], match[10]);

	            config._d = createUTCDate.apply(null, config._a);
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

	            getParsingFlags(config).rfc2822 = true;
	        } else {
	            config._isValid = false;
	        }
	    }

	    // date from iso format or fallback
	    function configFromString(config) {
	        var matched = aspNetJsonRegex.exec(config._i);

	        if (matched !== null) {
	            config._d = new Date(+matched[1]);
	            return;
	        }

	        configFromISO(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	        } else {
	            return;
	        }

	        configFromRFC2822(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	        } else {
	            return;
	        }

	        // Final attempt, use Input Fallback
	        hooks.createFromInputFallback(config);
	    }

	    hooks.createFromInputFallback = deprecate(
	        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
	        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
	        'discouraged and will be removed in an upcoming major release. Please refer to ' +
	        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	        function (config) {
	            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	        }
	    );

	    // constant that refers to the ISO standard
	    hooks.ISO_8601 = function () {};

	    // constant that refers to the RFC 2822 form
	    hooks.RFC_2822 = function () {};

	    // date from string and format string
	    function configFromStringAndFormat(config) {
	        // TODO: Move this to another part of the creation flow to prevent circular deps
	        if (config._f === hooks.ISO_8601) {
	            configFromISO(config);
	            return;
	        }
	        if (config._f === hooks.RFC_2822) {
	            configFromRFC2822(config);
	            return;
	        }
	        config._a = [];
	        getParsingFlags(config).empty = true;

	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var string = '' + config._i,
	            i, parsedInput, tokens, token, skipped,
	            stringLength = string.length,
	            totalParsedInputLength = 0;

	        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

	        for (i = 0; i < tokens.length; i++) {
	            token = tokens[i];
	            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	            // console.log('token', token, 'parsedInput', parsedInput,
	            //         'regex', getParseRegexForToken(token, config));
	            if (parsedInput) {
	                skipped = string.substr(0, string.indexOf(parsedInput));
	                if (skipped.length > 0) {
	                    getParsingFlags(config).unusedInput.push(skipped);
	                }
	                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	                totalParsedInputLength += parsedInput.length;
	            }
	            // don't parse if it's not a known token
	            if (formatTokenFunctions[token]) {
	                if (parsedInput) {
	                    getParsingFlags(config).empty = false;
	                }
	                else {
	                    getParsingFlags(config).unusedTokens.push(token);
	                }
	                addTimeToArrayFromToken(token, parsedInput, config);
	            }
	            else if (config._strict && !parsedInput) {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	        }

	        // add remaining unparsed input length to the string
	        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	        if (string.length > 0) {
	            getParsingFlags(config).unusedInput.push(string);
	        }

	        // clear _12h flag if hour is <= 12
	        if (config._a[HOUR] <= 12 &&
	            getParsingFlags(config).bigHour === true &&
	            config._a[HOUR] > 0) {
	            getParsingFlags(config).bigHour = undefined;
	        }

	        getParsingFlags(config).parsedDateParts = config._a.slice(0);
	        getParsingFlags(config).meridiem = config._meridiem;
	        // handle meridiem
	        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

	        configFromArray(config);
	        checkOverflow(config);
	    }


	    function meridiemFixWrap (locale, hour, meridiem) {
	        var isPm;

	        if (meridiem == null) {
	            // nothing to do
	            return hour;
	        }
	        if (locale.meridiemHour != null) {
	            return locale.meridiemHour(hour, meridiem);
	        } else if (locale.isPM != null) {
	            // Fallback
	            isPm = locale.isPM(meridiem);
	            if (isPm && hour < 12) {
	                hour += 12;
	            }
	            if (!isPm && hour === 12) {
	                hour = 0;
	            }
	            return hour;
	        } else {
	            // this is not supposed to happen
	            return hour;
	        }
	    }

	    // date from string and array of format strings
	    function configFromStringAndArray(config) {
	        var tempConfig,
	            bestMoment,

	            scoreToBeat,
	            i,
	            currentScore;

	        if (config._f.length === 0) {
	            getParsingFlags(config).invalidFormat = true;
	            config._d = new Date(NaN);
	            return;
	        }

	        for (i = 0; i < config._f.length; i++) {
	            currentScore = 0;
	            tempConfig = copyConfig({}, config);
	            if (config._useUTC != null) {
	                tempConfig._useUTC = config._useUTC;
	            }
	            tempConfig._f = config._f[i];
	            configFromStringAndFormat(tempConfig);

	            if (!isValid(tempConfig)) {
	                continue;
	            }

	            // if there is any input that was not parsed add a penalty for that format
	            currentScore += getParsingFlags(tempConfig).charsLeftOver;

	            //or tokens
	            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	            getParsingFlags(tempConfig).score = currentScore;

	            if (scoreToBeat == null || currentScore < scoreToBeat) {
	                scoreToBeat = currentScore;
	                bestMoment = tempConfig;
	            }
	        }

	        extend(config, bestMoment || tempConfig);
	    }

	    function configFromObject(config) {
	        if (config._d) {
	            return;
	        }

	        var i = normalizeObjectUnits(config._i);
	        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
	            return obj && parseInt(obj, 10);
	        });

	        configFromArray(config);
	    }

	    function createFromConfig (config) {
	        var res = new Moment(checkOverflow(prepareConfig(config)));
	        if (res._nextDay) {
	            // Adding is smart enough around DST
	            res.add(1, 'd');
	            res._nextDay = undefined;
	        }

	        return res;
	    }

	    function prepareConfig (config) {
	        var input = config._i,
	            format = config._f;

	        config._locale = config._locale || getLocale(config._l);

	        if (input === null || (format === undefined && input === '')) {
	            return createInvalid({nullInput: true});
	        }

	        if (typeof input === 'string') {
	            config._i = input = config._locale.preparse(input);
	        }

	        if (isMoment(input)) {
	            return new Moment(checkOverflow(input));
	        } else if (isDate(input)) {
	            config._d = input;
	        } else if (isArray(format)) {
	            configFromStringAndArray(config);
	        } else if (format) {
	            configFromStringAndFormat(config);
	        }  else {
	            configFromInput(config);
	        }

	        if (!isValid(config)) {
	            config._d = null;
	        }

	        return config;
	    }

	    function configFromInput(config) {
	        var input = config._i;
	        if (isUndefined(input)) {
	            config._d = new Date(hooks.now());
	        } else if (isDate(input)) {
	            config._d = new Date(input.valueOf());
	        } else if (typeof input === 'string') {
	            configFromString(config);
	        } else if (isArray(input)) {
	            config._a = map(input.slice(0), function (obj) {
	                return parseInt(obj, 10);
	            });
	            configFromArray(config);
	        } else if (isObject(input)) {
	            configFromObject(config);
	        } else if (isNumber(input)) {
	            // from milliseconds
	            config._d = new Date(input);
	        } else {
	            hooks.createFromInputFallback(config);
	        }
	    }

	    function createLocalOrUTC (input, format, locale, strict, isUTC) {
	        var c = {};

	        if (locale === true || locale === false) {
	            strict = locale;
	            locale = undefined;
	        }

	        if ((isObject(input) && isObjectEmpty(input)) ||
	                (isArray(input) && input.length === 0)) {
	            input = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c._isAMomentObject = true;
	        c._useUTC = c._isUTC = isUTC;
	        c._l = locale;
	        c._i = input;
	        c._f = format;
	        c._strict = strict;

	        return createFromConfig(c);
	    }

	    function createLocal (input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, false);
	    }

	    var prototypeMin = deprecate(
	        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	        function () {
	            var other = createLocal.apply(null, arguments);
	            if (this.isValid() && other.isValid()) {
	                return other < this ? this : other;
	            } else {
	                return createInvalid();
	            }
	        }
	    );

	    var prototypeMax = deprecate(
	        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	        function () {
	            var other = createLocal.apply(null, arguments);
	            if (this.isValid() && other.isValid()) {
	                return other > this ? this : other;
	            } else {
	                return createInvalid();
	            }
	        }
	    );

	    // Pick a moment m from moments so that m[fn](other) is true for all
	    // other. This relies on the function fn to be transitive.
	    //
	    // moments should either be an array of moment objects or an array, whose
	    // first element is an array of moment objects.
	    function pickBy(fn, moments) {
	        var res, i;
	        if (moments.length === 1 && isArray(moments[0])) {
	            moments = moments[0];
	        }
	        if (!moments.length) {
	            return createLocal();
	        }
	        res = moments[0];
	        for (i = 1; i < moments.length; ++i) {
	            if (!moments[i].isValid() || moments[i][fn](res)) {
	                res = moments[i];
	            }
	        }
	        return res;
	    }

	    // TODO: Use [].sort instead?
	    function min () {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isBefore', args);
	    }

	    function max () {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isAfter', args);
	    }

	    var now = function () {
	        return Date.now ? Date.now() : +(new Date());
	    };

	    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

	    function isDurationValid(m) {
	        for (var key in m) {
	            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
	                return false;
	            }
	        }

	        var unitHasDecimal = false;
	        for (var i = 0; i < ordering.length; ++i) {
	            if (m[ordering[i]]) {
	                if (unitHasDecimal) {
	                    return false; // only allow non-integers for smallest unit
	                }
	                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
	                    unitHasDecimal = true;
	                }
	            }
	        }

	        return true;
	    }

	    function isValid$1() {
	        return this._isValid;
	    }

	    function createInvalid$1() {
	        return createDuration(NaN);
	    }

	    function Duration (duration) {
	        var normalizedInput = normalizeObjectUnits(duration),
	            years = normalizedInput.year || 0,
	            quarters = normalizedInput.quarter || 0,
	            months = normalizedInput.month || 0,
	            weeks = normalizedInput.week || 0,
	            days = normalizedInput.day || 0,
	            hours = normalizedInput.hour || 0,
	            minutes = normalizedInput.minute || 0,
	            seconds = normalizedInput.second || 0,
	            milliseconds = normalizedInput.millisecond || 0;

	        this._isValid = isDurationValid(normalizedInput);

	        // representation for dateAddRemove
	        this._milliseconds = +milliseconds +
	            seconds * 1e3 + // 1000
	            minutes * 6e4 + // 1000 * 60
	            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = +days +
	            weeks * 7;
	        // It is impossible to translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = +months +
	            quarters * 3 +
	            years * 12;

	        this._data = {};

	        this._locale = getLocale();

	        this._bubble();
	    }

	    function isDuration (obj) {
	        return obj instanceof Duration;
	    }

	    function absRound (number) {
	        if (number < 0) {
	            return Math.round(-1 * number) * -1;
	        } else {
	            return Math.round(number);
	        }
	    }

	    // FORMATTING

	    function offset (token, separator) {
	        addFormatToken(token, 0, 0, function () {
	            var offset = this.utcOffset();
	            var sign = '+';
	            if (offset < 0) {
	                offset = -offset;
	                sign = '-';
	            }
	            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
	        });
	    }

	    offset('Z', ':');
	    offset('ZZ', '');

	    // PARSING

	    addRegexToken('Z',  matchShortOffset);
	    addRegexToken('ZZ', matchShortOffset);
	    addParseToken(['Z', 'ZZ'], function (input, array, config) {
	        config._useUTC = true;
	        config._tzm = offsetFromString(matchShortOffset, input);
	    });

	    // HELPERS

	    // timezone chunker
	    // '+10:00' > ['10',  '00']
	    // '-1530'  > ['-15', '30']
	    var chunkOffset = /([\+\-]|\d\d)/gi;

	    function offsetFromString(matcher, string) {
	        var matches = (string || '').match(matcher);

	        if (matches === null) {
	            return null;
	        }

	        var chunk   = matches[matches.length - 1] || [];
	        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	        var minutes = +(parts[1] * 60) + toInt(parts[2]);

	        return minutes === 0 ?
	          0 :
	          parts[0] === '+' ? minutes : -minutes;
	    }

	    // Return a moment from input, that is local/utc/zone equivalent to model.
	    function cloneWithOffset(input, model) {
	        var res, diff;
	        if (model._isUTC) {
	            res = model.clone();
	            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
	            // Use low-level api, because this fn is low-level api.
	            res._d.setTime(res._d.valueOf() + diff);
	            hooks.updateOffset(res, false);
	            return res;
	        } else {
	            return createLocal(input).local();
	        }
	    }

	    function getDateOffset (m) {
	        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	        // https://github.com/moment/moment/pull/1871
	        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	    }

	    // HOOKS

	    // This function will be called whenever a moment is mutated.
	    // It is intended to keep the offset in sync with the timezone.
	    hooks.updateOffset = function () {};

	    // MOMENTS

	    // keepLocalTime = true means only change the timezone, without
	    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	    // +0200, so we adjust the time as needed, to be valid.
	    //
	    // Keeping the time actually adds/subtracts (one hour)
	    // from the actual represented time. That is why we call updateOffset
	    // a second time. In case it wants us to change the offset again
	    // _changeInProgress == true case, then we have to adjust, because
	    // there is no such time in the given timezone.
	    function getSetOffset (input, keepLocalTime, keepMinutes) {
	        var offset = this._offset || 0,
	            localAdjust;
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        if (input != null) {
	            if (typeof input === 'string') {
	                input = offsetFromString(matchShortOffset, input);
	                if (input === null) {
	                    return this;
	                }
	            } else if (Math.abs(input) < 16 && !keepMinutes) {
	                input = input * 60;
	            }
	            if (!this._isUTC && keepLocalTime) {
	                localAdjust = getDateOffset(this);
	            }
	            this._offset = input;
	            this._isUTC = true;
	            if (localAdjust != null) {
	                this.add(localAdjust, 'm');
	            }
	            if (offset !== input) {
	                if (!keepLocalTime || this._changeInProgress) {
	                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
	                } else if (!this._changeInProgress) {
	                    this._changeInProgress = true;
	                    hooks.updateOffset(this, true);
	                    this._changeInProgress = null;
	                }
	            }
	            return this;
	        } else {
	            return this._isUTC ? offset : getDateOffset(this);
	        }
	    }

	    function getSetZone (input, keepLocalTime) {
	        if (input != null) {
	            if (typeof input !== 'string') {
	                input = -input;
	            }

	            this.utcOffset(input, keepLocalTime);

	            return this;
	        } else {
	            return -this.utcOffset();
	        }
	    }

	    function setOffsetToUTC (keepLocalTime) {
	        return this.utcOffset(0, keepLocalTime);
	    }

	    function setOffsetToLocal (keepLocalTime) {
	        if (this._isUTC) {
	            this.utcOffset(0, keepLocalTime);
	            this._isUTC = false;

	            if (keepLocalTime) {
	                this.subtract(getDateOffset(this), 'm');
	            }
	        }
	        return this;
	    }

	    function setOffsetToParsedOffset () {
	        if (this._tzm != null) {
	            this.utcOffset(this._tzm, false, true);
	        } else if (typeof this._i === 'string') {
	            var tZone = offsetFromString(matchOffset, this._i);
	            if (tZone != null) {
	                this.utcOffset(tZone);
	            }
	            else {
	                this.utcOffset(0, true);
	            }
	        }
	        return this;
	    }

	    function hasAlignedHourOffset (input) {
	        if (!this.isValid()) {
	            return false;
	        }
	        input = input ? createLocal(input).utcOffset() : 0;

	        return (this.utcOffset() - input) % 60 === 0;
	    }

	    function isDaylightSavingTime () {
	        return (
	            this.utcOffset() > this.clone().month(0).utcOffset() ||
	            this.utcOffset() > this.clone().month(5).utcOffset()
	        );
	    }

	    function isDaylightSavingTimeShifted () {
	        if (!isUndefined(this._isDSTShifted)) {
	            return this._isDSTShifted;
	        }

	        var c = {};

	        copyConfig(c, this);
	        c = prepareConfig(c);

	        if (c._a) {
	            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	            this._isDSTShifted = this.isValid() &&
	                compareArrays(c._a, other.toArray()) > 0;
	        } else {
	            this._isDSTShifted = false;
	        }

	        return this._isDSTShifted;
	    }

	    function isLocal () {
	        return this.isValid() ? !this._isUTC : false;
	    }

	    function isUtcOffset () {
	        return this.isValid() ? this._isUTC : false;
	    }

	    function isUtc () {
	        return this.isValid() ? this._isUTC && this._offset === 0 : false;
	    }

	    // ASP.NET json date format regex
	    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

	    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	    // and further modified to allow for strings containing both week and day
	    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

	    function createDuration (input, key) {
	        var duration = input,
	            // matching against regexp is expensive, do it on demand
	            match = null,
	            sign,
	            ret,
	            diffRes;

	        if (isDuration(input)) {
	            duration = {
	                ms : input._milliseconds,
	                d  : input._days,
	                M  : input._months
	            };
	        } else if (isNumber(input)) {
	            duration = {};
	            if (key) {
	                duration[key] = input;
	            } else {
	                duration.milliseconds = input;
	            }
	        } else if (!!(match = aspNetRegex.exec(input))) {
	            sign = (match[1] === '-') ? -1 : 1;
	            duration = {
	                y  : 0,
	                d  : toInt(match[DATE])                         * sign,
	                h  : toInt(match[HOUR])                         * sign,
	                m  : toInt(match[MINUTE])                       * sign,
	                s  : toInt(match[SECOND])                       * sign,
	                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
	            };
	        } else if (!!(match = isoRegex.exec(input))) {
	            sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
	            duration = {
	                y : parseIso(match[2], sign),
	                M : parseIso(match[3], sign),
	                w : parseIso(match[4], sign),
	                d : parseIso(match[5], sign),
	                h : parseIso(match[6], sign),
	                m : parseIso(match[7], sign),
	                s : parseIso(match[8], sign)
	            };
	        } else if (duration == null) {// checks for null or undefined
	            duration = {};
	        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
	            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

	            duration = {};
	            duration.ms = diffRes.milliseconds;
	            duration.M = diffRes.months;
	        }

	        ret = new Duration(duration);

	        if (isDuration(input) && hasOwnProp(input, '_locale')) {
	            ret._locale = input._locale;
	        }

	        return ret;
	    }

	    createDuration.fn = Duration.prototype;
	    createDuration.invalid = createInvalid$1;

	    function parseIso (inp, sign) {
	        // We'd normally use ~~inp for this, but unfortunately it also
	        // converts floats to ints.
	        // inp may be undefined, so careful calling replace on it.
	        var res = inp && parseFloat(inp.replace(',', '.'));
	        // apply sign while we're at it
	        return (isNaN(res) ? 0 : res) * sign;
	    }

	    function positiveMomentsDifference(base, other) {
	        var res = {milliseconds: 0, months: 0};

	        res.months = other.month() - base.month() +
	            (other.year() - base.year()) * 12;
	        if (base.clone().add(res.months, 'M').isAfter(other)) {
	            --res.months;
	        }

	        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

	        return res;
	    }

	    function momentsDifference(base, other) {
	        var res;
	        if (!(base.isValid() && other.isValid())) {
	            return {milliseconds: 0, months: 0};
	        }

	        other = cloneWithOffset(other, base);
	        if (base.isBefore(other)) {
	            res = positiveMomentsDifference(base, other);
	        } else {
	            res = positiveMomentsDifference(other, base);
	            res.milliseconds = -res.milliseconds;
	            res.months = -res.months;
	        }

	        return res;
	    }

	    // TODO: remove 'name' arg after deprecation is removed
	    function createAdder(direction, name) {
	        return function (val, period) {
	            var dur, tmp;
	            //invert the arguments, but complain about it
	            if (period !== null && !isNaN(+period)) {
	                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
	                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
	                tmp = val; val = period; period = tmp;
	            }

	            val = typeof val === 'string' ? +val : val;
	            dur = createDuration(val, period);
	            addSubtract(this, dur, direction);
	            return this;
	        };
	    }

	    function addSubtract (mom, duration, isAdding, updateOffset) {
	        var milliseconds = duration._milliseconds,
	            days = absRound(duration._days),
	            months = absRound(duration._months);

	        if (!mom.isValid()) {
	            // No op
	            return;
	        }

	        updateOffset = updateOffset == null ? true : updateOffset;

	        if (months) {
	            setMonth(mom, get(mom, 'Month') + months * isAdding);
	        }
	        if (days) {
	            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	        }
	        if (milliseconds) {
	            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	        }
	        if (updateOffset) {
	            hooks.updateOffset(mom, days || months);
	        }
	    }

	    var add      = createAdder(1, 'add');
	    var subtract = createAdder(-1, 'subtract');

	    function getCalendarFormat(myMoment, now) {
	        var diff = myMoment.diff(now, 'days', true);
	        return diff < -6 ? 'sameElse' :
	                diff < -1 ? 'lastWeek' :
	                diff < 0 ? 'lastDay' :
	                diff < 1 ? 'sameDay' :
	                diff < 2 ? 'nextDay' :
	                diff < 7 ? 'nextWeek' : 'sameElse';
	    }

	    function calendar$1 (time, formats) {
	        // We want to compare the start of today, vs this.
	        // Getting start-of-today depends on whether we're local/utc/offset or not.
	        var now = time || createLocal(),
	            sod = cloneWithOffset(now, this).startOf('day'),
	            format = hooks.calendarFormat(this, sod) || 'sameElse';

	        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

	        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
	    }

	    function clone () {
	        return new Moment(this);
	    }

	    function isAfter (input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	        if (units === 'millisecond') {
	            return this.valueOf() > localInput.valueOf();
	        } else {
	            return localInput.valueOf() < this.clone().startOf(units).valueOf();
	        }
	    }

	    function isBefore (input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	        if (units === 'millisecond') {
	            return this.valueOf() < localInput.valueOf();
	        } else {
	            return this.clone().endOf(units).valueOf() < localInput.valueOf();
	        }
	    }

	    function isBetween (from, to, units, inclusivity) {
	        inclusivity = inclusivity || '()';
	        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
	            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
	    }

	    function isSame (input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input),
	            inputMs;
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units || 'millisecond');
	        if (units === 'millisecond') {
	            return this.valueOf() === localInput.valueOf();
	        } else {
	            inputMs = localInput.valueOf();
	            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
	        }
	    }

	    function isSameOrAfter (input, units) {
	        return this.isSame(input, units) || this.isAfter(input,units);
	    }

	    function isSameOrBefore (input, units) {
	        return this.isSame(input, units) || this.isBefore(input,units);
	    }

	    function diff (input, units, asFloat) {
	        var that,
	            zoneDelta,
	            output;

	        if (!this.isValid()) {
	            return NaN;
	        }

	        that = cloneWithOffset(input, this);

	        if (!that.isValid()) {
	            return NaN;
	        }

	        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	        units = normalizeUnits(units);

	        switch (units) {
	            case 'year': output = monthDiff(this, that) / 12; break;
	            case 'month': output = monthDiff(this, that); break;
	            case 'quarter': output = monthDiff(this, that) / 3; break;
	            case 'second': output = (this - that) / 1e3; break; // 1000
	            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
	            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
	            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
	            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
	            default: output = this - that;
	        }

	        return asFloat ? output : absFloor(output);
	    }

	    function monthDiff (a, b) {
	        // difference in months
	        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
	            // b is in (anchor - 1 month, anchor + 1 month)
	            anchor = a.clone().add(wholeMonthDiff, 'months'),
	            anchor2, adjust;

	        if (b - anchor < 0) {
	            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor - anchor2);
	        } else {
	            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor2 - anchor);
	        }

	        //check for negative zero, return zero if negative zero
	        return -(wholeMonthDiff + adjust) || 0;
	    }

	    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	    function toString () {
	        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	    }

	    function toISOString(keepOffset) {
	        if (!this.isValid()) {
	            return null;
	        }
	        var utc = keepOffset !== true;
	        var m = utc ? this.clone().utc() : this;
	        if (m.year() < 0 || m.year() > 9999) {
	            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
	        }
	        if (isFunction(Date.prototype.toISOString)) {
	            // native implementation is ~50x faster, use it when we can
	            if (utc) {
	                return this.toDate().toISOString();
	            } else {
	                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
	            }
	        }
	        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
	    }

	    /**
	     * Return a human readable representation of a moment that can
	     * also be evaluated to get a new moment which is the same
	     *
	     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	     */
	    function inspect () {
	        if (!this.isValid()) {
	            return 'moment.invalid(/* ' + this._i + ' */)';
	        }
	        var func = 'moment';
	        var zone = '';
	        if (!this.isLocal()) {
	            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	            zone = 'Z';
	        }
	        var prefix = '[' + func + '("]';
	        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
	        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
	        var suffix = zone + '[")]';

	        return this.format(prefix + year + datetime + suffix);
	    }

	    function format (inputString) {
	        if (!inputString) {
	            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
	        }
	        var output = formatMoment(this, inputString);
	        return this.localeData().postformat(output);
	    }

	    function from (time, withoutSuffix) {
	        if (this.isValid() &&
	                ((isMoment(time) && time.isValid()) ||
	                 createLocal(time).isValid())) {
	            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function fromNow (withoutSuffix) {
	        return this.from(createLocal(), withoutSuffix);
	    }

	    function to (time, withoutSuffix) {
	        if (this.isValid() &&
	                ((isMoment(time) && time.isValid()) ||
	                 createLocal(time).isValid())) {
	            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function toNow (withoutSuffix) {
	        return this.to(createLocal(), withoutSuffix);
	    }

	    // If passed a locale key, it will set the locale for this
	    // instance.  Otherwise, it will return the locale configuration
	    // variables for this instance.
	    function locale (key) {
	        var newLocaleData;

	        if (key === undefined) {
	            return this._locale._abbr;
	        } else {
	            newLocaleData = getLocale(key);
	            if (newLocaleData != null) {
	                this._locale = newLocaleData;
	            }
	            return this;
	        }
	    }

	    var lang = deprecate(
	        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	        function (key) {
	            if (key === undefined) {
	                return this.localeData();
	            } else {
	                return this.locale(key);
	            }
	        }
	    );

	    function localeData () {
	        return this._locale;
	    }

	    function startOf (units) {
	        units = normalizeUnits(units);
	        // the following switch intentionally omits break keywords
	        // to utilize falling through the cases.
	        switch (units) {
	            case 'year':
	                this.month(0);
	                /* falls through */
	            case 'quarter':
	            case 'month':
	                this.date(1);
	                /* falls through */
	            case 'week':
	            case 'isoWeek':
	            case 'day':
	            case 'date':
	                this.hours(0);
	                /* falls through */
	            case 'hour':
	                this.minutes(0);
	                /* falls through */
	            case 'minute':
	                this.seconds(0);
	                /* falls through */
	            case 'second':
	                this.milliseconds(0);
	        }

	        // weeks are a special case
	        if (units === 'week') {
	            this.weekday(0);
	        }
	        if (units === 'isoWeek') {
	            this.isoWeekday(1);
	        }

	        // quarters are also special
	        if (units === 'quarter') {
	            this.month(Math.floor(this.month() / 3) * 3);
	        }

	        return this;
	    }

	    function endOf (units) {
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond') {
	            return this;
	        }

	        // 'date' is an alias for 'day', so it should be considered as such.
	        if (units === 'date') {
	            units = 'day';
	        }

	        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
	    }

	    function valueOf () {
	        return this._d.valueOf() - ((this._offset || 0) * 60000);
	    }

	    function unix () {
	        return Math.floor(this.valueOf() / 1000);
	    }

	    function toDate () {
	        return new Date(this.valueOf());
	    }

	    function toArray () {
	        var m = this;
	        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	    }

	    function toObject () {
	        var m = this;
	        return {
	            years: m.year(),
	            months: m.month(),
	            date: m.date(),
	            hours: m.hours(),
	            minutes: m.minutes(),
	            seconds: m.seconds(),
	            milliseconds: m.milliseconds()
	        };
	    }

	    function toJSON () {
	        // new Date(NaN).toJSON() === null
	        return this.isValid() ? this.toISOString() : null;
	    }

	    function isValid$2 () {
	        return isValid(this);
	    }

	    function parsingFlags () {
	        return extend({}, getParsingFlags(this));
	    }

	    function invalidAt () {
	        return getParsingFlags(this).overflow;
	    }

	    function creationData() {
	        return {
	            input: this._i,
	            format: this._f,
	            locale: this._locale,
	            isUTC: this._isUTC,
	            strict: this._strict
	        };
	    }

	    // FORMATTING

	    addFormatToken(0, ['gg', 2], 0, function () {
	        return this.weekYear() % 100;
	    });

	    addFormatToken(0, ['GG', 2], 0, function () {
	        return this.isoWeekYear() % 100;
	    });

	    function addWeekYearFormatToken (token, getter) {
	        addFormatToken(0, [token, token.length], 0, getter);
	    }

	    addWeekYearFormatToken('gggg',     'weekYear');
	    addWeekYearFormatToken('ggggg',    'weekYear');
	    addWeekYearFormatToken('GGGG',  'isoWeekYear');
	    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	    // ALIASES

	    addUnitAlias('weekYear', 'gg');
	    addUnitAlias('isoWeekYear', 'GG');

	    // PRIORITY

	    addUnitPriority('weekYear', 1);
	    addUnitPriority('isoWeekYear', 1);


	    // PARSING

	    addRegexToken('G',      matchSigned);
	    addRegexToken('g',      matchSigned);
	    addRegexToken('GG',     match1to2, match2);
	    addRegexToken('gg',     match1to2, match2);
	    addRegexToken('GGGG',   match1to4, match4);
	    addRegexToken('gggg',   match1to4, match4);
	    addRegexToken('GGGGG',  match1to6, match6);
	    addRegexToken('ggggg',  match1to6, match6);

	    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	        week[token.substr(0, 2)] = toInt(input);
	    });

	    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	        week[token] = hooks.parseTwoDigitYear(input);
	    });

	    // MOMENTS

	    function getSetWeekYear (input) {
	        return getSetWeekYearHelper.call(this,
	                input,
	                this.week(),
	                this.weekday(),
	                this.localeData()._week.dow,
	                this.localeData()._week.doy);
	    }

	    function getSetISOWeekYear (input) {
	        return getSetWeekYearHelper.call(this,
	                input, this.isoWeek(), this.isoWeekday(), 1, 4);
	    }

	    function getISOWeeksInYear () {
	        return weeksInYear(this.year(), 1, 4);
	    }

	    function getWeeksInYear () {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	    }

	    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	        var weeksTarget;
	        if (input == null) {
	            return weekOfYear(this, dow, doy).year;
	        } else {
	            weeksTarget = weeksInYear(input, dow, doy);
	            if (week > weeksTarget) {
	                week = weeksTarget;
	            }
	            return setWeekAll.call(this, input, week, weekday, dow, doy);
	        }
	    }

	    function setWeekAll(weekYear, week, weekday, dow, doy) {
	        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	        this.year(date.getUTCFullYear());
	        this.month(date.getUTCMonth());
	        this.date(date.getUTCDate());
	        return this;
	    }

	    // FORMATTING

	    addFormatToken('Q', 0, 'Qo', 'quarter');

	    // ALIASES

	    addUnitAlias('quarter', 'Q');

	    // PRIORITY

	    addUnitPriority('quarter', 7);

	    // PARSING

	    addRegexToken('Q', match1);
	    addParseToken('Q', function (input, array) {
	        array[MONTH] = (toInt(input) - 1) * 3;
	    });

	    // MOMENTS

	    function getSetQuarter (input) {
	        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	    }

	    // FORMATTING

	    addFormatToken('D', ['DD', 2], 'Do', 'date');

	    // ALIASES

	    addUnitAlias('date', 'D');

	    // PRIORITY
	    addUnitPriority('date', 9);

	    // PARSING

	    addRegexToken('D',  match1to2);
	    addRegexToken('DD', match1to2, match2);
	    addRegexToken('Do', function (isStrict, locale) {
	        // TODO: Remove "ordinalParse" fallback in next major release.
	        return isStrict ?
	          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
	          locale._dayOfMonthOrdinalParseLenient;
	    });

	    addParseToken(['D', 'DD'], DATE);
	    addParseToken('Do', function (input, array) {
	        array[DATE] = toInt(input.match(match1to2)[0]);
	    });

	    // MOMENTS

	    var getSetDayOfMonth = makeGetSet('Date', true);

	    // FORMATTING

	    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	    // ALIASES

	    addUnitAlias('dayOfYear', 'DDD');

	    // PRIORITY
	    addUnitPriority('dayOfYear', 4);

	    // PARSING

	    addRegexToken('DDD',  match1to3);
	    addRegexToken('DDDD', match3);
	    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	        config._dayOfYear = toInt(input);
	    });

	    // HELPERS

	    // MOMENTS

	    function getSetDayOfYear (input) {
	        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
	    }

	    // FORMATTING

	    addFormatToken('m', ['mm', 2], 0, 'minute');

	    // ALIASES

	    addUnitAlias('minute', 'm');

	    // PRIORITY

	    addUnitPriority('minute', 14);

	    // PARSING

	    addRegexToken('m',  match1to2);
	    addRegexToken('mm', match1to2, match2);
	    addParseToken(['m', 'mm'], MINUTE);

	    // MOMENTS

	    var getSetMinute = makeGetSet('Minutes', false);

	    // FORMATTING

	    addFormatToken('s', ['ss', 2], 0, 'second');

	    // ALIASES

	    addUnitAlias('second', 's');

	    // PRIORITY

	    addUnitPriority('second', 15);

	    // PARSING

	    addRegexToken('s',  match1to2);
	    addRegexToken('ss', match1to2, match2);
	    addParseToken(['s', 'ss'], SECOND);

	    // MOMENTS

	    var getSetSecond = makeGetSet('Seconds', false);

	    // FORMATTING

	    addFormatToken('S', 0, 0, function () {
	        return ~~(this.millisecond() / 100);
	    });

	    addFormatToken(0, ['SS', 2], 0, function () {
	        return ~~(this.millisecond() / 10);
	    });

	    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	    addFormatToken(0, ['SSSS', 4], 0, function () {
	        return this.millisecond() * 10;
	    });
	    addFormatToken(0, ['SSSSS', 5], 0, function () {
	        return this.millisecond() * 100;
	    });
	    addFormatToken(0, ['SSSSSS', 6], 0, function () {
	        return this.millisecond() * 1000;
	    });
	    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	        return this.millisecond() * 10000;
	    });
	    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	        return this.millisecond() * 100000;
	    });
	    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	        return this.millisecond() * 1000000;
	    });


	    // ALIASES

	    addUnitAlias('millisecond', 'ms');

	    // PRIORITY

	    addUnitPriority('millisecond', 16);

	    // PARSING

	    addRegexToken('S',    match1to3, match1);
	    addRegexToken('SS',   match1to3, match2);
	    addRegexToken('SSS',  match1to3, match3);

	    var token;
	    for (token = 'SSSS'; token.length <= 9; token += 'S') {
	        addRegexToken(token, matchUnsigned);
	    }

	    function parseMs(input, array) {
	        array[MILLISECOND] = toInt(('0.' + input) * 1000);
	    }

	    for (token = 'S'; token.length <= 9; token += 'S') {
	        addParseToken(token, parseMs);
	    }
	    // MOMENTS

	    var getSetMillisecond = makeGetSet('Milliseconds', false);

	    // FORMATTING

	    addFormatToken('z',  0, 0, 'zoneAbbr');
	    addFormatToken('zz', 0, 0, 'zoneName');

	    // MOMENTS

	    function getZoneAbbr () {
	        return this._isUTC ? 'UTC' : '';
	    }

	    function getZoneName () {
	        return this._isUTC ? 'Coordinated Universal Time' : '';
	    }

	    var proto = Moment.prototype;

	    proto.add               = add;
	    proto.calendar          = calendar$1;
	    proto.clone             = clone;
	    proto.diff              = diff;
	    proto.endOf             = endOf;
	    proto.format            = format;
	    proto.from              = from;
	    proto.fromNow           = fromNow;
	    proto.to                = to;
	    proto.toNow             = toNow;
	    proto.get               = stringGet;
	    proto.invalidAt         = invalidAt;
	    proto.isAfter           = isAfter;
	    proto.isBefore          = isBefore;
	    proto.isBetween         = isBetween;
	    proto.isSame            = isSame;
	    proto.isSameOrAfter     = isSameOrAfter;
	    proto.isSameOrBefore    = isSameOrBefore;
	    proto.isValid           = isValid$2;
	    proto.lang              = lang;
	    proto.locale            = locale;
	    proto.localeData        = localeData;
	    proto.max               = prototypeMax;
	    proto.min               = prototypeMin;
	    proto.parsingFlags      = parsingFlags;
	    proto.set               = stringSet;
	    proto.startOf           = startOf;
	    proto.subtract          = subtract;
	    proto.toArray           = toArray;
	    proto.toObject          = toObject;
	    proto.toDate            = toDate;
	    proto.toISOString       = toISOString;
	    proto.inspect           = inspect;
	    proto.toJSON            = toJSON;
	    proto.toString          = toString;
	    proto.unix              = unix;
	    proto.valueOf           = valueOf;
	    proto.creationData      = creationData;
	    proto.year       = getSetYear;
	    proto.isLeapYear = getIsLeapYear;
	    proto.weekYear    = getSetWeekYear;
	    proto.isoWeekYear = getSetISOWeekYear;
	    proto.quarter = proto.quarters = getSetQuarter;
	    proto.month       = getSetMonth;
	    proto.daysInMonth = getDaysInMonth;
	    proto.week           = proto.weeks        = getSetWeek;
	    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
	    proto.weeksInYear    = getWeeksInYear;
	    proto.isoWeeksInYear = getISOWeeksInYear;
	    proto.date       = getSetDayOfMonth;
	    proto.day        = proto.days             = getSetDayOfWeek;
	    proto.weekday    = getSetLocaleDayOfWeek;
	    proto.isoWeekday = getSetISODayOfWeek;
	    proto.dayOfYear  = getSetDayOfYear;
	    proto.hour = proto.hours = getSetHour;
	    proto.minute = proto.minutes = getSetMinute;
	    proto.second = proto.seconds = getSetSecond;
	    proto.millisecond = proto.milliseconds = getSetMillisecond;
	    proto.utcOffset            = getSetOffset;
	    proto.utc                  = setOffsetToUTC;
	    proto.local                = setOffsetToLocal;
	    proto.parseZone            = setOffsetToParsedOffset;
	    proto.hasAlignedHourOffset = hasAlignedHourOffset;
	    proto.isDST                = isDaylightSavingTime;
	    proto.isLocal              = isLocal;
	    proto.isUtcOffset          = isUtcOffset;
	    proto.isUtc                = isUtc;
	    proto.isUTC                = isUtc;
	    proto.zoneAbbr = getZoneAbbr;
	    proto.zoneName = getZoneName;
	    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
	    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

	    function createUnix (input) {
	        return createLocal(input * 1000);
	    }

	    function createInZone () {
	        return createLocal.apply(null, arguments).parseZone();
	    }

	    function preParsePostFormat (string) {
	        return string;
	    }

	    var proto$1 = Locale.prototype;

	    proto$1.calendar        = calendar;
	    proto$1.longDateFormat  = longDateFormat;
	    proto$1.invalidDate     = invalidDate;
	    proto$1.ordinal         = ordinal;
	    proto$1.preparse        = preParsePostFormat;
	    proto$1.postformat      = preParsePostFormat;
	    proto$1.relativeTime    = relativeTime;
	    proto$1.pastFuture      = pastFuture;
	    proto$1.set             = set;

	    proto$1.months            =        localeMonths;
	    proto$1.monthsShort       =        localeMonthsShort;
	    proto$1.monthsParse       =        localeMonthsParse;
	    proto$1.monthsRegex       = monthsRegex;
	    proto$1.monthsShortRegex  = monthsShortRegex;
	    proto$1.week = localeWeek;
	    proto$1.firstDayOfYear = localeFirstDayOfYear;
	    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

	    proto$1.weekdays       =        localeWeekdays;
	    proto$1.weekdaysMin    =        localeWeekdaysMin;
	    proto$1.weekdaysShort  =        localeWeekdaysShort;
	    proto$1.weekdaysParse  =        localeWeekdaysParse;

	    proto$1.weekdaysRegex       =        weekdaysRegex;
	    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
	    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

	    proto$1.isPM = localeIsPM;
	    proto$1.meridiem = localeMeridiem;

	    function get$1 (format, index, field, setter) {
	        var locale = getLocale();
	        var utc = createUTC().set(setter, index);
	        return locale[field](utc, format);
	    }

	    function listMonthsImpl (format, index, field) {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';

	        if (index != null) {
	            return get$1(format, index, field, 'month');
	        }

	        var i;
	        var out = [];
	        for (i = 0; i < 12; i++) {
	            out[i] = get$1(format, i, field, 'month');
	        }
	        return out;
	    }

	    // ()
	    // (5)
	    // (fmt, 5)
	    // (fmt)
	    // (true)
	    // (true, 5)
	    // (true, fmt, 5)
	    // (true, fmt)
	    function listWeekdaysImpl (localeSorted, format, index, field) {
	        if (typeof localeSorted === 'boolean') {
	            if (isNumber(format)) {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        } else {
	            format = localeSorted;
	            index = format;
	            localeSorted = false;

	            if (isNumber(format)) {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        }

	        var locale = getLocale(),
	            shift = localeSorted ? locale._week.dow : 0;

	        if (index != null) {
	            return get$1(format, (index + shift) % 7, field, 'day');
	        }

	        var i;
	        var out = [];
	        for (i = 0; i < 7; i++) {
	            out[i] = get$1(format, (i + shift) % 7, field, 'day');
	        }
	        return out;
	    }

	    function listMonths (format, index) {
	        return listMonthsImpl(format, index, 'months');
	    }

	    function listMonthsShort (format, index) {
	        return listMonthsImpl(format, index, 'monthsShort');
	    }

	    function listWeekdays (localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	    }

	    function listWeekdaysShort (localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	    }

	    function listWeekdaysMin (localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	    }

	    getSetGlobalLocale('en', {
	        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (toInt(number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        }
	    });

	    // Side effect imports

	    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
	    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

	    var mathAbs = Math.abs;

	    function abs () {
	        var data           = this._data;

	        this._milliseconds = mathAbs(this._milliseconds);
	        this._days         = mathAbs(this._days);
	        this._months       = mathAbs(this._months);

	        data.milliseconds  = mathAbs(data.milliseconds);
	        data.seconds       = mathAbs(data.seconds);
	        data.minutes       = mathAbs(data.minutes);
	        data.hours         = mathAbs(data.hours);
	        data.months        = mathAbs(data.months);
	        data.years         = mathAbs(data.years);

	        return this;
	    }

	    function addSubtract$1 (duration, input, value, direction) {
	        var other = createDuration(input, value);

	        duration._milliseconds += direction * other._milliseconds;
	        duration._days         += direction * other._days;
	        duration._months       += direction * other._months;

	        return duration._bubble();
	    }

	    // supports only 2.0-style add(1, 's') or add(duration)
	    function add$1 (input, value) {
	        return addSubtract$1(this, input, value, 1);
	    }

	    // supports only 2.0-style subtract(1, 's') or subtract(duration)
	    function subtract$1 (input, value) {
	        return addSubtract$1(this, input, value, -1);
	    }

	    function absCeil (number) {
	        if (number < 0) {
	            return Math.floor(number);
	        } else {
	            return Math.ceil(number);
	        }
	    }

	    function bubble () {
	        var milliseconds = this._milliseconds;
	        var days         = this._days;
	        var months       = this._months;
	        var data         = this._data;
	        var seconds, minutes, hours, years, monthsFromDays;

	        // if we have a mix of positive and negative values, bubble down first
	        // check: https://github.com/moment/moment/issues/2166
	        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
	                (milliseconds <= 0 && days <= 0 && months <= 0))) {
	            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	            days = 0;
	            months = 0;
	        }

	        // The following code bubbles up values, see the tests for
	        // examples of what that means.
	        data.milliseconds = milliseconds % 1000;

	        seconds           = absFloor(milliseconds / 1000);
	        data.seconds      = seconds % 60;

	        minutes           = absFloor(seconds / 60);
	        data.minutes      = minutes % 60;

	        hours             = absFloor(minutes / 60);
	        data.hours        = hours % 24;

	        days += absFloor(hours / 24);

	        // convert days to months
	        monthsFromDays = absFloor(daysToMonths(days));
	        months += monthsFromDays;
	        days -= absCeil(monthsToDays(monthsFromDays));

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        data.days   = days;
	        data.months = months;
	        data.years  = years;

	        return this;
	    }

	    function daysToMonths (days) {
	        // 400 years have 146097 days (taking into account leap year rules)
	        // 400 years have 12 months === 4800
	        return days * 4800 / 146097;
	    }

	    function monthsToDays (months) {
	        // the reverse of daysToMonths
	        return months * 146097 / 4800;
	    }

	    function as (units) {
	        if (!this.isValid()) {
	            return NaN;
	        }
	        var days;
	        var months;
	        var milliseconds = this._milliseconds;

	        units = normalizeUnits(units);

	        if (units === 'month' || units === 'year') {
	            days   = this._days   + milliseconds / 864e5;
	            months = this._months + daysToMonths(days);
	            return units === 'month' ? months : months / 12;
	        } else {
	            // handle milliseconds separately because of floating point math errors (issue #1867)
	            days = this._days + Math.round(monthsToDays(this._months));
	            switch (units) {
	                case 'week'   : return days / 7     + milliseconds / 6048e5;
	                case 'day'    : return days         + milliseconds / 864e5;
	                case 'hour'   : return days * 24    + milliseconds / 36e5;
	                case 'minute' : return days * 1440  + milliseconds / 6e4;
	                case 'second' : return days * 86400 + milliseconds / 1000;
	                // Math.floor prevents floating point math errors here
	                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
	                default: throw new Error('Unknown unit ' + units);
	            }
	        }
	    }

	    // TODO: Use this.as('ms')?
	    function valueOf$1 () {
	        if (!this.isValid()) {
	            return NaN;
	        }
	        return (
	            this._milliseconds +
	            this._days * 864e5 +
	            (this._months % 12) * 2592e6 +
	            toInt(this._months / 12) * 31536e6
	        );
	    }

	    function makeAs (alias) {
	        return function () {
	            return this.as(alias);
	        };
	    }

	    var asMilliseconds = makeAs('ms');
	    var asSeconds      = makeAs('s');
	    var asMinutes      = makeAs('m');
	    var asHours        = makeAs('h');
	    var asDays         = makeAs('d');
	    var asWeeks        = makeAs('w');
	    var asMonths       = makeAs('M');
	    var asYears        = makeAs('y');

	    function clone$1 () {
	        return createDuration(this);
	    }

	    function get$2 (units) {
	        units = normalizeUnits(units);
	        return this.isValid() ? this[units + 's']() : NaN;
	    }

	    function makeGetter(name) {
	        return function () {
	            return this.isValid() ? this._data[name] : NaN;
	        };
	    }

	    var milliseconds = makeGetter('milliseconds');
	    var seconds      = makeGetter('seconds');
	    var minutes      = makeGetter('minutes');
	    var hours        = makeGetter('hours');
	    var days         = makeGetter('days');
	    var months       = makeGetter('months');
	    var years        = makeGetter('years');

	    function weeks () {
	        return absFloor(this.days() / 7);
	    }

	    var round = Math.round;
	    var thresholds = {
	        ss: 44,         // a few seconds to seconds
	        s : 45,         // seconds to minute
	        m : 45,         // minutes to hour
	        h : 22,         // hours to day
	        d : 26,         // days to month
	        M : 11          // months to year
	    };

	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }

	    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
	        var duration = createDuration(posNegDuration).abs();
	        var seconds  = round(duration.as('s'));
	        var minutes  = round(duration.as('m'));
	        var hours    = round(duration.as('h'));
	        var days     = round(duration.as('d'));
	        var months   = round(duration.as('M'));
	        var years    = round(duration.as('y'));

	        var a = seconds <= thresholds.ss && ['s', seconds]  ||
	                seconds < thresholds.s   && ['ss', seconds] ||
	                minutes <= 1             && ['m']           ||
	                minutes < thresholds.m   && ['mm', minutes] ||
	                hours   <= 1             && ['h']           ||
	                hours   < thresholds.h   && ['hh', hours]   ||
	                days    <= 1             && ['d']           ||
	                days    < thresholds.d   && ['dd', days]    ||
	                months  <= 1             && ['M']           ||
	                months  < thresholds.M   && ['MM', months]  ||
	                years   <= 1             && ['y']           || ['yy', years];

	        a[2] = withoutSuffix;
	        a[3] = +posNegDuration > 0;
	        a[4] = locale;
	        return substituteTimeAgo.apply(null, a);
	    }

	    // This function allows you to set the rounding function for relative time strings
	    function getSetRelativeTimeRounding (roundingFunction) {
	        if (roundingFunction === undefined) {
	            return round;
	        }
	        if (typeof(roundingFunction) === 'function') {
	            round = roundingFunction;
	            return true;
	        }
	        return false;
	    }

	    // This function allows you to set a threshold for relative time strings
	    function getSetRelativeTimeThreshold (threshold, limit) {
	        if (thresholds[threshold] === undefined) {
	            return false;
	        }
	        if (limit === undefined) {
	            return thresholds[threshold];
	        }
	        thresholds[threshold] = limit;
	        if (threshold === 's') {
	            thresholds.ss = limit - 1;
	        }
	        return true;
	    }

	    function humanize (withSuffix) {
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }

	        var locale = this.localeData();
	        var output = relativeTime$1(this, !withSuffix, locale);

	        if (withSuffix) {
	            output = locale.pastFuture(+this, output);
	        }

	        return locale.postformat(output);
	    }

	    var abs$1 = Math.abs;

	    function sign(x) {
	        return ((x > 0) - (x < 0)) || +x;
	    }

	    function toISOString$1() {
	        // for ISO strings we do not use the normal bubbling rules:
	        //  * milliseconds bubble up until they become hours
	        //  * days do not bubble at all
	        //  * months bubble up until they become years
	        // This is because there is no context-free conversion between hours and days
	        // (think of clock changes)
	        // and also not between days and months (28-31 days per month)
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }

	        var seconds = abs$1(this._milliseconds) / 1000;
	        var days         = abs$1(this._days);
	        var months       = abs$1(this._months);
	        var minutes, hours, years;

	        // 3600 seconds -> 60 minutes -> 1 hour
	        minutes           = absFloor(seconds / 60);
	        hours             = absFloor(minutes / 60);
	        seconds %= 60;
	        minutes %= 60;

	        // 12 months -> 1 year
	        years  = absFloor(months / 12);
	        months %= 12;


	        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	        var Y = years;
	        var M = months;
	        var D = days;
	        var h = hours;
	        var m = minutes;
	        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
	        var total = this.asSeconds();

	        if (!total) {
	            // this is the same as C#'s (Noda) and python (isodate)...
	            // but not other JS (goog.date)
	            return 'P0D';
	        }

	        var totalSign = total < 0 ? '-' : '';
	        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
	        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
	        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

	        return totalSign + 'P' +
	            (Y ? ymSign + Y + 'Y' : '') +
	            (M ? ymSign + M + 'M' : '') +
	            (D ? daysSign + D + 'D' : '') +
	            ((h || m || s) ? 'T' : '') +
	            (h ? hmsSign + h + 'H' : '') +
	            (m ? hmsSign + m + 'M' : '') +
	            (s ? hmsSign + s + 'S' : '');
	    }

	    var proto$2 = Duration.prototype;

	    proto$2.isValid        = isValid$1;
	    proto$2.abs            = abs;
	    proto$2.add            = add$1;
	    proto$2.subtract       = subtract$1;
	    proto$2.as             = as;
	    proto$2.asMilliseconds = asMilliseconds;
	    proto$2.asSeconds      = asSeconds;
	    proto$2.asMinutes      = asMinutes;
	    proto$2.asHours        = asHours;
	    proto$2.asDays         = asDays;
	    proto$2.asWeeks        = asWeeks;
	    proto$2.asMonths       = asMonths;
	    proto$2.asYears        = asYears;
	    proto$2.valueOf        = valueOf$1;
	    proto$2._bubble        = bubble;
	    proto$2.clone          = clone$1;
	    proto$2.get            = get$2;
	    proto$2.milliseconds   = milliseconds;
	    proto$2.seconds        = seconds;
	    proto$2.minutes        = minutes;
	    proto$2.hours          = hours;
	    proto$2.days           = days;
	    proto$2.weeks          = weeks;
	    proto$2.months         = months;
	    proto$2.years          = years;
	    proto$2.humanize       = humanize;
	    proto$2.toISOString    = toISOString$1;
	    proto$2.toString       = toISOString$1;
	    proto$2.toJSON         = toISOString$1;
	    proto$2.locale         = locale;
	    proto$2.localeData     = localeData;

	    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
	    proto$2.lang = lang;

	    // Side effect imports

	    // FORMATTING

	    addFormatToken('X', 0, 0, 'unix');
	    addFormatToken('x', 0, 0, 'valueOf');

	    // PARSING

	    addRegexToken('x', matchSigned);
	    addRegexToken('X', matchTimestamp);
	    addParseToken('X', function (input, array, config) {
	        config._d = new Date(parseFloat(input, 10) * 1000);
	    });
	    addParseToken('x', function (input, array, config) {
	        config._d = new Date(toInt(input));
	    });

	    // Side effect imports


	    hooks.version = '2.22.2';

	    setHookCallback(createLocal);

	    hooks.fn                    = proto;
	    hooks.min                   = min;
	    hooks.max                   = max;
	    hooks.now                   = now;
	    hooks.utc                   = createUTC;
	    hooks.unix                  = createUnix;
	    hooks.months                = listMonths;
	    hooks.isDate                = isDate;
	    hooks.locale                = getSetGlobalLocale;
	    hooks.invalid               = createInvalid;
	    hooks.duration              = createDuration;
	    hooks.isMoment              = isMoment;
	    hooks.weekdays              = listWeekdays;
	    hooks.parseZone             = createInZone;
	    hooks.localeData            = getLocale;
	    hooks.isDuration            = isDuration;
	    hooks.monthsShort           = listMonthsShort;
	    hooks.weekdaysMin           = listWeekdaysMin;
	    hooks.defineLocale          = defineLocale;
	    hooks.updateLocale          = updateLocale;
	    hooks.locales               = listLocales;
	    hooks.weekdaysShort         = listWeekdaysShort;
	    hooks.normalizeUnits        = normalizeUnits;
	    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
	    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	    hooks.calendarFormat        = getCalendarFormat;
	    hooks.prototype             = proto;

	    // currently HTML5 input type only supports 24-hour formats
	    hooks.HTML5_FMT = {
	        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
	        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
	        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
	        DATE: 'YYYY-MM-DD',                             // <input type="date" />
	        TIME: 'HH:mm',                                  // <input type="time" />
	        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
	        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
	        WEEK: 'YYYY-[W]WW',                             // <input type="week" />
	        MONTH: 'YYYY-MM'                                // <input type="month" />
	    };

	    return hooks;

	})));
	});

	var BaseQueryConverter = /** @class */ (function () {
	    function BaseQueryConverter() {
	    }
	    /**
	     * Returns the url for the REST API.
	     *
	     * @param baseUrl is the leading part of the url that is to be generated.
	     * @param query is the query that is to be converted into the url.
	     * @returns The url to use for fetching the date, represented as a string.
	     */
	    BaseQueryConverter.prototype.getUrl = function (baseUrl, servicePath, query) {
	        var params = this.getUrlParams(query).sort();
	        baseUrl = baseUrl.replace(/\/+$/, '');
	        servicePath = servicePath.replace(/(^\/+)|(\/+$)/g, '');
	        return baseUrl + "/" + servicePath + "?" + params.join('&');
	    };
	    BaseQueryConverter.prototype.addParamIfSet = function (params, key, param) {
	        var value = param.toString();
	        if (value) {
	            params.push(key + "=" + encodeURIComponent(value));
	        }
	    };
	    BaseQueryConverter.prototype.createDate = function (date) {
	        if (!date) {
	            return '';
	        }
	        var dateString;
	        if (typeof date === 'object' && !(date instanceof String) && !(date instanceof Date)) {
	            dateString = moment().add(date).toISOString();
	        }
	        else {
	            dateString = moment(date).toISOString();
	        }
	        return dateString;
	    };
	    return BaseQueryConverter;
	}());

	/**
	 * The Filter interface defines what information is held for a chosen category as a filter.
	 */
	var Filter = /** @class */ (function () {
	    /**
	     * Creates a Filter instance, holding the displayName and a copy of the original Category (excluding category.children).
	     *
	     * @param displayName Holds an array of all displayNames for the path to this category.
	     * @param category A copy/reference to the actual category selected (from what was received in the categorize call).
	     */
	    function Filter(displayName, category) {
	        this.displayName = displayName;
	        this.category = category;
	    }
	    return Filter;
	}());

	/**
	 * Class to handle creating categorize lookups for restservice version 3.
	 */
	var AutocompleteQueryConverter = /** @class */ (function (_super) {
	    __extends(AutocompleteQueryConverter, _super);
	    function AutocompleteQueryConverter() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    /**
	     * Converts the query params to an array of key=value segments,
	     * fit for Find REST v4.
	     */
	    AutocompleteQueryConverter.prototype.getUrlParams = function (query) {
	        var params = [];
	        this.addParamIfSet(params, 'l', 1); // Forces this to always do server-side when called. The client will skip calling when not needed instead.
	        this.addParamIfSet(params, 'q', query.queryText);
	        this.addParamIfSet(params, 's', query.maxSuggestions);
	        return params;
	    };
	    return AutocompleteQueryConverter;
	}(BaseQueryConverter));

	/**
	 * These are the triggers that define when and when not to trigger an autocomplete lookup.
	 */
	var AutocompleteTriggers = /** @class */ (function () {
	    /**
	     * Creates an AutocompleteTrigger object for you, based on AutocompleteTrigger defaults and the overrides provided as a param.
	     *
	     * @param triggers - The trigger defined here will override the default AutocompleteTrigger.
	     */
	    function AutocompleteTriggers(triggers) {
	        if (triggers === void 0) { triggers = {}; }
	        /**
	         * Whether or not an autocomplete lookup should be done when the maxSuggestions setting is changed.
	         *
	         * Note: Requires queryChanged to be true.
	         */
	        this.maxSuggestionsChanged = true;
	        /**
	         * Turns on or off all query-related triggers.
	         */
	        this.queryChange = true;
	        /**
	         * Delay triggers until changes has not been made to the query for a certain time (milliseconds).
	         * This is to avoid executing searches constantly while the user is typing.
	         *
	         * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
	         * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
	         *
	         * Note: Requires queryChanged to be true.
	         * Note: Requires query to be longer than queryMinLength.
	         */
	        this.queryChangeDelay = 200;
	        /**
	         * Triggers action immediately instead of delayed when the query matches the regex.
	         *
	         * Note: Requires queryChanged to be true.
	         * Note: Requires query to be longer than queryMinLength.
	         *
	         * Default: Trigger on first whitespace after non-whitespace
	         */
	        this.queryChangeInstantRegex = /\S\s$/;
	        /**
	         * Min length before triggering.
	         *
	         * Note: Requires queryChanged to be true.
	         */
	        this.queryChangeMinLength = 3;
	        Object.assign(this, triggers);
	    }
	    return AutocompleteTriggers;
	}());

	/**
	 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
	 */
	var AutocompleteSettings = /** @class */ (function (_super) {
	    __extends(AutocompleteSettings, _super);
	    /**
	     * Creates an AutocompleteSettings object for you, based on AutocompleteSettings defaults and the overrides provided as a param.
	     * @param settings - The settings defined here will override the default AutocompleteSettings.
	     */
	    function AutocompleteSettings(settings) {
	        var _this = _super.call(this, settings) || this;
	        /**
	         * The trigger-settings for when automatic suggestion updates are to be triggered.
	         */
	        _this.triggers = new AutocompleteTriggers();
	        /**
	         * The endpoint to do autocomplete lookups for.
	         */
	        _this.url = 'autocomplete';
	        if (settings) {
	            _this.triggers = typeof settings.triggers !== 'undefined' ? new AutocompleteTriggers(settings.triggers) : _this.triggers;
	            _this.url = typeof settings.url !== 'undefined' ? settings.url : _this.url;
	        }
	        // Remove leading and trailing slashes from the url
	        _this.url = _this.url.replace(/(^\/+)|(\/+$)/g, '');
	        return _this;
	    }
	    return AutocompleteSettings;
	}(BaseSettings));

	/**
	 * This class allows you to create a service that executes autocomplete lookupds for the IntelliSearch SearchService.
	 *
	 * Note: Typically you will not instantiate this class. Instead you will use it indirectly via the SearchClient class.
	 */
	var Autocomplete = /** @class */ (function (_super) {
	    __extends(Autocomplete, _super);
	    /**
	     * Creates an Autocomplete instance that knows how to get query-suggestions.
	     * @param baseUrl - The base url that the Autocomplete is to use for fetching suggestions.
	     * @param settings - The settings for how the Autocomplete is to operate.
	     * @param auth - The object that handles authentication.
	     */
	    function Autocomplete(baseUrl, settings, auth /*, allCategories: AllCategories*/) {
	        var _this = _super.call(this) || this;
	        _this.settings = settings;
	        settings = new AutocompleteSettings(settings);
	        _this.settings = new AutocompleteSettings(settings);
	        auth = auth || new AuthToken();
	        _super.prototype.init.call(_this, baseUrl, settings, auth);
	        _this.queryConverter = new AutocompleteQueryConverter();
	        return _this;
	    }
	    /**
	     * When called it will execute a rest-call to the base-url and fetch sutocomplete suggestions based on the query passed.
	     * Note that if a request callback has been setup then if it returns false the request is skipped.
	     * @param query - Is used to find out which autocomplete suggestions and from what sources they should be retrieved.
	     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
	     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
	     */
	    Autocomplete.prototype.fetch = function (query, suppressCallbacks) {
	        var _this = this;
	        if (query === void 0) { query = new Query(); }
	        if (suppressCallbacks === void 0) { suppressCallbacks = false; }
	        var url = this.queryConverter.getUrl(this.baseUrl, this.settings.url, query);
	        var reqInit = this.requestObject();
	        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
	            return nodePonyfill(url, reqInit)
	                .then(function (response) {
	                if (!response.ok) {
	                    throw Error(response.status + " " + response.statusText + " for request url '" + url + "'");
	                }
	                return response.json();
	            })
	                .then(function (suggestions) {
	                _this.cbSuccess(suppressCallbacks, suggestions, url, reqInit);
	                return suggestions;
	            })
	                .catch(function (error) {
	                _this.cbError(suppressCallbacks, error, url, reqInit);
	                return Promise.reject(error);
	            });
	        }
	        else {
	            // TODO: When a fetch is stopped due to cbRequest returning false, should we:
	            // 1) Reject the promise (will then be returned as an error).
	            // or
	            // 2) Resolve the promise (will then be returned as a success).
	            // or
	            // 3) should we do something else (old code returned undefined...)
	            return Promise.resolve(null);
	        }
	    };
	    Autocomplete.prototype.maxSuggestionsChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.maxSuggestionsChanged) {
	            this.update(query);
	        }
	    };
	    Autocomplete.prototype.queryTextChanged = function (oldValue, query) {
	        var _this = this;
	        if (this.settings.cbSuccess && this.settings.triggers.queryChange) {
	            if (query.queryText.length > this.settings.triggers.queryChangeMinLength) {
	                if (this.settings.triggers.queryChangeInstantRegex && this.settings.triggers.queryChangeInstantRegex.test(query.queryText)) {
	                    this.update(query);
	                }
	                else {
	                    if (this.settings.triggers.queryChangeDelay > -1) {
	                        // If a delay is already pending then clear it and restart the delay
	                        clearTimeout(this.delay);
	                        // Set up the delay
	                        this.delay = setTimeout(function () {
	                            _this.update(query);
	                        }, this.settings.triggers.queryChangeDelay);
	                    }
	                }
	            }
	        }
	    };
	    return Autocomplete;
	}(BaseCall));

	/**
	 * Class to handle creating categorize lookups for restservice version 3.
	 */
	var CategorizeQueryConverter = /** @class */ (function (_super) {
	    __extends(CategorizeQueryConverter, _super);
	    function CategorizeQueryConverter() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    /**
	     * Converts the query params to an array of key=value segments,
	     * fit for Categorize REST v4.
	     */
	    CategorizeQueryConverter.prototype.getUrlParams = function (query) {
	        var params = [];
	        this.addParamIfSet(params, 'c', query.clientId);
	        this.addParamIfSet(params, 'df', this.createDate(query.dateFrom));
	        this.addParamIfSet(params, 'dt', this.createDate(query.dateTo));
	        var filters = query.filters.map(function (f) { return f.category.categoryName.join('|'); });
	        this.addParamIfSet(params, 'f', filters.join(';'));
	        this.addParamIfSet(params, 'q', query.queryText);
	        this.addParamIfSet(params, 't', exports.SearchType[query.searchType]);
	        this.addParamIfSet(params, 'l', query.uiLanguageCode);
	        this.addParamIfSet(params, 'ct', exports.CategorizationType[query.categorizationType]);
	        return params;
	    };
	    return CategorizeQueryConverter;
	}(BaseQueryConverter));

	/**
	 * These are the triggers that define when and when not to trigger a categorize lookup.
	 */
	var CategorizeTriggers = /** @class */ (function () {
	    /**
	     * Creates a CategorizeTrigger object for you, based on CategorizeTrigger defaults and the overrides provided as a param.
	     *
	     * @param triggers - The triggers defined here will override the default CategorizeTrigger.
	     */
	    function CategorizeTriggers(triggers) {
	        if (triggers === void 0) { triggers = {}; }
	        /**
	         * Triggers when the clientCategoryFilter is changed.
	         */
	        this.clientCategoryFilterChanged = true;
	        /**
	         * Triggers when the clientId property has changed
	         */
	        this.clientIdChanged = true;
	        /**
	         * Triggers when the from date property has changed.
	         */
	        this.dateFromChanged = true;
	        /**
	         * Triggers when the to date property has changed.
	         */
	        this.dateToChanged = true;
	        /**
	         * Triggers when the filter property has changed.
	         */
	        this.filterChanged = true;
	        /**
	         * Turns on or off all query-related triggers.
	         */
	        this.queryChange = true;
	        /**
	         * Delay triggers until changes has not been made to the query for a certain time (milliseconds).
	         * This is to avoid executing searches constantly while the user is typing.
	         * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
	         * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
	         *
	         * Note: Requires queryChanged to be true.
	         * Note: Requires query to be longer than queryMinLength.
	         *
	         * Default for Categorize is to not run delayed lookups and instead only do that for queryChangeInstantRegex matches.
	         * @override BaseTriggers
	         */
	        this.queryChangeDelay = -1;
	        /**
	         * Triggers action immediately instead of delayed when the query matches the regex.
	         *
	         * Note: Requires queryChanged to be true.
	         * Note: Requires query to be longer than queryMinLength.
	         *
	         * Default: Trigger on first ENTER after non-whitespace (i.e. user presses enter at the end of the query-field,
	         * if it is a "multiline"" and accepts the enter").
	         * @override BaseTriggers
	         */
	        this.queryChangeInstantRegex = /\S\n$/;
	        /**
	         * Min length before triggering. For Categorize (and Find) this should be ok with short queries too.
	         * One character followed by an enter (default).
	         *
	         * Note: Requires queryChanged to be true.
	         * @override BaseTriggers
	         */
	        this.queryChangeMinLength = 2;
	        /**
	         * Triggers when the searchType property has changed.
	         */
	        this.searchTypeChanged = true;
	        /**
	         * Triggers when the uiLanguageCode property has changed.
	         * Default: Refetch on change - as the categories normally are translated.
	         */
	        this.uiLanguageCodeChanged = true;
	        Object.assign(this, triggers);
	    }
	    return CategorizeTriggers;
	}());

	/**
	 * These are all the settings that can affect the returned categories for categorize() lookups.
	 */
	var CategorizeSettings = /** @class */ (function (_super) {
	    __extends(CategorizeSettings, _super);
	    /**
	     * Creates an instance of CategorizeSettings, based on CategorizeSettings defaults and the overrides provided as a param.
	     * @param settings - The settings defined here will override the default CategorizeSettings.
	     */
	    function CategorizeSettings(settings) {
	        var _this = _super.call(this, settings) || this;
	        /**
	         * This is the separator-character that is used when comparing the clientCategoryFilters. You need to use this
	         * to join categoryName arrays in the filter section. See [[SearchClient.clientCategoryFilters]].
	         */
	        _this.clientCategoryFiltersSepChar = '_';
	        /**
	         * The trigger-settings for when automatic category result-updates are to be triggered.
	         */
	        _this.triggers = new CategorizeTriggers();
	        /**
	         * The endpoint to do categorize lookups for.
	         */
	        _this.url = 'search/categorize';
	        if (settings) {
	            _this.clientCategoryFiltersSepChar = typeof settings.clientCategoryFiltersSepChar !== 'undefined' ? settings.clientCategoryFiltersSepChar : _this.clientCategoryFiltersSepChar;
	            _this.triggers = typeof settings.triggers !== 'undefined' ? new CategorizeTriggers(settings.triggers) : _this.triggers;
	            _this.url = typeof settings.url !== 'undefined' ? settings.url : _this.url;
	        }
	        // Remove leading and trailing slashes from the url
	        _this.url = _this.url.replace(/(^\/+)|(\/+$)/g, '');
	        return _this;
	    }
	    return CategorizeSettings;
	}(BaseSettings));

	/**
	 * The Categorize service queries the search-engine for which categories that any
	 * search-matches for the same query will contain.
	 *
	 * It is normally used indirectly via the SearchClient class.
	 */
	var Categorize = /** @class */ (function (_super) {
	    __extends(Categorize, _super);
	    /**
	     * Creates a Categorize instance that handles fetching categories dependent on settings and query.
	     * Supports registering a callback in order to receive categories when they have been received.
	     * @param baseUrl - The base url that the categorize is to fetch categories from.
	     * @param settings - The settings that define how the Categorize instance is to operate.
	     * @param auth - An object that handles the authentication.
	     */
	    function Categorize(baseUrl, settings, auth) {
	        var _this = _super.call(this) || this;
	        _this.settings = settings;
	        _this.clientCategoryFilter = {};
	        settings = new CategorizeSettings(settings);
	        auth = auth || new AuthToken();
	        _super.prototype.init.call(_this, baseUrl, new CategorizeSettings(settings), auth);
	        _this.queryConverter = new CategorizeQueryConverter();
	        return _this;
	    }
	    /**
	     * Fetches the search-result categories from the server.
	     * @param query - The query-object that controls which results that are to be returned.
	     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
	     * @returns a promise that when resolved returns a Categories object.
	     */
	    Categorize.prototype.fetch = function (query, suppressCallbacks) {
	        var _this = this;
	        if (query === void 0) { query = new Query(); }
	        if (suppressCallbacks === void 0) { suppressCallbacks = false; }
	        var url = this.queryConverter.getUrl(this.baseUrl, this.settings.url, query);
	        var reqInit = this.requestObject();
	        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
	            return nodePonyfill(url, reqInit)
	                .then(function (response) {
	                if (!response.ok) {
	                    throw Error(response.status + " " + response.statusText + " for request url '" + url + "'");
	                }
	                return response.json();
	            })
	                .then(function (categories) {
	                _this.categories = categories;
	                _this.filterCategories(categories);
	                _this.cbSuccess(suppressCallbacks, categories, url, reqInit);
	                return categories;
	            })
	                .catch(function (error) {
	                _this.cbError(suppressCallbacks, error, url, reqInit);
	                return Promise.reject(error);
	            });
	        }
	        else {
	            // TODO: When a fetch is stopped due to cbRequest returning false, should we:
	            // 1) Reject the promise (will then be returned as an error).
	            // or
	            // 2) Resolve the promise (will then be returned as a success).
	            // or
	            // 3) should we do something else (old code returned undefined...)
	            return Promise.resolve(null);
	        }
	    };
	    Categorize.prototype.clientCategoryFiltersChanged = function (oldValue, value) {
	        this.clientCategoryFilter = value;
	        if (this.settings.cbSuccess && this.settings.triggers.clientCategoryFilterChanged) {
	            this.cbSuccess(false, this.filterCategories(this.categories), null, null);
	        }
	    };
	    Categorize.prototype.clientIdChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.clientIdChanged) {
	            this.update(query);
	        }
	    };
	    Categorize.prototype.dateFromChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.dateFromChanged) {
	            this.update(query);
	        }
	    };
	    Categorize.prototype.dateToChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.dateToChanged) {
	            this.update(query);
	        }
	    };
	    Categorize.prototype.filtersChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.filterChanged) {
	            this.update(query);
	        }
	    };
	    Categorize.prototype.queryTextChanged = function (oldValue, query) {
	        var _this = this;
	        if (this.settings.cbSuccess && this.settings.triggers.queryChange) {
	            if (query.queryText.length > this.settings.triggers.queryChangeMinLength) {
	                if (this.settings.triggers.queryChangeInstantRegex && this.settings.triggers.queryChangeInstantRegex.test(query.queryText)) {
	                    this.update(query);
	                }
	                else {
	                    if (this.settings.triggers.queryChangeDelay > -1) {
	                        // If a delay is already pending then clear it and restart the delay
	                        clearTimeout(this.delay);
	                        // Set up the delay
	                        this.delay = setTimeout(function () {
	                            _this.update(query);
	                        }, this.settings.triggers.queryChangeDelay);
	                    }
	                }
	            }
	        }
	    };
	    Categorize.prototype.searchTypeChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.searchTypeChanged) {
	            this.update(query);
	        }
	    };
	    Categorize.prototype.uiLanguagecodeChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.uiLanguageCodeChanged) {
	            this.update(query);
	        }
	    };
	    /**
	     * Creates a Filter object based on the input id (string [] or Category).
	     *
	     * NB! This method does NOT apply the filter in the filters colleciton.
	     * It is used behind the scenes by the filter* methods in SearchClient.
	     * To apply a filter you need to use the filter* properties/methods in
	     * SearchClient.
	     *
	     * If the category doesn't exist then the filter
	     * will not be created.
	     *
	     * If passing in a string[] then the value is expected to match the categoryName
	     * property of a listed category.
	     *
	     * @param categoryName A string array or a Category that denotes the category to create a filter for.
	     */
	    Categorize.prototype.createCategoryFilter = function (categoryName) {
	        var catName = Array.isArray(categoryName) ? categoryName : categoryName.categoryName;
	        var result = [];
	        var path = catName.slice(0);
	        var groupId = path.splice(0, 1)[0].toLowerCase();
	        if (!this.categories || !this.categories.groups || this.categories.groups.length === 0) {
	            return null;
	        }
	        var group = this.categories.groups.find(function (g) { return g.name.toLowerCase() === groupId; });
	        if (!group) {
	            return null;
	        }
	        result.push(group.displayName);
	        if (group.categories.length > 0) {
	            var _a = this.getCategoryPathDisplayNameFromCategories(path, group.categories), displayName = _a.displayName, ref = _a.ref;
	            if (displayName && displayName.length > 0) {
	                result = result.concat(displayName);
	                return new Filter(result, ref);
	            }
	        }
	        return null;
	    };
	    Categorize.prototype.getCategoryPathDisplayNameFromCategories = function (categoryName, categories) {
	        var result = [];
	        var path = categoryName.slice(0);
	        var catId = path.splice(0, 1)[0].toLowerCase();
	        var category = categories.find(function (c) { return c.name.toLowerCase() === catId; });
	        if (!category) {
	            return null;
	        }
	        result.push(category.displayName);
	        var res;
	        if (category.children.length > 0 && path.length > 0) {
	            res = this.getCategoryPathDisplayNameFromCategories(path, category.children);
	            if (res.displayName && res.displayName.length > 0) {
	                result = result.concat(res.displayName);
	            }
	        }
	        return { displayName: result, ref: (res ? res.ref : category) };
	    };
	    Categorize.prototype.filterCategories = function (categories) {
	        var _this = this;
	        if (!this.clientCategoryFilter || Object.getOwnPropertyNames(this.clientCategoryFilter).length === 0) {
	            return categories;
	        }
	        var cats = __assign({}, categories);
	        var groups = cats.groups.map(function (inGroup) {
	            var group = __assign({}, inGroup);
	            if (group.categories && group.categories.length > 0) {
	                group.categories = _this.mapCategories(group.categories);
	            }
	            group.expanded = group.expanded || group.categories.some(function (c) { return c.expanded === true; });
	            return group;
	        });
	        cats.groups = groups.filter(function (g) { return g !== undefined; });
	        return cats;
	    };
	    Categorize.prototype.mapCategories = function (categories) {
	        var _this = this;
	        var cats = categories.slice();
	        cats = cats.map(function (inCategory) {
	            var category = __assign({}, inCategory);
	            var result = _this.inClientCategoryFilters(__assign({}, category));
	            if (result !== false) {
	                if (result) {
	                    if (category.children && category.children.length > 0) {
	                        category.children = _this.mapCategories(category.children);
	                    }
	                    category.expanded = true;
	                }
	                category.expanded = category.expanded || category.children.some(function (c) { return c.expanded === true; });
	                return category;
	            }
	        });
	        cats = cats.filter(function (c) { return c !== undefined; });
	        return cats;
	    };
	    Categorize.prototype.inClientCategoryFilters = function (category) {
	        if (!this.clientCategoryFilter) {
	            return null;
	        }
	        for (var prop in this.clientCategoryFilter) {
	            if (this.clientCategoryFilter.hasOwnProperty(prop)) {
	                var filterKey = prop.toLowerCase();
	                var cat = category.categoryName.slice(0, -1);
	                var categoryKey = cat.join(this.settings.clientCategoryFiltersSepChar).toLowerCase();
	                if (filterKey === categoryKey) {
	                    var displayExpression = this.clientCategoryFilter[prop];
	                    if (!displayExpression) {
	                        continue;
	                    }
	                    var regex = new RegExp(displayExpression, 'i');
	                    var result = regex.test(category.displayName);
	                    return result;
	                }
	                else {
	                    continue;
	                }
	            }
	        }
	        return null;
	    };
	    return Categorize;
	}(BaseCall));

	/**
	 * Class to handle creating categorize lookups for restservice version 3.
	 */
	var FindQueryConverter = /** @class */ (function (_super) {
	    __extends(FindQueryConverter, _super);
	    function FindQueryConverter() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    /**
	     * Converts the query params to an array of key=value segments,
	     * fit for Find REST v4.
	     */
	    FindQueryConverter.prototype.getUrlParams = function (query) {
	        var params = [];
	        this.addParamIfSet(params, 'c', query.clientId);
	        this.addParamIfSet(params, 'df', this.createDate(query.dateFrom));
	        this.addParamIfSet(params, 'dt', this.createDate(query.dateTo));
	        var filters = query.filters.map(function (f) { return f.category.categoryName.join('|'); });
	        this.addParamIfSet(params, 'f', filters.join(';'));
	        this.addParamIfSet(params, 'q', query.queryText);
	        this.addParamIfSet(params, 't', exports.SearchType[query.searchType]);
	        this.addParamIfSet(params, 'l', query.uiLanguageCode);
	        this.addParamIfSet(params, 'g', query.matchGrouping);
	        this.addParamIfSet(params, 'o', exports.OrderBy[query.matchOrderBy]);
	        this.addParamIfSet(params, 'p', query.matchPage);
	        this.addParamIfSet(params, 's', query.matchPageSize);
	        this.addParamIfSet(params, 'gc', query.matchGenerateContent);
	        this.addParamIfSet(params, 'gch', query.matchGenerateContentHighlights);
	        return params;
	    };
	    return FindQueryConverter;
	}(BaseQueryConverter));

	/**
	 * These are the triggers that define when and when not to trigger a find lookup.
	 */
	var FindTriggers = /** @class */ (function () {
	    /**
	     * Creates a FindTrigger object for you, based on FindTrigger defaults and the overrides provided as a param.
	     * @param triggers - The trigger defined here will override the default FindTrigger.
	     */
	    function FindTriggers(triggers) {
	        if (triggers === void 0) { triggers = {}; }
	        /**
	         * Triggers when the clientCategoryFilter is changed.
	         */
	        this.clientCategoryFilterChanged = true;
	        /**
	         * Triggers when the clientId property has changed
	         */
	        this.clientIdChanged = true;
	        /**
	         * Triggers when the from date property has changed.
	         */
	        this.dateFromChanged = true;
	        /**
	         * Triggers when the to date property has changed.
	         */
	        this.dateToChanged = true;
	        /**
	         * Triggers when the filter property has changed.
	         */
	        this.filterChanged = true;
	        /**
	         * Triggers when the generateContent property has changed.
	         *
	         * Note: Only available for v4+.
	         */
	        this.matchGenerateContentChanged = true;
	        /**
	         * Triggers when the generateContentHighlights property has changed.
	         *
	         * Note: Only available for v4+.
	         */
	        this.matchGenerateContentHighlightsChanged = true;
	        /**
	         * Triggers when the useGrouping property has changed.
	         */
	        this.matchGroupingChanged = true;
	        /**
	         * Triggers when the orderBy property has changed.
	         */
	        this.matchOrderByChanged = true;
	        /**
	         * Triggers when the page property has changed.
	         */
	        this.matchPageChanged = true;
	        /**
	         * Triggers when the pageSize property has changed.
	         */
	        this.matchPageSizeChanged = true;
	        /**
	         * Turns on or off all query-related triggers.
	         */
	        this.queryChange = true;
	        /**
	         * Delay triggers until changes has not been made to the query for a certain time (milliseconds).
	         * This is to avoid executing searches constantly while the user is typing.
	         * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
	         * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
	         *
	         * Note: Requires queryChanged to be true.
	         * Note: Requires query to be longer than queryMinLength.
	         *
	         * Default for Categorize is to not run delayed lookups and instead only do that for queryChangeInstantRegex matches.
	         * @override BaseTriggers
	         */
	        this.queryChangeDelay = -1;
	        /**
	         * Triggers action immediately instead of delayed when the query matches the regex.
	         *
	         * Note: Requires queryChanged to be true.
	         * Note: Requires query to be longer than queryMinLength.
	         *
	         * Default: Trigger on first ENTER after non-whitespace (i.e. user presses enter at the end of the query-field,
	         * if it is a "multiline"" and accepts the enter").
	         * @override BaseTriggers
	         */
	        this.queryChangeInstantRegex = /\S\n$/;
	        /**
	         * Min length before triggering. For Categorize (and Find) this should be ok with short queries too.
	         * One character followed by an enter (default).
	         *
	         * Note: Requires queryChanged to be true.
	         */
	        this.queryChangeMinLength = 2;
	        /**
	         * Triggers when the searchType property has changed.
	         */
	        this.searchTypeChanged = true;
	        /**
	         * Triggers when the uiLanguageCode property has changed.
	         * Note: Overrides the default set in CategorizeTriggers.
	         * Default: Do not refetch on change - as there are no language-dependent data in the find-response.
	         */
	        this.uiLanguageCodeChanged = false;
	        Object.assign(this, triggers);
	    }
	    return FindTriggers;
	}());

	/**
	 * These are all the settings that can affect the returned categories for Find() lookups.
	 */
	var FindSettings = /** @class */ (function (_super) {
	    __extends(FindSettings, _super);
	    /**
	     * Creates a FindSettings object for you, based on FindSettings defaults and the overrides provided as a param.
	     * @param settings - The settings defined here will override the default FindSettings.
	     */
	    function FindSettings(settings) {
	        var _this = _super.call(this, settings) || this;
	        /**
	         * The trigger-settings for when automatic match result-updates are to be triggered.
	         */
	        _this.triggers = new FindTriggers();
	        /**
	         * The endpoint to do Find lookups for.
	         */
	        _this.url = '/search/find';
	        if (settings) {
	            _this.triggers = typeof settings.triggers !== 'undefined' ? new FindTriggers(settings.triggers) : _this.triggers;
	            _this.url = typeof settings.url !== 'undefined' ? settings.url : _this.url;
	        }
	        // Remove leading and trailing slashes from the url
	        _this.url = _this.url.replace(/(^\/+)|(\/+$)/g, '');
	        return _this;
	    }
	    return FindSettings;
	}(BaseSettings));

	/**
	 * The Find service queries the search-engine for search-matches for the given query.
	 *
	 * It is normally used indirectly via the SearchClient class.
	 */
	var Find = /** @class */ (function (_super) {
	    __extends(Find, _super);
	    /**
	     * Creates a Find instance that handles fetching matches dependent on settings and query.
	     * @param baseUrl - The base url that the find call is to use.
	     * @param settings - The settings that define how the Find instance is to operate.
	     * @param auth - An auth-object that handles the authentication.
	     */
	    function Find(baseUrl, settings, auth) {
	        var _this = _super.call(this) || this;
	        _this.settings = settings;
	        settings = new FindSettings(settings);
	        auth = auth || new AuthToken();
	        _super.prototype.init.call(_this, baseUrl, settings, auth);
	        _this.queryConverter = new FindQueryConverter();
	        return _this;
	    }
	    /**
	     * Fetches the search-result matches from the server.
	     * Note that if a request callback has been setup then if it returns false the request is skipped.
	     * @param query - The query-object that controls which results that are to be returned.
	     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
	     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
	     */
	    Find.prototype.fetch = function (query, suppressCallbacks) {
	        var _this = this;
	        if (query === void 0) { query = new Query(); }
	        if (suppressCallbacks === void 0) { suppressCallbacks = false; }
	        var url = this.queryConverter.getUrl(this.baseUrl, this.settings.url, query);
	        var reqInit = this.requestObject();
	        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
	            return nodePonyfill(url, reqInit)
	                .then(function (response) {
	                if (!response.ok) {
	                    throw Error(response.status + " " + response.statusText + " for request url '" + url + "'");
	                }
	                return response.json();
	            })
	                .then(function (matches) {
	                _this.cbSuccess(suppressCallbacks, matches, url, reqInit);
	                return matches;
	            })
	                .catch(function (error) {
	                _this.cbError(suppressCallbacks, error, url, reqInit);
	                return Promise.reject(error);
	            });
	        }
	        else {
	            // TODO: When a fetch is stopped due to cbRequest returning false, should we:
	            // 1) Reject the promise (will then be returned as an error).
	            // or
	            // 2) Resolve the promise (will then be returned as a success).
	            // or
	            // 3) should we do something else (old code returned undefined...)
	            return Promise.resolve(null);
	        }
	    };
	    Find.prototype.clientIdChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.clientIdChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.dateFromChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.dateFromChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.dateToChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.dateToChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.filtersChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.filterChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.matchGenerateContentChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.matchGenerateContentChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.matchGenerateContentHighlightsChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.matchGenerateContentChanged && this.settings.triggers.matchGenerateContentHighlightsChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.matchGroupingChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.matchGroupingChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.matchOrderByChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.matchOrderByChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.matchPageChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.matchPageChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.matchPageSizeChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.matchPageSizeChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.queryTextChanged = function (oldValue, query) {
	        var _this = this;
	        if (this.settings.cbSuccess && this.settings.triggers.queryChange) {
	            if (query.queryText.length > this.settings.triggers.queryChangeMinLength) {
	                if (this.settings.triggers.queryChangeInstantRegex && this.settings.triggers.queryChangeInstantRegex.test(query.queryText)) {
	                    this.update(query);
	                }
	                else {
	                    if (this.settings.triggers.queryChangeDelay > -1) {
	                        // If a delay is already pending then clear it and restart the delay
	                        clearTimeout(this.delay);
	                        // Set up the delay
	                        this.delay = setTimeout(function () {
	                            _this.update(query);
	                        }, this.settings.triggers.queryChangeDelay);
	                    }
	                }
	            }
	        }
	    };
	    Find.prototype.searchTypeChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.searchTypeChanged) {
	            this.update(query);
	        }
	    };
	    Find.prototype.uiLanguagecodeChanged = function (oldValue, query) {
	        if (this.settings.cbSuccess && this.settings.triggers.uiLanguageCodeChanged) {
	            this.update(query);
	        }
	    };
	    return Find;
	}(BaseCall));

	/**
	 * Settings as used by the SearchClient.
	 *
	 * Please see the data-type description for each property in question.
	 */
	var Settings = /** @class */ (function () {
	    /**
	     * Creates a Settings object for you, based on Settings defaults and the overrides provided as a param.
	     * @param settings - The settings defined here will override the default Settings.
	     */
	    function Settings(settings) {
	        /**
	         * The JWT authentication token to use.
	         */
	        this.authentication = new AuthenticationSettings();
	        /**
	         * Settings for autocomplete().
	         */
	        this.autocomplete = new AutocompleteSettings();
	        /**
	         * Settings for categorize().
	         */
	        this.categorize = new CategorizeSettings();
	        /**
	         * Settings for find().
	         */
	        this.find = new FindSettings();
	        /**
	         * You can use this path to override the path to the rest-service.
	         * If not set, it will default to "RestService/v4".
	         */
	        this.path = 'RestService/v4';
	        /**
	         * Settings for the common query (autocomplete/find/categorize)
	         */
	        this.query = new Query();
	        if (settings) {
	            var defaultVersionPath = { path: settings.path };
	            settings.authentication = new AuthenticationSettings(settings.authentication || defaultVersionPath);
	            settings.autocomplete = new AutocompleteSettings(settings.autocomplete || defaultVersionPath);
	            settings.categorize = new CategorizeSettings(settings.categorize || defaultVersionPath);
	            settings.find = new FindSettings(settings.find || defaultVersionPath);
	            settings.query = new Query(settings.query);
	        }
	        Object.assign(this, settings);
	    }
	    return Settings;
	}());

	/**
	 * This is the "main class" of this package. Please read the <a href="https://intellisearch.github.io/search-client/">getting-started section</a>"
	 * for a proper introduction.
	 *
	 * The SearchClient manages a range of other services:
	 *   * Authentication,
	 *   * Autocomplete,
	 *   * Categorize
	 *   * Find
	 *
	 * Each of the above services can be used independently, but it is highly recommended to use the SearchClient instead.
	 *
	 * The SearchClient allows you to have an advanced search with minimal effort in regards to setup and logics. instead
	 * of having to write all the logics yourself the SearchClient exposes the following methods for managing your search:
	 *   1. Configure callbacks in your settings-object that you pass to the SearchClient.
	 *   2. Configure triggers to define when to do server-lookups and not (if you need to deviate from the defaults)
	 *   3. Set query-values real-time (queryText, filters, date-ranges, etc.)
	 *   4. Receive autocomplete-suggestions, matches and categories in your callback handlers when the data is available.
	 *
	 * What happens is that any query-changes that arrive are checked in regards to trigger-settings. If they are to trigger
	 * and a callback has been set up then the server is requested and when the data is received it is sent to the callback
	 * registered in the settings-object.
	 */
	var SearchClient = /** @class */ (function () {
	    /**
	     *
	     * @param baseUrl The baseUrl for the IntelliSearch SearchService rest-service, typically http://server:9950/
	     * @param settings A settings object that indicates how the search-client instance is to behave.
	     */
	    function SearchClient(baseUrl, settings) {
	        if (settings === void 0) { settings = new Settings(); }
	        this.settings = settings;
	        /**
	         * Holds a reference to the setup Authentication service.
	         */
	        this.authentication = undefined;
	        /**
	         * Holds a reference to the currently set authentication token.
	         */
	        this.authenticationToken = undefined;
	        /**
	         * Holds a reference to the setup Autocomplete service.
	         */
	        this.autocomplete = undefined;
	        /**
	         * Holds a reference to the setup Categorize service.
	         */
	        this.categorize = undefined;
	        /**
	         * Holds a reference to the setup Find service.
	         */
	        this.find = undefined;
	        // tslint:disable-next-line:variable-name
	        this._clientCategoryFilters = {};
	        settings = new Settings(settings);
	        if (this.settings.authentication.enabled) {
	            this.authentication = new Authentication(baseUrl, this.settings.authentication, this);
	        }
	        if (this.settings.autocomplete.enabled) {
	            this.autocomplete = new Autocomplete(baseUrl, this.settings.autocomplete, this);
	        }
	        if (this.settings.categorize.enabled) {
	            this.categorize = new Categorize(baseUrl, this.settings.categorize, this);
	        }
	        if (this.settings.find.enabled) {
	            this.find = new Find(baseUrl, this.settings.find, this);
	        }
	        this._query = this.settings.query;
	    }
	    /**
	     * This method is typically called when the user clicks the search-button in the UI.
	     * For query-fields that accepts enter the default queryChangeInstantRegex catches enter (for find and categorize).
	     * When they don't take enter you will have to set up something that either catches the default enter or a user clicks
	     * on a "Search"-button or similar. You can choose to use the already current query, or you can pass it in. If you
	     * include the query then the internal updates are suppressed while changing the query-properties, to make sure that
	     * only one update per service is made (if any of their trigger-checks returned true).
	     *
	     * When called it will unconditionally call the fetch() method of both Categorize and Find.
	     *
	     * Note: The Autocomplete fetch() method is not called, as it is deemed very unexpected to want to list autocomplete
	     * suggestions when the Search-button is clicked.
	     */
	    SearchClient.prototype.findAndCategorize = function (query) {
	        if (query) {
	            this.deferUpdates(true);
	            this.query = query;
	            this.deferUpdates(false, true); // Skip any pending requests
	        }
	        this.categorize.fetch(this._query)
	            .catch(function () {
	            // Ignore the error?
	        });
	        this.find.fetch(this._query)
	            .catch(function () {
	            // Ignore the error?
	        });
	    };
	    Object.defineProperty(SearchClient.prototype, "clientCategoryFilters", {
	        /**
	         * Gets the currently registered regex-filters.
	         */
	        get: function () {
	            return this._clientCategoryFilters;
	        },
	        /**
	         * This is a handy helper to help the user navigating the category-tree. It is typically used when a given node
	         * has a lot of categories. This often happens with i.e. the Author category node. With this feature you can
	         * present the user with a filter-edit-box in the Author node, and allow them to start typing values which will
	         * then filter the category-nodes' displayName to only match the text entered.
	         *
	         * Nodes that doesn't have any filters are returned, even if filters for other nodes are defined.
	         *
	         * Also note that the filter automatically sets the expanded property for affected nodes, to help allow them to
	         * automatically be shown, with their immediate children.
	         *
	         * The actual value is an associative array that indicates which category-nodes to filter and what pattern to filter
	         * that node with.
	         *
	         * It will not execute any server-side calls, but may run triggers leading to new content returned in callbacks.
	         *
	         * **Note 1:** This is only used when:
	         *
	         * **1. The categorize service is enabled in the [[SearchClient]] constructor (may be disabled via the [[Settings]]
	         * object).**
	         * **2. You have enabled a [[CategorizeSettings.cbSuccess]] callback.**
	         * **3. You have not disabled the [[CategorizeTriggers.clientCategoryFilterChanged]] trigger.**
	         *
	         * **Note 2:** [[deferUpdates]] will not have any effect on this functionality. Deferring only affects calls to the
	         * server and does not stop categorize-callbacks from being run - as long as they are the result of changing the
	         * [[clientCategoryFilter]].
	         *
	         * @example How to set the clientCategoryFilter:
	         *
	         *     const searchClient = new SearchClient("http://server:9950/");
	         *
	         *     searchClient.clientCategoryFilters = {
	         *         // Show only Author-nodes with DisplayName that matches /john/.
	         *         Author: /john/,
	         *         // Show only nodes in the System/File/Server node that matches /project/
	         *         System_File_Server: /project/,
	         *     }
	         *
	         * As you can see from the example the key is composed by joining the categoryName with an underscore. If you
	         * experience problems with this (i.e. your categories have `_` in their names already) then change the
	         * [[CategorizeSettings.clientCategoryFiltersSepChar]], for example to `|`. Note that if you do, then you probably
	         * also need to quote the keys that have the pipe-character.
	         *
	         * @example The above example will with [[CategorizeSettings.clientCategoryFiltersSepChar]] set to `|` become:
	         *
	         *     const searchClient = new SearchClient("http://server:9950/");
	         *
	         *     searchClient.clientCategoryFilters = {
	         *         // Show only Author-nodes with DisplayName that matches /john/.
	         *         Author: /john/,
	         *         // Show only nodes in the System/File/Server node that matches /project/
	         *         "System|File|Server": /project/,
	         *     }
	         *
	         */
	        set: function (clientCategoryFilters) {
	            if (clientCategoryFilters !== this._clientCategoryFilters) {
	                var oldValue = this._clientCategoryFilters;
	                this._clientCategoryFilters = clientCategoryFilters;
	                this.autocomplete.clientCategoryFiltersChanged(oldValue, this._clientCategoryFilters);
	                this.categorize.clientCategoryFiltersChanged(oldValue, this._clientCategoryFilters);
	                this.find.clientCategoryFiltersChanged(oldValue, this._clientCategoryFilters);
	            }
	            this._clientCategoryFilters = clientCategoryFilters;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "clientId", {
	        /**
	         * Gets the currently active client-id value.
	         */
	        get: function () {
	            return this._query.clientId;
	        },
	        /**
	         * Sets the currently active client-id.
	         *
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (clientId) {
	            if (clientId !== this._query.clientId) {
	                var oldValue = this._query.clientId;
	                this._query.clientId = clientId;
	                this.autocomplete.clientIdChanged(oldValue, this._query);
	                this.categorize.clientIdChanged(oldValue, this._query);
	                this.find.clientIdChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "dateFrom", {
	        /**
	         * Gets the currently active date-from value.
	         */
	        get: function () {
	            return this._query.dateFrom;
	        },
	        /**
	         * Sets the from-date for matches to be used.
	         *
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (dateFrom) {
	            if (!deepEqual_1(dateFrom, this._query.dateFrom)) {
	                var oldValue = Object.assign({}, this._query.dateFrom); // clone
	                this._query.dateFrom = dateFrom;
	                this.autocomplete.dateFromChanged(oldValue, this._query);
	                this.categorize.dateFromChanged(oldValue, this._query);
	                this.find.dateFromChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "dateTo", {
	        /**
	         * Gets the currently active date-to value.
	         */
	        get: function () {
	            return this._query.dateTo;
	        },
	        /**
	         * Sets the to-date for matches to be used.
	         *
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (dateTo) {
	            if (!deepEqual_1(dateTo, this._query.dateTo)) {
	                var oldValue = Object.assign({}, this._query.dateTo); // clone
	                this._query.dateTo = dateTo;
	                this.autocomplete.dateToChanged(oldValue, this._query);
	                this.categorize.dateToChanged(oldValue, this._query);
	                this.find.dateToChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "filters", {
	        /**
	         * Gets the currently active filters.
	         */
	        get: function () {
	            return this._query.filters;
	        },
	        /**
	         * Sets the filters to be used.
	         *
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (filters) {
	            filters = filters || [];
	            var sortedFilters = filters.sort();
	            if (sortedFilters.join('') !== this._query.filters.join('')) {
	                var oldValue = this._query.filters.slice(0); // clone
	                this._query.filters = sortedFilters;
	                this.autocomplete.filtersChanged(oldValue, this._query);
	                this.categorize.filtersChanged(oldValue, this._query);
	                this.find.filtersChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Add the given filter, if it isn't already there.
	     *
	     * Will run trigger-checks and potentially update services.
	     */
	    SearchClient.prototype.filterAdd = function (filter) {
	        var item = this.filterId(filter);
	        var foundIndex = this.filterIndex(item);
	        if (foundIndex === -1) {
	            this.doFilterAdd(item);
	            return true;
	        }
	        // Filter already set
	        return false;
	    };
	    /**
	     * Remove the given filter, if it is already set.
	     *
	     * Will run trigger-checks and potentially update services.
	     */
	    SearchClient.prototype.filterRemove = function (filter) {
	        var item = this.filterId(filter);
	        var foundIndex = this.filterIndex(item);
	        if (foundIndex > -1) {
	            this.doFilterRemove(foundIndex);
	            return true;
	        }
	        // Filter already set
	        return false;
	    };
	    /**
	     * Toggle the given filter.
	     *
	     * Will run trigger-checks and potentially update services.
	     *
	     * @param filter Is either string[], Filter or Category. When string array it expects the equivalent of the Category.categoryName property, which is like this: ["Author", "Normann"].
	     * @return true if the filter was added, false if it was removed.
	     */
	    SearchClient.prototype.filterToggle = function (filter) {
	        var item = this.filterId(filter);
	        var foundIndex = this.filterIndex(item);
	        if (foundIndex > -1) {
	            this.doFilterRemove(foundIndex);
	            return false;
	        }
	        else {
	            this.doFilterAdd(item);
	            return true;
	        }
	    };
	    Object.defineProperty(SearchClient.prototype, "matchGenerateContent", {
	        /**
	         * Gets the currently active match generateContent setting.
	         */
	        get: function () {
	            return this._query.matchGenerateContent;
	        },
	        /**
	         * Sets whether the results should generate the content or not.
	         *
	         * **Note:** Requires the backend IndexManager to have the option enabled in it's configuration too.
	         *
	         * Will run trigger-checks and potentially update services.
	         *
	         * Note: Only effective for v4+.
	         */
	        set: function (generateContent) {
	            if (generateContent !== this._query.matchGenerateContent) {
	                var oldValue = this._query.matchGenerateContent;
	                this._query.matchGenerateContent = generateContent;
	                this.autocomplete.matchGenerateContentChanged(oldValue, this._query);
	                this.categorize.matchGenerateContentChanged(oldValue, this._query);
	                this.find.matchGenerateContentChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "matchGenerateContentHighlights", {
	        /**
	         * Gets the currently active match generateContentHighlights setting.
	         */
	        get: function () {
	            return this._query.matchGenerateContent;
	        },
	        /**
	         * Sets whether the results should generate the content-highlight tags or not.
	         *
	         * **Note:** See the matchGenerateContent property in regards to IndexManager requirements.
	         *
	         * Will run trigger-checks and potentially update services.
	         *
	         * Note: Only effective for v4+.
	         */
	        set: function (generateContentHighlights) {
	            if (generateContentHighlights !== this._query.matchGenerateContentHighlights) {
	                var oldValue = this._query.matchGenerateContentHighlights;
	                this._query.matchGenerateContentHighlights = generateContentHighlights;
	                this.autocomplete.matchGenerateContentHighlightsChanged(oldValue, this._query);
	                this.categorize.matchGenerateContentHighlightsChanged(oldValue, this._query);
	                this.find.matchGenerateContentHighlightsChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "matchGrouping", {
	        /**
	         * Gets the currently active match grouping mode.
	         */
	        get: function () {
	            return this._query.matchGrouping;
	        },
	        /**
	         * Sets whether the results should be grouped or not.
	         *
	         * **Note:** Requires the search-service to have the option enabled in it's configuration too.
	         *
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (useGrouping) {
	            if (useGrouping !== this._query.matchGrouping) {
	                var oldValue = this._query.matchGrouping;
	                this._query.matchGrouping = useGrouping;
	                this.autocomplete.matchGroupingChanged(oldValue, this._query);
	                this.categorize.matchGroupingChanged(oldValue, this._query);
	                this.find.matchGroupingChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "matchPage", {
	        /**
	         * Gets the currently active match-page.
	         */
	        get: function () {
	            return this._query.matchPage;
	        },
	        /**
	         * Sets the match-page to get.
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (page) {
	            if (page < 1) {
	                throw new Error('"matchPage" cannot be set to a value smaller than 1.');
	            }
	            if (page !== this._query.matchPage) {
	                var oldValue = this._query.matchPage;
	                this._query.matchPage = page;
	                this.autocomplete.matchPageChanged(oldValue, this._query);
	                this.categorize.matchPageChanged(oldValue, this._query);
	                this.find.matchPageChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Gets the previous page of match-results.
	     * Will run trigger-checks and potentially update services.
	     */
	    SearchClient.prototype.matchPagePrev = function () {
	        if (this._query.matchPage > 1) {
	            var oldValue = this._query.matchPage;
	            this._query.matchPage--;
	            this.autocomplete.matchPageChanged(oldValue, this._query);
	            this.categorize.matchPageChanged(oldValue, this._query);
	            this.find.matchPageChanged(oldValue, this._query);
	            return true;
	        }
	        // Cannot fetch page less than 0
	        return false;
	    };
	    /**
	     * Gets the next page of match-results (if any).
	     * Will run trigger-checks and potentially update services.
	     */
	    SearchClient.prototype.matchPageNext = function () {
	        var oldValue = this._query.matchPage;
	        this._query.matchPage++;
	        this.autocomplete.matchPageChanged(oldValue, this._query);
	        this.categorize.matchPageChanged(oldValue, this._query);
	        this.find.matchPageChanged(oldValue, this._query);
	        return true;
	    };
	    Object.defineProperty(SearchClient.prototype, "matchPageSize", {
	        /**
	         * Gets the currently active match page-size.
	         */
	        get: function () {
	            return this._query.matchPageSize;
	        },
	        /**
	         * Sets the match page-size to be used.
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (pageSize) {
	            if (pageSize < 1) {
	                throw new Error('"matchPageSize" cannot be set to a value smaller than 1.');
	            }
	            if (pageSize !== this._query.matchPageSize) {
	                var oldValue = this._query.matchPageSize;
	                this._query.matchPageSize = pageSize;
	                this.autocomplete.matchPageSizeChanged(oldValue, this._query);
	                this.categorize.matchPageSizeChanged(oldValue, this._query);
	                this.find.matchPageSizeChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "matchOrderBy", {
	        /**
	         * Gets the currently active match order.
	         */
	        get: function () {
	            return this._query.matchOrderBy;
	        },
	        /**
	         * Sets the match sorting mode to be used.
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (orderBy) {
	            if (orderBy !== this._query.matchOrderBy) {
	                var oldValue = this._query.matchOrderBy;
	                this._query.matchOrderBy = orderBy;
	                this.autocomplete.matchOrderByChanged(oldValue, this._query);
	                this.categorize.matchOrderByChanged(oldValue, this._query);
	                this.find.matchOrderByChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "maxSuggestions", {
	        /**
	         * Gets the currently active max number of autocomplete suggestions to get.
	         */
	        get: function () {
	            return this._query.maxSuggestions;
	        },
	        /**
	         * Sets the max number of autocomplete suggestions to get.
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (maxSuggestions) {
	            if (maxSuggestions < 0) {
	                maxSuggestions = 0;
	            }
	            if (maxSuggestions !== this._query.maxSuggestions) {
	                var oldValue = this._query.maxSuggestions;
	                this._query.maxSuggestions = maxSuggestions;
	                this.autocomplete.maxSuggestionsChanged(oldValue, this._query);
	                this.categorize.maxSuggestionsChanged(oldValue, this._query);
	                this.find.maxSuggestionsChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "query", {
	        /**
	         * Returns the currently active query.
	         */
	        get: function () {
	            return this._query;
	        },
	        /**
	         * Sets the query to use.
	         *
	         * **Note:** Changing the `query` property will likely lead to multiple trigger-checks and potential updates.
	         * This is because changing the whole value will lead to each of the query-objects' properties to trigger individual
	         * events.
	         *
	         * To avoid multiple updates, call `deferUpdates(true)` before and deferUpdates(false) afterwards. Then at max
	         * only one update will be generated.
	         */
	        set: function (query) {
	            this.clientId = query.clientId;
	            this.dateFrom = query.dateFrom;
	            this.dateTo = query.dateTo;
	            this.filters = query.filters;
	            this.matchGrouping = query.matchGrouping;
	            this.matchOrderBy = query.matchOrderBy;
	            this.matchPage = query.matchPage;
	            this.matchPageSize = query.matchPageSize;
	            this.maxSuggestions = query.maxSuggestions;
	            this.queryText = query.queryText;
	            this.searchType = query.searchType;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "queryText", {
	        /**
	         * Gets the currently active query-object.
	         */
	        get: function () {
	            return this._query.queryText;
	        },
	        /**
	         * Sets the query-text to be used.
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (queryText) {
	            if (queryText !== this._query.queryText) {
	                var oldValue = this._query.queryText;
	                this._query.queryText = queryText;
	                this.autocomplete.queryTextChanged(oldValue, this._query);
	                this.categorize.queryTextChanged(oldValue, this._query);
	                this.find.queryTextChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "searchType", {
	        /**
	         * Gets the currently active search-type value.
	         */
	        get: function () {
	            return this._query.searchType;
	        },
	        /**
	         * Sets the search-type to be used.
	         * Will run trigger-checks and potentially update services.
	         */
	        set: function (searchType) {
	            if (searchType !== this._query.searchType) {
	                var oldValue = this._query.searchType;
	                this._query.searchType = searchType;
	                this.autocomplete.searchTypeChanged(oldValue, this._query);
	                this.categorize.searchTypeChanged(oldValue, this._query);
	                this.find.searchTypeChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SearchClient.prototype, "uiLanguageCode", {
	        /**
	         * Gets the currently active match generateContent setting.
	         */
	        get: function () {
	            return this._query.uiLanguageCode;
	        },
	        /**
	         * Sets the language that the client uses. Affects category-names (and in the future maybe metadata too).
	         * The expected values should be according to the https://www.wikiwand.com/en/IETF_language_tag standard.
	         *
	         * Changes will run trigger-checks and potentially update services.
	         *
	         * Note: Only effective for v4+.
	         */
	        set: function (uiLanguageCode) {
	            if (uiLanguageCode !== this._query.uiLanguageCode) {
	                var oldValue = this._query.uiLanguageCode;
	                this._query.uiLanguageCode = uiLanguageCode;
	                this.autocomplete.uiLanguageCodeChanged(oldValue, this._query);
	                this.categorize.uiLanguageCodeChanged(oldValue, this._query);
	                this.find.uiLanguageCodeChanged(oldValue, this._query);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Decides whether an update should be executed or not. Typically used to temporarily turn
	     * off update-execution. When turned back on the second param can be used to indicate whether
	     * pending updates should be executed or not.
	     *
	     * **Note:** Changes deferring of updates for all components (Autocomplete, Categorize and Find).
	     * Use the service properties of the SearchClient instance to control deferring for each service.
	     *
	     * @example Some examples:
	     *
	     *     // Example 1: Defer updates to avoid multiple updates:
	     *     searchClient.deferUpdates(true);
	     *
	     *     // Example 2: Change some props that triggers may be listening for
	     *     searchClient.dateFrom = { M: -1};
	     *     searchClient.dateTo = { M: 0};
	     *     // When calling deferUpdates with (false) the above two update-events are now executed as one instead (both value-changes are accounted for though)
	     *     searchClient.deferUpdates(false);
	     *
	     *     // Example 3: Suppress updates (via deferUpdates):
	     *     searchClient.deferUpdates(true);
	     *     // Change a prop that should trigger updates
	     *     searchClient.queryText = "some text";
	     *     // Call deferUpdates with (false, true), to skip the pending update.
	     *     searchClient.deferUpdates(false, true);
	     *
	     *     // Example 4: Defer update only for one service (Categorize in this sample):
	     *     searchClient.categorize.deferUpdates(true);
	     *
	     * @param state Turns on or off deferring of updates.
	     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring
	     * is turned off. The param is ignored for `state=true`.
	     */
	    SearchClient.prototype.deferUpdates = function (state, skipPending) {
	        if (skipPending === void 0) { skipPending = false; }
	        this.autocomplete.deferUpdates(state, skipPending);
	        this.categorize.deferUpdates(state, skipPending);
	        this.find.deferUpdates(state, skipPending);
	    };
	    SearchClient.prototype.doFilterAdd = function (filter) {
	        // Find item in categorize.categories, and build displayName for the Filter (displayName for each categoryNode in the hierarchy)
	        var newFilter = this.categorize.createCategoryFilter(filter);
	        var oldValue = this._query.filters.slice(0);
	        this._query.filters.push(newFilter);
	        this._query.filters.sort();
	        this.autocomplete.filtersChanged(oldValue, this._query);
	        this.categorize.filtersChanged(oldValue, this._query);
	        this.find.filtersChanged(oldValue, this._query);
	    };
	    SearchClient.prototype.doFilterRemove = function (i) {
	        var oldValue = this._query.filters.slice(0);
	        this._query.filters.splice(i, 1);
	        // Note: No need to sort the filter-list afterwards, as removing an item cannot change the order anyway.
	        this.autocomplete.filtersChanged(oldValue, this._query);
	        this.categorize.filtersChanged(oldValue, this._query);
	        this.find.filtersChanged(oldValue, this._query);
	        return true;
	    };
	    SearchClient.prototype.filterId = function (filter) {
	        var id;
	        if (Array.isArray(filter)) {
	            id = filter;
	        }
	        else if (filter instanceof Filter) {
	            id = filter.category.categoryName;
	        }
	        else {
	            id = filter.categoryName;
	        }
	        return id;
	    };
	    SearchClient.prototype.filterIndex = function (filter) {
	        var filterString = filter.join('|');
	        return this._query.filters.findIndex(function (f) { return f.category.categoryName.join('|') === filterString; });
	    };
	    return SearchClient;
	}());

	exports.SearchClient = SearchClient;
	exports.Authentication = Authentication;
	exports.AuthenticationSettings = AuthenticationSettings;
	exports.AuthenticationTriggers = AuthenticationTriggers;
	exports.AuthToken = AuthToken;
	exports.Autocomplete = Autocomplete;
	exports.AutocompleteQueryConverter = AutocompleteQueryConverter;
	exports.AutocompleteSettings = AutocompleteSettings;
	exports.AutocompleteTriggers = AutocompleteTriggers;
	exports.Categorize = Categorize;
	exports.CategorizeSettings = CategorizeSettings;
	exports.CategorizeTriggers = CategorizeTriggers;
	exports.CategorizeQueryConverter = CategorizeQueryConverter;
	exports.BaseCall = BaseCall;
	exports.BaseSettings = BaseSettings;
	exports.BaseQueryConverter = BaseQueryConverter;
	exports.Filter = Filter;
	exports.Query = Query;
	exports.Find = Find;
	exports.FindQueryConverter = FindQueryConverter;
	exports.FindSettings = FindSettings;
	exports.FindTriggers = FindTriggers;
	exports.Settings = Settings;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=SearchClient.js.map
