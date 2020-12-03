import i from "../math/cartesian.js";
import s from "./Tool.js";

var n = function(t) {
        this.toolInit(t),
        this.p1 = new i(0,0),
        this.p2 = new i(0,0),
        this.active = !1;
        var e = t.scene.settings.brush;
        this.addedObjects = [],
        this.options = {
            breakLength: e.breakLength,
            maxBreakLength: e.maxBreakLength,
            minBreakLength: e.minBreakLength,
            breakLengthSensitivity: e.breakLengthSensitivity,
            trailSpeed: e.trailSpeed,
            maxTrailSpeed: e.maxTrailSpeed,
            minTrailSpeed: e.minTrailSpeed,
            trailSpeedSensitivity: e.trailSpeedSensitivity
        }
    }
    , r = n.prototype = new s;
r.toolInit = r.init,
r.toolUpdate = r.update,
r.name = "Brush",
r.p1 = null,
r.p2 = null,
r.active = !1,
r.options = null,
r.reset = function() {
    this.recordActionsToToolhandler(),
    this.active = !1
}
,
r.recordActionsToToolhandler = function() {
    var t, e = this.addedObjects, i = e.length;
    if (i)
        for (t = 0; i > t; t++)
            this.toolhandler.addActionToTimeline({
                type: "add",
                objects: [e[t]]
            });
    this.addedObjects = []
}
,
r.press = function() {
    if (this.recordActionsToToolhandler(),
    !this.active) {
        var t = this.mouse.touch.real;
        this.p1.x = t.x,
        this.p1.y = t.y,
        this.p2.x = t.x,
        this.p2.y = t.y,
        this.active = !0
    }
}
,
r.hold = function() {
    var t = this.mouse.touch.real
        , e = this.p1
        , i = this.p2
        , s = this.options.trailSpeed
        , n = this.options.breakLength;
    i.inc(t.sub(i).factor(s));
    var r = screen.height + t.sub(i).len();
    if (r *= n,
    i.sub(e).lenSqr() > r) {
        var o = this.scene.track
            , a = !1;
        a = "physics" === this.toolhandler.options.lineType ? o.addPhysicsLine(e.x, e.y, i.x, i.y) : o.addSceneryLine(e.x, e.y, i.x, i.y),
        a && this.addedObjects.push(a),
        e.equ(i),
        this.toolhandler.snapPoint.x = i.x,
        this.toolhandler.snapPoint.y = i.y
    }
    this.toolhandler.moveCameraTowardsMouse()
}
,
r.release = function() {
    var t = this.p1
        , e = this.p2
        , i = this.scene.track
        , s = !1;
    s = "physics" === this.toolhandler.options.lineType ? i.addPhysicsLine(t.x, t.y, e.x, e.y) : i.addSceneryLine(t.x, t.y, e.x, e.y),
    s && this.addedObjects.push(s),
    this.recordActionsToToolhandler();
    var n = this.toolhandler
        , r = n.snapPoint;
    r.x = e.x,
    r.y = e.y,
    this.active = !1
}
,
r.update = function() {
    var t = this.toolhandler.gamepad
        , e = this.mouse;
    t.isButtonDown("alt") ? e.mousewheel !== !1 && this.adjustTrailSpeed(e.mousewheel) : t.isButtonDown("shift") && e.mousewheel !== !1 && this.adjustBreakLength(e.mousewheel);
    var i = this.toolhandler;
    i.options.snap && (this.active = !0,
    this.p1.x = i.snapPoint.x,
    this.p1.y = i.snapPoint.y,
    this.p2.x = e.touch.real.x,
    this.p2.y = e.touch.real.y),
    this.toolUpdate()
}
,
r.adjustTrailSpeed = function(t) {
    var e = this.options.trailSpeed
        , i = this.options.trailSpeedSensitivity
        , s = this.options.maxTrailSpeed
        , n = this.options.minTrailSpeed;
    t > 0 ? (e += i,
    e > s && (e = s)) : (e -= i,
    n > e && (e = n)),
    this.setOption("trailSpeed", e)
}
,
r.adjustBreakLength = function(t) {
    var e = this.options.breakLength
        , i = this.options.breakLengthSensitivity
        , s = this.options.maxBreakLength
        , n = this.options.minBreakLength;
    t > 0 ? (e += i,
    e > s && (e = s)) : (e -= i,
    n > e && (e = n)),
    this.setOption("breakLength", e)
}
,
r.setOption = function(t, e) {
    this.options[t] = e
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
r.draw = function() {
    var t = this.scene
        , e = (t.game.canvas,
    t.game.canvas.getContext("2d"))
        , i = t.camera
        , s = i.zoom;
    this.drawCursor(e),
    this.active && (this.drawLine(e, s),
    this.drawPoint(e, this.p1, s),
    this.drawPoint(e, this.p2, s))
}
,
r.drawText = function(t) {
    var e = this.name
        , i = this.options.breakLength
        , s = this.options.trailSpeed
        , n = this.game.pixelRatio;
    t.fillStyle = "#000000",
    t.font = 12 * n + "pt arial",
    t.fillText(e, 10 * n, 20 * n),
    t.font = 8 * n + "pt arial",
    s = 0 | s,
    i = i,
    t.fillText("Trail speed : " + s, 10 * n, 40 * n),
    t.fillText("Break length : " + i, 10 * n, 60 * n)
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
        t.stroke()
    } else
        t.beginPath(),
        t.arc(i.x, i.y, 1 * s, 0, 2 * Math.PI, !1),
        t.lineWidth = 1,
        t.fillStyle = o,
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