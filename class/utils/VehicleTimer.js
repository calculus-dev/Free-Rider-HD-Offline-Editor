var p, u;

export default class {
    constructor(a) {
        this.scene = a,
        this.settings = a.settings,
        this.player = !1,
        this.tweens = [],
        this.build_interface(),
        this.createPulseTween()
    }
    scene = null;
    container = null;
    cached = !1;
    build_interface() {
        var t = this.scene.game.pixelRatio
        , e = new createjs.Container
        , i = "helsinki"
        , s = new createjs.Shape;
        s.graphics.setStrokeStyle(5, "round").beginStroke("rgba(242,144,66,1)").beginFill("rgba(242,144,66,0.5)").drawRoundRect(0, 0, 200, 60, 25);
        var n = new createjs.Text("00:00","35px " + i,window.lite &&  window.lite.getVar("dark") ? "#fdfdfd" : "#000000");
        n.textAlign = "center",
        n.textBaseline = "middle",
        n.x = 100,
        n.y = 30,
        e.addChild(s),
        e.addChild(n),
        e.visible = !1,
        e.scaleX = e.scaleY = t / 2,
        this.timeText = n,
        this.container = e,
        this.scene.game.stage.addChild(e),
        this.center_container()
    }
    setPlayer(t) {
        this.player = t
    }
    removePlayer() {
        this.player = !1
    }
    playerAddedTime(t) {
        this.player === t && this.createPulseTween()
    }
    createPulseTween() {
        var self = this;
        class Tween {
            constructor(t) {
                this.e = t,
                this.i = {},
                this.n = {},
                this.r = {},
                this.o = 1e3,
                this.a = 0,
                this.h = !1,
                this.l = !1,
                this.c = !1,
                this.u = 0,
                this.p = null,
                this.d = (t) => { return t },
                this.f = function(t, e) {
                    var i = t.length - 1
                    , n = i * e
                    , r = floor(n)
                    , o = function(t, e, i) {
                        return (e - t) * i + t
                    };
                    return 0 > e ? o(t[0], t[1], n) : e > 1 ? o(t[i], t[i - 1], i - n) : o(t[r], t[r + 1 > i ? i : r + 1], n - r)
                },
                this.v = [],
                this.g = null,
                this.m = !1,
                this.y = null,
                this.w = null,
                this.x = null;
                for (var _ in t)
                    this.i[_] = parseFloat(t[_], 10);
            }
            to(t, e) {
                return void 0 !== e && (this.o = e),
                this.n = t,
                this
            }
            start(t) {
                self.tweens.push(this),
                this.l = !0,
                this.m = !1,
                p = void 0 !== t ? t : window.performance.now(),
                p += u;
                for (var o in n) {
                    if (n[o]instanceof Array) {
                        if (0 === n[o].length)
                            continue;
                        n[o] = [e[o]].concat(n[o])
                    }
                    this.i[o] = e[o],
                    this.i[o]instanceof Array == !1 && (this.i[o] *= 1),
                    r[o] = this.i[o] || 0
                }
                return this
            }
            stop() {
                return l ? ((i = t.indexOf(this), i !== -1 && self.tweens.splice(i, 1)),
                l = !1,
                null !== x && x.call(e),
                this.stopChainedTweens(),
                this) : this
            }
            stopChainedTweens() {
                for (var t = 0, e = this.v.length; e > t; t++)
                    this.v[t].stop()
            }
            delay(t) {
                return this.u = t,
                this
            }
            repeat(t) {
                return this.a = t,
                this
            }
            yoyo(t) {
                return this.h = t,
                this
            }
            easing(t) {
                return this.d = t,
                this
            }
            interpolation(t) {
                return this.f = t,
                this
            }
            chain() {
                return v = arguments,
                this
            }
            onStart(t) {
                return g = t,
                this
            }
            onUpdate(t) {
                return this.y = t,
                this
            }
            onComplete(t) {
                return this.w = t,
                this
            }
            onStop(t) {
                return this.x = t,
                this
            }
            update(t) {
                var s, l, x;
                if (p > t)
                    return !0;
                m === !1 && (null !== g && g.call(e),
                m = !0),
                l = (t - p) / o,
                l = l > 1 ? 1 : l,
                x = d(l);
                for (s in n) {
                    var _ = i[s] || 0
                      , b = n[s];
                    b instanceof Array ? e[s] = f(b, x) : ("string" == typeof b && (b = _ + parseFloat(b, 10)),
                    "number" == typeof b && (e[s] = _ + (b - _) * x))
                }
                if (null !== y && y.call(e, x),
                1 === l) {
                    if (a > 0) {
                        isFinite(a) && a--;
                        for (s in r) {
                            if ("string" == typeof n[s] && (r[s] = r[s] + parseFloat(n[s], 10)),
                            h) {
                                var T = r[s];
                                r[s] = n[s],
                                n[s] = T
                            }
                            i[s] = r[s]
                        }
                        return h && (c = !c),
                        p = t + u,
                        !0
                    }
                    null !== w && w.call(e);
                    for (var C = 0, k = v.length; k > C; C++)
                        v[C].start(p + o);
                    return !1
                }
                return !0
            }
        }
        var t = this.container
        , e = this.scene.game.pixelRatio
        , i = e / 2
        , n = {
            scale: i
        }
        , r = {
            scale: 1.2 * i
        };
        this.pulse = new Tween(n).to(r, 200).repeat(1).yoyo(!0).easing(function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
        }).onUpdate(function() {
            t.scaleX = t.scaleY = this.scale
        }).start()
    }
    center_container() {
        var t = this.scene.screen
        , e = this.container;
        e.x = t.width / 2 - 100 * e.scaleX,
        e.y = t.height - 100 * e.scaleY
    }
    update = () => {

        this.player && this.player._tempVehicleTicks > 0 ? (this.center_container(),
        this.updateTime()) : this.container.visible = !1
    }
    updateTime() {
        var t = (this.container,
        this.timeText)
        , e = (this.player,
        this.player._tempVehicleTicks)
        , i = this.scene.settings.drawFPS
        , s = e / i;
        s = s.toFixed(2);
        var n = "";
        10 > s && (n = "0"),
        n += s,
        t.text = n,
        this.container.visible = !0
    }
    close() {
        this.container = null,
        this.player = null,
        this.scene = null,
        this.settings = null,
        this.timeText = null
    }
}