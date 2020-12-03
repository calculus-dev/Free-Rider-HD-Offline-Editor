import MouseHandler from "../utils/MouseHandler.js";
import Score from "../utils/Score.js";
import CampaignScore from "../utils/CampaignScore.js";
import Camera from "../view/Camera.js";
import Screen from "../view/Screen.js";
import PlayerManager from "../vehicles/PlayerManager.js";
import VehicleTimer from "../utils/VehicleTimer.js";
import ToolHandler from "../tools/ToolHandler.js";
import CameraTool from "../tools/Camera.js";
import Track from "../tracks/Track.js";
import LoadingCircle from "../utils/LoadingCircle.js";
import PauseControls from "../controls/Pause.js";
import SoundManager from "../utils/SoundManager.js";
import MessageManager from "../utils/MessageManager.js";
import ControlSettings from "../controls/Settings.js";
import S from "../utils/Sha256.js";
import formatNumber from "../utils/FormatNumber.js";

export default class Main {
    constructor(game) {
        this.game = game,
        this.assets = game.assets,
        this.stage = game.stage,
        this.settings = game.settings,
        this.sound = new SoundManager(this),
        this.mouse = new MouseHandler(this),
        this.initalizeCamera(),
        this.screen = new Screen(this),
        this.createTrack(),
        this.score = new Score(this),
        this.raceTimes = new RaceTimes(this),
        this.message = new MessageManager(this),
        this.settings.isCampaign && (this.campaignScore = new CampaignScore(this)),
        this.loadingcircle = new LoadingCircle(this),
        this.loading = !1,
        this.ready = !1,
        this.playerManager = new PlayerManager(this),
        this.vehicleTimer = new VehicleTimer(this),
        this.races = [],
        this.state = this.setStateDefaults(),
        this.oldState = this.setStateDefaults(),
        this.createMainPlayer(),
        this.createControls(),
        this.registerTools(),
        this.setStartingVehicle(),
        this.restart(),
        this.initializeAnalytics(),
        this.stage.addEventListener("stagemousedown", this.tapToStartOrRestart.bind(this)),
        window.lite && this.injectLiteFeatures()
    }
    game = null;
    assets = null;
    stage = null;
    settings = null;
    camera = null;
    score = null;
    screen = null;
    mouse = null;
    track = null;
    player = null;
    players = null;
    ticks = 0;
    races = null;
    state = null;
    oldState = null;
    stateDirty = !0;
    onStateChange = null;
    playing = !1;
    ready = !1;
    vehicle = "Mtb";
    showDialog = !1;
    importCode = !1;
    preloading = !0;
    loading = !0;
    pauseControls = null;
    fullscreenControls = null;
    settingsControls = null;
    controls = null;
    message = null;
    showSkip = !1;
    injectLiteFeatures() {
        if(window.lite.getVar("feats")) {
            fetch("https://raw.githubusercontent.com/calculus-dev/Official_Featured_Ghosts/master/tampermonkey.script.js").then((response) => response.text()).then(data => {
                var script = document.createElement('script');
                script.innerHTML = data;
                document.head.appendChild(script)
            })
        }
    }
    getCanvasOffset() {
        var t = {
            height: 0,
            width: 0
        };
        return t
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
            deaths: 0
        }
    }
    createControls() {
        this.pauseControls = new PauseControls(this),
        this.settings.fullscreenAvailable && (this.fullscreenControls = new FullScreenControls(this)),
        this.settingsControls = new ControlSettings(this)
    }
    play() {
        this.state.playing || (this.state.playing = !0,
        this.hideControlPlanel())
    }
    buttonDown(button) {
        if (!this.state.showDialog) {
            var e = this.camera;
            switch (button) {
            case "change_camera":
                e.focusOnNextPlayer();
                break;
            case "pause":
                this.state.paused = !this.state.paused;
                break;
            case "settings":
                this.openDialog("settings");
                break;
            case "exit_fullscreen":
                this.exitFullscreen();
                break;
            case "change_vehicle":
                this.toggleVehicle();
                break;
            case "zoom_increase":
                e.increaseZoom();
                break;
            case "zoom_decrease":
                e.decreaseZoom();
                break;
            case "fullscreen":
                this.toggleFullscreen()
            }
        }
    }
    exitFullscreen() {
        this.settings.fullscreenAvailable && (this.settings.fullscreen = !1,
        this.state.fullscreen = !1,
        this.trackEvent("game-ui", "game-fullscreen-toggle", "game-out-fullscreen"))
    }
    toggleFullscreen() {
        if (this.settings.embedded) {
            var t = this.settings
            , e = t.basePlatformUrl + "/t/" + t.track.url;
            window.open(e)
        } else
            this.settings.fullscreenAvailable && (this.settings.fullscreen = !this.settings.fullscreen,
            this.state.fullscreen = !this.settings.fullscreen,
            this.settings.fullscreen ? this.trackEvent("game-ui", "game-fullscreen-toggle", "game-into-fullscreen") : this.trackEvent("game-ui", "game-fullscreen-toggle", "game-out-fullscreen"))
    }
    trackEvent(a, b, c) {
        var d = {
            category: a,
            action: b,
            label: c,
            value: 0,
            non_interaction: !0
        };
        Application.Helpers.GoogleAnalyticsHelper.track_event(d)
    }
    getAvailableTrackCode() {
        var t = this.settings
        , e = !1;
        return t.importCode && "false" !== t.importCode ? (e = t.importCode,
        t.importCode = null) : this.importCode && (e = this.importCode,
        this.importCode = null),
        e
    }
    createMainPlayer() {
        var t = this.playerManager
        , e = t.createPlayer(this, this.settings.user)
        , i = e.getGamepad();
        i.setKeyMap(this.settings.playHotkeys),
        i.recordKeys(this.settings.keysToRecord),
        i.onButtonDown = this.buttonDown.bind(this),
        i.listen(),
        this.playerManager.firstPlayer = e,
        this.playerManager.addPlayer(e)
    }
    createTrack() {
        this.track && this.track.close();
        var t = new Track(this)
        , e = this.getAvailableTrackCode();
        0 != e && (t.read(e),
        this.track = t,
        this.setTrackAllowedVehicles(),
        this.state.preloading = !1,
        this.loading = !1,
        this.restartTrack = !0,
        this.ready = !0),
        this.track = t
    }
    setTrackAllowedVehicles() {
        var t = this.track
        , e = this.settings.track;
        e && (t.allowedVehicles = e.vehicles)
    }
    initalizeCamera() {
        this.camera = new Camera(this)
    }
    updateControls() {
        if (this.controls) {
            var t = this.state.paused;
            this.controls.isVisible() === t && (t || (this.state.playing = !1,
            this.camera.focusOnMainPlayer(),
            this.toolHandler.setTool("camera")),
            this.controls.setVisibility(!t),
            this.controls.setZoomControlsVisibilty(t),
            this.updateState()),
            this.controls.update()
        }
        this.pauseControls.update(),
        this.settings.fullscreenAvailable && this.fullscreenControls.update()
    }
    registerTools() {
        var t = new ToolHandler(this);
        this.toolHandler = t,
        t.registerTool(CameraTool),
        t.setTool("Camera")
    }
    updateToolHandler() {
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update()
    }
    update() {
        this.ready ? (this.updateToolHandler(),
        this.mouse.update(),
        this.state.paused || this.state.showDialog || (this.updateGamepads(),
        this.checkGamepads()),
        this.screen.update(),
        this.updateControls(),
        this.camera.update(),
        this.sound.update(),
        this.restartTrack && this.restart(),
        !this.state.paused && this.state.playing && (this.message.update(),
        this.updatePlayers(),
        this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
        this.updateScore(),
        this.vehicleTimer.update(),
        this.isStateDirty() && this.updateState(),
        this.stage.clear(),
        this.draw(),
        this.stage.update(),
        this.camera.updateZoom()) : this.importCode && this.createTrack()
    }
    isStateDirty() {
        var t = this.oldState
        , e = this.state;
        e.fullscreen != GameSettings.fullscreen && (e.fullscreen = GameSettings.fullscreen);
        var i = !1;
        for (var s in e)
            e[s] !== t[s] && (i = !0,
            this.oldState[s] = e[s]);
        return i
    }
    updateScore() {
        this.score.update(),
        this.campaignScore && this.campaignScore.update(),
        this.raceTimes.update()
    }
    restart() {
        this.settings.mobile ? this.message.show("Press Any Button To Start", 1, "#333333") : this.message.show("Press Any Key To Start", 1, "#333333", "#FFFFFF"),
        this.track.resetPowerups(),
        this.restartTrack = !1,
        this.state.paused = !1,
        this.state.playing = !this.settings.waitForKeyPress,
        this.ticks = 0,
        this.playerManager.reset(),
        this.playerManager.getPlayerCount() > 0 && (this.camera.focusIndex = 1),
        this.camera.focusOnPlayer(),
        this.camera.fastforward(),
        this.showControlPlanel("main")
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
    setStartingVehicle() {
        var t = this.settings
        , e = t.startVehicle;
        t.track && (e = t.track.vehicle),
        this.vehicle = e
    }
    updateGamepads() {
        this.playerManager.updateGamepads()
    }
    checkGamepads() {
        this.playerManager.checkKeys()
    }
    updatePlayers() {
        this.playerManager.update()
    }
    drawPlayers() {
        this.playerManager.draw()
    }
    hideControlPlanel() {
        this.state.showSkip && (this.state.showSkip = !1),
        this.state.showControls !== !1 && (this.state.showControls = !1)
    }
    showControlPlanel(c) {
        this.settings.isCampaign && !this.settings.mobile && this.settings.campaignData.can_skip && this.analytics && this.analytics.deaths > 5 && (this.state.showSkip = !0),
        this.stateshowControls !== c && this.settings.showHelpControls && (this.state.showControls = c)
    }
    draw() {
        this.toolHandler.drawGrid(),
        this.track.draw(),
        this.drawPlayers(),
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
        this.loading && this.loadingcircle.draw(),
        this.message.draw()
    }
    redraw() {
        this.track.undraw(),
        GameInventoryManager.redraw(),
        this.toolHandler.resize()
    }
    resize() {
        this.pauseControls.resize(),
        this.settings.fullscreenAvailable && this.fullscreenControls.resize(),
        this.settingsControls.resize(),
        this.controls && this.controls.resize()
    }
    updateState() {
        null !== this.game.onStateChange && this.game.onStateChange(this.state)
    }
    stateChanged() {
        this.updateState()
    }
    setStateDefaults() {
        var t = {};
        return t.playing = !this.settings.waitForKeyPress,
        t.paused = !1,
        t.playerAlive = !0,
        t.inFocus = !0,
        t.preloading = !0,
        t.fullscreen = this.settings.fullscreen,
        t.showControls = !1,
        t.showSkip = !1,
        t.showDialog = !1,
        t.dialogOptions = !1,
        t
    }
    toggleVehicle() {
        var t = this.track.allowedVehicles
        , e = t.length
        , i = this.vehicle
        , s = t.indexOf(i);
        s++,
        s >= e && (s = 0);
        var i = t[s];
        this.selectVehicle(i)
    }
    selectVehicle(t) {
        var e = this.track.allowedVehicles
        , i = e.indexOf(t);
        -1 !== i && (this.settings.track.vehicle = t,
        this.vehicle = t,
        this.playerManager.firstPlayer.setBaseVehicle(t),
        this.restartTrack = !0)
    }
    openDialog(t) {
        this.state.playing = !1,
        this.state.showDialog = t
    }
    command() {
        var t = Array.prototype.slice.call(arguments, 0)
        , e = t.shift();
        switch (e) {
        case "resize":
            this.resize();
            break;
        case "dialog":
            var i = t[0];
            i === !1 ? this.listen() : this.unlisten(),
            this.openDialog(i);
            break;
        case "focused":
            var s = t[0];
            s === !0 ? (this.state.inFocus = !0,
            this.state.showDialog === !1 && this.listen()) : (this.state.inFocus = !1,
            this.unlisten(),
            this.state.playing = !1);
            break;
        case "add track":
            var n = t[0];
            this.importCode = n.code;
            break;
        case "clear race":
            this.races = [],
            this.restartTrack = !0,
            this.raceTimes.clear();
            break;
        case "add race":
            var r = t[0]
            , o = t[1];
            this.addRaces(r),
            o && (this.state.dialogOptions = {
                races: this.races
            },
            this.command("dialog", "race_dialog"));
            break;
        case "change vehicle":
            var a = t[0];
            this.selectVehicle(a);
            break;
        case "restart":
            this.command("dialog", !1),
            this.restartTrack = !0;
            break;
        case "resume":
            this.state.paused = !1;
            break;
        case "fullscreen":
            this.toggleFullscreen();
            break;
        case "exit_fullscreen":
            this.exitFullscreen()
        }
    }
    addRaces(race) {
        this.mergeRaces(race),
        this.sortRaces(),
        this.formatRaces(),
        this.addRaceTimes(),
        this.addPlayers(),
        this.restartTrack = !0
    }
    addRaceTimes() {
        var t = this.settings.raceColors
        , e = t.length
        , i = this.races
        , s = this.raceTimes;
        s.clear();
        for (var n in i) {
            var r = i[n];
            r.user.color = t[n % e],
            s.addRace(r, n)
        }
    }
    addPlayers() {
        var t = this.races
        , e = this.playerManager;
        e.clear();
        var i = this.settings.keysToRecord;
        for (var s in t) {
            var n = t[s]
            , r = n.user
            , o = n.race
            , a = o.code;
            "string" == typeof a && (a = JSON.parse(a));
            var h = e.createPlayer(this, r);
            h.setBaseVehicle(o.vehicle),
            h.setAsGhost();
            var l = h.getGamepad();
            l.loadPlayback(a, i),
            e.addPlayer(h)
        }
    }
    formatRaces() {
        var t = this.races;
        for (var e in t) {
            var i = t[e].race
            , s = i.code;
            if ("string" == typeof s) {
                s = JSON.parse(s);
                for (var n in s) {
                    var o = {};
                    for(var b in s[n]) {
                        o[s[n][b]] = 0;
                        o[s[n][b]]++
                    }
                    s[n] = o
                }
                i.code = s
            }
        }
    }
    removeDuplicateRaces() {}
    uniqesByUserIdIterator(a) {
        var e = a.user;
        return e.u_id
    }
    sortRaces() {
        this.races.forEach(t => {
            this.sortByRunTicksIterator(t);
        });
        this.races.sort((a, b) => {
            return a.race.run_ticks - b.race.run_ticks
        });
    }
    mergeRaces(race) {
        race = race[0] || race;
        if(race) {
            for(var t in this.races) {
                if(this.races[t].user.u_id === (race.user.u_id)) {
                    if(this.races[t].race.run_ticks === race.race.run_ticks) {
                        return;
                    }
                }
            }
            this.races.push(race);
        }
    }
    sortByRunTicksIterator(a) {
        var e = this.settings
        , i = parseInt(a.race.run_ticks)
        , s = formatNumber(i / e.drawFPS * 1e3);
        return a.runTime = s,
        i
    }
    verifyComplete() {
        var t = this.playerManager.firstPlayer
        , e = t._powerupsConsumed.targets
        , i = this.track.targets
        , s = !0;
        for (var n in i) {
            var r = i[n]
            , o = r.id;
            -1 === e.indexOf(o) && (s = !1)
        }
        return s
    }
    trackComplete() {
        if (this.verifyComplete()) {
            this.sound.play("victory_sound");
            var t = this.playerManager;
            t.mutePlayers();
            var e = t.firstPlayer
            , i = e.getGamepad()
            , s = i.getReplayString()
            , n = this.settings
            , r = this.ticks
            , o = formatNumber(r / n.drawFPS * 1e3)
            , a = $("#track-data").data("t_id")
            , h = {
                t_id: a,
                u_id: n.user.u_id,
                code: s,
                vehicle: e._baseVehicleType,
                run_ticks: r,
                fps: 25,
                time: o
            }
            , l = h.t_id + "|" + h.u_id + "|" + h.code + "|" + h.run_ticks + "|" + h.vehicle + "|" + h.fps + "|erxrHHcksIHHksktt8933XhwlstTekz"
            , c = S.SHA256(l).toString();
            h.sig = c;
            var u = this.races
            , p = u.length
            , d = [];
            if (p > 0) {
                for (var f = 0; p > f; f++)
                    d.push(u[f].user.u_id);
                h.races = d
            }
            n.isCampaign && (h.is_campaign = !0),
            this.state.dialogOptions = {
                postData: h,
                analytics: this.analytics
            },
            n.isCampaign ? this.command("dialog", "campaign_complete") : this.command("dialog", "track_complete"),
            i.reset(!0),
            this.listen()
        }
    }
    drawFPS() {
        var t = createjs.Ticker.getMeasuredFPS()
        , e = this.game.pixelRatio
        , i = this.game.canvas.getContext("2d")
        , s = 5
        , n = this.screen.height - 12 * e
        , r = Math.round(10 * t) / 10
        , o = "FPS : " + r;
        i.save(),
        i.fillStyle = "#000000",
        i.font = 8 * e + "pt arial",
        i.fillText(o, s * e, n),
        i.restore()
    }
    close() {
        this.fullscreenControls = null,
        this.settingsControls = null,
        this.pauseControls = null,
        this.raceTimes = null,
        this.score = null,
        this.campaignScore = null,
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