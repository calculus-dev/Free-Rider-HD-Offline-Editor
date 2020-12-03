import i from "../math/cartesian.js";
import s from "./Tool.js";

var n = function(t) {
  this.game = t.scene.game,
  this.toolInit(t),
  this.p1 = new i(0,0),
  this.p2 = new i(0,0),
  this.active = !1,
  this.shouldDrawMetadata = !1,
  this.options = {}
}
, r = n.prototype = new s;
r.toolInit = r.init,
r.toolUpdate = r.update,
r.toolDraw = r.draw,
r.name = "StraightLine",
r.p1 = null,
r.p2 = null,
r.active = !1,
r.reset = function() {
  this.active = !1
}
,
r.press = function() {
  if (!this.active) {
      var t = this.mouse.touch.real;
      this.p1.x = t.x,
      this.p1.y = t.y,
      this.active = !0
  }
}
,
r.getOptions = function() {
  var t = this.toolhandler
    , e = this.options;
  return e.lineType = t.options.lineType,
  e.snap = t.options.snap,
  e
}
,
r.hold = function() {
  var t = this.mouse.touch.real;
  this.p2.x = t.x,
  this.p2.y = t.y,
  this.toolhandler.moveCameraTowardsMouse()
}
,
r.release = function() {
  var t = this.p1
    , e = this.p2
    , i = this.scene.track
    , s = this.toolhandler
    , n = !1;
  n = "physics" === s.options.lineType ? i.addPhysicsLine(t.x, t.y, e.x, e.y) : i.addSceneryLine(t.x, t.y, e.x, e.y),
  n && s.addActionToTimeline({
      type: "add",
      objects: [n]
  });
  var r = s.snapPoint;
  r.x = e.x,
  r.y = e.y,
  this.active = !1
}
,
r.update = function() {
  this.toolUpdate();
  var t = this.toolhandler
    , e = t.gamepad;
  t.options.snap && (this.active = !0,
  this.p1 = t.snapPoint,
  this.hold()),
  this.shouldDrawMetadata = e.isButtonDown("ctrl") ? !0 : !1
}
,
r.draw = function() {
  var t = this.scene
    , e = (t.game.canvas,
  t.game.canvas.getContext("2d"))
    , i = t.camera
    , s = i.zoom;
  e.save(),
  this.drawCursor(e),
  this.active && (this.drawLine(e, s),
  this.drawPoint(e, this.p1, s),
  this.drawPoint(e, this.p2, s),
  this.drawPointData(e, this.p2, s)),
  e.restore()
}
,
r.drawCursor = function(t) {
  var e = this.mouse.touch
    , i = e.real.toScreen(this.scene)
    , s = this.camera.zoom
    , n = this.toolhandler
    , r = (n.options.lineType,
  n.options.grid)
    , o = "#1884cf";
  if (r) {
      var a = 5 * s;
      t.beginPath(),
      t.moveTo(i.x, i.y - a),
      t.lineTo(i.x, i.y + a),
      t.moveTo(i.x - a, i.y),
      t.lineTo(i.x + a, i.y),
      t.lineWidth = 1 * s,
      t.closePath(),
      t.stroke()
  } else
      t.lineWidth = 1,
      t.fillStyle = o,
      t.beginPath(),
      t.arc(i.x, i.y, 1 * s, 0, 2 * Math.PI, !1),
      t.closePath(),
      t.fill()
}
,
r.drawPoint = function(t, e, i) {
  var s = e.toScreen(this.scene);
  t.beginPath(),
  t.arc(s.x, s.y, 1 * i, 0, 2 * Math.PI, !1),
  t.lineWidth = 1,
  t.fillStyle = "#1884cf",
  t.fill()
}
,
r.drawPointData = function(t, e) {
  var i = e.toScreen(this.scene);
  if (this.shouldDrawMetadata) {
      var s = this.p1.getAngleInDegrees(this.p2);
      s = s.toFixed(2);
      var n = this.game.pixelRatio;
      t.fillStyle = "#000000",
      t.font = 8 * n + "pt arial",
      t.fillText("" + s + "°", i.x + 10, i.y + 10),
      t.strokeText("" + s + "°", i.x + 10, i.y + 10)
  }
}
,
r.drawLine = function(t, e) {
  var i = this.scene
    , s = (i.game.canvas,
  2 * e > .5 ? 2 * e : .5)
    , n = this.toolhandler
    , r = n.options.lineType
    , o = "physics" === r ? "#000" : "#AAA";
  t.beginPath(),
  t.lineWidth = s,
  t.lineCap = "round",
  t.strokeStyle = o;
  var a = this.p1.toScreen(this.scene)
    , h = this.p2.toScreen(this.scene);
  t.moveTo(a.x, a.y),
  t.lineTo(h.x, h.y),
  t.stroke()
}
export default n