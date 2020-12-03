import i from "./Tool.js";

var s = function(t) {
    this.toolInit(t)
}
, n = s.prototype = new i;
n.toolInit = n.init,
n.toolDraw = n.draw,
n.name = "Camera",
n.hold = function() {
    var t = this.mouse.touch
    , e = t.pos
    , i = this.camera
    , s = t.old.pos.sub(e).factor(1 / i.zoom);
    i.position.inc(s)
}
,
n.draw = function() {
    {
        var t = this.scene;
        t.game.canvas,
        t.game.canvas.getContext("2d")
    }
}
,
n.drawText = function(t) {
    {
        var e = this.name
        , i = this.game.pixelRatio
        , s = this.scene;
        s.game.canvas
    }
    t.fillStyle = "#000000",
    t.font = 12 * i + "pt arial",
    t.fillText(e, 10 * i, 20 * i),
    t.font = 8 * i + "pt arial"
}
export default s