/**
 * @namespace
 */
var Igloo = Igloo || {};

/**
 * Asynchronously or synchronously fetch data from the server.
 * @param {string} url
 * @param {Function} [callback]
 * @returns {string}
 */
Igloo.fetch = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, Boolean(callback));
    if (callback != null) {
        xhr.onload = function() {
            callback(xhr.responseText);
        };
    }
    xhr.send();
    return xhr.responseText;
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} [error] If true, throw an error rather than return null
 * @returns {?WebGLRenderingContext} a WebGL rendering context.
 */
Igloo.getContext = function(canvas, error) {
    var gl;
    try {
        gl = canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
    } catch (e) {
        gl = null;
    }
    if (gl == null && error) {
        throw new Error('Could not create WebGL context.');
    } else {
        return gl;
    }
};

/**
 * Fluent WebGLProgram wrapper for managing variables and data. The
 * constructor compiles and links a program from a pair of shaders.
 * Throws an exception if compiling or linking fails.
 * @param {WebGLRenderingContext|HTMLCanvasElement} gl
 * @param {string} vertUrl
 * @param {string} fragUrl
 * @param {Function} [tff] source transform function
 * @constructor
 */
Igloo.Program = function(gl, vertUrl, fragUrl, tff) {
    if  (gl instanceof HTMLCanvasElement) {
        gl = Igloo.getContext(gl, true);
    }
    this.gl = gl;
    this.program = gl.createProgram();
    gl.attachShader(this.program,
                    this.makeShader(gl.VERTEX_SHADER, vertUrl, tff));
    gl.attachShader(this.program,
                    this.makeShader(gl.FRAGMENT_SHADER, fragUrl, tff));
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(this.program));
    }
    this.vars = {};
};

/**
 * Compile a shader from a URL.
 * @param {number} type
 * @param {string} url
 * @param {Function} [tff] source transform function
 * @returns {WebGLShader}
 */
Igloo.Program.prototype.makeShader = function(type, url, tff) {
    var gl = this.gl;
    var shader = gl.createShader(type), source = Igloo.fetch(url);
    if (tff != null) source = tff(source);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        throw new Error(gl.getShaderInfoLog(shader));
    }
};

/**
 * Tell WebGL to use this program right now.
 * @returns {Igloo.Program} this
 */
Igloo.Program.prototype.use = function() {
    this.gl.useProgram(this.program);
    return this;
};

/**
 * Declare/set a uniform or set a uniform's data.
 * @param {string} name uniform variable name
 * @param {number|Point} [value]
 * @param {boolean} [i] if true, use the integer function
 * @returns {Igloo.Program} this
 */
Igloo.Program.prototype.uniform = function(name, value, i) {
    if (value == null) {
        this.vars[name] = this.gl.getUniformLocation(this.program, name);
    } else {
        if (this.vars[name] == null) this.uniform(name);
        var v = this.vars[name];
        if (value instanceof VecN) {
            switch (value.length) {
            case 2:
                if (i)
                    this.gl.uniform2i(v, value.x, value.y);
                else
                    this.gl.uniform2f(v, value.x, value.y);
                break;
            case 3:
                if (i)
                    this.gl.uniform3i(v, value.x, value.y, value.z);
                else
                    this.gl.uniform3f(v, value.x, value.y, value.z);
                break;
            case 4:
                if (i)
                    this.gl.uniform4i(v, value.x, value.y, value.z, value.w);
                else
                    this.gl.uniform4f(v, value.x, value.y, value.z, value.w);
                break;
            default:
                throw new Error('Invalid vector length');
            }
        } else if (i) {
            this.gl.uniform1i(v, value);
        } else {
            this.gl.uniform1f(v, value);
        }
    }
    return this;
};

/**
 * Declare an attrib or set an attrib's buffer.
 * @param {string} name attrib variable name
 * @param {WebGLBuffer} [value]
 * @param {number} [size] element size
 * @param {number} [stride]
 * @returns {Igloo.Program} this
 */
Igloo.Program.prototype.attrib = function(name, value, size, stride) {
    if (value == null) {
        this.vars[name] = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(this.vars[name]);
    } else {
        if (this.vars[name] == null) this.attrib(name);
        var gl = this.gl;
        if (value instanceof Igloo.Buffer) {
            value.bind();
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, value);
        }
        gl.vertexAttribPointer(this.vars[name], size, gl.FLOAT,
                               false, stride == null ? 0 : stride, 0);
    }
    return this;
};

/**
 * Call drawArrays with this program. You must call this.use() first.
 * @param {number} mode
 * @param {number} count the total buffer length
 * @returns {Igloo.Program} this
 */
Igloo.Program.prototype.draw = function(mode, count) {
    this.gl.drawArrays(mode, 0, count);
    if (this.gl.getError() !== this.gl.NO_ERROR) {
        throw new Error('WebGL rendering error');
    }
    return this;
};

/**
 * Fluent WebGLBuffer wrapper.
 * @param {WebGLRenderingContext|HTMLCanvasElement} gl
 * @param {ArrayBuffer|ArrayBufferView} [data]
 * @param {GLenum} [usage]
 * @returns {WebGLProgram}
 * @constructor
 */
Igloo.Buffer = function(gl, data, usage) {
    if  (gl instanceof HTMLCanvasElement) {
        gl = Igloo.getContext(gl, true);
    }
    usage = usage == null ? gl.STATIC_DRAW : usage;
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.size = -1;
    if (data != null) {
        this.update(data, usage);
    }
};

/**
 * Binds this buffer to ARRAY_BUFFER.
 * @returns {Igloo.Buffer} this
 */
Igloo.Buffer.prototype.bind = function() {
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    return this;
};

/**
 * @param
 * @param {ArrayBuffer|ArrayBufferView} data
 * @param {GLenum} [usage]
 * @returns {Igloo.Buffer} this
 */
Igloo.Buffer.prototype.update = function(data, usage) {
    var gl = this.gl;
    usage = usage == null ? gl.STREAM_DRAW : usage;
    this.bind();
    if (this.size !== data.byteLength) {
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        this.size = data.byteLength;
    } else {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    }
    return this;
};
