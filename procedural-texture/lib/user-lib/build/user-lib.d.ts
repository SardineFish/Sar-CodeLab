interface Config {
    width?: number;
    height?: number;
    background?: string | Color;
    normalizedInput?: boolean;
    livePreview?: boolean;
}
declare function config(options: Config): void;
interface Vector {
    magnitude: number;
    normalized: ThisType<this>;
}
declare type vec2 = Vector2;
declare const V2Constructor: new (...p: [number, number]) => [number, number];
declare class Vector2 extends V2Constructor implements Vector {
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get magnitude(): number;
    get normalized(): Vector2;
    get negative(): Vector2;
    get inversed(): Vector2;
    constructor(x: number, y: number);
    static zero(): Vector2;
    static one(): Vector2;
    static up(): Vector2;
    static down(): Vector2;
    static left(): Vector2;
    static right(): Vector2;
    plus(v: Vector2): this;
    minus(v: Vector2): this;
    mul(v: Vector2): this;
    div(v: Vector2): this;
    dot(v: Vector2): number;
    normalize(): Vector2;
    inverse(): this;
    negate(): this;
    /**
     * cross product with vec3
     * @param a u
     * @param b v
     */
    cross(b: Vector2): number;
    clone(): Vector2;
    toVec3(z?: number): Vector3;
    __to(type: Function): Vector2 | Vector3 | Vector4;
}
declare function vec2(x: number): Vector2;
declare namespace vec2 {
    var from: (src: Iterable<number>) => Vector2;
    var zero: typeof Vector2.zero;
    var one: typeof Vector2.one;
    var left: typeof Vector2.left;
    var right: typeof Vector2.right;
    var down: typeof Vector2.down;
    var up: typeof Vector2.up;
}
declare function vec2(x: number, y: number): Vector2;
declare namespace vec2 {
    var from: (src: Iterable<number>) => Vector2;
    var zero: typeof Vector2.zero;
    var one: typeof Vector2.one;
    var left: typeof Vector2.left;
    var right: typeof Vector2.right;
    var down: typeof Vector2.down;
    var up: typeof Vector2.up;
}
declare type vec3 = Vector3;
declare const V3Constructor: new (...p: [number, number, number]) => [number, number, number];
declare class Vector3 extends V3Constructor implements Vector {
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get z(): number;
    set z(z: number);
    get magnitude(): number;
    get normalized(): Vector3;
    get negative(): Vector3;
    get inversed(): Vector3;
    constructor(x: number, y: number, z: number);
    static zero(): Vector3;
    static one(): Vector3;
    plus(v: Vector3): this;
    minus(v: Vector3): this;
    mul(v: Vector3): this;
    div(v: Vector3): this;
    dot(v: Vector3): number;
    normalize(): Vector3;
    inverse(): this;
    negate(): this;
    /**
     * cross product with vec3
     * @param a u
     * @param b v
     */
    cross(b: Vector3): Vector3;
    clone(): Vector3;
    toVec2(): Vector2;
    __to(type: Function): Vector2 | Vector3 | Vector4;
}
declare function vec3(x: number): Vector3;
declare namespace vec3 {
    var from: (src: Iterable<number>) => Vector3;
    var zero: typeof Vector3.zero;
    var one: typeof Vector3.one;
}
declare function vec3(x: number, y: number, z: number): Vector3;
declare namespace vec3 {
    var from: (src: Iterable<number>) => Vector3;
    var zero: typeof Vector3.zero;
    var one: typeof Vector3.one;
}
declare type vec4 = Vector4;
declare const V4Constructor: new (...p: [number, number, number, number]) => [number, number, number, number];
declare class Vector4 extends V4Constructor implements Vector {
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get z(): number;
    set z(z: number);
    get w(): number;
    set w(w: number);
    get magnitude(): number;
    get normalized(): Vector4;
    get negative(): Vector4;
    get inversed(): Vector4;
    constructor(x: number, y: number, z?: number, w?: number);
    static zero(): Vector4;
    static one(): Vector4;
    plus(v: Vector4): this;
    minus(v: Vector4): this;
    mul(v: Vector4): this;
    div(v: Vector4): this;
    dot(v: Vector4): number;
    normalize(): Vector4;
    inverse(): this;
    negate(): this;
    clone(): Vector4;
    __to(type: Function): Vector2 | Vector3 | Vector4;
}
declare function vec4(x: number): Vector4;
declare namespace vec4 {
    var from: (src: Iterable<number>) => Vector4;
    var zero: typeof Vector4.zero;
    var one: typeof Vector4.one;
}
declare function vec4(x: number, y: number, z: number, w: number): Vector4;
declare namespace vec4 {
    var from: (src: Iterable<number>) => Vector4;
    var zero: typeof Vector4.zero;
    var one: typeof Vector4.one;
}
declare class Color extends Vector4 {
    get r(): number;
    set r(r: number);
    get g(): number;
    set g(g: number);
    get b(): number;
    set b(b: number);
    get a(): number;
    set a(a: number);
    constructor(r: number, g: number, b: number, a?: number);
    static get white(): Color;
    static get transparent(): Color;
    static get black(): Color;
    static get red(): Color;
    static get green(): Color;
    static get blue(): Color;
    static get cyan(): Color;
    static get yellow(): Color;
    static get magenta(): Color;
    static get gray(): Color;
}
declare const rgba: (r: number, g: number, b: number, a?: number) => Color;
declare const rgb: (r: number, g?: number, b?: number) => Color;
declare type vec = number | vec2 | vec3 | vec4;
declare type Larger<U extends vec, V extends vec> = U extends vec4 ? vec4 : V extends vec4 ? vec4 : U extends vec3 ? vec3 : V extends vec3 ? vec3 : U extends vec2 ? vec2 : V extends vec2 ? vec2 : number;
declare type ArithmeticType<U extends vec, V extends vec> = Larger<U, V> & Vector;
declare function _arithOrder<U extends vec, V extends vec>(a: U, b: V): [any, any, boolean];
declare function plus<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>;
declare function minus<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>;
declare function mul<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>;
declare function div<U extends vec, V extends vec>(a: U, b: V): ArithmeticType<U, V>;
declare function distance<V extends vec>(a: V, b: V): number;
declare function dot(a: vec3, b: vec3): number;
declare function cross(a: vec3, b: vec3): Vector3;
declare const Deg2Rad: number;
declare const Rad2Deg: number;
