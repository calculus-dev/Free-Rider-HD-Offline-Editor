import s from "../math/cartesian.js";
import PhysicsLine from "../sector/PhysicsLine.js";
import SceneryLine from "../sector/SceneryLine.js";
import bresenham from "../math/bresenham.js";
import Sector from "../sector/Sector.js";
import Bomb from "../sector/powerups/Bomb.js";
import Gravity from "../sector/powerups/Gravity.js";
import Booster from "../sector/powerups/Boost.js";
import Checkpoint from "../sector/powerups/Checkpoint.js";
import Target from "../sector/powerups/Goal.js";
import Slowmo from "../sector/powerups/Slowmo.js";
import Antigravity from "../sector/powerups/Antigravity.js";
import Teleporter from "../sector/powerups/Teleport.js";
import Helicopter from "../sector/vehiclepowerups/Helicopter.js";
import Truck from "../sector/vehiclepowerups/Truck.js";
import Balloon from "../sector/vehiclepowerups/Balloon.js";
import Blob from "../sector/vehiclepowerups/Blob.js";
import CanvasPool from "../utils/CanvasPool.js";

var M = {
    LINE: 1,
    POWERUPS: 2
}
  , PowerupsCache = [];

export default class Track {
    constructor(t) {
        this.scene = t,
        this.game = t.game,
        this.settings = t.game.settings,
        this.camera = t.camera,
        this.sectors = {},
        this.sectors.drawSectors = [],
        this.sectors.physicsSectors = [],
        this.totalSectors = [],
        this.powerups = [],
        this.powerupsLookupTable = {},
        this.physicsLines = [],
        this.sceneryLines = [],
        this.targets = [],
        this.allowedVehicles = ["MTB", "BMX"],
        this.canvasPool = new CanvasPool(t),
        this.createPowerupCache()
    }
    defaultLine = {
        p1: new s(-40,50),
        p2: new s(40,50)
    }
    game = null;
    scene = null;
    camera = null;
    canvas = null;
    canvasPool = null;
    settings = null;
    physicsLines = null;
    sceneryLines = null;
    powerups = null;
    targets = null;
    targetCount = 0;
    sectors = null;
    totalSectors = null;
    allowedVehicles = null;
    dirty = !1;
    createPowerupCache() {
        PowerupsCache.push(new Booster(0,0,0,this)),
        PowerupsCache.push(new Slowmo(0,0,this)),
        PowerupsCache.push(new Bomb(0,0,this)),
        PowerupsCache.push(new Gravity(0,0,0,this)),
        PowerupsCache.push(new Checkpoint(0,0,this)),
        PowerupsCache.push(new Target(0,0,this)),
        PowerupsCache.push(new Antigravity(0,0,this)),
        PowerupsCache.push(new Teleporter(0,0,this)),
        PowerupsCache.push(new Helicopter(0,0,0,this)),
        PowerupsCache.push(new Truck(0,0,0,this)),
        PowerupsCache.push(new Balloon(0,0,0,this)),
        PowerupsCache.push(new Blob(0,0,0,this))
    }
    recachePowerups(a) {
        for (var e in PowerupsCache)
            PowerupsCache[e].recache(a)
    }
    read(a) {
        var e = a.split("#")
          , i = e[0].split(",")
          , s = []
          , n = [];
        if (e.length > 2)
            var s = e[1].split(",")
              , n = e[2].split(",");
        else if (e.length > 1)
            var n = e[1].split(",");
        this.addLines(i, this.addPhysicsLine),
        this.addLines(s, this.addSceneryLine),
        this.addPowerups(n)
    }
    addPowerups(tt) {
        for (var e = tt.length, i = [], s = ((new Date).getTime(),
        0); e > s; s++)
            if (i = tt[s].split(" "),
            i.length >= 2) {
                for (var n = [], r = i.length, o = 1; r > o; o++) {
                    var a = parseInt(i[o], 32);
                    n.push(a)
                }
                var h = Math.round(n[0])
                  , l = Math.round(n[1])
                  , p = null;
                switch (i[0]) {
                case "B":
                    p = new Booster(h,l,n[2],this),
                    this.addPowerup(p);
                    break;
                case "S":
                    p = new Slowmo(h,l,this),
                    this.addPowerup(p);
                    break;
                case "O":
                    p = new Bomb(h,l,this),
                    this.addPowerup(p);
                    break;
                case "G":
                    p = new Gravity(h,l,n[2],this),
                    this.addPowerup(p);
                    break;
                case "C":
                    p = new Checkpoint(h,l,this),
                    this.addPowerup(p);
                    break;
                case "T":
                    p = new Target(h,l,this),
                    this.addTarget(p),
                    this.addPowerup(p);
                    break;
                case "A":
                    p = new Antigravity(h,l,this),
                    this.addPowerup(p);
                    break;
                case "V":
                    var d = n[2]
                      , P = n[3]
                      , M = this.settings.vehiclePowerup.minTime
                      , A = this.settings.vehiclePowerup.maxTime;
                    P = P || M,
                    P = Math.min(P, A),
                    P = Math.max(P, M);
                    var p;
                    switch (d) {
                        case 1:
                            p = new Helicopter(h,l,P,this);
                            break;
                        case 2:
                            p = new Truck(h,l,P,this);
                            break;
                        case 3:
                            p = new Balloon(h,l,P,this);
                            break;
                        case 4:
                            p = new Blob(h,l,P,this);
                            break;
                        default:
                            continue
                    }
                    this.addPowerup(p);
                    break;
                case "W":
                    var D = n[0]
                      , I = n[1]
                      , E = n[2]
                      , O = n[3]
                      , z = new Teleporter(D,I,this)
                      , j = new Teleporter(E,O,this);
                    z.addOtherPortalRef(j),
                    j.addOtherPortalRef(z),
                    this.addPowerup(z),
                    this.addPowerup(j)
                }
            }
    }
    addTarget(t) {
        this.dirty = !0,
        this.targetCount++,
        this.targets.push(t)
    }
    addPowerup(t) {
        var e = this.sectors.drawSectors
          , i = this.sectors.physicsSectors
          , s = t.x
          , n = t.y
          , r = this.settings.drawSectorSize
          , o = this.settings.physicsSectorSize;
        this.addRef(s, n, t, M.POWERUPS, i, o);
        var a = this.addRef(s, n, t, M.POWERUPS, e, r);
        return a !== !1 && this.totalSectors.push(a),
        null !== t && (this.powerups.push(t),
        t.id && (this.powerupsLookupTable[t.id] = t)),
        t
    }
    addLines(t, e) {
        for (var i = t.length, s = 0; i > s; s++) {
            var n = t[s].split(" ")
              , r = n.length;
            if (r > 3)
                for (var o = 0; r - 2 > o; o += 2) {
                    var a = parseInt(n[o], 32)
                      , h = parseInt(n[o + 1], 32)
                      , l = parseInt(n[o + 2], 32)
                      , c = parseInt(n[o + 3], 32)
                      , u = a + h + l + c;
                    isNaN(u) || e.call(this, a, h, l, c)
                }
        }
    }
    addPhysicsLine(t, e, i, s) {
        var t = Math.round(t)
          , e = Math.round(e)
          , i = Math.round(i)
          , s = Math.round(s)
          , r = i - t
          , o = s - e
          , a = Math.sqrt(Math.pow(r, 2) + Math.pow(o, 2));
        if (a >= 2) {
            var h = new PhysicsLine(t,e,i,s);
            this.addPhysicsLineToTrack(h)
        }
        return h
    }
    addPhysicsLineToTrack(t) {
        for (var e = this.settings.drawSectorSize, i = t.p1, s = t.p2, n = i.x, r = i.y, a = s.x, h = s.y, l = bresenham(n, r, a, h, e), c = this.sectors.drawSectors, u = l.length, p = 0; u > p; p += 2) {
            var d = l[p]
              , f = l[p + 1]
              , v = this.addRef(d, f, t, M.LINE, c, e);
            v !== !1 && this.totalSectors.push(v)
        }
        for (var g = this.settings.physicsSectorSize, m = bresenham(n, r, a, h, g), y = this.sectors.physicsSectors, w = m.length, p = 0; w > p; p += 2) {
            var d = m[p]
              , f = m[p + 1];
            this.addRef(d, f, t, M.LINE, y, g)
        }
        return this.physicsLines.push(t),
        t
    }
    addSceneryLine(t, e, i, s) {
        var t = Math.round(t)
          , e = Math.round(e)
          , i = Math.round(i)
          , s = Math.round(s)
          , n = i - t
          , o = s - e
          , a = Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2));
        if (a >= 2) {
            var h = new SceneryLine(t,e,i,s);
            this.addSceneryLineToTrack(h)
        }
        return h
    }
    addSceneryLineToTrack(t) {
        for (var e = this.settings.drawSectorSize, i = t.p1, s = t.p2, n = i.x, r = i.y, a = s.x, h = s.y, l = bresenham(n, r, a, h, e), c = this.sectors.drawSectors, u = l.length, p = 0; u > p; p += 2) {
            var d = l[p]
              , f = l[p + 1]
              , v = this.addRef(d, f, t, M.LINE, c, e);
            v !== !1 && this.totalSectors.push(v)
        }
        return this.sceneryLines.push(t),
        t
    }
    addRef(t, e, i, s, n, r) {
        var o = Math.floor(t / r)
          , h = Math.floor(e / r)
          , c = !1;
        if (void 0 === n[o] && (n[o] = []),
        void 0 === n[o][h]) {
            var u = new Sector(o,h,this);
            n[o][h] = u,
            c = u
        }
        switch (s) {
            case M.LINE:
                n[o][h].addLine(i),
                i.addSectorReference(n[o][h]);
                break;
            case M.POWERUPS:
                n[o][h].addPowerup(i),
                i.addSectorReference(n[o][h])
        }
        return this.dirty = !0,
        c
    }
    cleanTrack() {
        this.cleanLines(),
        this.cleanPowerups()
    }
    cleanLines() {
        for (var t = this.physicsLines, e = this.sceneryLines, i = t.length, s = e.length, n = i - 1; n >= 0; n--)
            t[n].remove && t.splice(n, 1);
        for (var r = s - 1; r >= 0; r--)
            e[r].remove && e.splice(r, 1)
    }
    cleanPowerups() {
        for (var t = this.powerups, e = this.targets, i = this.targets.length, s = t.length, n = (this.powerupsLookupTable,
        s - 1); n >= 0; n--)
            t[n].remove && t.splice(n, 1);
        for (var r = i - 1; r >= 0; r--)
            e[r].remove && e.splice(r, 1);
        this.targetCount = e.length
    }
    updatePowerupState(t) {
        var e = t._powerupsConsumed;
        this.resetPowerups();
        var i = e.targets
          , s = e.checkpoints
          , n = e.misc;
        this.setPowerupStates(i),
        this.setPowerupStates(s),
        this.setPowerupStates(n)
    }
    setPowerupStates(t) {
        var e = this.powerupsLookupTable;
        for (var i in t) {
            var s = t[i]
              , n = e[s];
            n.remove && n.id && (delete e[s],
            delete t[s]),
            n.hit = !0,
            n.sector.powerupCanvasDrawn = !1
        }
    }
    select(a, b) {
        var segments = [];
        if(a.x < b.x && a.y < b.y){
            for(var i of [...this.physicsLines, ...this.sceneryLines, ...this.powerups]){
                if(i.p1 || i.p2) {
                    if(i.p1.x >= a.x && i.p1.y >= a.y || i.p2.x >= a.x && i.p2.y >= a.y && i.p1.x <= b.x && i.p1.y <= b.y ||
                    i.p2.x <= b.x && i.p2.y <= b.y) {
                        segments.push(i);
                    }
                } else {
                    if(i.x >= a.x && i.y >= a.y && i.x <= b.x && i.y <= b.y) {
                        segments.push(i);
                    }
                }
            }
        } else {
            for(var i of [...this.physicsLines, ...this.sceneryLines, ...this.powerups]){
                if(i.p1 || i.p2) {
                    if(i.p1.x <= a.x && i.p1.y <= a.y || i.p2.x <= a.x && i.p2.y <= a.y && i.p1.x >= b.x && i.p1.y >= b.y ||
                    i.p2.x >= b.x && i.p2.y >= b.y) {
                        segments.push(i);
                    }
                } else {
                    if(i.x <= a.x && i.y <= a.y && i.x >= b.x && i.y >= b.y) {
                        segments.push(i);
                    }
                }
            }
        }
        return segments
    }
    getCode() {
        this.cleanTrack();
        var t = this.powerups
          , e = this.physicsLines
          , i = this.sceneryLines
          , s = ""
          , n = e.length
          , r = i.length
          , o = t.length;
        if (n > 0) {
            for (var a in e) {
                var h = e[a];
                h.recorded || (s += h.p1.x.toString(32) + " " + h.p1.y.toString(32) + h.getCode(this) + ",")
            }
            s = s.slice(0, -1);
            for (var a in e)
                e[a].recorded = !1
        }
        if (s += "#",
        r > 0) {
            for (var l in i) {
                var h = i[l];
                h.recorded || (s += h.p1.x.toString(32) + " " + h.p1.y.toString(32) + h.getCode(this) + ",")
            }
            s = s.slice(0, -1);
            for (var l in i)
                i[l].recorded = !1
        }
        if (s += "#",
        o > 0) {
            for (var c in t) {
                var u = t[c]
                  , p = u.getCode();
                p && (s += p + ",")
            }
            s = s.slice(0, -1)
        }
        return s
    }
    resetPowerups() {
        var t = this.powerups;
        for (var e in t) {
            var i = t[e];
            i.hit && !i.remove && (i.hit = !1,
            i.sector.powerupCanvasDrawn = !1)
        }
    }
    addDefaultLine() {
        var t = this.defaultLine
          , e = t.p1
          , i = t.p2;
        this.addPhysicsLine(e.x, e.y, i.x, i.y)
    }
    erase(t, e, i) {
        this.dirty = !0;
        for (var s = t.x - e, n = t.y - e, r = t.x + e, o = t.y + e, a = Math.max(s, r), p = Math.min(s, r), d = Math.max(n, o), f = Math.min(n, o), v = this.settings.drawSectorSize, g = Math.floor(a / v), m = Math.floor(p / v), y = Math.floor(d / v), w = Math.floor(f / v), x = this.sectors.drawSectors, _ = [], b = m; g >= b; b++)
            for (var T = w; y >= T; T++)
                x[b] && x[b][T] && _.push(x[b][T].erase(t, e, i));
        var t = [];
        for(var e in _) {
            for(var i in _[e]) {
                t.push(_[e][i])
            }
        }
        return t
    }
    drawAndCache() {
        for (var t = performance.now(), e = this.totalSectors, i = e.length, s = 0; i > s; s++) {
            var n = e[s];
            !function(t) {
                setTimeout(function() {
                    t.draw(),
                    t.cacheAsImage()
                }, 250 * s)
            }(n)
        }
        var r = performance.now();
        console.log("Track :: Time to draw entire track : " + (r - t) + "ms")
    }
    undraw() {
        var t = (performance.now(),
        this.totalSectors);
        for (var e in t) {
            var i = t[e];
            i.drawn && i.clear(!0)
        }
        var s = this.camera.zoom;
        this.recachePowerups(Math.max(s, 1)),
        this.canvasPool.update()
    }
    collide(t) {
        var e = this.settings.physicsSectorSize
          , i = Math.floor(t.pos.x / e - .5)
          , s = Math.floor(t.pos.y / e - .5)
          , n = this.sectors.physicsSectors;
        n[i] && n[i][s] && n[i][s].resetCollided(),
        n[i + 1] && n[i + 1][s] && n[i + 1][s].resetCollided(),
        n[i + 1] && n[i + 1][s + 1] && n[i + 1][s + 1].resetCollided(),
        n[i] && n[i][s + 1] && n[i][s + 1].resetCollided(),
        n[i] && n[i][s] && n[i][s].collide(t),
        n[i + 1] && n[i + 1][s] && n[i + 1][s].collide(t),
        n[i + 1] && n[i + 1][s + 1] && n[i + 1][s + 1].collide(t),
        n[i] && n[i][s + 1] && n[i][s + 1].collide(t)
    }
    getDrawSector(t, e) {
        var i = this.settings.drawSectorSize
          , s = Math.floor(t / i)
          , n = Math.floor(e / i)
          , r = this.sectors.drawSectors
          , o = !1;
        return "undefined" != typeof r[s] && "undefined" != typeof r[s][n] && (o = r[s][n]),
        o
    }
    draw() {
        var t = this.scene
          , e = t.camera
          , i = t.screen
          , s = t.game.canvas.getContext("2d")
          , n = e.zoom
          , r = e.position
          , o = t.screen.center
          , a = this.settings.drawSectorSize * n
          , h = r.x * n / a
          , l = r.y * n / a
          , c = i.width / a
          , u = i.height / a
          , p = u / 2
          , d = c / 2
          , f = h - d - 1
          , v = l - p - 1
          , g = h + d
          , m = l + p;
        s.imageSmoothingEnabled = !1,
        s.mozImageSmoothingEnabled = !1,
        s.oImageSmoothingEnabled = !1,
        s.webkitImageSmoothingEnabled = !1;
        for (var y = h * a - o.x, w = l * a - o.y, x = this.totalSectors, _ = x.length, b = 0; _ > b; b++) {
            var T = x[b]
              , C = T.row
              , k = T.column;
            if (T.dirty && T.cleanSector(),
            k >= f && g >= k && C >= v && m >= C) {
                T.drawn === !1 && T.draw(),
                T.hasPowerups && (T.powerupCanvasDrawn || T.cachePowerupSector());
                var S = k * a - y
                  , P = C * a - w;
                if (S = 0 | S,
                P = 0 | P,
                s.drawImage(T.canvas, S, P, a, a),
                T.hasPowerups && T.powerupCanvasDrawn) {
                    var M = T.powerupCanvasOffset * n;
                    s.drawImage(T.powerupCanvas, S - M / 2, P - M / 2, a + M, a + M)
                }
            } else
                T.drawn && T.clear()
        }
    }
    closeSectors() {
        for (var t = this.totalSectors, e = t.length, i = 0; e > i; i++)
            t[i].close()
    }
    close() {
        this.scene = null,
        this.closeSectors(),
        this.totalSectors = null,
        this.canvasPool = null,
        this.sectors = null,
        this.physicsLines = null,
        this.sceneryLines = null,
        this.powerups = null,
        this.camera = null
    }
}