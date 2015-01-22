function $(s) {
    /* dumb jQuery polyfill */
    return [document.querySelector(s)];
};

function Demo() {
    var igloo    = this.igloo = new Igloo($('#my-canvas')[0]);
    this.quad    = igloo.array(Igloo.QUAD2);
    this.image   = igloo.texture($('#image')[0]);
    this.program = igloo.program('project.vert', 'tint.frag');
    this.tick    = 0;
}

Demo.prototype.draw = function() {
    this.image.bind(0);  // active texture 0
    var tint = [Math.sin(this.tick / 13), Math.cos(this.tick / 19), 0];
    this.program.use()
        .uniform('tint', tint)
        .uniformi('image', 0)
        .attrib('points', this.quad, 2)
        .draw(this.igloo.gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
    this.tick++;
};

var demo = null;
window.addEventListener('load', function() {
    demo = new Demo();
    function go() {
        demo.draw();
        requestAnimationFrame(go);
    }
    go();
});
