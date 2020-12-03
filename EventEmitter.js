function i() {
    this._events = this._events || {},
    this._maxListeners = this._maxListeners || void 0
}
function s(t) {
    return "function" == typeof t
}
function n(t) {
    return "number" == typeof t
}
function r(t) {
    return "object" == typeof t && null !== t
}
function o(t) {
    return void 0 === t
}
i.EventEmitter = i,
i.prototype._events = void 0,
i.prototype._maxListeners = void 0,
i.defaultMaxListeners = 10,
i.prototype.setMaxListeners = function(t) {
    if (!n(t) || 0 > t || isNaN(t))
        throw TypeError("n must be a positive number");
    return this._maxListeners = t,
    this
}
,
i.prototype.emit = function(t) {
    var e, i, n, a, h, l;
    if (this._events || (this._events = {}),
    "error" === t && (!this._events.error || r(this._events.error) && !this._events.error.length)) {
        if (e = arguments[1],
        e instanceof Error)
            throw e;
        throw TypeError('Uncaught, unspecified "error" event.')
    }
    if (i = this._events[t],
    o(i))
        return !1;
    if (s(i))
        switch (arguments.length) {
        case 1:
            i.call(this);
            break;
        case 2:
            i.call(this, arguments[1]);
            break;
        case 3:
            i.call(this, arguments[1], arguments[2]);
            break;
        default:
            for (n = arguments.length,
            a = new Array(n - 1),
            h = 1; n > h; h++)
                a[h - 1] = arguments[h];
            i.apply(this, a)
        }
    else if (r(i)) {
        for (n = arguments.length,
        a = new Array(n - 1),
        h = 1; n > h; h++)
            a[h - 1] = arguments[h];
        for (l = i.slice(),
        n = l.length,
        h = 0; n > h; h++)
            l[h].apply(this, a)
    }
    return !0
}
,
i.prototype.addListener = function(t, e) {
    var n;
    if (!s(e))
        throw TypeError("listener must be a function");
    if (this._events || (this._events = {}),
    this._events.newListener && this.emit("newListener", t, s(e.listener) ? e.listener : e),
    this._events[t] ? r(this._events[t]) ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e,
    r(this._events[t]) && !this._events[t].warned) {
        var n;
        n = o(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners,
        n && n > 0 && this._events[t].length > n && (this._events[t].warned = !0,
        console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length),
        "function" == typeof console.trace && console.trace())
    }
    return this
}
,
i.prototype.on = i.prototype.addListener,
i.prototype.once = function(t, e) {
    function i() {
        this.removeListener(t, i),
        n || (n = !0,
        e.apply(this, arguments))
    }
    if (!s(e))
        throw TypeError("listener must be a function");
    var n = !1;
    return i.listener = e,
    this.on(t, i),
    this
}
,
i.prototype.removeListener = function(t, e) {
    var i, n, o, a;
    if (!s(e))
        throw TypeError("listener must be a function");
    if (!this._events || !this._events[t])
        return this;
    if (i = this._events[t],
    o = i.length,
    n = -1,
    i === e || s(i.listener) && i.listener === e)
        delete this._events[t],
        this._events.removeListener && this.emit("removeListener", t, e);
    else if (r(i)) {
        for (a = o; a-- > 0; )
            if (i[a] === e || i[a].listener && i[a].listener === e) {
                n = a;
                break
            }
        if (0 > n)
            return this;
        1 === i.length ? (i.length = 0,
        delete this._events[t]) : i.splice(n, 1),
        this._events.removeListener && this.emit("removeListener", t, e)
    }
    return this
}
,
i.prototype.removeAllListeners = function(t) {
    var e, i;
    if (!this._events)
        return this;
    if (!this._events.removeListener)
        return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t],
        this;
    if (0 === arguments.length) {
        for (e in this._events)
            "removeListener" !== e && this.removeAllListeners(e);
        return this.removeAllListeners("removeListener"),
        this._events = {},
        this
    }
    if (i = this._events[t],
    s(i))
        this.removeListener(t, i);
    else
        for (; i.length; )
            this.removeListener(t, i[i.length - 1]);
    return delete this._events[t],
    this
}
,
i.prototype.listeners = function(t) {
    var e;
    return e = this._events && this._events[t] ? s(this._events[t]) ? [this._events[t]] : this._events[t].slice() : []
}
,
i.listenerCount = function(t, e) {
    var i;
    return i = t._events && t._events[e] ? s(t._events[e]) ? 1 : t._events[e].length : 0
}

export default i;