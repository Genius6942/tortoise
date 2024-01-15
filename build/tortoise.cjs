'use strict';

var bag14 = function (seed) {
    var gen = rng(seed);
    return function () {
        return gen.shuffleArray([
            "Z",
            "L",
            "O",
            "S",
            "I",
            "J",
            "T",
            "Z",
            "L",
            "O",
            "S",
            "I",
            "J",
            "T",
        ]);
    };
};

var bag7 = function (seed) {
    var gen = rng(seed);
    return function () { return gen.shuffleArray(["Z", "L", "O", "S", "I", "J", "T"]); };
};

var classic = function (seed) {
    var TETROMINOS = ["Z", "L", "O", "S", "I", "J", "T"];
    var lastGenerated = null;
    var gen = rng(seed);
    return function () {
        var index = Math.floor(gen.nextFloat() * (TETROMINOS.length + 1));
        if (index === lastGenerated || index >= TETROMINOS.length) {
            index = Math.floor(gen.nextFloat() * TETROMINOS.length);
        }
        return [TETROMINOS[index]];
    };
};

var pairs = function (seed) {
    var gen = rng(seed);
    return function () {
        var s = gen.shuffleArray(["Z", "L", "O", "S", "I", "J", "T"]);
        var pairs = gen.shuffleArray([s[0], s[0], s[0], s[1], s[1], s[1]]);
        return pairs;
    };
};

var random = function (seed) {
    var gen = rng(seed);
    return function () {
        var TETROMINOS = ["Z", "L", "O", "S", "I", "J", "T"];
        return [TETROMINOS[Math.floor(gen.nextFloat() * TETROMINOS.length)]];
    };
};

var rng = function (seed) {
    var t = seed % 2147483647;
    if (t <= 0) {
        t += 2147483646;
    }
    return {
        next: function () {
            return (t = (16807 * t) % 2147483647);
        },
        nextFloat: function () {
            return (this.next() - 1) / 2147483646;
        },
        shuffleArray: function (array) {
            var _a;
            if (array.length == 0) {
                return array;
            }
            for (var i = array.length - 1; i != 0; i--) {
                var r = Math.floor(this.nextFloat() * (i + 1));
                _a = [array[r], array[i]], array[i] = _a[0], array[r] = _a[1];
            }
            return array;
        },
    };
};
var rngMap = {
    "7-bag": bag7,
    "14-bag": bag14,
    classic: classic,
    pairs: pairs,
    "total-mayhem": random,
};

var Queue = /** @class */ (function () {
    function Queue(options) {
        this.repopulateListener = null;
        this.seed = options.seed;
        this.type = options.type;
        this.genFunction = rngMap[this.type](this.seed);
        this.value = [];
        this.minLength = options.minLength;
    }
    Queue.prototype.onRepopulate = function (listener) {
        this.repopulateListener = listener;
    };
    Object.defineProperty(Queue.prototype, "minLength", {
        get: function () {
            return this._minLength;
        },
        set: function (val) {
            this._minLength = val;
            this.repopulate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "next", {
        get: function () {
            return this.value[0];
        },
        enumerable: false,
        configurable: true
    });
    Queue.prototype.at = function (index) {
        return this.value.at(index);
    };
    Queue.prototype.shift = function () {
        var val = this.value.shift();
        this.repopulate();
        return val;
    };
    Queue.prototype.repopulate = function () {
        var _a;
        var added = [];
        while (this.value.length < this.minLength) {
            var newValues = this.genFunction();
            (_a = this.value).push.apply(_a, newValues);
            added.push.apply(added, newValues);
        }
        if (this.repopulateListener) {
            this.repopulateListener(added);
        }
    };
    return Queue;
}());

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Board = /** @class */ (function () {
    function Board(options) {
        var _this = this;
        this._width = options.width;
        this._height = options.height;
        this._buffer = options.buffer;
        this.state = Array(this.fullHeight)
            .fill(null)
            .map(function () { return Array(_this.width).fill(null); });
    }
    Object.defineProperty(Board.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        set: function (value) {
            this._buffer = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "fullHeight", {
        get: function () {
            return this.height + this.buffer;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.add = function () {
        var _this = this;
        var blocks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            blocks[_i] = arguments[_i];
        }
        blocks.forEach(function (_a) {
            var char = _a[0], x = _a[1], y = _a[2];
            _this.state[y][x] = char;
        });
    };
    Board.prototype.clearLines = function () {
        var _this = this;
        var lines = [];
        this.state.forEach(function (row, idx) {
            if (row.every(function (block) { return block !== null; })) {
                lines.push(idx);
            }
        });
        __spreadArray([], lines, true).reverse().forEach(function (line) {
            _this.state.splice(line, 1);
            _this.state.push(new Array(_this.width).fill(null));
        });
        return lines.length;
    };
    Object.defineProperty(Board.prototype, "perfectClear", {
        get: function () {
            return this.state.every(function (row) { return row.every(function (block) { return block === null; }); });
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.insertGarbage = function (_a) {
        var _b;
        var _this = this;
        var amount = _a.amount, size = _a.size, column = _a.column;
        (_b = this.state).splice.apply(_b, __spreadArray([0,
            0], Array.from({ length: amount }, function () {
            return Array.from({ length: _this.width }, function (_, idx) {
                return idx >= column && idx < column + size ? null : "G";
            });
        }), false));
        this.state.splice(this.fullHeight - amount - 1, amount);
    };
    return Board;
}());

var kicks = {
    SRS: {
        kicks: {
            "01": [
                [-1, 0],
                [-1, -1],
                [0, 2],
                [-1, 2],
            ],
            10: [
                [1, 0],
                [1, 1],
                [0, -2],
                [1, -2],
            ],
            12: [
                [1, 0],
                [1, 1],
                [0, -2],
                [1, -2],
            ],
            21: [
                [-1, 0],
                [-1, -1],
                [0, 2],
                [-1, 2],
            ],
            23: [
                [1, 0],
                [1, -1],
                [0, 2],
                [1, 2],
            ],
            32: [
                [-1, 0],
                [-1, 1],
                [0, -2],
                [-1, -2],
            ],
            30: [
                [-1, 0],
                [-1, 1],
                [0, -2],
                [-1, -2],
            ],
            "03": [
                [1, 0],
                [1, -1],
                [0, 2],
                [1, 2],
            ],
            "02": [
                [0, -1],
                [1, -1],
                [-1, -1],
                [1, 0],
                [-1, 0],
            ],
            13: [
                [1, 0],
                [1, -2],
                [1, -1],
                [0, -2],
                [0, -1],
            ],
            20: [
                [0, 1],
                [-1, 1],
                [1, 1],
                [-1, 0],
                [1, 0],
            ],
            31: [
                [-1, 0],
                [-1, -2],
                [-1, -1],
                [0, -2],
                [0, -1],
            ],
        },
        i_kicks: {
            "01": [
                [-2, 0],
                [1, 0],
                [-2, 1],
                [1, -2],
            ],
            10: [
                [2, 0],
                [-1, 0],
                [2, -1],
                [-1, 2],
            ],
            12: [
                [-1, 0],
                [2, 0],
                [-1, -2],
                [2, 1],
            ],
            21: [
                [1, 0],
                [-2, 0],
                [1, 2],
                [-2, -1],
            ],
            23: [
                [2, 0],
                [-1, 0],
                [2, -1],
                [-1, 2],
            ],
            32: [
                [-2, 0],
                [1, 0],
                [-2, 1],
                [1, -2],
            ],
            30: [
                [1, 0],
                [-2, 0],
                [1, 2],
                [-2, -1],
            ],
            "03": [
                [-1, 0],
                [2, 0],
                [-1, -2],
                [2, 1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        i2_kicks: {
            "01": [
                [0, -1],
                [-1, 0],
                [-1, -1],
            ],
            10: [
                [0, 1],
                [1, 0],
                [1, 1],
            ],
            12: [
                [1, 0],
                [0, -1],
                [1, 0],
            ],
            21: [
                [-1, 0],
                [0, 1],
                [-1, 0],
            ],
            23: [
                [0, 1],
                [1, 0],
                [1, -1],
            ],
            32: [
                [0, -1],
                [-1, 0],
                [-1, 1],
            ],
            30: [
                [-1, 0],
                [0, 1],
                [-1, 2],
            ],
            "03": [
                [1, 0],
                [0, -1],
                [1, -2],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        i3_kicks: {
            "01": [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ],
            10: [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ],
            12: [
                [1, 0],
                [-1, 0],
                [0, -2],
                [0, 2],
            ],
            21: [
                [-1, 0],
                [1, 0],
                [0, 2],
                [0, -2],
            ],
            23: [
                [-1, 0],
                [1, 0],
                [0, 1],
                [0, -1],
            ],
            32: [
                [1, 0],
                [-1, 0],
                [0, -1],
                [0, 1],
            ],
            30: [
                [-1, 0],
                [1, 0],
                [0, 0],
                [0, 0],
            ],
            "03": [
                [1, 0],
                [-1, 0],
                [0, 0],
                [0, 0],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        l3_kicks: {
            "01": [
                [-1, 0],
                [1, 0],
            ],
            10: [
                [1, 0],
                [-1, 0],
            ],
            12: [
                [0, -1],
                [0, 1],
            ],
            21: [
                [0, 1],
                [0, -1],
            ],
            23: [
                [1, 0],
                [-1, 0],
            ],
            32: [
                [-1, 0],
                [1, 0],
            ],
            30: [
                [0, 1],
                [0, -1],
            ],
            "03": [
                [0, -1],
                [0, 1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        i5_kicks: {
            "01": [
                [-2, 0],
                [2, 0],
                [-2, 1],
                [2, -2],
            ],
            10: [
                [2, 0],
                [-2, 0],
                [2, -1],
                [-2, 2],
            ],
            12: [
                [-2, 0],
                [2, 0],
                [-2, -2],
                [2, 1],
            ],
            21: [
                [2, 0],
                [-2, 0],
                [2, 2],
                [-2, -1],
            ],
            23: [
                [2, 0],
                [-2, 0],
                [2, -1],
                [-2, 2],
            ],
            32: [
                [-2, 0],
                [2, 0],
                [-2, 1],
                [2, -2],
            ],
            30: [
                [2, 0],
                [-2, 0],
                [2, 2],
                [-2, -1],
            ],
            "03": [
                [-2, 0],
                [2, 0],
                [-2, -2],
                [2, 1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        oo_kicks: {
            "01": [
                [0, -1],
                [-1, -1],
                [0, 1],
                [-1, 1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            10: [
                [1, 0],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            12: [
                [-1, 0],
                [0, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            21: [
                [0, -1],
                [1, -1],
                [0, 1],
                [1, 1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            23: [
                [0, -1],
                [-1, -1],
                [0, 1],
                [-1, 1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            32: [
                [1, 0],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            30: [
                [-1, 0],
                [0, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            "03": [
                [0, -1],
                [1, -1],
                [0, 1],
                [1, 1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            "02": [[0, -1]],
            13: [[1, 0]],
            20: [[0, 1]],
            31: [[-1, 0]],
        },
        additional_offsets: {},
        spawn_rotation: {},
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "l",
            o: "o",
            s: "s",
            i: "i",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        preview_overrides: {},
    },
    "SRS+": {
        kicks: {
            "01": [
                [-1, 0],
                [-1, -1],
                [0, 2],
                [-1, 2],
            ],
            10: [
                [1, 0],
                [1, 1],
                [0, -2],
                [1, -2],
            ],
            12: [
                [1, 0],
                [1, 1],
                [0, -2],
                [1, -2],
            ],
            21: [
                [-1, 0],
                [-1, -1],
                [0, 2],
                [-1, 2],
            ],
            23: [
                [1, 0],
                [1, -1],
                [0, 2],
                [1, 2],
            ],
            32: [
                [-1, 0],
                [-1, 1],
                [0, -2],
                [-1, -2],
            ],
            30: [
                [-1, 0],
                [-1, 1],
                [0, -2],
                [-1, -2],
            ],
            "03": [
                [1, 0],
                [1, -1],
                [0, 2],
                [1, 2],
            ],
            "02": [
                [0, -1],
                [1, -1],
                [-1, -1],
                [1, 0],
                [-1, 0],
            ],
            13: [
                [1, 0],
                [1, -2],
                [1, -1],
                [0, -2],
                [0, -1],
            ],
            20: [
                [0, 1],
                [-1, 1],
                [1, 1],
                [-1, 0],
                [1, 0],
            ],
            31: [
                [-1, 0],
                [-1, -2],
                [-1, -1],
                [0, -2],
                [0, -1],
            ],
        },
        i_kicks: {
            "01": [
                [1, 0],
                [-2, 0],
                [-2, 1],
                [1, -2],
            ],
            10: [
                [-1, 0],
                [2, 0],
                [-1, 2],
                [2, -1],
            ],
            12: [
                [-1, 0],
                [2, 0],
                [-1, -2],
                [2, 1],
            ],
            21: [
                [-2, 0],
                [1, 0],
                [-2, -1],
                [1, 2],
            ],
            23: [
                [2, 0],
                [-1, 0],
                [2, -1],
                [-1, 2],
            ],
            32: [
                [1, 0],
                [-2, 0],
                [1, -2],
                [-2, 1],
            ],
            30: [
                [1, 0],
                [-2, 0],
                [1, 2],
                [-2, -1],
            ],
            "03": [
                [-1, 0],
                [2, 0],
                [2, 1],
                [-1, -2],
            ],
            "02": [[0, -1]],
            13: [[1, 0]],
            20: [[0, 1]],
            31: [[-1, 0]],
        },
        i2_kicks: {
            "01": [
                [0, -1],
                [-1, 0],
                [-1, -1],
            ],
            10: [
                [0, 1],
                [1, 0],
                [1, 1],
            ],
            12: [
                [1, 0],
                [0, -1],
                [1, 0],
            ],
            21: [
                [-1, 0],
                [0, 1],
                [-1, 0],
            ],
            23: [
                [0, 1],
                [1, 0],
                [1, -1],
            ],
            32: [
                [0, -1],
                [-1, 0],
                [-1, 1],
            ],
            30: [
                [-1, 0],
                [0, 1],
                [-1, 2],
            ],
            "03": [
                [1, 0],
                [0, -1],
                [1, -2],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        i3_kicks: {
            "01": [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ],
            10: [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ],
            12: [
                [1, 0],
                [-1, 0],
                [0, -2],
                [0, 2],
            ],
            21: [
                [-1, 0],
                [1, 0],
                [0, 2],
                [0, -2],
            ],
            23: [
                [-1, 0],
                [1, 0],
                [0, 1],
                [0, -1],
            ],
            32: [
                [1, 0],
                [-1, 0],
                [0, -1],
                [0, 1],
            ],
            30: [
                [-1, 0],
                [1, 0],
                [0, 0],
                [0, 0],
            ],
            "03": [
                [1, 0],
                [-1, 0],
                [0, 0],
                [0, 0],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        l3_kicks: {
            "01": [
                [-1, 0],
                [1, 0],
            ],
            10: [
                [1, 0],
                [-1, 0],
            ],
            12: [
                [0, -1],
                [0, 1],
            ],
            21: [
                [0, 1],
                [0, -1],
            ],
            23: [
                [1, 0],
                [-1, 0],
            ],
            32: [
                [-1, 0],
                [1, 0],
            ],
            30: [
                [0, 1],
                [0, -1],
            ],
            "03": [
                [0, -1],
                [0, 1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        i5_kicks: {
            "01": [
                [-2, 0],
                [2, 0],
                [-2, 1],
                [2, -2],
            ],
            10: [
                [2, 0],
                [-2, 0],
                [2, -1],
                [-2, 2],
            ],
            12: [
                [-2, 0],
                [2, 0],
                [-2, -2],
                [2, 1],
            ],
            21: [
                [2, 0],
                [-2, 0],
                [2, 2],
                [-2, -1],
            ],
            23: [
                [2, 0],
                [-2, 0],
                [2, -1],
                [-2, 2],
            ],
            32: [
                [-2, 0],
                [2, 0],
                [-2, 1],
                [2, -2],
            ],
            30: [
                [2, 0],
                [-2, 0],
                [2, 2],
                [-2, -1],
            ],
            "03": [
                [-2, 0],
                [2, 0],
                [-2, -2],
                [2, 1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        oo_kicks: {
            "01": [
                [0, -1],
                [-1, -1],
                [0, 1],
                [-1, 1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            10: [
                [1, 0],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            12: [
                [-1, 0],
                [0, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            21: [
                [0, -1],
                [1, -1],
                [0, 1],
                [1, 1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            23: [
                [0, -1],
                [-1, -1],
                [0, 1],
                [-1, 1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            32: [
                [1, 0],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            30: [
                [-1, 0],
                [0, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            "03": [
                [0, -1],
                [1, -1],
                [0, 1],
                [1, 1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            "02": [[0, -1]],
            13: [[1, 0]],
            20: [[0, 1]],
            31: [[-1, 0]],
        },
        additional_offsets: {},
        spawn_rotation: {},
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "l",
            o: "o",
            s: "s",
            i: "i",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        preview_overrides: {},
    },
    "SRS-X": {
        kicks: {
            "01": [
                [-1, 0],
                [-1, -1],
                [0, 2],
                [-1, 2],
            ],
            10: [
                [1, 0],
                [1, 1],
                [0, -2],
                [1, -2],
            ],
            12: [
                [1, 0],
                [1, 1],
                [0, -2],
                [1, -2],
            ],
            21: [
                [-1, 0],
                [-1, -1],
                [0, 2],
                [-1, 2],
            ],
            23: [
                [1, 0],
                [1, -1],
                [0, 2],
                [1, 2],
            ],
            32: [
                [-1, 0],
                [-1, 1],
                [0, -2],
                [-1, -2],
            ],
            30: [
                [-1, 0],
                [-1, 1],
                [0, -2],
                [-1, -2],
            ],
            "03": [
                [1, 0],
                [1, -1],
                [0, 2],
                [1, 2],
            ],
            "02": [
                [1, 0],
                [2, 0],
                [1, 1],
                [2, 1],
                [-1, 0],
                [-2, 0],
                [-1, 1],
                [-2, 1],
                [0, -1],
                [3, 0],
                [-3, 0],
            ],
            13: [
                [0, 1],
                [0, 2],
                [-1, 1],
                [-1, 2],
                [0, -1],
                [0, -2],
                [-1, -1],
                [-1, -2],
                [1, 0],
                [0, 3],
                [0, -3],
            ],
            20: [
                [-1, 0],
                [-2, 0],
                [-1, -1],
                [-2, -1],
                [1, 0],
                [2, 0],
                [1, -1],
                [2, -1],
                [0, 1],
                [-3, 0],
                [3, 0],
            ],
            31: [
                [0, 1],
                [0, 2],
                [1, 1],
                [1, 2],
                [0, -1],
                [0, -2],
                [1, -1],
                [1, -2],
                [-1, 0],
                [0, 3],
                [0, -3],
            ],
        },
        i_kicks: {
            "01": [
                [-2, 0],
                [1, 0],
                [-2, 1],
                [1, -2],
            ],
            10: [
                [2, 0],
                [-1, 0],
                [2, -1],
                [-1, 2],
            ],
            12: [
                [-1, 0],
                [2, 0],
                [-1, -2],
                [2, 1],
            ],
            21: [
                [1, 0],
                [-2, 0],
                [1, 2],
                [-2, -1],
            ],
            23: [
                [2, 0],
                [-1, 0],
                [2, -1],
                [-1, 2],
            ],
            32: [
                [-2, 0],
                [1, 0],
                [-2, 1],
                [1, -2],
            ],
            30: [
                [1, 0],
                [-2, 0],
                [1, 2],
                [-2, -1],
            ],
            "03": [
                [-1, 0],
                [2, 0],
                [-1, -2],
                [2, 1],
            ],
            "02": [
                [-1, 0],
                [-2, 0],
                [1, 0],
                [2, 0],
                [0, 1],
            ],
            13: [
                [0, 1],
                [0, 2],
                [0, -1],
                [0, -2],
                [-1, 0],
            ],
            20: [
                [1, 0],
                [2, 0],
                [-1, 0],
                [-2, 0],
                [0, -1],
            ],
            31: [
                [0, 1],
                [0, 2],
                [0, -1],
                [0, -2],
                [1, 0],
            ],
        },
        i2_kicks: {
            "01": [
                [0, -1],
                [-1, 0],
                [-1, -1],
            ],
            10: [
                [0, 1],
                [1, 0],
                [1, 1],
            ],
            12: [
                [1, 0],
                [0, -1],
                [1, 0],
            ],
            21: [
                [-1, 0],
                [0, 1],
                [-1, 0],
            ],
            23: [
                [0, 1],
                [1, 0],
                [1, -1],
            ],
            32: [
                [0, -1],
                [-1, 0],
                [-1, 1],
            ],
            30: [
                [-1, 0],
                [0, 1],
                [-1, 2],
            ],
            "03": [
                [1, 0],
                [0, -1],
                [1, -2],
            ],
            "02": [
                [-1, 0],
                [-2, 0],
                [1, 0],
                [2, 0],
                [0, 1],
            ],
            13: [
                [0, 1],
                [0, 2],
                [0, -1],
                [0, -2],
                [-1, 0],
            ],
            20: [
                [1, 0],
                [2, 0],
                [-1, 0],
                [-2, 0],
                [0, -1],
            ],
            31: [
                [0, 1],
                [0, 2],
                [0, -1],
                [0, -2],
                [1, 0],
            ],
        },
        i3_kicks: {
            "01": [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ],
            10: [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ],
            12: [
                [1, 0],
                [-1, 0],
                [0, -2],
                [0, 2],
            ],
            21: [
                [-1, 0],
                [1, 0],
                [0, 2],
                [0, -2],
            ],
            23: [
                [-1, 0],
                [1, 0],
                [0, 1],
                [0, -1],
            ],
            32: [
                [1, 0],
                [-1, 0],
                [0, -1],
                [0, 1],
            ],
            30: [
                [-1, 0],
                [1, 0],
                [0, 0],
                [0, 0],
            ],
            "03": [
                [1, 0],
                [-1, 0],
                [0, 0],
                [0, 0],
            ],
            "02": [
                [1, 0],
                [2, 0],
                [1, 1],
                [2, 1],
                [-1, 0],
                [-2, 0],
                [-1, 1],
                [-2, 1],
                [0, -1],
                [3, 0],
                [-3, 0],
            ],
            13: [
                [0, 1],
                [0, 2],
                [-1, 1],
                [-1, 2],
                [0, -1],
                [0, -2],
                [-1, -1],
                [-1, -2],
                [1, 0],
                [0, 3],
                [0, -3],
            ],
            20: [
                [-1, 0],
                [-2, 0],
                [-1, -1],
                [-2, -1],
                [1, 0],
                [2, 0],
                [1, -1],
                [2, -1],
                [0, 1],
                [-3, 0],
                [3, 0],
            ],
            31: [
                [0, 1],
                [0, 2],
                [1, 1],
                [1, 2],
                [0, -1],
                [0, -2],
                [1, -1],
                [1, -2],
                [-1, 0],
                [0, 3],
                [0, -3],
            ],
        },
        l3_kicks: {
            "01": [
                [-1, 0],
                [1, 0],
            ],
            10: [
                [1, 0],
                [-1, 0],
            ],
            12: [
                [0, -1],
                [0, 1],
            ],
            21: [
                [0, 1],
                [0, -1],
            ],
            23: [
                [1, 0],
                [-1, 0],
            ],
            32: [
                [-1, 0],
                [1, 0],
            ],
            30: [
                [0, 1],
                [0, -1],
            ],
            "03": [
                [0, -1],
                [0, 1],
            ],
            "02": [
                [1, 0],
                [2, 0],
                [1, 1],
                [2, 1],
                [-1, 0],
                [-2, 0],
                [-1, 1],
                [-2, 1],
                [0, -1],
                [3, 0],
                [-3, 0],
            ],
            13: [
                [0, 1],
                [0, 2],
                [-1, 1],
                [-1, 2],
                [0, -1],
                [0, -2],
                [-1, -1],
                [-1, -2],
                [1, 0],
                [0, 3],
                [0, -3],
            ],
            20: [
                [-1, 0],
                [-2, 0],
                [-1, -1],
                [-2, -1],
                [1, 0],
                [2, 0],
                [1, -1],
                [2, -1],
                [0, 1],
                [-3, 0],
                [3, 0],
            ],
            31: [
                [0, 1],
                [0, 2],
                [1, 1],
                [1, 2],
                [0, -1],
                [0, -2],
                [1, -1],
                [1, -2],
                [-1, 0],
                [0, 3],
                [0, -3],
            ],
        },
        i5_kicks: {
            "01": [
                [-2, 0],
                [2, 0],
                [-2, 1],
                [2, -2],
            ],
            10: [
                [2, 0],
                [-2, 0],
                [2, -1],
                [-2, 2],
            ],
            12: [
                [-2, 0],
                [2, 0],
                [-2, -2],
                [2, 1],
            ],
            21: [
                [2, 0],
                [-2, 0],
                [2, 2],
                [-2, -1],
            ],
            23: [
                [2, 0],
                [-2, 0],
                [2, -1],
                [-2, 2],
            ],
            32: [
                [-2, 0],
                [2, 0],
                [-2, 1],
                [2, -2],
            ],
            30: [
                [2, 0],
                [-2, 0],
                [2, 2],
                [-2, -1],
            ],
            "03": [
                [-2, 0],
                [2, 0],
                [-2, -2],
                [2, 1],
            ],
            "02": [
                [1, 0],
                [2, 0],
                [1, 1],
                [2, 1],
                [-1, 0],
                [-2, 0],
                [-1, 1],
                [-2, 1],
                [0, -1],
                [3, 0],
                [-3, 0],
            ],
            13: [
                [0, 1],
                [0, 2],
                [-1, 1],
                [-1, 2],
                [0, -1],
                [0, -2],
                [-1, -1],
                [-1, -2],
                [1, 0],
                [0, 3],
                [0, -3],
            ],
            20: [
                [-1, 0],
                [-2, 0],
                [-1, -1],
                [-2, -1],
                [1, 0],
                [2, 0],
                [1, -1],
                [2, -1],
                [0, 1],
                [-3, 0],
                [3, 0],
            ],
            31: [
                [0, 1],
                [0, 2],
                [1, 1],
                [1, 2],
                [0, -1],
                [0, -2],
                [1, -1],
                [1, -2],
                [-1, 0],
                [0, 3],
                [0, -3],
            ],
        },
        oo_kicks: {
            "01": [
                [0, -1],
                [-1, -1],
                [0, 1],
                [-1, 1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            10: [
                [1, 0],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            12: [
                [-1, 0],
                [0, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            21: [
                [0, -1],
                [1, -1],
                [0, 1],
                [1, 1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            23: [
                [0, -1],
                [-1, -1],
                [0, 1],
                [-1, 1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            32: [
                [1, 0],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            30: [
                [-1, 0],
                [0, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [1, -1],
                [1, 1],
            ],
            "03": [
                [0, -1],
                [1, -1],
                [0, 1],
                [1, 1],
                [-1, 0],
                [-1, -1],
                [-1, 1],
            ],
            "02": [[0, -1]],
            13: [[1, 0]],
            20: [[0, 1]],
            31: [[-1, 0]],
        },
        additional_offsets: {},
        spawn_rotation: {},
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "l",
            o: "o",
            s: "s",
            i: "i",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        preview_overrides: {},
    },
    "TETRA-X": {
        kicks: {
            "01": [
                [0, 1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [1, 1],
                [0, -1],
                [-1, -1],
                [1, -1],
            ],
            10: [
                [0, 1],
                [1, 0],
                [-1, 0],
                [1, 1],
                [-1, 1],
                [0, -1],
                [1, -1],
                [-1, -1],
            ],
            12: [
                [0, 1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [1, 1],
                [0, -1],
                [-1, -1],
                [1, -1],
            ],
            21: [
                [0, 1],
                [1, 0],
                [-1, 0],
                [1, 1],
                [-1, 1],
                [0, -1],
                [1, -1],
                [-1, -1],
            ],
            23: [
                [0, 1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [1, 1],
                [0, -1],
                [-1, -1],
                [1, -1],
            ],
            32: [
                [0, 1],
                [1, 0],
                [-1, 0],
                [1, 1],
                [-1, 1],
                [0, -1],
                [1, -1],
                [-1, -1],
            ],
            30: [
                [0, 1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [1, 1],
                [0, -1],
                [-1, -1],
                [1, -1],
            ],
            "03": [
                [0, 1],
                [1, 0],
                [-1, 0],
                [1, 1],
                [-1, 1],
                [0, -1],
                [1, -1],
                [-1, -1],
            ],
            "02": [
                [0, 1],
                [0, -1],
                [-1, 0],
                [1, 0],
            ],
            13: [
                [0, 1],
                [0, -1],
                [-1, 0],
                [1, 0],
            ],
            20: [
                [0, 1],
                [0, -1],
                [-1, 0],
                [1, 0],
            ],
            31: [
                [0, 1],
                [0, -1],
                [-1, 0],
                [1, 0],
            ],
        },
        i_kicks: {
            "01": [
                [0, -1],
                [0, -2],
                [0, 1],
                [1, -1],
                [-1, -1],
                [1, -2],
                [-1, -2],
            ],
            10: [
                [0, -1],
                [0, -2],
                [0, 1],
                [-1, 0],
                [1, 0],
                [2, 0],
            ],
            12: [
                [0, -1],
                [0, -2],
                [0, 1],
                [-1, 0],
                [1, 0],
                [2, 0],
            ],
            21: [
                [0, 1],
                [0, 2],
                [0, -1],
                [-1, 1],
                [1, 1],
                [-1, 2],
                [1, 2],
            ],
            23: [
                [0, 1],
                [0, 2],
                [0, -1],
                [1, 1],
                [-1, 1],
                [1, 2],
                [-1, 2],
            ],
            32: [
                [0, -1],
                [0, -2],
                [0, 1],
                [1, 0],
                [-1, 0],
                [-2, 0],
            ],
            30: [
                [0, -1],
                [0, -2],
                [0, 1],
                [1, 0],
                [-1, 0],
                [-2, 0],
            ],
            "03": [
                [0, -1],
                [0, -2],
                [0, 1],
                [-1, -1],
                [1, -1],
                [-1, -2],
                [1, -2],
            ],
            "02": [
                [0, -1],
                [0, 1],
            ],
            13: [
                [0, -1],
                [0, 1],
            ],
            20: [
                [0, -1],
                [0, 1],
            ],
            31: [
                [0, -1],
                [0, 1],
            ],
        },
        additional_offsets: {},
        spawn_rotation: {},
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "o",
            o: "s",
            s: "i",
            i: "l",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        preview_overrides: {},
    },
    NRS: {
        kicks: {
            "01": [],
            10: [],
            12: [],
            21: [],
            23: [],
            32: [],
            30: [],
            "03": [],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        additional_offsets: {
            z: [
                [1, 1],
                [1, 0],
                [1, 0],
                [2, 0],
            ],
            l: [
                [1, 0],
                [1, 0],
                [1, 0],
                [1, 0],
            ],
            o: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            s: [
                [1, 1],
                [1, 0],
                [1, 0],
                [2, 0],
            ],
            i: [
                [0, 1],
                [0, 0],
                [0, 0],
                [1, 0],
            ],
            j: [
                [1, 0],
                [1, 0],
                [1, 0],
                [1, 0],
            ],
            t: [
                [1, 0],
                [1, 0],
                [1, 0],
                [1, 0],
            ],
        },
        spawn_rotation: { z: 0, l: 2, o: 0, s: 0, i: 0, j: 2, t: 2 },
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "l",
            o: "o",
            s: "s",
            i: "i",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        preview_overrides: {
            l: [
                [0, 0, 201],
                [1, 0, 68],
                [2, 0, 124],
                [0, 1, 31],
            ],
            j: [
                [0, 0, 199],
                [1, 0, 68],
                [2, 0, 114],
                [2, 1, 31],
            ],
            t: [
                [0, 0, 199],
                [1, 0, 74],
                [2, 0, 124],
                [1, 1, 31],
            ],
        },
    },
    ARS: {
        kicks: {
            "01": [
                [1, 0],
                [-1, 0],
            ],
            10: [
                [1, 0],
                [-1, 0],
            ],
            12: [
                [1, 0],
                [-1, 0],
            ],
            21: [
                [1, 0],
                [-1, 0],
            ],
            23: [
                [1, 0],
                [-1, 0],
            ],
            32: [
                [1, 0],
                [-1, 0],
            ],
            30: [
                [1, 0],
                [-1, 0],
            ],
            "03": [
                [1, 0],
                [-1, 0],
            ],
            "02": [
                [1, 0],
                [-1, 0],
            ],
            13: [
                [1, 0],
                [-1, 0],
            ],
            20: [
                [1, 0],
                [-1, 0],
            ],
            31: [
                [1, 0],
                [-1, 0],
            ],
        },
        additional_offsets: {
            i1: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            z: [
                [0, 1],
                [0, 0],
                [0, 0],
                [1, 0],
            ],
            l: [
                [0, 1],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            o: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            s: [
                [0, 1],
                [-1, 0],
                [0, 0],
                [0, 0],
            ],
            i: [
                [0, 0],
                [0, 0],
                [0, -1],
                [1, 0],
            ],
            j: [
                [0, 1],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            t: [
                [0, 1],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
        },
        spawn_rotation: { z: 0, l: 2, o: 0, s: 0, i: 0, j: 2, t: 2 },
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "s",
            l: "l",
            o: "o",
            s: "t",
            i: "z",
            j: "j",
            t: "i",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        preview_overrides: {
            l: [
                [0, 0, 201],
                [1, 0, 68],
                [2, 0, 124],
                [0, 1, 31],
            ],
            j: [
                [0, 0, 199],
                [1, 0, 68],
                [2, 0, 114],
                [2, 1, 31],
            ],
            t: [
                [0, 0, 199],
                [1, 0, 74],
                [2, 0, 124],
                [1, 1, 31],
            ],
        },
        center_column: [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [0, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ],
    },
    ASC: {
        kicks: {
            "01": [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            10: [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            12: [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            21: [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            23: [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            32: [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            30: [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            "03": [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        i_kicks: {
            "01": [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            10: [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            12: [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            21: [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            23: [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            32: [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            30: [
                [-1, 0],
                [0, 1],
                [-1, 1],
                [0, 2],
                [-1, 2],
                [-2, 0],
                [-2, 1],
                [-2, 2],
                [1, 0],
                [1, 1],
                [0, -1],
                [-1, -1],
                [-2, -1],
                [1, 2],
                [2, 0],
                [0, -2],
                [-1, -2],
                [-2, -2],
                [2, 1],
                [2, 2],
                [1, -1],
            ],
            "03": [
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [1, -1],
                [2, -1],
                [-1, 2],
                [-2, 0],
                [0, -2],
                [1, -2],
                [2, -2],
                [-2, 1],
                [-2, 2],
                [-1, -1],
            ],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        allow_o_kick: true,
        additional_offsets: {
            i1: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            z: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            l: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            o: [
                [0, 0],
                [0, 1],
                [-1, 1],
                [-1, 0],
            ],
            s: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            i: [
                [0, 0],
                [0, -1],
                [1, -1],
                [1, 0],
            ],
            j: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
            t: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ],
        },
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "l",
            o: "o",
            s: "s",
            i: "i",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        spawn_rotation: {},
        preview_overrides: {},
    },
    none: {
        kicks: {
            "01": [],
            10: [],
            12: [],
            21: [],
            23: [],
            32: [],
            30: [],
            "03": [],
            "02": [],
            13: [],
            20: [],
            31: [],
        },
        additional_offsets: {},
        colorMap: {
            i1: "i",
            i2: "i",
            i3: "i",
            l3: "j",
            i5: "i",
            z: "z",
            l: "l",
            o: "o",
            s: "s",
            i: "i",
            j: "j",
            t: "t",
            oo: "o",
            g: "g",
            d: "d",
            gb: "gb",
            gbd: "gbd",
        },
        spawn_rotation: {},
        preview_overrides: {},
    },
};

var legal = function (blocks, board) {
    if (board.length === 0)
        return false;
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        if (block[0] < 0)
            return false;
        if (block[0] >= board[0].length)
            return false;
        if (block[1] < 0)
            return false;
        if (board[block[1]][block[0]])
            return false;
    }
    return true;
};
var performKick = function (kicktable, piece, pieceLocation, blocks, startRotation, endRotation, board) {
    if (legal(blocks.map(function (block) { return [
        pieceLocation[0] + block[0],
        pieceLocation[1] - block[1],
    ]; }), board))
        return true;
    var kickID = "".concat(startRotation).concat(endRotation);
    var customKicksetID = "".concat(piece, "_kicks");
    var table = kicks[kicktable];
    var kickset = customKicksetID in table
        ? table[customKicksetID][kickID]
        : table.kicks[kickID];
    var _loop_1 = function (i) {
        var _a = kickset[i], dx = _a[0], dy = _a[1];
        if (legal(blocks.map(function (block) { return [
            pieceLocation[0] + block[0] + dx,
            pieceLocation[1] - block[1] - dy,
        ]; }), board)) {
            return { value: {
                    kick: [dx, -dy],
                    id: kickID,
                    index: i,
                } };
        }
    };
    for (var i = 0; i < kickset.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
};

var tetrominoes = {
    i1: {
        matrix: {
            w: 1,
            h: 1,
            dx: 0,
            dy: 1,
            data: [[[0, 0, 255]], [[0, 0, 255]], [[0, 0, 255]], [[0, 0, 255]]],
        },
        preview: { w: 1, h: 1, data: [[0, 0, 255]] },
    },
    i2: {
        matrix: {
            w: 2,
            h: 2,
            dx: 0,
            dy: 1,
            data: [
                [
                    [0, 0, 199],
                    [1, 0, 124],
                ],
                [
                    [1, 0, 241],
                    [1, 1, 31],
                ],
                [
                    [1, 1, 124],
                    [0, 1, 199],
                ],
                [
                    [0, 1, 31],
                    [0, 0, 241],
                ],
            ],
        },
        preview: {
            w: 2,
            h: 1,
            data: [
                [0, 0, 199],
                [1, 0, 124],
            ],
        },
    },
    i3: {
        matrix: {
            w: 3,
            h: 3,
            dx: 1,
            dy: 1,
            data: [
                [
                    [0, 1, 199],
                    [1, 1, 68],
                    [2, 1, 124],
                ],
                [
                    [1, 0, 241],
                    [1, 1, 17],
                    [1, 2, 31],
                ],
                [
                    [2, 1, 124],
                    [1, 1, 68],
                    [0, 1, 199],
                ],
                [
                    [1, 2, 31],
                    [1, 1, 17],
                    [1, 0, 241],
                ],
            ],
        },
        preview: {
            w: 3,
            h: 1,
            data: [
                [0, 0, 199],
                [1, 0, 68],
                [2, 0, 124],
            ],
        },
    },
    l3: {
        matrix: {
            w: 2,
            h: 2,
            dx: 0,
            dy: 1,
            data: [
                [
                    [0, 0, 241],
                    [0, 1, 39],
                    [1, 1, 124],
                ],
                [
                    [1, 0, 124],
                    [0, 0, 201],
                    [0, 1, 31],
                ],
                [
                    [1, 1, 31],
                    [1, 0, 114],
                    [0, 0, 199],
                ],
                [
                    [0, 1, 199],
                    [1, 1, 156],
                    [1, 0, 241],
                ],
            ],
        },
        preview: {
            w: 2,
            h: 2,
            data: [
                [0, 0, 241],
                [0, 1, 39],
                [1, 1, 124],
            ],
        },
    },
    i5: {
        matrix: {
            w: 5,
            h: 5,
            dx: 2,
            dy: 2,
            data: [
                [
                    [0, 2, 199],
                    [1, 2, 68],
                    [2, 2, 68],
                    [3, 2, 68],
                    [4, 2, 124],
                ],
                [
                    [2, 0, 241],
                    [2, 1, 17],
                    [2, 2, 17],
                    [2, 3, 17],
                    [2, 4, 31],
                ],
                [
                    [4, 2, 124],
                    [3, 2, 68],
                    [2, 2, 68],
                    [1, 2, 68],
                    [0, 2, 199],
                ],
                [
                    [2, 4, 31],
                    [2, 3, 17],
                    [2, 2, 17],
                    [2, 1, 17],
                    [2, 0, 241],
                ],
            ],
        },
        preview: {
            w: 5,
            h: 1,
            data: [
                [0, 0, 199],
                [1, 0, 68],
                [2, 0, 68],
                [3, 0, 68],
                [4, 0, 124],
            ],
        },
    },
    z: {
        matrix: {
            w: 3,
            h: 3,
            dx: 1,
            dy: 1,
            data: [
                [
                    [0, 0, 199],
                    [1, 0, 114],
                    [1, 1, 39],
                    [2, 1, 124],
                ],
                [
                    [2, 0, 241],
                    [2, 1, 156],
                    [1, 1, 201],
                    [1, 2, 31],
                ],
                [
                    [2, 2, 124],
                    [1, 2, 39],
                    [1, 1, 114],
                    [0, 1, 199],
                ],
                [
                    [0, 2, 31],
                    [0, 1, 201],
                    [1, 1, 156],
                    [1, 0, 241],
                ],
            ],
        },
        preview: {
            w: 3,
            h: 2,
            data: [
                [0, 0, 199],
                [1, 0, 114],
                [1, 1, 39],
                [2, 1, 124],
            ],
        },
    },
    l: {
        matrix: {
            w: 3,
            h: 3,
            dx: 1,
            dy: 1,
            data: [
                [
                    [2, 0, 241],
                    [0, 1, 199],
                    [1, 1, 68],
                    [2, 1, 156],
                ],
                [
                    [2, 2, 124],
                    [1, 0, 241],
                    [1, 1, 17],
                    [1, 2, 39],
                ],
                [
                    [0, 2, 31],
                    [2, 1, 124],
                    [1, 1, 68],
                    [0, 1, 201],
                ],
                [
                    [0, 0, 199],
                    [1, 2, 31],
                    [1, 1, 17],
                    [1, 0, 114],
                ],
            ],
        },
        preview: {
            w: 3,
            h: 2,
            data: [
                [2, 0, 241],
                [0, 1, 199],
                [1, 1, 68],
                [2, 1, 156],
            ],
        },
    },
    o: {
        matrix: {
            w: 2,
            h: 2,
            dx: 0,
            dy: 1,
            data: [
                [
                    [0, 0, 193],
                    [1, 0, 112],
                    [0, 1, 7],
                    [1, 1, 28],
                ],
                [
                    [1, 0, 112],
                    [1, 1, 28],
                    [0, 0, 193],
                    [0, 1, 7],
                ],
                [
                    [1, 1, 28],
                    [0, 1, 7],
                    [1, 0, 112],
                    [0, 0, 193],
                ],
                [
                    [0, 1, 7],
                    [0, 0, 193],
                    [1, 1, 28],
                    [1, 0, 112],
                ],
            ],
        },
        preview: {
            w: 2,
            h: 2,
            data: [
                [0, 0, 193],
                [1, 0, 112],
                [0, 1, 7],
                [1, 1, 28],
            ],
        },
    },
    s: {
        matrix: {
            w: 3,
            h: 3,
            dx: 1,
            dy: 1,
            data: [
                [
                    [1, 0, 201],
                    [2, 0, 124],
                    [0, 1, 199],
                    [1, 1, 156],
                ],
                [
                    [2, 1, 114],
                    [2, 2, 31],
                    [1, 0, 241],
                    [1, 1, 39],
                ],
                [
                    [1, 2, 156],
                    [0, 2, 199],
                    [2, 1, 124],
                    [1, 1, 201],
                ],
                [
                    [0, 1, 39],
                    [0, 0, 241],
                    [1, 2, 31],
                    [1, 1, 114],
                ],
            ],
        },
        preview: {
            w: 3,
            h: 2,
            data: [
                [1, 0, 201],
                [2, 0, 124],
                [0, 1, 199],
                [1, 1, 156],
            ],
        },
    },
    i: {
        matrix: {
            w: 4,
            h: 4,
            dx: 1,
            dy: 1,
            data: [
                [
                    [0, 1, 199],
                    [1, 1, 68],
                    [2, 1, 68],
                    [3, 1, 124],
                ],
                [
                    [2, 0, 241],
                    [2, 1, 17],
                    [2, 2, 17],
                    [2, 3, 31],
                ],
                [
                    [3, 2, 124],
                    [2, 2, 68],
                    [1, 2, 68],
                    [0, 2, 199],
                ],
                [
                    [1, 3, 31],
                    [1, 2, 17],
                    [1, 1, 17],
                    [1, 0, 241],
                ],
            ],
        },
        preview: {
            w: 4,
            h: 1,
            data: [
                [0, 0, 199],
                [1, 0, 68],
                [2, 0, 68],
                [3, 0, 124],
            ],
        },
    },
    j: {
        matrix: {
            w: 3,
            h: 3,
            dx: 1,
            dy: 1,
            data: [
                [
                    [0, 0, 241],
                    [0, 1, 39],
                    [1, 1, 68],
                    [2, 1, 124],
                ],
                [
                    [2, 0, 124],
                    [1, 0, 201],
                    [1, 1, 17],
                    [1, 2, 31],
                ],
                [
                    [2, 2, 31],
                    [2, 1, 114],
                    [1, 1, 68],
                    [0, 1, 199],
                ],
                [
                    [0, 2, 199],
                    [1, 2, 156],
                    [1, 1, 17],
                    [1, 0, 241],
                ],
            ],
        },
        preview: {
            w: 3,
            h: 2,
            data: [
                [0, 0, 241],
                [0, 1, 39],
                [1, 1, 68],
                [2, 1, 124],
            ],
        },
    },
    t: {
        matrix: {
            w: 3,
            h: 3,
            dx: 1,
            dy: 1,
            data: [
                [
                    [1, 0, 241],
                    [0, 1, 199],
                    [1, 1, 164],
                    [2, 1, 124],
                ],
                [
                    [2, 1, 124],
                    [1, 0, 241],
                    [1, 1, 41],
                    [1, 2, 31],
                ],
                [
                    [1, 2, 31],
                    [2, 1, 124],
                    [1, 1, 74],
                    [0, 1, 199],
                ],
                [
                    [0, 1, 199],
                    [1, 2, 31],
                    [1, 1, 146],
                    [1, 0, 241],
                ],
            ],
        },
        preview: {
            w: 3,
            h: 2,
            data: [
                [1, 0, 241],
                [0, 1, 199],
                [1, 1, 164],
                [2, 1, 124],
            ],
        },
    },
    oo: {
        matrix: {
            w: 4,
            h: 4,
            dx: 1,
            dy: 1,
            data: [
                [
                    [0, 1, 193],
                    [1, 1, 64],
                    [2, 1, 64],
                    [3, 1, 112],
                    [0, 2, 7],
                    [1, 2, 4],
                    [2, 2, 4],
                    [3, 2, 28],
                ],
                [
                    [2, 0, 112],
                    [2, 1, 16],
                    [2, 2, 16],
                    [2, 3, 28],
                    [1, 0, 193],
                    [1, 1, 1],
                    [1, 2, 1],
                    [1, 3, 7],
                ],
                [
                    [3, 2, 28],
                    [2, 2, 68],
                    [1, 2, 68],
                    [0, 2, 7],
                    [3, 1, 112],
                    [2, 1, 64],
                    [1, 1, 64],
                    [0, 1, 193],
                ],
                [
                    [1, 3, 7],
                    [1, 2, 1],
                    [1, 1, 1],
                    [1, 0, 193],
                    [2, 3, 28],
                    [2, 2, 16],
                    [2, 1, 16],
                    [2, 0, 112],
                ],
            ],
        },
        preview: {
            w: 4,
            h: 2,
            data: [
                [0, 0, 193],
                [1, 0, 64],
                [2, 0, 64],
                [3, 0, 112],
                [0, 1, 7],
                [1, 1, 4],
                [2, 1, 4],
                [3, 1, 28],
            ],
        },
        xweight: 1,
    },
};

var Tetromino = /** @class */ (function () {
    function Tetromino(options) {
        this.rotation = options.initialRotation;
        this.symbol = options.symbol;
        var tetromino = tetrominoes[this.symbol.toLowerCase()];
        this.states = tetromino.matrix.data;
        this.location = [
            Math.floor(options.boardWidth / 2 - tetromino.matrix.w / 2),
            options.boardHeight + 2,
        ];
        this.stats = {
            b2b: -1,
            combo: -1,
        };
    }
    Object.defineProperty(Tetromino.prototype, "blocks", {
        get: function () {
            return this.states[Math.min(this.rotation, this.states.length)];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tetromino.prototype, "rotation", {
        get: function () {
            return (this._rotation % 4);
        },
        set: function (value) {
            this._rotation = (value % 4);
        },
        enumerable: false,
        configurable: true
    });
    Tetromino.prototype.rotate = function (board, kickTable, amt) {
        var rotatedBlocks = this.states[(this.rotation + amt) % 4];
        var kickRes = performKick(kickTable, this.symbol, this.location, rotatedBlocks, this.rotation, ((this.rotation + amt) % 4), board);
        if (typeof kickRes === "object") {
            var kick = kickRes.kick;
            this.location = [this.location[0] + kick[0], this.location[1] + kick[1]];
        }
        if (kickRes) {
            this.rotation = this.rotation + amt;
            return kickRes;
        }
        return false;
    };
    Tetromino.prototype.rotateCW = function (board, kickTable) {
        return this.rotate(board, kickTable, 1);
    };
    Tetromino.prototype.rotateCCW = function (board, kickTable) {
        return this.rotate(board, kickTable, 3);
    };
    Tetromino.prototype.rotate180 = function (board, kickTable) {
        return this.rotate(board, kickTable, 2);
    };
    Tetromino.prototype.moveRight = function (board) {
        var _this = this;
        if (legal(this.blocks.map(function (block) { return [
            block[0] + _this.location[0] + 1,
            -block[1] + _this.location[1],
        ]; }), board)) {
            this.location[0]++;
            return true;
        }
        return false;
    };
    Tetromino.prototype.moveLeft = function (board) {
        var _this = this;
        if (legal(this.blocks.map(function (block) { return [
            block[0] + _this.location[0] - 1,
            -block[1] + _this.location[1],
        ]; }), board)) {
            this.location[0]--;
            return true;
        }
        return false;
    };
    Tetromino.prototype.softDrop = function (board) {
        var _this = this;
        while (legal(this.blocks.map(function (block) { return [
            block[0] + _this.location[0],
            -block[1] + _this.location[1] - 1,
        ]; }), board)) {
            this.location[1]--;
        }
        return true;
    };
    return Tetromino;
}());

var deepCopy = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var calculateIncrease = function (base, frames, increase, marginTime) {
    var times = Math.floor(Math.max(0, frames - marginTime) / 60);
    return base + increase * times;
};

var garbageData = {
    single: 0,
    double: 1,
    triple: 2,
    quad: 4,
    penta: 5,
    tspinMini: 0,
    tspin: 0,
    tspinMiniSingle: 0,
    tspinSingle: 2,
    tspinMiniDouble: 1,
    tspinDouble: 4,
    tspinTriple: 6,
    tspinQuad: 10,
    tspinPenta: 12,
    backtobackBonus: 1,
    backtobackBonusLog: 0.8,
    comboMinifier: 1,
    comboMinifierLog: 1.25,
    comboBonus: 0.25,
    allClear: 10,
    comboTable: {
        none: [0],
        "classic guideline": [0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5],
        "modern guideline": [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4],
    },
};
var garbageCalcV2 = function (data, config) {
    var garbage = 0;
    var rawSpin = data.spin, lines = data.lines, piece = data.piece, combo = data.combo, b2b = data.b2b, enemies = data.enemies, perfectClear = data.perfectClear;
    var spinBonuses = config.spinBonuses, comboTable = config.comboTable, b2bChaining = config.b2bChaining, garbageMultiplier = config.garbageMultiplier, garbageTargetBonus = config.garbageTargetBonus, garbageAttackCap = config.garbageAttackCap; config.garbageBlocking;
    var spin = rawSpin === "none" ? null : rawSpin === "full" ? "normal" : rawSpin;
    switch (lines) {
        case 0:
            garbage =
                spin === "mini"
                    ? garbageData.tspinMini
                    : spin === "normal"
                        ? garbageData.tspin
                        : 0;
            break;
        case 1:
            garbage =
                spin === "mini"
                    ? garbageData.tspinMiniSingle
                    : spin === "normal"
                        ? garbageData.tspinSingle
                        : garbageData.single;
            break;
        case 2:
            garbage =
                spin === "mini"
                    ? garbageData.tspinMiniDouble
                    : spin === "normal"
                        ? garbageData.tspinDouble
                        : garbageData.double;
            break;
        case 3:
            garbage = spin ? garbageData.tspinTriple : garbageData.triple;
            break;
        case 4:
            garbage = spin ? garbageData.tspinQuad : garbageData.quad;
            break;
        case 5:
            garbage = spin ? garbageData.tspinPenta : garbageData.penta;
            break;
        default: {
            var t = lines - 5;
            garbage = spin ? garbageData.tspinPenta + 2 * t : garbageData.penta + t;
            break;
        }
    }
    if (spin && spinBonuses === "handheld" && piece.toUpperCase() !== "T") {
        garbage /= 2;
    }
    if (lines > 0 && b2b > 0) {
        if (b2bChaining) {
            var b2bGains = garbageData.backtobackBonus *
                (Math.floor(1 + Math.log1p(b2b * garbageData.backtobackBonusLog)) +
                    (b2b == 1
                        ? 0
                        : (1 + (Math.log1p(b2b * garbageData.backtobackBonusLog) % 1)) /
                            3));
            garbage += b2bGains;
        }
        else {
            garbage += garbageData.backtobackBonus;
        }
    }
    if (combo > 0) {
        if (comboTable === "multiplier") {
            garbage *= 1 + garbageData.comboBonus * combo;
            if (combo > 1) {
                garbage = Math.max(Math.log1p(garbageData.comboMinifier * combo * garbageData.comboMinifierLog), garbage);
            }
        }
        else {
            var comboTableData = garbageData.comboTable[comboTable] || [0];
            garbage +=
                comboTableData[Math.max(0, Math.min(combo - 1, comboTableData.length - 1))];
        }
    }
    var garbageMultiplierValue = calculateIncrease(garbageMultiplier.value, data.frame, garbageMultiplier.increase, garbageMultiplier.marginTime);
    var garbageBonus = 0;
    if (lines > 0 && garbageTargetBonus !== "none") {
        var targetBonus = 0;
        switch (enemies) {
            case 0:
            case 1:
                break;
            case 2:
                targetBonus += 1;
                break;
            case 3:
                targetBonus += 3;
                break;
            case 4:
                targetBonus += 5;
                break;
            case 5:
                targetBonus += 7;
                break;
            default:
                targetBonus += 9;
        }
        if (garbageTargetBonus === "normal") {
            garbage += targetBonus;
        }
        else {
            garbageBonus = Math.floor(targetBonus * garbageMultiplierValue);
        }
    }
    var l = Math.floor(garbage * garbageMultiplierValue);
    if (garbageAttackCap) {
        l = Math.floor(Math.min(garbageAttackCap, l));
    }
    // todo: what is e.atm.fightlines, what is garbagebonus
    return {
        garbage: l + (perfectClear ? 10 * garbageMultiplierValue : 0),
        bonus: garbageBonus * garbageMultiplierValue,
    };
};

var bfs = function (engine, depth, target) {
    var keys = {
        left: engine.moveLeft.bind(engine),
        right: engine.moveRight.bind(engine),
        cw: engine.rotateCW.bind(engine),
        ccw: engine.rotateCCW.bind(engine),
        "180": engine.rotate180.bind(engine),
        soft: engine.softDrop.bind(engine),
    };
    var queue = [];
    var reset = (function () {
        var og = {
            rotation: engine.falling.rotation,
            location: __spreadArray([], engine.falling.location, true),
        };
        return function () {
            engine.falling.rotation = og.rotation;
            engine.falling.location = [og.location[0], og.location[1]];
        };
    })();
    // populate queue with first moves
    for (var _i = 0, _a = [null, "ccw", "cw", "180"]; _i < _a.length; _i++) {
        var rot = _a[_i];
        if (rot) {
            keys[rot]();
        }
        var left = engine.falling.blocks.reduce(function (a, b) { return [Math.min(a[0], b[0]), 0]; })[0] +
            engine.falling.location[0];
        var right = engine.board.width -
            1 -
            (engine.falling.blocks.reduce(function (a, b) { return [Math.max(a[0], b[0]), 0]; })[0] +
                engine.falling.location[0]);
        for (var x = 0; x < left; x++) {
            if (!rot && x === 0)
                continue;
            var k = rot
                ? __spreadArray([
                    rot
                ], Array(x)
                    .fill("")
                    .map(function () { return "left"; }), true) : __spreadArray([], Array(x)
                .fill("")
                .map(function () { return "left"; }), true);
            queue.push(k);
        }
        for (var x = 1; x < right; x++) {
            var k = rot
                ? __spreadArray([
                    rot
                ], Array(x)
                    .fill("")
                    .map(function () { return "right"; }), true) : __spreadArray([], Array(x)
                .fill("")
                .map(function () { return "right"; }), true);
            queue.push(k);
        }
        reset();
    }
    while (queue.length > 0) {
        var item = queue.shift();
        for (var _b = 0, _c = item.slice(0, item.length - 1); _b < _c.length; _b++) {
            var key = _c[_b];
            keys[key]();
        }
        var og = {
            rotation: engine.falling.rotation,
            location: __spreadArray([], engine.falling.location, true),
        };
        keys[item.at(-1)]();
        if ((["ccw", "cw", "180"].includes(item.at(-1)) &&
            engine.falling.rotation === og.rotation) ||
            (["left", "right"].includes(item.at(-1)) &&
                engine.falling.location[0] === og.location[0] &&
                engine.falling.location[1] === og.location[1])) {
            reset();
            continue;
        }
        // check if all blocks match
        if (engine.falling.blocks
            .map(function (block) { return [
            engine.falling.location[0] + block[0],
            engine.falling.location[1] - block[1],
        ]; })
            .every(function (block) {
            return target.filter(function (t) { return t[0] === block[0] && t[1] === block[1]; })
                .length > 0;
        })) {
            reset();
            if (item[item.length - 1] === "soft") {
                item.splice(item.length - 1, 1);
            }
            return item;
        }
        else {
            if (item.length >= depth) {
                reset();
                continue;
            }
            var lastKey = item.at(-1);
            for (var _d = 0, _e = Object.keys(keys); _d < _e.length; _d++) {
                var key = _e[_d];
                if (key === "hard" ||
                    (key === "cw" && lastKey === "ccw") ||
                    (key === "ccw" && lastKey === "cw") ||
                    (key === "right" && lastKey === "left") ||
                    (key === "left" && lastKey === "right"))
                    continue;
                queue.push(__spreadArray(__spreadArray([], item, true), [key], false));
            }
            reset();
        }
    }
    return false;
};

var GarbageQueue = /** @class */ (function () {
    function GarbageQueue(options) {
        this.options = options;
        if (!this.options.cap.absolute)
            this.options.cap.absolute = Infinity;
        this.queue = [];
    }
    Object.defineProperty(GarbageQueue.prototype, "size", {
        get: function () {
            return this.queue.reduce(function (a, b) { return a + b.amount; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    GarbageQueue.prototype.cap = function (frame) {
        return calculateIncrease(this.options.cap.value, frame, this.options.cap.increase, 0);
    };
    GarbageQueue.prototype.recieve = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.queue).push.apply(_a, args);
        while (this.size > this.options.cap.absolute) {
            var total = this.size;
            if (this.queue.at(-1).amount <= total - this.options.cap.absolute) {
                this.queue.pop();
            }
            else {
                this.queue.at(-1).amount -= total - this.options.cap.absolute;
            }
        }
    };
    GarbageQueue.prototype.cancel = function (amount) {
        while (amount > 0) {
            if (this.queue.length <= 0) {
                break;
            }
            if (amount >= this.queue[0].amount) {
                amount -= this.queue[0].amount;
                this.queue.shift();
            }
            else {
                this.queue[0].amount -= amount;
                amount = 0;
                break;
            }
        }
        return amount;
    };
    GarbageQueue.prototype.tank = function (frame) {
        var _this = this;
        var amount = this.cap(frame);
        var res = [];
        var tankable = this.queue.filter(function (garbage) { return frame - garbage.frame >= _this.options.speed; });
        this.queue = this.queue.sort(function (a, b) { return a.frame - b.frame; });
        while (amount > 0 && tankable.length > 0) {
            if (amount >= this.queue.length) {
                res.push(deepCopy(this.queue.shift()));
                tankable.shift();
            }
            else {
                this.queue[0].amount -= amount;
                amount = 0;
            }
        }
        return res;
    };
    return GarbageQueue;
}());

var Engine = /** @class */ (function () {
    function Engine(options) {
        this.queue = new Queue(options.queue);
        this._kickTable = options.kickTable;
        this.board = new Board(options.board);
        this.garbageQueue = new GarbageQueue(options.garbage);
        this.nextPiece();
        this.held = null;
        this.lastSpin = null;
        this.stats = {
            combo: -1,
            b2b: -1,
        };
        this.gameOptions = options.options;
        this.frame = 0;
    }
    Object.defineProperty(Engine.prototype, "kickTable", {
        get: function () {
            return kicks[this._kickTable];
        },
        set: function (value) {
            this._kickTable = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "kickTableName", {
        get: function () {
            return this._kickTable;
        },
        enumerable: false,
        configurable: true
    });
    Engine.prototype.nextPiece = function () {
        var newTetromino = this.queue.shift();
        this.initiatePiece(newTetromino);
    };
    Engine.prototype.initiatePiece = function (piece) {
        this.falling = new Tetromino({
            boardHeight: this.board.height,
            boardWidth: this.board.width,
            initialRotation: piece.toLowerCase() in this.kickTable.spawn_rotation
                ? this.kickTable.spawn_rotation[piece.toLowerCase()]
                : 0,
            symbol: piece,
        });
    };
    Engine.prototype.isTSpinKick = function (kick) {
        if (typeof kick === "object") {
            return ((kick.id === "03" && kick.index === 3) ||
                (kick.id === "21" && kick.index === 3));
        }
        return false;
    };
    Engine.prototype.rotateCW = function () {
        this.lastSpin = {
            piece: this.falling.symbol,
            type: this.detectSpin(this.isTSpinKick(this.falling.rotateCW(this.board.state, this.kickTableName))),
        };
    };
    Engine.prototype.rotateCCW = function () {
        this.lastSpin = {
            piece: this.falling.symbol,
            type: this.detectSpin(this.isTSpinKick(this.falling.rotateCCW(this.board.state, this.kickTableName))),
        };
    };
    Engine.prototype.rotate180 = function () {
        this.lastSpin = {
            piece: this.falling.symbol,
            type: this.detectSpin(this.isTSpinKick(this.falling.rotate180(this.board.state, this.kickTableName))),
        };
    };
    Engine.prototype.moveRight = function () {
        this.falling.moveRight(this.board.state);
    };
    Engine.prototype.moveLeft = function () {
        this.falling.moveLeft(this.board.state);
    };
    Engine.prototype.softDrop = function () {
        this.falling.softDrop(this.board.state);
    };
    Engine.prototype.detectSpin = function (finOrTst) {
        if (this.falling.symbol === "T") {
            return this.detectTSpin(finOrTst);
        }
        return "none";
    };
    Engine.prototype.detectTSpin = function (finOrTst) {
        if (this.falling.symbol !== "T")
            return "none";
        if (finOrTst)
            return "normal";
        var corners = this.getTCorners();
        if (corners.filter(function (item) { return item; }).length < 3)
            return "none";
        var facingCorners = [
            corners[this.falling.rotation],
            corners[(this.falling.rotation + 1) % 4],
        ];
        if (facingCorners[0] && facingCorners[1]) {
            return "normal";
        }
        return "mini";
    };
    /**
     * Returns array of true/false corners in this form (numbers represent array indicies):
     * @example
     *  0    1
     *  🟦🟦🟦
     *  3 🟦 2
     */
    Engine.prototype.getTCorners = function () {
        var _this = this;
        var _a = [this.falling.location[0] + 1, this.falling.location[1] - 1], x = _a[0], y = _a[1];
        var getLocation = function (x, y) {
            return x < 0
                ? true
                : x >= _this.board.width
                    ? true
                    : y < 0
                        ? true
                        : _this.board.state[y][x] !== null;
        };
        return [
            getLocation(x - 1, y + 1),
            getLocation(x + 1, y + 1),
            getLocation(x + 1, y - 1),
            getLocation(x - 1, y - 1),
        ];
    };
    Engine.prototype.hardDrop = function () {
        var _a;
        var _this = this;
        this.softDrop();
        (_a = this.board).add.apply(_a, this.falling.blocks.map(function (block) { return [
            _this.falling.symbol,
            _this.falling.location[0] + block[0],
            _this.falling.location[1] - block[1],
        ]; }));
        var lines = this.board.clearLines();
        if (lines > 0) {
            this.stats.combo++;
            if ((this.lastSpin && this.lastSpin.type !== "none") || lines > 4) {
                this.stats.b2b++;
            }
            else
                this.stats.b2b = -1;
        }
        else {
            this.stats.combo = -1;
        }
        var res = {
            lines: lines,
            spin: this.lastSpin ? this.lastSpin.type : "none",
            sent: garbageCalcV2({
                b2b: Math.max(this.stats.b2b, 0),
                combo: Math.max(this.stats.combo, 0),
                enemies: 0,
                lines: lines,
                perfectClear: this.board.perfectClear,
                piece: this.falling.symbol,
                spin: this.lastSpin ? this.lastSpin.type : "none",
                frame: this.frame,
            }, this.gameOptions).garbage,
            garbageAdded: false,
        };
        if (lines > 0) {
            res.sent -= this.garbageQueue.cancel(res.sent);
        }
        else {
            var garbages = this.garbageQueue.tank(this.frame);
            res.garbageAdded = garbages.length > 0;
            garbages.forEach(function (garbage) { return _this.board.insertGarbage(garbage); });
        }
        this.nextPiece();
        this.lastSpin = null;
        return res;
    };
    Engine.prototype.recieveGarbage = function () {
        var _a;
        var garbage = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            garbage[_i] = arguments[_i];
        }
        (_a = this.garbageQueue).recieve.apply(_a, garbage);
    };
    Engine.prototype.hold = function () {
        if (this.held) {
            var save = this.held;
            this.held = this.falling.symbol;
            this.initiatePiece(save);
        }
        else {
            this.held = this.falling.symbol;
            this.nextPiece();
        }
    };
    Engine.prototype.getPreview = function (piece) {
        return tetrominoes[piece.toLowerCase()].preview;
    };
    Engine.prototype.bfs = function (depth, target) {
        return bfs(this, depth, target);
    };
    Engine.prototype.onQueuePieces = function (listener) {
        this.queue.onRepopulate(listener);
    };
    return Engine;
}());

exports.Engine = Engine;
