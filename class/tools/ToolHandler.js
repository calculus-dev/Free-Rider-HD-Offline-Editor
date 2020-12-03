import i from "../math/cartesian.js";
import n from "../sector/PhysicsLine.js";
import r from "../sector/SceneryLine.js";
import o from "../sector/powerups/Goal.js";

var s = Math.floor
, a = 50
, h = function(t) {
  this.currentTool = "",
  this.scene = t,
  this.camera = t.camera,
  this.mouse = t.mouse,
  this.mouse.updateCallback = this.draw.bind(this),
  this.gamepad = t.playerManager.firstPlayer.getGamepad(),
  this.tools = {},
  this.options = t.settings.toolHandler,
  this.snapPoint = new i,
  this.snapPoint.equ(this.scene.track.defaultLine.p2),
  this.gridCache = !1,
  this.initAnalytics(),
  this.actionTimeline = [],
  this.actionTimelinePointer = 0
};
h.prototype = {
  currentTool: "",
  scene: null,
  camera: null,
  mouse: null,
  tools: {},
  gamepad: null,
  gridCache: !1,
  gridCacheAlpha: 1,
  gridUseEnabled: !1,
  snapPoint: !1,
  options: null,
  initAnalytics: function() {
      this.analytics = {
          actions: 0
      }
  },
  enableGridUse: function() {
      this.gridUseEnabled = !0
  },
  getToolOptions: function() {
      return this.tools[this.currentTool].getOptions()
  },
  setToolOption: function(t, e, i) {
      "undefined" != typeof i && "undefined" != typeof this.tools[i] ? this.tools[i].setOption(t, e) : this.tools[this.currentTool].setOption(t, e),
      this.scene.stateChanged()
  },
  registerTool: function(t) {
      var t = new t(this)
        , e = t.name.toLowerCase();
      this.tools[e] = t
  },
  setTool: function(t) {
      {
          var t = t.toLowerCase();
          this.scene
      }
      this.currentTool !== t && (this.resetTool(),
      this.currentTool = t,
      this.scene.stateChanged(),
      this.analytics.actions++)
  },
  addActionToTimeline: function(t) {
      this.actionTimeline.length >= a && (this.actionTimeline.splice(0, this.actionTimeline.length - a),
      this.actionTimelinePointer = a),
      this.actionTimeline.splice(this.actionTimelinePointer),
      this.actionTimeline.push(t),
      this.actionTimelinePointer++
  },
  revertAction: function() {
      var t = this.actionTimelinePointer;
      if (t > 0) {
          var e = this.actionTimeline[t - 1];
          switch (t--,
          e.type) {
          case "add":
              this.removeObjects(e.objects);
              break;
          case "remove":
              this.addObjects(e.objects)
          }
          this.actionTimelinePointer = t
      }
  },
  applyAction: function() {
      var t = this.actionTimeline
        , e = this.actionTimelinePointer;
      if (e < t.length) {
          var i = this.actionTimeline[e];
          switch (e++,
          i.type) {
          case "add":
              this.addObjects(i.objects);
              break;
          case "remove":
              this.removeObjects(i.objects)
          }
          this.actionTimelinePointer = e
      }
  },
  removeObjects: function(t) {
      for (var e = t.length, i = 0; e > i; i++) {
          var s = t[i];
          s.remove = !0,
          s.removeAllReferences()
      }
      this.scene.track.cleanTrack()
  },
  addObjects: function(t) {
      for (var e = t.length, i = this.scene.track, s = 0; e > s; s++) {
          var a = t[s];
          a instanceof n ? (a.remove = !1,
          i.addPhysicsLineToTrack(a)) : a instanceof r ? (a.remove = !1,
          i.addSceneryLineToTrack(a)) : a instanceof o ? (a.remove = !1,
          i.addTarget(a),
          i.addPowerup(a)) : (a.remove = !1,
          i.addPowerup(a))
      }
  },
  resetTool: function() {
      "" !== this.currentTool && this.tools[this.currentTool].reset()
  },
  update: function() {
      this.checkGrid(),
      this.mouse.enabled && this.tools[this.currentTool].update(),
      this.checkHotkeys(),
      this.checkMouse(),
      this.checkSnap()
  },
  checkGrid: function() {
      var t = this.scene.camera;
      t.zoom !== t.desiredZoom && (this.gridCache = !1)
  },
  checkSnap: function() {
      this.options.snapLocked && (this.options.snap = !0)
  },
  moveCameraTowardsMouse: function() {
      if (this.options.cameraLocked === !1) {
          var t = this.scene.screen
            , e = 100
            , i = t.height - e
            , s = 0 + e
            , n = t.width - e
            , r = 0 + e
            , o = this.options.cameraMoveSpeed
            , a = t.center
            , h = this.camera
            , l = this.mouse.touch
            , c = l.pos.x
            , u = l.pos.y
            , p = .8 * (c - a.x)
            , d = u - a.y;
          (c >= n || r >= c || u >= i || s >= u) && (h.position.x += p * o * (1 / h.zoom),
          h.position.y += d * o * (1 / h.zoom))
      }
  },
  checkMouse: function() {
      var t = this.mouse.touch
        , e = this.mouse.secondaryTouch;
      (t.press || e.press) && this.press()
  },
  press: function() {
      this.camera.unfocus()
  },
  checkHotkeys: function() {
      var t = this.gamepad
        , e = this.options.snap
        , i = this.options.snapLocked
        , s = this.options.rightClickMove
        , n = t.isButtonDown("alt");
      s && (n = t.isButtonDown("shift")),
      n && !e ? this.toggleQuickSnap() : n || !e || i || this.toggleQuickSnap(),
      t.isButtonDown("ctrl") && t.isButtonDown("z") && (t.setButtonUp("z"),
      this.revertAction()),
      t.isButtonDown("ctrl") && t.isButtonDown("y") && (t.setButtonUp("y"),
      this.applyAction());
      var r = this.tools;
      for (var o in r) {
          var a = r[o];
          a.checkKeys()
      }
      this.gridUseEnabled && t.isButtonDown("grid") && (t.setButtonUp("grid"),
      this.toggleGrid()),
      t.isButtonDown("zoom_increase") && (t.setButtonUp("zoom_increase"),
      this.scene.camera.increaseZoom()),
      t.isButtonDown("zoom_decrease") && (t.setButtonUp("zoom_decrease"),
      this.scene.camera.decreaseZoom()),
      t.isButtonDown("zoom_100") && (t.setButtonUp("zoom_100"),
      this.scene.camera.resetZoom()),
      t.isButtonDown("lineType") && (t.setButtonUp("lineType"),
      this.toggleLineType())
  },
  toggleLineType: function() {
      var t = this.options.lineType;
      this.options.lineType = "physics" === t ? "scenery" : "physics",
      this.scene.stateChanged()
  },
  toggleGrid: function() {
      this.options.grid = this.scene.state.grid = !this.options.grid,
      this.scene.stateChanged()
  },
  toggleSnap: function() {
      this.options.snap = !this.options.snap,
      this.options.snapLocked = !this.options.snapLocked,
      this.resetTool(),
      this.scene.stateChanged()
  },
  toggleQuickSnap: function() {
      this.options.snapLocked || (this.options.snap = !this.options.snap,
      this.resetTool(),
      this.scene.stateChanged())
  },
  toggleCameraLock: function() {
      this.options.cameraLocked = !this.options.cameraLocked,
      this.scene.stateChanged()
  },
  draw: function() {
      this.scene.game.pixelRatio,
      this.scene.game.canvas.getContext("2d");
      this.mouse.enabled && this.tools[this.currentTool].draw()
  },
  drawGrid: function() {
      var t = this.scene.game.pixelRatio
        , e = this.scene.game.canvas.getContext("2d");
      this.options.grid === !0 && this.options.visibleGrid && this.drawCachedGrid(e, t)
  },
  drawCachedGrid: function(t, e) {
      this.gridCache === !1 && this.cacheGrid(e);
      var i = this.gridCache
        , s = i.width
        , n = i.height
        , r = this.scene.screen
        , o = r.center
        , a = (o.x / s | 0) + 2
        , h = (o.y / n | 0) + 2
        , l = this.camera.zoom
        , c = this.camera.position.x * l % s
        , u = this.camera.position.y * l % n;
      t.globalAlpha = this.gridCacheAlpha;
      for (var p = -a; a > p; p++)
          for (var d = -h; h > d; d++) {
              var f = p * s - c + o.x
                , v = d * n - u + o.y;
              t.drawImage(i, 0, 0, n, s, f, v, s, n)
          }
      t.globalAlpha = 1
  },
  cacheGrid: function() {
      var t = this.scene.camera.zoom
        , e = 200 * t
        , i = 200 * t
        , n = this.options.gridSize
        , r = n * t
        , o = document.createElement("canvas");
      o.width = e,
      o.height = i;
      var a = o.getContext("2d");
      a.strokeStyle = this.options.gridMinorLineColor,
      a.strokeWidth = 1,
      a.beginPath();
      var h = null
        , l = null
        , c = null
        , u = null;
      for (h = s(e / r),
      l = 0; h >= l; l++)
          c = l * r,
          a.moveTo(c, 0),
          a.lineTo(c, i),
          a.stroke();
      for (h = s(i / r),
      l = 0; h >= l; l++)
          u = l * r,
          a.moveTo(0, u),
          a.lineTo(e, u),
          a.stroke();
      a.beginPath(),
      a.rect(0, 0, e, i),
      a.lineWidth = 2,
      a.strokeStyle = this.options.gridMajorLineColor,
      a.stroke(),
      a.closePath(),
      this.gridCache = o,
      this.gridCacheAlpha = Math.min(t + .2, 1)
  },
  resize: function() {
      var t = this.scene.game.pixelRatio;
      this.cacheGrid(t)
  },
  undo: function() {},
  redo: function() {},
  close: function() {
      this.actionTimeline = [],
      this.actionTimelinePointer = 0,
      this.tools = null,
      this.mouse = null,
      this.scene = null,
      this.camera = null,
      this.options.grid = !1,
      this.options = null,
      this.gridCache = null
  }
}
export default h