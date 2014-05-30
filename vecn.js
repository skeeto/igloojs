/**
 * Fast, immutable vector implementations via metaprogramming.
 * @namespace
 * @constructor
 */
var VecN = VecN || function() {};

VecN.FIELDS = 'xyzwabcdefghijklmnopqrstuv'.split('');

VecN.make = function(n) {
    if (n > VecN.FIELDS.length) {
        throw new Error('VecN limited to ' + VecN.FIELDS.length);
    }

    function func(params, body) {
        var args = params.slice(0);
        args.push(body);
        args.unshift(null);
        var factory = Function.bind.apply(Function, args);
        return new factory();
    }

    var fields = VecN.FIELDS.slice(0, n);

    /**
     * @constructor
     */
    var Vec = func(fields, fields.map(function(field) {
        return 'this.' + field + ' = ' + field + ';';
    }).join('\n'));

    Vec.prototype = Object.create(VecN.prototype);
    Vec.prototype.constructor = Vec;
    Vec.prototype.length = n;
    Vec.prototype.VecN = this;

    Vec.prototype.toString
        = func([], 'return "[Vec' + n + ' (" + ' +
               fields.map(function(field) {
                   return 'this.' + field;
               }).join(' + ", " + ') + ' + ")]";');

    function create(f, constructor) {
        constructor = constructor || 'this.constructor';
        return 'return new ' + constructor +
            '(' + fields.map(f).join(', ') + ');';
    }

    function opWith(operator) {
        return func(['vec'], create(function(field) {
            return 'this.' + field + ' ' + operator + ' vec.' + field;
        }));
    }

    /**
     * @method
     */
    Vec.prototype.add = opWith('+');

    /**
     * @method
     */
    Vec.prototype.subtract = opWith('-');

    /**
     * @method
     */
    Vec.prototype.multiply = opWith('*');

    /**
     * @method
     */
    Vec.prototype.divide = opWith('/');

    function op(operator) {
        return func(['scalar'], create(function(field) {
            return 'this.' + field + ' ' + operator + ' scalar';
        }));
    }

    /**
     * @method
     */
    Vec.prototype.fadd = op('+');

    /**
     * @method
     */
    Vec.prototype.fsubtract = op('-');

    /**
     * @method
     */
    Vec.prototype.fmultiply = op('*');

    /**
     * @method
     */
    Vec.prototype.fdivide = op('/');

    /**
     * @method
     */
    Vec.prototype.magnitude =
        func([], 'return Math.sqrt(' + fields.map(function(f) {
            return 'this.' + f + ' * this.' + f;
        }).join(' + ') + ');');

    function apply(name, params) {
        params = params || [];
        return func(params, create(function(f) {
            var args = params.slice(0);
            args.unshift('this.' + f);
            return name + '(' + args.join(', ') + ')';
        }));
    };

    /**
     * @method
     */
    Vec.prototype.floor = apply('Math.floor');

    /**
     * @method
     */
    Vec.prototype.ceil = apply('Math.ceil');

    /**
     * @method
     */
    Vec.prototype.abs = apply('Math.abs');

    /**
     * @method
     */
    Vec.prototype.negate = apply('-1 * ');

    /**
     * @method
     */
    Vec.prototype.pow = apply('Math.pow', ['expt']);

    /**
     * @method
     */
    Vec.prototype.pow2 = func([], create(function(f) {
        return 'this.' + f + ' * this.' + f;
    }));

    /**
     * @method
     */
    Vec.prototype.pow3 = func([], create(function(f) {
        return 'this.' + f + ' * this.' + f + ' * this.' + f;
    }));

    /**
     * @method
     */
    Vec.prototype.product = func([], 'return ' + fields.map(function(f) {
        return 'this.' + f;
    }).join(' * ') + ';');


    /**
     * @method
     */
    Vec.prototype.sum = func([], 'return ' + fields.map(function(f) {
        return 'this.' + f;
    }).join(' + ') + ';');

    /**
     * @method
     */
    Vec.prototype.normalize = function normalize() {
        return this.fdivide(this.magnitude());
    };

    /**
     * @method
     */
    Vec.prototype.dot = function dot(vec) {
        return this.multiply(vec).sum();
    };

    /**
     * @method
     */
    Vec.prototype.toArray = func([], 'return [' + fields.map(function(field) {
            return 'this.' + field;
        }).join(', ') + ']');

    /* Setup swizzling. */

    function swizzle(fields) {
        var args = fields.map(function(field) {
            return 'this.' + field;
        }).join(', ');
        Object.defineProperty(Vec.prototype, fields.join(''), {
            get: new Function('return new this.VecN.Vec' + fields.length +
                              '(' + args + ');')
        });
    }

    function swizzleRec(stack, count) {
        fields.forEach(function(field) {
            stack.push(field);
            if (count === 1) {
                swizzle(stack);
            } else {
                swizzleRec(stack, count - 1);
            }
            stack.pop();
        });
    }

    if (n <= 6) { // stop at 7,776
        for (var i = 2; i <= n; i++) {
            swizzleRec([], i);
        }
    }

    Vec.random = func([], create(function() {
        return 'Math.random()';
    }, 'this'));

    return Vec;
};
(10);

/**
 * Create a convenience constructor function.
 * @param {Number} n
 * @returns {Function}
 */
VecN.convenience = function(n) {
    return function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg.toArray) {
                args.push.apply(args, arg.toArray());
            } else {
                args.push(arg);
            }
        }
        var Vec = VecN['Vec' + n];
        var vec = Object.create(Vec.prototype);
        Vec.apply(vec, args);
        return vec;
    };
};

/* Now create vectors of lengths 2, 3, and 4. */
VecN.Vec2 = VecN.make(2);
VecN.Vec3 = VecN.make(3);
VecN.Vec4 = VecN.make(4);
var vec2 = VecN.convenience(2);
var vec3 = VecN.convenience(3);
var vec4 = VecN.convenience(4);
