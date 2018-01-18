const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const int = number => Math.floor(number);
var iteration = 10;
var width, height;
/**
 * @type {HTMLCanvasElement}
 */
var canvas;
/**
 * @type {CanvasRenderingContext2D}
 */
var ctx;
var imgData;
window.onload = function ()
{
    init();
};
function init()
{
    canvas = $("#canvas");
    ctx = canvas.getContext("2d");
    var style = getComputedStyle(canvas);
    width = parseInt(style.width);
    height = parseInt(style.height);
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    imgData = ctx.getImageData(0, 0, width, height);
    requestAnimationFrame(function ()
    {
        render(ctx, width, height, iteration);
    });
}

/**
 * 
 * @param {ComplexNumber} x 
 * @param {ComplexNumber} c
 */
function f(x, c)
{
    return ComplexNumber.multi(x, x).plus(c);
}

/**
 * 
 * @param {ComplexNumber} z
 * @param {Number} iteration 
 * @returns {Numbers}
 */
function Mandellbrot(z, iteration)
{
    const c = z.clone();
    for (var i = 0; i < iteration; i++)
    {
        if (z.magnitudeSqr > 4)
            return i / iteration;
        z = f(z, c);
    }
    return 1;
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} iteration 
 */
function render(ctx, width, height, iteration)
{
    console.log("Start render. Iterate:" + iteration);
    let imgData = ctx.getImageData(0, 0, width, height);
    const size = Math.floor(Math.min(width, height));
    const half = size / 2;
    const startX = Math.floor((width - size) / 2);
    const startY = Math.floor((height - size) / 2);
    const D = Math.log(iteration);
    for (let y = 0; y < size; y++)
    {
        for (let x = 0; x < size; x++)
        {
            let z = new ComplexNumber((x - half) / size * 4, (y - half) / size * 4);
            let m = Mandellbrot(z, iteration);
            let idx = (x + startY) * width * 4 + (y + startX) * 4;
            let color = 255 - Math.floor(255 * Math.log(m * iteration + 1) / D);
            //imgData.data[idx] = imgData.data[idx + 1] = color;
            imgData.data[idx] = 253;
            imgData.data[idx + 1] = 255;
            imgData.data[idx + 2] = 227;
            imgData.data[idx + 3] = color;
        }
    }
    ctx.putImageData(imgData,0,0);
    console.log("Render completed.");
}
function iterate(iteration)
{
    render(ctx, width, height, iteration);
}
class ComplexNumber
{
    /**
     * 
     * @param {Number} a 
     * @param {Number} b 
     */
    constructor(a, b)
    {
        this.a = a;
        this.b = b;
    }

    get magnitude()
    {
        return Math.sqrt(this.a * this.a + this.b * this.b);
    }
    get magnitudeSqr()
    {
        return this.a * this.a + this.b * this.b;
    }

    clone()
    {
        return new ComplexNumber(this.a, this.b);
    }

    /**
     * 
     * @param {ComplexNumber} x 
     * @returns {ComplexNumber}
     */
    plus(x)
    {
        this.a += x.a;
        this.b += x.b;
        return this;
    }

    /**
     * 
     * @param {ComplexNumber} x 
     * @returns {ComplexNumber}
     */
    minus(x)
    {
        this.a -= x.a;
        this.b -= x.b;
        return this;
    }

    /**
     * 
     * @param {ComplexNumber} x
     * @returns {ComplexNumber} 
     */
    multi(x)
    {
        var a = this.a * x.a - this.b * x.b;
        var b = this.a * x.b + this.b * x.a;
        this.a = a;
        this.b = b;
        return this;
    }

    /**
     * 
     * @param {ComplexNumber} x
     * @returns {ComplexNumber} 
     */
    divide(x)
    {
        var a = (this.a * x.a + this.b * x.b) / (x.a * x.a + x.b * x.b);
        var b = (this.b * x.a - this.a * x.b) / (x.a * x.a + x.b * x.b);
        this.a = a;
        this.b = b;
        return this;
    }

    /**
     * @returns {String}
     */
    toString()
    {
        return this.a + " + " + this.b + "i";
    }

    /**
     * @param {ComplexNumber} u
     * @param {ComplexNumber} v
     * @returns {ComplexNumber}
     */
    static plus(u, v)
    {
        return new ComplexNumber(u.a, v.a, u.b + v.b);
    }

    /**
     * @param {ComplexNumber} u
     * @param {ComplexNumber} v
     * @returns {ComplexNumber}
     */
    static minus(u, v)
    {
        return new ComplexNumber(u.a - v.a, u.b - v.b);
    }

    /**
     * @param {ComplexNumber} u
     * @param {ComplexNumber} v
     * @returns {ComplexNumber}
     */
    static multi(u, v)
    {
        return new ComplexNumber(
            u.a * v.a - u.b * v.b,
            u.a * v.b + u.b * v.a
        );
    }

    /**
     * @param {ComplexNumber} u
     * @param {ComplexNumber} v
     * @returns {ComplexNumber}
     */
    static divide(u, v)
    {
        return new ComplexNumber(
            (u.a * v.a + u.b * v.b) / (v.a * v.a + v.b * v.b),
            (u.b * v.a - u.a * v.b) / (v.a * v.a + v.b * v.b)
        );
    }
}