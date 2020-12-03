import MouseHandler from "../utils/MouseHandler.js";
import Camera from "../view/Camera.js";
import Screen from "../view/Screen.js";
import PlayerManager from "../vehicles/PlayerManager.js";
import VehicleTimer from "../utils/VehicleTimer.js";
import ToolHandler from "../tools/ToolHandler.js";
import CameraTool from "../tools/Camera.js";
import CurveTool from "../tools/Curve.js";
import StraightLineTool from "../tools/StraightLine.js";
import BrushTool from "../tools/Brush.js";
import SelectTool from "../tools/Select.js";
import EraserTool from "../tools/Eraser.js";
import PowerupTool from "../tools/Powerup.js";
import VehiclePowerupTool from "../tools/VehiclePowerup.js";
import Track from "../tracks/Track.js";
import LoadingCircle from "../utils/LoadingCircle.js";
import Score from "../utils/Score.js";
import PauseControls from "../controls/Pause.js";
import UndoManager from "../controls/UndoManager.js";
import SoundManager from "../utils/SoundManager.js";
import MessageManager from "../utils/MessageManager.js";

export default class Editor {
    constructor(game){
        this.game = game,
        this.assets = game.assets,
        this.stage = game.stage,
        this.settings = game.settings,
        this.sound = new SoundManager(this),
        this.mouse = new MouseHandler(this),
        this.mouse.disableContextMenu(),
        this.message = new MessageManager(this),
        this.camera = new Camera(this),
        this.screen = new Screen(this),
        this.createTrack(),
        this.loadingcircle = new LoadingCircle(this),
        this.playerManager = new PlayerManager(this),
        this.vehicleTimer = new VehicleTimer(this),
        this.score = new Score(this),
        this.createMainPlayer(),
        this.createControls(),
        this.registerTools(),
        this.state = this.setStateDefaults(),
        this.oldState = this.setStateDefaults(),
        this.restart(),
        this.initializeAnalytics(),
        this.stage.addEventListener("stagemousedown", this.tapToStartOrRestart.bind(this)),
        window.lite && this.injectLiteFeatures()
    }
    game = null;
    assets = null;
    stage = null;
    canvas = null;
    settings = null;
    camera = null;
    screen = null;
    mouse = null;
    track = null;
    player = null;
    players = null;
    ticks = 0;
    state = null;
    oldState = null;
    stateDirty = !0;
    onStateChange = null;
    vehicle = "Mtb";
    showDialog = !1;
    dialogOptions = !1;
    importCode = !1;
    clear = !1;
    redoundoControls = null;
    pauseControls = null;
    inFocus = !0;
    controls = null;
    verified = !1;
    injectLiteFeatures() {
        var ca = document.createElement('div');
        ca.className = 'topMenu-button topMenu-button_autoCheck';
        ca.title = 'Check to see if your auto is broken';
        ca.onclick = window.lite.checkAuto;
        ca.innerHTML = '<a>Check Auto</a>';
        var ic = setInterval(() => {
            if(document.getElementsByClassName('topMenu-button_offline').length > 0) {
                document.getElementsByClassName('topMenu-button_offline')[0].after(ca);
                clearInterval(ic)
            }
        })
        var tm = document.createElement('div');
        tm.id = 'trackMover';
        tm.className = 'bottomToolOptions';
        tm.title = 'Move your track!';
        tm.innerHTML = `<a onClick="window.lite.moveTrack()">Move Track</a>
        &emsp;<input type="number" id="moveX" placeholder="Position X"></input>
        &emsp;<input type="number" id="moveY" placeholder="Position Y"></input>`;
        var tc = document.createElement('div');
        tc.id = 'trackCombiner';
        tc.className = 'bottomToolOptions';
        tc.title = 'Combine your tracks!';
        tc.innerHTML = `<a onClick="window.lite.combine()" id="combineTrack">Combine Track</a>
        &emsp;<input id="input1" placeholder="Track 1" spellcheck="false"></input>
        &emsp;<input id="input2" placeholder="Track 2" spellcheck="false"></input>
        &emsp;<input id="output" placeholder="Output" readonly="true" spellcheck="false"></input>`;
        var t = window.lite.getVar("toggle") ? tm : tc;
        window.lite.nodes.trackMover = tm;
        window.lite.nodes.trackCombiner = tc;
        window.lite.nodes.tools = t;
        var script = document.createElement('script');
        script.innerHTML = `([...document.querySelectorAll('input')]).forEach(n => {
            n.addEventListener('keydown', e => e.stopPropagation());
            n.addEventListener('keyup', e => e.stopPropagation());
            n.addEventListener('keypress', e => e.stopPropagation());
        });`;
        var it = setInterval(() => {
            if(document.getElementsByClassName('bottomToolOptions_straightline').length > 0) {
                document.getElementsByClassName('bottomToolOptions_straightline')[0].after(t);
                document.body.appendChild(script);
                clearInterval(it)
            }
        })
        var st = document.createElement('div');
        st.className = 'sideButton sideButton-bottom sideButton_selectTool';
        st.onclick = () => {
            this.toolHandler.setTool('select'),
            st.className = 'sideButton sideButton-bottom sideButton_selectTool active';
        }
        st.innerHTML = `<div style="width:40px;height:40px;display:flex"><img src="https://i.imgur.com/FLP6RhL.png" style="display:inline-flex;margin:auto;width:30px;height:30px;justify-content:center;align-items:center;float:center"></img></div>`;
        var ith = setInterval(() => {
            if(document.getElementsByClassName('sideButton').length > 0) {
                [...document.getElementsByClassName('sideButton')].forEach(e => {
                    e.onclick = () => {
                        if(!['sideButton sideButton-bottom sideButton_selectTool'].includes(e.className)) {
                            st.className = 'sideButton sideButton-bottom sideButton_selectTool';
                        } else {
                            this.toolHandler.setTool('select'),
                            st.className = 'sideButton sideButton-bottom sideButton_selectTool active';
                        }
                    }
                })
                clearInterval(ith)
            }
        })
        var is = setInterval(() => {
            if(document.getElementsByClassName('sideButton_cameraTool').length > 0) {
                document.getElementsByClassName('sideButton_cameraTool')[0].after(st)
                clearInterval(is)
            }
        })
    }
    getCanvasOffset() {
        var t = {
            height: 90,
            width: 0
        };
        return this.settings.isStandalone && (t = {
            height: 202,
            width: 0
        }),
        t
    }
    tapToStartOrRestart() {
        if (this.settings.mobile) {
            var t = this.playerManager.firstPlayer;
            if (t && t._crashed && !this.state.paused) {
                var e = t.getGamepad();
                e.setButtonDown("enter")
            } else
                this.play()
        }
    }
    analytics = null;
    initializeAnalytics() {
        this.analytics = {
            deaths: 0,
            mouseEvents: 0
        },
        this.trackAction("editor-open", "open")
    }
    createMainPlayer() {
        var t = this.playerManager
          , e = t.createPlayer(this, this.settings.user)
          , i = e.getGamepad();
        i.setKeyMap(this.settings.editorHotkeys),
        i.onButtonDown = this.buttonDown.bind(this),
        i.listen(),
        this.playerManager.firstPlayer = e,
        this.playerManager.addPlayer(e)
    }
    createControls() {
        this.redoundoControls = new UndoManager(this),
        this.pauseControls = new PauseControls(this)
    }
    createTrack() {
        this.track && this.track.close();
        var t = new Track(this)
          , e = this.getAvailableTrackCode();
        0 != e ? (t.read(e),
        this.track = t,
        this.state.preloading = !1,
        this.state.loading = !1) : t.addDefaultLine(),
        this.importCode = !1,
        this.restartTrack = !0,
        this.clear = !1,
        this.track = t
    }
    updateControls() {
        if (this.controls) {
            var t = this.state.paused;
            this.controls.isVisible() === t && (t || (this.state.playing = !1,
            this.camera.focusOnMainPlayer(),
            this.toolHandler.setTool("camera")),
            this.controls.setVisibility(!t),
            this.updateState()),
            this.controls.update()
        }
        this.pauseControls.update()
    }
    registerTools() {
        var t = new ToolHandler(this);
        t.enableGridUse(),
        this.toolHandler = t,
        t.registerTool(CameraTool),
        t.registerTool(CurveTool),
        t.registerTool(StraightLineTool),
        t.registerTool(BrushTool),
        t.registerTool(SelectTool),
        t.registerTool(EraserTool),
        t.registerTool(PowerupTool),
        t.registerTool(VehiclePowerupTool),
        t.setTool(this.settings.startTool)
    }
    updateToolHandler() {
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update()
    }
    play() {
        this.state.playing = !0
    }
    update = () => {
        this.updateToolHandler(),
        this.mouse.update(),
        this.state.showDialog || (this.updateGamepads(),
        this.checkGamepads()),
        this.screen.update(),
        this.updateControls(),
        this.camera.update(),
        this.sound.update(),
        this.restartTrack && this.restart(),
        !this.state.paused && this.state.playing && (this.message.update(),
        this.updatePlayers(),
        this.score.update(),
        this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
        this.vehicleTimer.update(),
        (this.importCode || this.clear) && this.createTrack(),
        this.isStateDirty() && this.updateState(),
        this.stage.clear(),
        this.draw(),
        this.stage.update(),
        this.camera.updateZoom()
    }
    isStateDirty() {
        var t = this.oldState
          , e = this.state
          , i = !1;
        for (var s in e)
            e[s] !== t[s] && (i = !0,
            this.oldState[s] = e[s]);
        return i
    }
    updateGamepads() {
        this.playerManager.updateGamepads()
    }
    checkGamepads() {
        this.playerManager.checkKeys()
    }
    stopAudio() {
        createjs.Sound.stop()
    }
    restart() {
        this.verified = !this.settings.requireTrackVerification,
        this.track.dirty = !1,
        this.track.resetPowerups(),
        this.message.hide(),
        this.restartTrack = !1,
        this.state.playing = !1,
        this.ticks = 0,
        this.playerManager.reset(),
        this.camera.focusOnPlayer(),
        this.camera.fastforward(),
        this.score.update()
    }
    buttonDown(button) {
        var e = this.camera;
        switch (this.state.playing = !0,
        button) {
        case "up":
        case "down":
        case "left":
        case "right":
            e.focusOnMainPlayer();
            break;
        case "change_camera":
            e.focusOnNextPlayer();
            break;
        case "pause":
            this.state.paused = !this.state.paused;
            break;
        case "settings":
            this.command("dialog", "settings");
            break;
        case "change_vehicle":
            this.toggleVehicle(),
            this.stateChanged();
            break;
        case "zoom_increase":
            e.increaseZoom(),
            this.stateChanged();
            break;
        case "zoom_decrease":
            e.decreaseZoom(),
            this.stateChanged();
            break;
        case "fullscreen":
            this.toggleFullscreen(),
            this.stateChanged()
        }
    }
    toggleFullscreen() {
        if (this.settings.embedded) {
            var t = this.settings
              , e = t.basePlatformUrl + "/t/" + t.track.url;
            window.open(e)
        } else
            this.settings.fullscreenAvailable && (this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen)
    }
    updatePlayers() {
        this.playerManager.update()
    }
    drawPlayers() {
        this.playerManager.draw()
    }
    draw() {
        this.toolHandler.drawGrid(),
        this.track.draw(),
        this.drawPlayers(),
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
        this.state.loading && this.loadingcircle.draw(),
        this.message.draw()
    }
    getAvailableTrackCode() {
        var t = this.settings
          , e = !1;
        return t.importCode && "false" !== t.importCode ? (e = t.importCode,
        t.importCode = null) : this.importCode && (e = this.importCode,
        this.importCode = null),
        e
    }
    redraw() {
        this.track.undraw(),
        GameInventoryManager.redraw(),
        this.toolHandler.resize()
    }
    resize() {
        this.pauseControls.resize(),
        this.redoundoControls.resize(),
        this.controls && this.controls.resize()
    }
    updateState() {
        if (null !== this.game.onStateChange) {
            var t = this.state;
            t.tool = this.toolHandler.currentTool,
            t.toolOptions = this.toolHandler.getToolOptions(),
            t.grid = this.toolHandler.options.grid,
            t.cameraLocked = this.toolHandler.options.cameraLocked,
            t.zoomPercentage = this.camera.zoomPercentage,
            t.vehicle = this.vehicle,
            this.game.onStateChange(this.state)
        }
    }
    stateChanged() {
        this.updateState()
    }
    setStateDefaults() {
        var t = {};
        return t.paused = this.settings.mobile ? !0 : this.settings.startPaused,
        t.loading = !1,
        t.playing = this.settings.waitForKeyPress,
        t.tool = this.toolHandler.currentTool,
        t.toolOptions = this.toolHandler.getToolOptions(),
        t.grid = this.toolHandler.options.grid,
        t.cameraLocked = this.toolHandler.options.cameraLocked,
        t.zoomPercentage = this.camera.zoomPercentage,
        t.vehicle = this.vehicle,
        t.showDialog = !1,
        t.dialogOptions = !1,
        t.preloading = !1,
        t.fullscreen = this.settings.fullscreen,
        t.inFocus = !0,
        this.controls && (t.hideMenus = this.controls.isVisible()),
        t
    }
    toggleVehicle() {
        var t = this.track.allowedVehicles
          , e = t.length
          , i = this.state.vehicle
          , s = t.indexOf(i);
        s++,
        s >= e && (s = 0);
        var i = t[s];
        this.selectVehicle(i)
    }
    selectVehicle(t) {
        var e = this.track.allowedVehicles
          , i = e.indexOf(t);
        -1 !== i && (this.vehicle = t,
        this.playerManager.firstPlayer.setBaseVehicle(t),
        this.restartTrack = !0)
    }
    trackAction(t, e) {
        var i = this.toolHandler.analytics.actions
          , s = this.mouse.analytics.clicks
          , n = i + s
          , r = {
            category: "create",
            action: t,
            label: e,
            value: n,
            non_interaction: !0
        };
        Application.Helpers.GoogleAnalyticsHelper.track_event(r)
    }
    openDialog(t) {
        switch (this.state.dialogOptions = {},
        t) {
        case "import":
            break;
        case "export":
            setTimeout(this.getTrackCode.bind(this), 750);
            break;
        case "upload":
            "undefined" == typeof isChromeApp && setTimeout(this.getTrackCode.bind(this), 750)
        }
        this.state.playing = !1,
        this.state.showDialog = t
    }
    getTrackCode() {
        this.state.dialogOptions = {},
        this.state.dialogOptions.verified = this.verified,
        this.state.dialogOptions.code = this.track.getCode()
    }
    trackComplete() {
        this.verified = this.track.dirty ? !1 : !0
    }
    hideControlPlanel() {}
    showControlPlanel() {}
    command() {
        var t = Array.prototype.slice.call(arguments, 0)
          , e = t.shift();
        switch (e) {
        case "change tool":
            var i = t[0];
            this.toolHandler.setTool(i);
            break;
        case "change tool option":
            var s = t[0]
              , n = t[1];
            "undefined" != typeof t[2] ? this.toolHandler.setToolOption(s, n, t[2]) : this.toolHandler.setToolOption(s, n);
            break;
        case "snap":
            this.toolHandler.toggleSnap();
            break;
        case "add track":
            this.track.read(demo.code),
            track = null;
            break;
        case "redraw":
            this.redraw();
            break;
        case "fullscreen":
            this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen;
            break;
        case "grid":
            this.toolHandler.toggleGrid();
            break;
        case "lock camera":
            this.toolHandler.toggleCameraLock();
            break;
        case "toggle vehicle":
            this.toggleVehicle(),
            this.stateChanged();
            break;
        case "reset zoom":
            this.camera.resetZoom();
            break;
        case "increase zoom":
            this.camera.increaseZoom();
            break;
        case "decrease zoom":
            this.camera.decreaseZoom();
            break;
        case "change lineType":
            var r = t[0];
            this.toolHandler.options.lineType = r,
            this.stateChanged();
            break;
        case "resize":
            this.resize();
            break;
        case "dialog":
            var o = t[0];
            o === !1 ? this.listen() : this.unlisten(),
            this.openDialog(o);
            break;
        case "focused":
            var a = t[0];
            a === !0 ? (this.state.inFocus = !0,
            this.state.showDialog === !1 && this.listen()) : (this.state.inFocus = !1,
            this.unlisten(),
            this.state.playing = !1);
            break;
        case "clear track":
            this.trackAction("editor-action", "clear"),
            this.clear = !0;
            break;
        case "import":
            var h = t[0];
            h.length <= 0 && (h = !1),
            this.importCode = h,
            this.clear = t[1],
            this.command("dialog", !1)
        }
    }
    listen() {
        var t = this.playerManager.firstPlayer
          , e = t.getGamepad();
        e.listen()
    }
    unlisten() {
        var t = this.playerManager.firstPlayer
          , e = t.getGamepad();
        e.unlisten()
    }
    stopAudio() {
        createjs.Sound.stop()
    }
    close() {
        this.trackAction("editor-exit", "exit"),
        this.pauseControls = null,
        this.mouse.close(),
        this.mouse = null,
        this.camera.close(),
        this.camera = null,
        this.screen.close(),
        this.screen = null,
        this.vehicleTimer.close(),
        this.vehicleTimer = null,
        this.playerManager.close(),
        this.playerManager = null,
        this.sound.close(),
        this.sound = null,
        this.track.close(),
        this.toolHandler.close(),
        this.game = null,
        this.assets = null,
        this.settings = null,
        this.stage = null,
        this.track = null,
        this.state = null,
        this.stopAudio()
    }
}