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
h.name = "truck",
h.getCode = function() {
    return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 2 " + this.time.toString(32)
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
    s.save(),
    s.scale(i, i),
    s.beginPath(),
    s.moveTo(0, 0),
    s.lineTo(24, 0),
    s.lineTo(24, 26),
    s.lineTo(0, 26),
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
    s.translate(-1320, -352),
    s.save(),
    s.translate(251, 28),
    s.save(),
    s.translate(1056, 265),
    s.save(),
    s.translate(3, 49),
    s.save(),
    s.translate(10, 8),
    s.save(),
    s.fillStyle = "#000000",
    s.beginPath(),
    s.moveTo(2, 17),
    s.lineTo(4, 17),
    s.quadraticCurveTo(6, 17, 6, 19),
    s.lineTo(6, 26),
    s.quadraticCurveTo(6, 28, 4, 28),
    s.lineTo(2, 28),
    s.quadraticCurveTo(0, 28, 0, 26),
    s.lineTo(0, 19),
    s.quadraticCurveTo(0, 17, 2, 17),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.save(),
    s.fillStyle = "#000000",
    s.beginPath(),
    s.moveTo(20, 17),
    s.lineTo(22, 17),
    s.quadraticCurveTo(24, 17, 24, 19),
    s.lineTo(24, 26),
    s.quadraticCurveTo(24, 28, 22, 28),
    s.lineTo(20, 28),
    s.quadraticCurveTo(18, 28, 18, 26),
    s.lineTo(18, 19),
    s.quadraticCurveTo(18, 17, 20, 17),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.save(),
    s.strokeStyle = "#000000",
    s.lineWidth = 2,
    s.lineCap = "square",
    s.beginPath(),
    s.moveTo(3.5, 23),
    s.lineTo(20.5, 23),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.save(),
    s.save(),
    s.fillStyle = "#94d44e",
    s.save(),
    s.beginPath(),
    s.moveTo(23, 11.2672237),
    s.bezierCurveTo(23.5979157, 11.6115707, 24, 12.2552568, 24, 12.999615),
    s.lineTo(24, 19.000385),
    s.bezierCurveTo(24, 20.1047419, 23.1029738, 21, 21.9950534, 21),
    s.lineTo(2.00494659, 21),
    s.bezierCurveTo(.897645164, 21, 0, 20.1125667, 0, 19.000385),
    s.lineTo(0, 12.999615),
    s.bezierCurveTo(0, 12.2603805, .401930294, 11.6148368, 1, 11.268783),
    s.lineTo(1, 3.99742191),
    s.bezierCurveTo(1, 2.89427625, 1.88967395, 2, 2.991155, 2),
    s.lineTo(21.008845, 2),
    s.bezierCurveTo(22.1085295, 2, 23, 2.89092539, 23, 3.99742191),
    s.lineTo(23, 11.2672237),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.restore(),
    s.save(),
    s.strokeStyle = "#000000",
    s.lineWidth = 2,
    s.beginPath(),
    s.moveTo(22.5009348, 12.1337882),
    s.lineTo(22, 11.8452936),
    s.lineTo(22, 3.99742191),
    s.bezierCurveTo(22, 3.44392402, 21.5569554, 3, 21.008845, 3),
    s.lineTo(2.991155, 3),
    s.bezierCurveTo(2.44342393, 3, 2, 3.44509694, 2, 3.99742191),
    s.lineTo(2, 11.8455),
    s.lineTo(1.50082265, 12.1343329),
    s.bezierCurveTo(1.19247839, 12.3127464, 1, 12.6390115, 1, 12.999615),
    s.lineTo(1, 19.000385),
    s.bezierCurveTo(1, 19.5563739, 1.44601448, 20, 2.00494659, 20),
    s.lineTo(21.9950534, 20),
    s.bezierCurveTo(22.5510229, 20, 23, 19.5521213, 23, 19.000385),
    s.lineTo(23, 12.999615),
    s.bezierCurveTo(23, 12.6352349, 22.8086914, 12.311029, 22.5009348, 12.1337882),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.restore(),
    s.save(),
    s.fillStyle = "#000000",
    s.beginPath(),
    s.moveTo(5, 6),
    s.lineTo(19, 6),
    s.quadraticCurveTo(19, 6, 19, 6),
    s.lineTo(19, 12),
    s.quadraticCurveTo(19, 12, 19, 12),
    s.lineTo(5, 12),
    s.quadraticCurveTo(5, 12, 5, 12),
    s.lineTo(5, 6),
    s.quadraticCurveTo(5, 6, 5, 6),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.save(),
    s.fillStyle = "#000000",
    s.beginPath(),
    s.arc(5.03571429, 16.0357143, 1.39285714, 0, 6.283185307179586, !0),
    s.closePath(),
    s.fill(),
    s.stroke(),
    s.restore(),
    s.save(),
    s.fillStyle = "#000000",
    s.beginPath(),
    s.arc(18.9642857, 16.0357143, 1.39285714, 0, 6.283185307179586, !0),
    s.closePath(),
    s.fill(),
    s.stroke(),
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
        i.setTempVehicle("TRUCK", c, {
            x: this.x,
            y: this.y
        }, e.dir),
        l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
        l.vehicleTimer.playerAddedTime(i)),
        i.isGhost() === !1 && (this.hit = !0,
        this.sector.powerupCanvasDrawn = !1,
        this.scene.message.show("Truck Powerup!", 50, "#94d44e", !1))
    }
}
export default i