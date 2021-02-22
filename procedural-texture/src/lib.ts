
export type vec2 = Vector2;

const V2Constructor: new (...p: [number, number]) => [number, number] = Array as any;
export class Vector2 extends V2Constructor
{
    get x() { return this[0]; }
    set x(x: number) { this[0] = x; }
    get y() { return this[1]; }
    set y(y: number) { this[1] = y; }

    get magnitude()
    {
        return Math.hypot(...this);
    }

    get normalized()
    {
        const m = this.magnitude;
        return m == 0 ? vec2.zero() : this.clone().div(vec2(m, m));
    }
    get negative()
    {
        return this.clone().negate();
    }
    get inversed()
    {
        return this.clone().inverse();
    }

    constructor(x: number, y: number)
    {
        super(x, y);
    }

    static zero()
    {
        return new Vector2(0, 0);
    }
    static one()
    {
        return new Vector2(1, 1);
    }
    static up()
    {
        return new Vector2(0, 1);
    }
    static down()
    {
        return new Vector2(0, -1);
    }
    static left() { return new Vector2(-1, 0) }
    static right() { return new Vector2(1, 0) }

    plus(v: Vector2)
    {
        this[0] += v[0];
        this[1] += v[1];
        return this;
    }
    minus(v: Vector2)
    {
        this[0] -= v[0];
        this[1] -= v[1];
        return this;
    }
    mul(v: Vector2)
    {
        this[0] *= v[0];
        this[1] *= v[1];
        return this;
    }
    div(v: Vector2)
    {
        this[0] /= v[0];
        this[1] /= v[1];
        return this;
    }
    dot(v: Vector2)
    {
        return this[0] * v[0]
            + this[1] * v[1];
    }
    normalize()
    {
        const m = this.magnitude;
        return m == 0 ? vec2.zero() : this.clone().div(vec2(m, m));
    }
    inverse()
    {
        this[0] = 1 / this[0];
        this[1] = 1 / this[1];
        return this;
    }
    negate()
    {
        this[0] = -this[0];
        this[1] = -this[1];
        return this;
    }
    /**
     * cross product with vec3
     * @param a u
     * @param b v
     */
    cross(b: Vector2)
    {
        return this.x * b.y - this.y * b.x;
    }

    clone()
    {
        return vec2(this[0], this[1]);
    }

    toVec3(z = 0)
    {
        return vec3(this[0], this[1], z);
    }
    __to(type: Function)
    {
        switch (type)
        {
            case Vector4:
                return vec4(this[0], this[1], 0, 0);
            case Vector3:
                return vec3(this[0], this[1], 0);
        }
        return this.clone();
    }
}

export function vec2(x: number): Vector2
export function vec2(x: number, y: number): Vector2
export function vec2(x: number, y = x): Vector2
{
    return new Vector2(x, y);
}
vec2.from = (src: Iterable<number>) =>
{
    const [x = 0, y = 0] = src;
    return vec2(x, y);
}
vec2.zero = Vector2.zero;
vec2.one = Vector2.one;
vec2.left = Vector2.left;
vec2.right = Vector2.right;
vec2.down = Vector2.down;
vec2.up = Vector2.up;


/// Vec3

export type vec3 = Vector3;

const V3Constructor: new (...p: [number, number, number]) => [number, number, number] = Array as any;
export class Vector3 extends V3Constructor
{
    get x() { return this[0]; }
    set x(x: number) { this[0] = x; }
    get y() { return this[1]; }
    set y(y: number) { this[1] = y; }
    get z() { return this[2]; }
    set z(z: number) { this[2] = z; }

    get magnitude()
    {
        return Math.hypot(...this);
    }

    get normalized()
    {
        const m = this.magnitude;
        return m == 0 ? vec3.zero() : this.clone().div(vec3(m, m, m));
    }

    get negative()
    {
        return this.clone().negate();
    }
    get inversed()
    {
        return this.clone().inverse();
    }

    constructor(x: number, y: number, z: number)
    {
        super(x, y, z);
    }

    static zero()
    {
        return new Vector3(0, 0, 0);
    }
    static one()
    {
        return new Vector3(1, 1, 1);
    }
    plus(v: Vector3)
    {
        this[0] += v[0];
        this[1] += v[1];
        this[2] += v[2];
        return this;
    }
    minus(v: Vector3)
    {
        this[0] -= v[0];
        this[1] -= v[1];
        this[2] -= v[2];
        return this;
    }
    mul(v: Vector3)
    {
        this[0] *= v[0];
        this[1] *= v[1];
        this[2] *= v[2];
        return this;
    }
    div(v: Vector3)
    {
        this[0] /= v[0];
        this[1] /= v[1];
        this[2] /= v[2];
        return this;
    }
    dot(v: Vector3)
    {
        return this[0] * v[0]
            + this[1] * v[1]
            + this[2] * v[2];
    }
    normalize()
    {
        const m = this.magnitude;
        return m == 0 ? vec3.zero() : this.clone().div(vec3(m, m, m));
    }
    inverse()
    {
        this[0] = 1 / this[0];
        this[1] = 1 / this[1];
        this[2] = 1 / this[2];
        return this;
    }
    negate()
    {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        return this;
    }
    /**
     * cross product with vec3
     * @param a u
     * @param b v
     */
    cross(b: Vector3)
    {
        return vec3(
            this.y * b.z - this.z * b.y,
            this.z * b.x - this.x * b.z,
            this.x * b.y - this.y * b.x
        );
    }

    clone()
    {
        return vec3(this[0], this[1], this[2]);
    }

    toVec2()
    {
        return vec2(this[0], this[1]);
    }

    __to(type: Function)
    {
        switch (type)
        {
            case Vector4:
                return vec4(this[0], this[1], this[2], 0);
            case Vector2:
                return vec2(this[0], this[1]);
        }
        return this.clone();
    }
}
export function vec3(x: number): Vector3
export function vec3(x: number, y: number, z: number): Vector3
export function vec3(x: number, y: number = x, z: number = x): Vector3
{
    return new Vector3(x, y, z);
}
vec3.from = (src: Iterable<number>) =>
{
    const [x = 0, y = 0, z = 0] = src;
    return vec3(x, y, z);
}
vec3.zero = Vector3.zero;
vec3.one = Vector3.one;



/// Vec4

export type vec4 = Vector4;

const V4Constructor: new (...p: [number, number, number, number]) => [number, number, number, number] = Array as any;
export class Vector4 extends V4Constructor
{
    get x() { return this[0]; }
    set x(x: number) { this[0] = x; }
    get y() { return this[1]; }
    set y(y: number) { this[1] = y; }
    get z() { return this[2]; }
    set z(z: number) { this[2] = z; }
    get w() { return this[3]; }
    set w(w: number) { this[3] = w }

    get magnitude()
    {
        return Math.hypot(...this);
    }

    get normalized()
    {
        const m = this.magnitude;
        return m == 0 ? vec4.zero() : this.clone().div(vec4(m, m, m, m));
    }
    get negative()
    {
        return this.clone().negate();
    }
    get inversed()
    {
        return this.clone().inverse();
    }

    constructor(x: number, y: number, z: number = 0, w: number = 0)
    {
        super(x, y, z || 0, w || 0);
    }

    static zero()
    {
        return new Vector4(0, 0, 0, 0);
    }
    static one()
    {
        return new Vector4(1, 1, 1, 1);
    }
    plus(v: Vector4)
    {
        this[0] += v[0];
        this[1] += v[1];
        this[2] += v[2];
        this[3] += v[3];
        return this;
    }
    minus(v: Vector4)
    {
        this[0] -= v[0];
        this[1] -= v[1];
        this[2] -= v[2];
        this[3] -= v[3];
        return this;
    }
    mul(v: Vector4)
    {
        this[0] *= v[0];
        this[1] *= v[1];
        this[2] *= v[2];
        this[3] *= v[3];
        return this;
    }
    div(v: Vector4)
    {
        this[0] /= v[0];
        this[1] /= v[1];
        this[2] /= v[2];
        this[3] /= v[3];
        return this;
    }
    dot(v: Vector4)
    {
        return this[0] * v[0]
            + this[1] * v[1]
            + this[2] * v[2]
            + this[3] * v[3];
    }
    normalize()
    {
        const m = this.magnitude;
        return m == 0 ? vec4.zero() : this.clone().div(vec4(m, m, m, m));
    }
    inverse()
    {
        this[0] = 1 / this[0];
        this[1] = 1 / this[1];
        this[2] = 1 / this[2];
        this[3] = 1 / this[3];
        return this;
    }
    negate()
    {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = -this[3];
        return this;
    }
    clone()
    {
        return vec4(this[0], this[1], this[2], this[3]);
    }
    __to(type: Function)
    {
        switch (type)
        {
            case Vector4:
                return this.clone();
            case Vector3:
                return vec3(this[0], this[1], this[2]);
            case Vector2:
                return vec2(this[0], this[1]);
        }
        return this.clone();
    }
}

export function vec4(x: number): Vector4
export function vec4(x: number, y: number, z: number, w: number): Vector4
export function vec4(x: number, y: number = x, z: number = x, w: number = x): Vector4
{
    return new Vector4(x, y, z, w);
}

vec4.from = (src: Iterable<number>) =>
{
    const [x = 0, y = 0, z = 0, w = 0] = src;
    return vec4(x, y, z, w);
}
vec4.zero = Vector4.zero;
vec4.one = Vector4.one;


export class Color extends Vector4
{
    get r() { return this[0]; }
    set r(r: number) { this[0] = r; }
    get g() { return this[1]; }
    set g(g: number) { this[1] = g; }
    get b() { return this[2]; }
    set b(b: number) { this[2] = b; }
    get a() { return this[3]; }
    set a(a: number) { this[3] = a }

    constructor(r: number, g: number, b: number, a: number = 1)
    {
        super(r, g, b, a);
    }

    static get white() { return new Color(1, 1, 1); }
    static get transparent() { return new Color(1, 1, 1, 0); }
    static get black() { return new Color(0, 0, 0); }
    static get red() { return new Color(1, 0, 0); }
    static get green() { return new Color(0, 1, 0); }
    static get blue() { return new Color(0, 0, 1); }
    static get cyan() { return new Color(0, 1, 1); }
    static get yellow() { return new Color(1, 1, 0); }
    static get magenta() { return new Color(1, 0, 1); }
    static get gray() { return new Color(.5, .5, .5); }
}

export const rgba = (r: number, g: number, b: number, a: number = 1) => new Color(r, g, b, a);
export const rgb = (r: number, g: number, b: number) => new Color(r, g, b, 1);



type vec = number | vec2 | vec3 | vec4;

type Larger<U extends vec, V extends vec> =
    U extends vec4 ? vec4 :
    V extends vec4 ? vec4 :
    U extends vec3 ? vec3 :
    V extends vec3 ? vec3 :
    U extends vec2 ? vec2 :
    V extends vec2 ? vec2 :
    number;

type ArithmeticType<U extends vec, V extends vec> = Larger<U, V>

(Number as any).prototype.__to = function (type: Function)
{
    switch (type)
    {
        case Vector4:
            return vec4(this.valueOf(), this.valueOf(), this.valueOf(), this.valueOf());
        case Vector3:
            return vec3(this.valueOf(), this.valueOf(), this.valueOf());
        case Vector2:
            return vec2(this.valueOf(), this.valueOf());
    }
    return this.valueOf();
}

function _arithOrder<U extends vec, V extends vec>(a: U, b: V): [any, any, boolean]
{
    if (typeof (a) === "number")
        return [b, a, true];
    else if (typeof (b) === "number")
        return [a, b, false];
    return ((b as number[]).length > (a as number[]).length ? [b, a, true] : [a, b, false]);
}


export function plus<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>
{
    const [lhs, rhs] = _arithOrder(a, b);
    return rhs.__to(lhs.constructor).plus(lhs);
}
export function minus<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>
{
    const [lhs, rhs, invert] = _arithOrder(a, b);
    return invert
        ? rhs.__to(lhs.constructor).minus(lhs)
        : rhs.__to(lhs.constructor).minus(lhs).negate();
}

export function mul<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>
{
    const [lhs, rhs] = _arithOrder(a, b);
    return rhs.__to(lhs.constructor).mul(lhs);
}
export function div<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>
{
    const [lhs, rhs, invert] = _arithOrder(a, b);
    return invert
        ? rhs.__to(lhs.constructor).div(lhs)
        : rhs.__to(lhs.constructor).div(lhs).inversed;
}

export function dot(a: vec3, b: vec3): number
{
    return a.dot(b);
}
export function cross(a: vec3, b: vec3)
{
    return a.cross(b);
}


const Deg2Rad = Math.PI / 180;
const Rad2Deg = 180 / Math.PI;
