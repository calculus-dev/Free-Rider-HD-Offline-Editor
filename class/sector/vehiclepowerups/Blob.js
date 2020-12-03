import s from "../Powerup.js";

function i(t, e, i, s) {
    this.x = t,
    this.y = e,
    this.time = i,
    this.id = r().toString(36).substr(2),
    this.hit = !1,
    this.init(s)
}
var n = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 32,
    height: 42
}
  , r = Math.random
  , o = Math.pow
  , a = Math.sqrt
  , h = (Math.cos,
Math.sin,
i.prototype = new s);
h.x = 0,
h.y = 0,
h.name = "blob",
h.getCode = function() {
    return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 4 " + this.time.toString(32)
}
,
h.recache = function(t) {
    n.dirty = !1;
    var e = n.canvas;
    e.width = n.width * t,
    e.height = n.height * t;
    var i = e.getContext("2d")
      , s = e.width / 2
      , r = e.height / 2;
    this.drawIcon(s, r, t, i)
}
,
h.setDirty = function(t) {
    n.dirty = t
}
,
h.draw = function(t, e, i, s) {
    if (!this.hit) {
        n.dirty && this.recache(i);
        var r = n.width * i
          , o = n.height * i
          , a = r / 2
          , h = o / 2;
        s.drawImage(n.canvas, t - a, e - h, r, o)
    }
}
,
h.drawIcon = function(t, e, i, s) {
    i *= 1,
    s.lineCap = "butt",
    s.lineJoin = "miter",
    s.miterLimit = 4 * i,
    s.save(),
    s.scale(i, i),
    s.beginPath(),
    s.moveTo(0, 0),
    s.lineTo(24, 0),
    s.lineTo(24, 22),
    s.lineTo(0, 22),
    s.closePath(),
    s.clip(),
    s.translate(0, 0),
    s.translate(0, 0),
    s.scale(1, 1),
    s.translate(0, 0),
    s.strokeStyle = "rgba(0,0,0,0)",
    s.lineCap = "butt",
    s.lineJoin = "miter",
    s.miterLimit = 4,
    s.save(),
    s.restore(),
    s.save(),
    s.restore(),
    s.save(),
    s.fillStyle = "rgba(0, 0, 0, 0)",
    s.strokeStyle = "rgba(0, 0, 0, 0)",
    s.lineWidth = 1,
    s.translate(-1320, -491),
    s.save(),
    s.translate(251, 28),
    s.save(),
    s.translate(1056, 265),
    s.save(),
    s.translate(3, 187),
    s.save(),
    s.translate(10, 11),
    s.save(),
    s.save(),
    s.fillStyle = "#a784c5",
    s.save(),
    s.beginPath(),
    s.moveTo(4, 0),
    s.lineTo(20, 0),
    s.quadraticCurveTo(24, 0, 24, 4),
    s.lineTo(24, 18),
    s.quadraticCurveTo(24, 22, 20, 22),
    s.lineTo(4, 22),
    s.quadraticCurveTo(0, 22, 0, 18),
    s.lineTo(0, 4),
    s.quadraticCurveTo(0, 0, 4, 0),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.restore(),
    s.save(),
    s.strokeStyle = "#000000",
    s.lineWidth = 2,
    s.beginPath(),
    s.moveTo(5, 1),
    s.lineTo(19, 1),
    s.quadraticCurveTo(23, 1, 23, 5),
    s.lineTo(23, 17),
    s.quadraticCurveTo(23, 21, 19, 21),
    s.lineTo(5, 21),
    s.quadraticCurveTo(1, 21, 1, 17),
    s.lineTo(1, 5),
    s.quadraticCurveTo(1, 1, 5, 1),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.restore(),
    s.restore(),
    s.restore(),
    s.restore(),
    s.restore(),
    s.restore(),
    s.restore()
}
,
h.collide = function(t) {
    var e = t.parent
      , i = e.player
      , s = t.pos.x - this.x
      , n = t.pos.y - this.y
      , r = a(o(s, 2) + o(n, 2))
      , h = i._powerupsConsumed.misc
      , l = this.scene;
    if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
        h.push(this.id);
        var c = this.time * l.settings.drawFPS;
        i.setTempVehicle("BLOB", c, {
            x: this.x,
            y: this.y
        }, e.dir),
        l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
        l.vehicleTimer.playerAddedTime(i)),
        i.isGhost() === !1 && (this.hit = !0,
        this.sector.powerupCanvasDrawn = !1,
        this.scene.message.show("Blob Powerup!", 50, "#A784C5", !1))
    }
}
export default i