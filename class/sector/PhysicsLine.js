import s from "../math/cartesian.js";

function i(t, e, i, n) {
    var r = new s(t,e)
      , o = new s(i,n)
      , a = o.sub(r);
    this.p1 = r,
    this.p2 = o,
    this.pp = a,
    this.len = a.len(),
    this.sectors = [],
    this.collided = !1,
    this.remove = !1,
    this.highlight = !1,
    this.recorded = !1
}
var n = Math.sqrt
  , r = Math.pow
  , o = Math.floor;
i.prototype = {
    sectors: null,
    p1: null,
    p2: null,
    pp: null,
    len: 0,
    collided: !1,
    remove: !1,
    highlight: !1,
    recorded: !1,
    getCode: function(t) {
        this.recorded = !0;
        var e = this.p2
          , i = " " + e.x.toString(32) + " " + e.y.toString(32)
          , s = this.checkForConnectedLine(t, e);
        return s && (i += s.getCode(t)),
        i
    },
    checkForConnectedLine: function(t, e) {
        var i = t.settings.physicsSectorSize
          , s = t.sectors.physicsSectors
          , n = o(e.x / i)
          , r = o(e.y / i);
        return s[n][r].searchForLine("physicsLines", e)
    },
    addSectorReference: function(t) {
        this.sectors.push(t)
    },
    removeAllReferences: function() {
        this.remove = !0;
        for (var t = this.sectors, e = t.length, i = 0; e > i; i++)
            t[i].drawn = !1,
            t[i].dirty = !0;
        this.sectors = []
    },
    erase: function(t, e) {
        var i = !1;
        if (!this.remove) {
            var s = this.p1
              , r = this.p2
              , o = t
              , a = e
              , h = r.sub(s)
              , l = s.sub(o)
              , c = h.dot(h)
              , u = 2 * l.dot(h)
              , p = l.dot(l) - a * a
              , d = u * u - 4 * c * p;
            if (d > 0) {
                d = n(d);
                var f = (-u - d) / (2 * c)
                  , v = (-u + d) / (2 * c);
                f >= 0 && 1 >= f && (i = !0,
                this.removeAllReferences()),
                v >= 0 && 1 >= v && (i = !0,
                this.removeAllReferences())
            }
            this.intersects(this.p1.x, this.p1.y, t.x, t.y, e) ? (i = !0,
            this.removeAllReferences()) : this.intersects(this.p2.x, this.p2.y, t.x, t.y, e) && (i = !0,
            this.removeAllReferences())
        }
        return i
    },
    intersects: function(t, e, i, s, n) {
        var r = t - i
          , o = e - s;
        return n * n >= r * r + o * o
    },
    collide: function(t) {
        if (!this.collided) {
            this.collided = !0;
            var e = t.pos
              , i = t.vel
              , s = t.radius
              , o = 0
              , a = 0
              , h = 0
              , l = this.p1
              , c = this.p2
              , u = e.x - l.x
              , p = e.y - l.y
              , d = this.pp
              , f = this.len
              , v = (u * d.x + p * d.y) / f / f;
            if (v >= 0 && 1 >= v) {
                var g = (u * d.y - p * d.x) * ((u - i.x) * d.y - (p - i.y) * d.x) < 0 ? -1 : 1
                  , o = u - d.x * v
                  , a = p - d.y * v;
                if (h = n(r(o, 2) + r(a, 2)),
                0 === h && (h = 1),
                s > h || 0 > g) {
                    var m = (s * g - h) / h;
                    return e.x += o * m,
                    e.y += a * m,
                    void t.drive(-a / h, o / h)
                }
            }
            if (!(-s > v * f || v * f > f + s)) {
                var y = v > 0 ? c : l;
                if (o = e.x - y.x,
                a = e.y - y.y,
                h = n(r(o, 2) + r(a, 2)),
                0 === h && (h = 1),
                s > h) {
                    var m = (s - h) / h;
                    return e.x += o * m,
                    e.y += a * m,
                    void t.drive(-a / h, o / h)
                }
            }
        }
    }
}
export default i