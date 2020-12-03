import s from "../Powerup.js";

function i(t, e, i, s) {
    this.x = t,
    this.y = e,
    this.angle = i,
    this.realAngle = i;
    var n = (i - 180) / 360 * 2 * Math.PI;
    this.directionX = (-Math.sin(n)).toFixed(15) / 1,
    this.directionY = Math.cos(n).toFixed(15) / 1,
    this.init(s)
}
var n = Math.pow
  , r = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 24,
    height: 16
}
  , o = i.prototype = new s;
o.x = 0,
o.y = 0,
o.name = "boost",
o.angle = 0,
o.realAngle = 0,
o.directionX = 0,
o.directionY = 0,
o.getCode = function() {
    return "B " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.realAngle.toString(32)
}
,
o.recache = function(t) {
    r.dirty = !1;
    var e = r.canvas;
    e.width = r.width * t,
    e.height = r.height * t;
    var i = e.getContext("2d")
      , s = e.width / 2
      , n = e.height / 2;
    this.drawCircle(s, n, t, i),
    this.settings.developerMode && (i.beginPath(),
    i.rect(0, 0, e.width, e.height),
    i.strokeStyle = "red",
    i.strokeWidth = 1 * t,
    i.stroke())
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
      , u = (this.angle - 90) * (Math.PI / 180);
    s.translate(l, c),
    s.rotate(u),
    s.drawImage(r.canvas, -a, -h, n, o),
    s.rotate(-u),
    s.translate(-l, -c)
}
,
o.drawCircle = function(t, e, i, s) {
    s.save(),
    s.strokeStyle = "rgba(0,0,0,0)",
    s.lineCap = "round",
    s.fillStyle = "#8ac832",
    s.strokeStyle = "#000000",
    i *= .2,
    s.lineWidth = Math.max(8 * i, 1),
    s.beginPath(),
    s.moveTo(0 * i, 0 * i),
    s.lineTo(118 * i, 0 * i),
    s.lineTo(118 * i, 81 * i),
    s.lineTo(0 * i, 81 * i),
    s.closePath(),
    s.beginPath(),
    s.moveTo(3 * i, 1.5 * i),
    s.lineTo(35 * i, 1.7 * i),
    s.lineTo(66 * i, 40 * i),
    s.lineTo(34 * i, 78 * i),
    s.lineTo(4 * i, 78 * i),
    s.lineTo(36 * i, 39 * i),
    s.lineTo(3 * i, 1.5 * i),
    s.closePath(),
    s.moveTo(53 * i, 1.5 * i),
    s.lineTo(85 * i, 1.7 * i),
    s.lineTo(116 * i, 40 * i),
    s.lineTo(84 * i, 78 * i),
    s.lineTo(54 * i, 78 * i),
    s.lineTo(85 * i, 39 * i),
    s.lineTo(53 * i, 1.5 * i),
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
      , h = a.length
      , l = this.directionX
      , c = this.directionY;
    if (1e3 > o && i.isAlive()) {
        for (var u = h - 1; u >= 0; u--) {
            var p = a[u].pos;
            p.x += l,
            p.y += c
        }
        i.isGhost() === !1 && (this.scene.sound.play("boost_sound"),
        this.scene.message.show("Boost Engaged", 50, "#8ac832"))
    }
}
export default i