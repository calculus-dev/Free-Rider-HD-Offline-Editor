import i from "./Tool.js";
import s from "./vehiclepoweruptools/Helicopter.js";
import n from "./vehiclepoweruptools/Truck.js";
import r from "./vehiclepoweruptools/Balloon.js";
import o from "./vehiclepoweruptools/Blob.js";

var a = function(t) {
  this.toolInit(t),
  this.powerupTools = {},
  this.options = t.scene.settings.vehiclePowerup,
  this.registerPowerupTools()
}
, h = a.prototype = new i;
h.toolInit = h.init,
h.toolUpdate = h.update,
h.name = "vehiclepowerup",
h.powerupTools = null,
h.registerPowerupTools = function() {
  this.registerTool(new s(this,this.toolhandler)),
  this.registerTool(new n(this,this.toolhandler)),
  this.registerTool(new r(this,this.toolhandler)),
  this.registerTool(new o(this,this.toolhandler))
}
,
h.registerTool = function(t) {
  this.powerupTools[t.name] = t
}
,
h.setOption = function(t, e) {
  this.options[t] = e
}
,
h.getOptions = function() {
  return this.options
}
,
h.update = function() {
  this.toolhandler.gamepad,
  this.mouse,
  this.options;
  this.toolUpdate()
}
,
h.press = function() {
  var t = this.options.selected;
  this.powerupTools[t].press()
}
,
h.hold = function() {
  var t = this.options.selected;
  this.powerupTools[t].hold()
}
,
h.release = function() {
  var t = this.options.selected;
  this.powerupTools[t].release()
}
,
h.draw = function() {
  var t = this.scene
    , e = (t.game.canvas,
  t.game.canvas.getContext("2d"))
    , i = this.options;
  this.powerupTools[i.selected].draw(e)
}
export default a