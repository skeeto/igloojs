/**
 * Fluent WebGLProgram wrapper for managing variables and data. The
 * constructor compiles and links a program from a pair of shaders.
 * Throws an exception if compiling or linking fails.
 * @param {WebGLRenderingContext|HTMLCanvasElement} gl
 * @param {string} vertUrl
 * @param {string} vergrafUrl
 * @returns {WebGLProgram}
 */
function IglooProgram(gl, vertUrl, fragUrl) {
    if  (gl instanceof HTMLCanvasElement) {
        gl = IglooProgram.getContext(gl);
        if (gl == null) throw new Error('Could not create WebGL context.');
    }
    this.gl = gl;
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.makeShader(gl.VERTEX_SHADER, vertUrl));
    gl.attachShader(this.program, this.makeShader(gl.FRAGMENT_SHADER, fragUrl));
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(this.program));
    }
    this.vars = {};
}

/**
 * Asynchronously or synchronously fetch data from the server.
 * @param {string} url
 * @param {Function} [callback]
 * @returns {string}
 */
IglooProgram.fetch = function(url, callback) {
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
 * @returns {?WebGLRenderingContext} a WebGL rendering context.
 */
IglooProgram.getContext = function(canvas) {
    var gl;
    try {
        gl = canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
    } catch (e) {
        gl = null;
    }
    return gl;
};

/**
 * Compile a shader from a URL.
 * @param {number} type
 * @param {string} url
 * @returns {WebGLShader}
 */
IglooProgram.prototype.makeShader = function(type, url) {
    var gl = this.gl;
    var shader = gl.createShader(type);
    gl.shaderSource(shader, IglooProgram.fetch(url));
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        throw new Error(gl.getShaderInfoLog(shader));
    }
};

/**
 * Tell WebGL to use this program right now.
 * @returns {IglooProgram} this
 */
IglooProgram.prototype.use = function() {
    this.gl.useProgram(this.program);
    return this;
};

/**
 * Declare a uniform or set a uniform's data.
 * @param {string} name uniform variable name
 * @param {number|Point} [value]
 * @returns {IglooProgram} this
 */
IglooProgram.prototype.uniform = function(name, value) {
    if (value == null) {
        this.vars[name] = this.gl.getUniformLocation(this.program, name);
    } else {
        if (this.vars[name] == null) this.uniform(name);
        var v = this.vars[name];
        if (value instanceof VecN) {
            switch (value.length) {
            case 2:
                this.gl.uniform2f(v, value.x, value.y);
                break;
            case 3:
                this.gl.uniform3f(v, value.x, value.y, value.z);
                break;
            case 4:
                this.gl.uniform4f(v, value.x, value.y, value.z, value.w);
                break;
            default:
                throw new Error('Invalid vector length');
            }
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
 * @returns {IglooProgram} this
 */
IglooProgram.prototype.attrib = function(name, value, size) {
    if (value == null) {
        this.vars[name] = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(this.vars.position);
    } else {
        if (this.vars[name] == null) this.attrib(name);
        var gl = this.gl;
        if (value instanceof IglooBuffer) {
            value.bind();
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, value);
        }
        gl.vertexAttribPointer(this.vars[name], size, gl.FLOAT, false, 0, 0);
    }
    return this;
};

/**
 * Call drawArrays with this program. You must call this.use() first.
 * @param {number} mode
 * @param {number} count the total buffer length
 * @returns {IglooProgram} this
 */
IglooProgram.prototype.draw = function(mode, count) {
    this.gl.drawArrays(mode, 0, count);
    if (this.gl.getError() !== this.gl.NO_ERROR) {
        throw new Error('WebGL rendering error');
    }
    return this;
};
