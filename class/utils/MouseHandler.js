import i from "../math/cartesian.js";

export default class {
    constructor(a) {
        this.scene = a,
        this.enabled = !0,
        this.touch = this.getTouchObject(),
        this.touch.old = this.getTouchObject(),
        this.secondaryTouch = this.getTouchObject(),
        this.secondaryTouch.old = this.getTouchObject(),
        this.initAnalytics(),
        this.bindToMouseEvents(),
        this.updateCallback = !1
    }
    scene = null;
    touch = null;
    touches = [];
    wheel = !1;
    mousewheel = !1;
    mouseMoveListener = null;
    mouseUpListener = null;
    mouseDownListener = null;
    throttledMouseWheel = null;
    analytics = null;
    contextMenuHandler(t) {
        return t.stopPropagation(),
        t.preventDefault(),
        !1
    }
    initAnalytics() {
        this.analytics = {
            clicks: 0
        }
    }
    getTouchObject() {
        var t = {
            id: null,
            down: !1,
            press: !1,
            release: !1,
            pos: new i(0,0),
            real: new i(0,0),
            type: 1
        };
        return t
    }
    bindToMouseEvents() {
        var t = this.scene.game.stage
        , e = this.scene.game.canvas
        , i = this.onMouseMove.bind(this)
        , n = this.onMouseDown.bind(this)
        , r = this.onMouseUp.bind(this);
        t.addEventListener("stagemousemove", i),
        t.addEventListener("stagemousedown", n),
        t.addEventListener("stagemouseup", r),
        this.mouseMoveListener = i,
        this.mouseDownListener = n,
        this.mouseUpListener = r;
        function hn(t, e, i) {
            var o = function() {
                if (a = arguments,
                c = Date.now(),
                u = this,
                d = g && (p || !m),
                !1 === v)
                    var i = m && !p;
                else {
                    h || m || (f = c);
                    var s = v - (c - f)
                        , o = 0 >= s || s > v;
                    o ? (h && (h = or(h)),
                    f = c,
                    l = t.apply(u, a)) : h || (h = setTimeout(!function(e, i) {
                        i && or(i),
                        e && (f = Date.now(),
                        l = t.apply(u, a),
                        p || h)
                    }(g, p), s))
                }
                return o && p ? p = or(p) : p || e === v || (p = setTimeout(n = function() {
                    var t = e - (Date.now() - c);
                    0 >= t || t > e ? s(d, h) : p = setTimeout(n, t)
                }, e)), i && (o = !0, l = t.apply(u, a)), !o || p || h, l
            };
            var a, h, l, c, u, p, d, f = 0, v = !1, g = !0;
            if ("function" != typeof t)
                throw new Kn(U);
            if (e = 0 > e ? 0 : +e || 0,
            !0 === i)
                var m = !0
                    , g = !1;
            else
            (!!i && (typeof i == "object" || typeof i == "function")) && (m = !!i.leading,
                v = "maxWait"in i && Math.max(+i.maxWait || 0, e),
                g = "trailing"in i ? !!i.trailing : g);
            return o.cancel = function() {
                p && or(p),
                h && or(h),
                f = 0,
                h = p = d = T
            }, o
        }
        var throttle = function(t, e, i) {
            var s = !0
              , n = !0;
            if (typeof t != "function") {
                throw Error()
            }
            var v = hn(t, e, {
                leading: s,
                maxWait: +e,
                trailing: n
            });
            return !1 === i ? s = !1 : (!!i && (typeof i == "object" || typeof i == "function")) && (s = "leading" in i ? !!i.leading : s,
            n = "trailing" in i ? !!i.trailing : n),
            v
        }
        var o = throttle(this.onMouseWheel, 0);
        e.addEventListener("mousewheel", o.bind(this)),
        e.addEventListener("wheel", o.bind(this)),
        e.addEventListener("DOMMouseScroll", o.bind(this)),
        this.mouseWheelListener = o
    }
    onMouseDown(t) {
        this.analytics.clicks++,
        2 === t.nativeEvent.button ? this.secondaryTouch.down === !1 && (this.updatePosition(t, this.secondaryTouch),
        this.secondaryTouch.down = !0) : this.touch.down === !1 && (this.updatePosition(t, this.touch),
        this.touch.down = !0)
    }
    disableContextMenu() {
        this.scene.game.canvas.oncontextmenu = function() {
            return !1
        }
    }
    onMouseUp(t) {
        2 === t.nativeEvent.button ? this.secondaryTouch.down === !0 && (this.updatePosition(t, this.secondaryTouch),
        this.secondaryTouch.down = !1) : this.touch.down === !0 && (this.updatePosition(t, this.touch),
        this.touch.down = !1)
    }
    updatePosition(t, e) {
        e.id = t.pointerID,
        e.type = t.nativeEvent.button;
        var i = e.pos;
        i.x = t.stageX,
        i.y = t.stageY,
        this.updateRealPosition(e)
    }
    updateRealPosition(t) {
        var e = t.pos
        , i = t.real
        , s = this.scene
        , n = s.screen
        , o = s.camera
        , a = n.center
        , h = o.position
        , l = (e.x - a.x) / o.zoom + h.x
        , c = (e.y - a.y) / o.zoom + h.y;
        i.x = Math.round(l),
        i.y = Math.round(c);
        var u = this.scene.settings;
        if(this.scene.toolHandler.options.grid) {
            var p = u.toolHandler.gridSize | 0;
            i.x = Math.round(i.x / p) * p
            i.y = Math.round(i.y / p) * p
        }
        this.updateCallback
    }
    onMouseWheel(t) {
        var t = window.event || t;
        t.preventDefault(),
        t.stopPropagation();
        var e = Math.max(-1, Math.min(1, t.deltaY || -t.detail));
        return 0 == e && (e = Math.max(-1, Math.min(1, t.deltaX || -t.detail))),
        this.wheel = -e,
        !1
    }
    onMouseMove(t) {
        this.updatePosition(t, this.touch),
        this.updatePosition(t, this.secondaryTouch)
    }
    update() {
        this.enabled && (this.updateTouch(this.touch),
        this.updateTouch(this.secondaryTouch),
        this.updateWheel())
    }
    updateTouch(t) {
        var e = t.old
        , i = t.pos
        , s = t.real
        , n = t.down;
        e.pos.x = i.x,
        e.pos.y = i.y,
        e.real.x = s.x,
        e.real.y = s.y,
        !e.down && n && (t.press = !0),
        e.down && !n && (t.release = !0),
        e.press && (t.press = !1),
        e.release && (t.release = !1),
        this.updateRealPosition(t),
        e.down = t.down,
        e.press = t.press,
        e.release = t.release
    }
    updateWheel() {
        this.mousewheel = this.wheel,
        this.wheel = !1
    }
    close() {
        var t = this.scene.game.stage
        , e = this.scene.game.canvas;
        t.removeAllEventListeners(),
        e.removeEventListener("mousewheel", this.mouseWheelListener),
        e.removeEventListener("DOMMouseScroll", this.mouseWheelListener),
        this.touches = null,
        this.touch = null,
        this.scene = null,
        this.wheel = null,
        this.mouseMoveListener = null,
        this.mouseDownListener = null,
        this.mouseUpListener = null
    }
}