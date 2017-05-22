# Igloo WebGL

Igloo is a minimal, fluent, object-oriented wrapper API for WebGL. The
idea is to maintain WebGL's low-level graphics access but fit it to
JavaScript idioms and simplify the API. It's designed to play *very*
well with [glMatrix](http://glmatrix.net/), though its use is not
strictly required.

WebGL requires lots of boilerplate to use directly and the existing
abstraction wrappers are too high-level. The long term goal is to make
prototyping WebGL ideas much quicker and easier so that the OpenGL
calls don't dominate small programs.

![](http://i.imgur.com/snY3Gh2.png)

Igloo is *not* intended to completely replace use of the
WebGLRenderingContext object, nor is it intended to hide details from
beginners. The WebGLRenderingContext object still needed for all the
enumerations, occasionally you may need to do something that Igloo
doesn't cover, and you still need to understand the intricacies of the
OpenGL API.

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
    this.program.use()
        .uniform('tint', [1, 0, 0])
        .uniform('scale', 1.2)
        .uniformi('image', 0)
        .attrib('points', this.quad, 2)
        .draw(this.igloo.gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
}
```

This example (shader code not shown) would display a scaled, tinted
image on the screen. No other WebGL calls are required to make this
work.

## Documentation

All functions and methods have complete JSDoc headers. Someday this
will used to automatically generate documentation.

Igloo has wrapper objects for programs, array buffers, element array
buffers, textures, and framebuffers. The object being wrapped is
directly accessible through the name of the kind of thing
(texobject.texture, arraybuffer.buffer, etc.) in case you need to
access it.

## Alternative Bindings

* [skew-igloo](https://github.com/ryankaplan/skew-igloo) (Skew)
* [igloo-ts](https://github.com/joewood/igloo-ts) (TypeScirpt)

## IglooJS Showcase

* Visualizations in [NYT: Miles of Ice Collapsing Into the Sea](https://www.nytimes.com/interactive/2017/05/18/climate/antarctica-ice-melt-climate-change.html)
* Various demos:
 [Liquid](http://nullprogram.com/fun-liquid/webgl/),
 [Particles](http://nullprogram.com/webgl-particles/),
 [Voronoi](http://nullprogram.com/voronoi-toy/),
 [Game of Life](http://nullprogram.com/webgl-game-of-life/),
 [Path Solver](http://nullprogram.com/webgl-path-solver/),
 [Feedback](http://nullprogram.com/Feedback/webgl/)
