export class Vector2 extends Array {
    constructor(x, y) {
        if (x instanceof Array)
            super(...x);
        else
            super(x, y);
    }
    get x() { return this[0]; }
    set x(value) { this[0] = value; }
    get y() { return this[1]; }
    set y(value) { this[1] = value; }
    static get zero() { return new Vector2(0, 0); }
    get normalized() {
        let l = Math.hypot(this.x, this.y);
        if (l === 0)
            return new Vector2(0, 0);
        return new Vector2(this.x / l, this.y / l);
    }
    get magnitude() {
        return Math.hypot(this.x, this.y);
    }
    plus(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    minus(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    scale(k) {
        this.x *= k;
        this.y *= k;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
}
export class Vector4 extends Array {
    constructor(x, y, z, w) {
        if (x instanceof Array)
            super(...x);
        else
            super(x, y, z, w);
    }
    get x() { return this[0]; }
    set x(value) { this[0] = value; }
    get y() { return this[1]; }
    set y(value) { this[1] = value; }
    get z() { return this[2]; }
    set z(value) { this[2] = value; }
    get w() { return this[3]; }
    set w(value) { this[3] = value; }
    get normalized() {
        return new Vector4(this.x / this.magnitude, this.y / this.magnitude, this.z / this.magnitude, this.w / this.magnitude);
    }
    get magnitude() {
        return Math.hypot(this.x, this.y, this.z, this.w);
    }
}
export function vec4(x, y, z, w) {
    return new Vector4(x, y, z, w);
}
export function vec2(x, y) {
    return new Vector2(x, y);
}
export function plus(u, v) {
    if (u instanceof Vector2) {
        return new Vector2(u.x + v.x, u.y + v.y);
    }
    else if (v instanceof Vector4) {
        return new Vector4(u.x + v.x, u.y + v.y, u.z + v.z, u.w + v.w);
    }
}
export function minus(u, v) {
    if (u instanceof Vector2) {
        return new Vector2(u.x - v.x, u.y - v.y);
    }
    else if (v instanceof Vector4) {
        return new Vector4(u.x - v.x, u.y - v.y, u.z - v.z, u.w - v.w);
    }
}
export function scale(u, k) {
    if (u instanceof Vector2) {
        return new Vector2(u.x * k, u.y * k);
    }
    else {
        return new Vector4(u.x * k, u.y * k, u.z * k, u.w * k);
    }
}
export function dot(u, v) {
    if (u instanceof Vector2) {
        return u.x * v.x + u.y * v.y;
    }
    else if (v instanceof Vector4) {
        return u.x * v.x +
            u.y * v.y +
            u.z * v.z +
            u.w * v.w;
    }
}
export function rotateDeg(v, deg) {
    let rad = deg * Math.PI / 180;
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
}
export function rotateRad(v, rad) {
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
}
export function degOfVector(v) {
    return Math.atan2(v.y, v.x) * 180 / Math.PI;
}
export function radOfVector(v) {
    return Math.atan2(v.y, v.x);
}
export function cross(u, v) {
    return u.x * v.y - u.y * v.x;
}
export class Matrix3x3 {
    constructor(mat = null) {
        this[0] = [1, 0, 0];
        this[1] = [0, 1, 0];
        this[2] = [0, 0, 1];
        if (mat instanceof Matrix3x3 || mat instanceof Array) {
            this[0] = mat[0].copyWithin(0, 0);
            this[1] = mat[1].copyWithin(0, 0);
            this[2] = mat[2].copyWithin(0, 0);
        }
    }
    static get identity() {
        return new Matrix3x3();
    }
    static multipleVector(mat, v) {
        let result = [
            mat[0][0] * v[0] + mat[0][1] * v[1] + mat[0][2] * 1,
            mat[1][0] * v[0] + mat[1][1] * v[1] + mat[1][2] * 1,
            mat[2][0] * v[2] + mat[2][1] * v[1] + mat[2][2] * 1,
        ];
        return new Vector2(result);
    }
    static multipleMatrix(a, b) {
        let mat = new Matrix3x3();
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                for (let k = 0; k < 3; k++)
                    mat[i][j] = a[i][k] * b[k][j];
        return mat;
    }
    multipleVector(v) {
        return Matrix3x3.multipleVector(this, v);
    }
    multipleMatrix(m) {
        let mat = Matrix3x3.multipleMatrix(this, m);
        this[0] = mat[0].copyWithin(0, 0);
        this[1] = mat[1].copyWithin(0, 0);
        this[2] = mat[2].copyWithin(0, 0);
        return this;
    }
}
export class Range extends Vector2 {
    constructor(from, to) {
        super(from, to);
    }
    get from() {
        return this[0];
    }
    set from(value) {
        this[0] = value;
    }
    get to() {
        return this[1];
    }
    set to(value) {
        this[1] = value;
    }
    get size() {
        return this[1] - this[0];
    }
    interpolate(t) {
        return t * this.size + this.from;
    }
    inRange(n) {
        return this.from < n && n < this.to;
    }
    inRangeInclude(n) {
        return this.from <= n && n <= this.to;
    }
}
export const interpolate = {
    linear: (t) => t,
    sqr: (t) => t * t,
    sqrt: (t) => Math.sqrt(t),
    cosDec: (t) => (Math.cos(t * Math.PI) + 1) / 2,
    cosInc: (t) => (-Math.cos(t * Math.PI) + 1) / 2,
};
export function clamp01(t) {
    if (t < 0)
        return 0;
    if (t > 1)
        return 1;
    return t;
}
