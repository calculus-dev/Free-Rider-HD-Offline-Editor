export default !function() {
    "use strict";
    function t(t) {
        this.drawAngle = 0,
        this.colors = t,
        this.createVersion()
    }
    var s = GameInventoryManager.HeadClass
      , n = Math.max
      , r = {}
      , o = 0
      , a = 0
      , c = 115
      , u = 112
      , p = .17
      , d = t.prototype = new s;
    d.versionName = "",
    d.dirty = !0,
    d.getVersions = function() {
        return r
    }
    ,
    d.cache = function(t) {
        var e = r[this.versionName];
        e.dirty = !1;
        var t = n(t, 1)
          , i = c * t * p
          , s = u * t * p
          , h = e.canvas;
        h.width = i,
        h.height = s,
        o = h.width / 2,
        a = h.height / 2;
        var v = h.getContext("2d")
          , d = p * t;
        v.save(),
        v.scale(d, d),
        v.fillStyle = "#ffffff00";
        v.lineCap = "round";
        v.lineWidth = 11.5;
        v.beginPath(),
        v.arc(44, 50.5, 29.5, 0, 2 * Math.PI),
        v.moveTo(15,54),
        v.lineTo(100, 38.5),
        v.fill(),
        v.stroke()
    }
    ,
    d.setDirty = function() {
        r[this.versionName].dirty = !0
    }
    ,
    d.getBaseWidth = function() {
        return 115
    }
    ,
    d.getBaseHeight = function() {
        return 112
    }
    ,
    d.getDrawOffsetX = function() {
        return 2.2
    }
    ,
    d.getDrawOffsetY = function() {
        return 1
    }
    ,
    d.getScale = function() {
        return .17
    }
    ,
    GameInventoryManager && GameInventoryManager.register("forward_cap", t),
    "undefined" != typeof i && ("undefined" != typeof e && e.exports && (i = e.exports = t),
    i.Forward_Cap = t)
}()