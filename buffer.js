/**
 * Fluent WebGLBuffer wrapper.
 * @param {WebGLRenderingContext|HTMLCanvasElement} gl
 * @param {ArrayBuffer|ArrayBufferView} [data]
 * @param {GLenum} [usage]
 * @returns {WebGLProgram}
 */

function IglooBuffer(gl, data, usage) {
    if  (gl instanceof HTMLCanvasElement) {
        gl = IglooProgram.getContext(gl);
        if (gl == null) throw new Error('Could not create WebGL context.');
    }
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.size = -1;
    if (data != null) {
        this.update(data, usage);
    }
}

/**
 * Binds this buffer to ARRAY_BUFFER.
 * @returns {IglooBuffer} this
 */
IglooBuffer.prototype.bind = function() {
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    return this;
};

/**
 * @param
 * @param {ArrayBuffer|ArrayBufferView} data
 * @param {GLenum} [usage]
 * @returns {IglooBuffer} this
 */
IglooBuffer.prototype.update = function(data, usage) {
    var gl = this.gl;
    usage = usage == null ? gl.STREAM_DRAW : usage;
    this.bind();
    if (this.size !== data.byteLength) {
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        this.size = data.byteLength;
    } else {
        this.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    }
    return this;
};
