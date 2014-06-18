/* Matrix library */

var MatN = MatN || function() {};

MatN.Mat2 = function(m00, m01,
                     m10, m11) {
    this[0] = vec2(m00, m01);
    this[1] = vec2(m10, m11);
};
MatN.Mat2.prototype = Object.create(MatN.prototype);
MatN.Mat2.prototype.constructor = MatN.Mat2;

MatN.Mat2.prototype.multiply = function(v) {
    var m = this;
    if (typeof v === 'number') {
        return new MatN.Mat2(v * m[0][0], v * m[0][1],
                             v * m[1][0], v * m[1][1]);
    } else if (v instanceof MatN.Mat2) {
        return new MatN.Mat2
        (m[0][0] * v[0][0] + m[1][0] * v[0][1],
         m[0][1] * v[0][0] + m[1][1] * v[0][1],
         m[0][0] * v[1][0] + m[1][0] * v[1][1],
         m[0][1] * v[1][0] + m[1][1] * v[1][1]);
    } else if (v instanceof VecN.Vec2) {
        return vec2(v.x * m[0][0] + v.y * m[1][0],
                    v.x * m[0][1] + v.y * m[1][1]);
    } else {
        throw new Error('Invalid operand: ' + v);
    }
};

MatN.Mat2.prototype.rotate = function(angle) {
    return this.multiply(new MatN.Mat2(Math.cos(angle), Math.sin(angle),
                                       -Math.sin(angle), Math.cos(angle)));
};

MatN.Mat2.prototype.toString = function() {
    var m = this;
    return '[Mat2 (' + [m[0][0], m[0][1], m[1][0], m[1][1]].join(', ') + ')]';
};

MatN.Mat3 = function(m00, m01, m02,
                     m10, m11, m12,
                     m20, m21, m22) {
    this[0] = vec3(m00, m01, m02);
    this[1] = vec3(m10, m11, m12);
    this[2] = vec3(m20, m21, m22);
};
MatN.Mat3.prototype = Object.create(MatN);
MatN.Mat3.prototype.constructor = MatN.Mat3;

MatN.Mat3.prototype.toString = function() {
    var m = this;
    return '[Mat3 (' + [m[0][0], m[0][1], m[0][2],
                        m[1][0], m[1][1], m[1][2],
                        m[2][0], m[2][1], m[2][2]].join(', ') + ')]';
};

MatN.Mat4 = function(m00, m01, m02, m03,
                     m10, m11, m12, m13,
                     m20, m21, m22, m23,
                     m30, m31, m32, m33) {
    this[0] = vec4(m00, m01, m02, m03);
    this[1] = vec4(m10, m11, m12, m13);
    this[2] = vec4(m20, m21, m22, m23);
    this[3] = vec4(m30, m31, m32, m33);
};
MatN.Mat4.prototype = Object.create(MatN);
MatN.Mat4.prototype.constructor = MatN.Mat4;

MatN.Mat4.prototype.toString = function() {
    var m = this;
    return '[Mat4 (' + [m[0][0], m[0][1], m[0][2], m[0][3],
                        m[1][0], m[1][1], m[1][2], m[1][3],
                        m[2][0], m[2][1], m[2][2], m[2][3],
                        m[3][0], m[3][1], m[3][2], m[3][3]].join(', ') + ')]';
};

MatN.Mat2.IDENTITY = new MatN.Mat2(1, 0, 0, 1);
MatN.Mat3.IDENTITY = new MatN.Mat3(1, 0, 0,
                                   0, 1, 0,
                                   0, 0, 1);
MatN.Mat4.IDENTITY = new MatN.Mat4(1, 0, 0, 0,
                                   0, 1, 0, 0,
                                   0, 0, 1, 0,
                                   0, 0, 0, 1);
