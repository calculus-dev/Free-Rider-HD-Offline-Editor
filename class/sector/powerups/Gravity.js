import s from "../Powerup.js";

function i(t, e, i, s) {
    this.x = t,
    this.y = e,
    this.angle = i - 180,
    this.realAngle = i;
    var n = this.angle / 360 * 2 * Math.PI;
    this.directionX = (-.3 * Math.sin(n)).toFixed(15) / 1,
    this.directionY = (.3 * Math.cos(n)).toFixed(15) / 1,
    this.init(s)
}
var n = Math.pow
  , r = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 20,
    height: 20
}
  , o = i.prototype = new s;
o.x = 0,
o.y = 0,
o.angle = 0,
o.realAngle = 0,
o.name = "gravity",
o.recache = function(t) {
    r.dirty = !1;
    var e = r.canvas;
    e.width = r.width * t,
    e.height = r.height * t;
    var i = e.getContext("2d")
      , s = e.width / 2
      , n = e.height / 2;
    this.drawArrow(s, n, t, i),
    this.settings.developerMode && (i.beginPath(),
    i.rect(0, 0, e.width, e.height),
    i.strokeStyle = "red",
    i.strokeWidth = 3 * t,
    i.stroke())
}
,
o.getCode = function() {
    return "G " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.realAngle.toString(32)
}
,
o.setDirty = function(t) {
    r.dirty = t
}
,
o.draw = function(t, e, i, s) {
    r.dirty && this.recache(i);
    var n = r.width * i
      , o = r.height * i
      , a = n / 2
      , h = o / 2
      , l = t
      , c = e
      , u = (this.angle + 90) * (Math.PI / 180);
    s.translate(l, c),
    s.rotate(u),
    s.drawImage(r.canvas, -a, -h, n, o),
    s.rotate(-u),
    s.translate(-l, -c)
}
,
o.drawArrow = function(t, e, i, s) {
    i *= .2,
    s.beginPath(),
    s.moveTo(0 * i, 0 * i),
    s.lineTo(97 * i, 0 * i),
    s.lineTo(97 * i, 96 * i),
    s.lineTo(0 * i, 96 * i),
    s.closePath(),
    s.clip(),
    s.fillStyle = "rgba(0, 0, 0, 0)",
    s.strokeStyle = "rgba(0, 0, 0, 0)",
    s.lineWidth = Math.max(6 * i, 1),
    s.save(),
    s.fillStyle = "#376eb7",
    s.strokeStyle = "#000000",
    s.beginPath(),
    s.moveTo(41 * i, 70 * i),
    s.lineTo(41 * i, 95 * i),
    s.lineTo(97 * i, 48 * i),
    s.lineTo(41 * i, 1 * i),
    s.lineTo(41 * i, 25 * i),
    s.lineTo(1 * i, 25 * i),
    s.lineTo(1 * i, 70 * i),
    s.lineTo(41 * i, 70 * i),
    s.closePath(),
    s.closePath(),
    s.fill(),
    s.stroke()
}
,
o.collide = function(t) {
    var e = t.parent
      , i = e.player
      , s = t.pos.x - this.x
      , r = t.pos.y - this.y
      , o = n(s, 2) + n(r, 2)
      , a = e.masses
      , h = (a.length,
    this.directionX)
      , l = this.directionY;
    1e3 > o && i.isAlive() && (e.gravity.x = h,
    e.gravity.y = l,
    i.isGhost() === !1 && (this.scene.message.show("Gravity Changed", 50, "#1F80C3", "#FFFFFF"),
    this.scene.sound.play("gravity_down_sound")))
}
export default i