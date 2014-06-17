# Igloo WebGL

Igloo is a minimal, fluent, object-oriented wrapper API for WebGL. The
idea is to maintain WebGL's low-level graphics access but fit it to
JavaScript idioms and simplify the API.

WebGL requires lots of boilerplate to use directly and the existing
abstraction wrappers are too high-level. The long term goal is to make
prototyping WebGL ideas much quicker and easier so that the OpenGL
calls don't dominate small programs.

![](http://i.imgur.com/snY3Gh2.png)

Igloo is *not* intended to completely replace use of the
WebGLRenderingContext object. It's still needed for all the
enumerations, and occasionally you may need to do something that Igloo
doesn't cover.

## Example Usage

```js
function Demo() {
    var igloo    = this.igloo = new Igloo($('#my-canvas')[0]);
    this.quad    = igloo.array(Igloo.QUAD2);        // create array buffer
    this.image   = igloo.texture($('#image')[0]);   // create texture
    this.program = igloo.program('src/project.vert', 'src/tint.frag');
}

Demo.prototype.draw = function() {
    this.image.bind(0);  // active texture 0
    program.use()
        .uniform('tint', vec3(1, 0, 0))
        .uniform('scale', 1.2)
        .uniformi('image', 0)
        .attrib('points', buffer)
        .draw(igloo.gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
}
```

This example (shader code not shown) would display a scaled, tinted
image on the screen.

## Documentation

All functions and methods have complete JSDoc headers. Someday this
will used to automatically generate documentation.

Igloo has wrapper objects for programs, array buffers, element array
buffers, textures, and framebuffers. The object being wrapped is
directly accessible through the name of the kind of thing
(texobject.texture, arraybuffer.buffer, etc.) in case you need to
access it.

## Vector and Matrix Library

Vectors come in three lengths: 2, 3, or 4. They are intended to be
immutable, reasonably performant, support swizzling, and can be
constructed from each other like GLSL vectors.

```js
var foo = vec3(1, 2, 3);
foo.zxy;         // => {x: 3, y: 2, z: 1}
var bar = vec4(foo.xy, -1, 0);
bar;             // => {x: 1, y: 2, z: -1, w: 0}
```

These vectors can be given to the `uniform()` method for binding to
shader uniforms.

Matrix library coming soon.
