# Igloo WebGL

*This library is still in its early stage.*

Igloo is a fluent, object-oriented wrapper API for WebGL. The goal is
to maintain WebGL's low-level graphics access but fit it to JavaScript
idioms. As it stands, WebGL requires too much boilerplate to easily
use directly and the existing abstraction wrappers are high-level.

Igloo is oriented primarily around OpenGL programs and flexible
GLSL-like vectors. WebGL errors result in exceptions, dropping WebGL's
original C-style result checking.

```js
var canvas = document.getElementById('my-canvas');
var program = new IglooProgram(canvas, 'src/project.vert', 'src/color.frag');
// ...
program.use()
    .uniform('color', vec3(1, 0, 0))
    .uniform('scale', 10)
    .attrib('points', vertices)
    .draw(program.gl.TRIANGLES, vertices.length / 3);
```

Vectors come in three lengths: 2, 3, or 4. They are immutable,
reasonably performant, support swizzling, and can be constructed from
each other like GLSL vectors.

```js
var foo = vec3(1, 2, 3);
foo.zxy;         // => "[Vec3 (3, 1, 2)]"
var bar = vec4(foo.xy, -1, 0);
bar.toString();  // => "[Vec4 (1, 2, -1, 0)]
```
