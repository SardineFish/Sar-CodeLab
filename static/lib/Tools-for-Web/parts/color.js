/**
 * 
 * @param {Number | String} r 
 * @param {Number} [g]
 * @param {Number} [b] 
 * @param {Number} [a] 
 */
function Color(r, g, b, a)
{
    while (typeof (r) === "string")
    {
        var str = r;
        str = str.replace(new RegExp(/\s/g), "");

        var reg = new RegExp("#[0-9a-fA-F]{6}");
        if (reg.test(str))
        {
            str = str.replace("#", "");
            var strR = str.charAt(0) + str.charAt(1);
            var strG = str.charAt(2) + str.charAt(3);
            var strB = str.charAt(4) + str.charAt(5);
            r = parseInt(strR, 16);
            g = parseInt(strG, 16);
            b = parseInt(strB, 16);
            a = 1.0;
            break;
        }
        reg = new RegExp("rgb\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
        if (reg.test(str))
        {
            var colorArray = str.replace("rgb(", "").replace(")", "").split(",");
            r = parseInt(colorArray[0]);
            g = parseInt(colorArray[1]);
            b = parseInt(colorArray[2]);
            a = 1.0;
            break;
        }
        reg = new RegExp("rgba\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
        if (reg.test(str))
        {
            var colorArray = str.replace("rgba(", "").replace(")", "").split(",");
            r = parseInt(colorArray[0]);
            g = parseInt(colorArray[1]);
            b = parseInt(colorArray[2]);
            a = parseFloat(colorArray[3]);
            break;
        }
        var color = Colors[str] || new Color(0, 0, 0, 1.0);
        r = color.r;
        g = color.g;
        b = color.b;
        a = color.a;
        break;
    }
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    if (isNaN(r) || r >= 256)
        r = 255;
    else if (r < 0)
        r = 0;
    if (isNaN(g) || g >= 256)
        g = 255;
    else if (g < 0)
        g = 0;
    if (isNaN(b) || b >= 256)
        b = 255;
    else if (b < 0)
        b = 0;
    if (isNaN(a) || a > 1.0)
        a = 1.0;
    else if (a < 0)
        a = 0;
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
}
Color.version = 2.0;
/**
 * @returns {Color}
 */
Color.random = function ()
{
    return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1.0);
}
/**
 * 
 * @param {String} str 
 * @returns {Color}
 */
Color.fromString = function (str)
{
    str = str.replace(new RegExp(/\s/g), "");

    var reg = new RegExp("#[0-9a-fA-F]{6}");
    if (reg.test(str))
    {
        str = str.replace("#", "");
        var strR = str.charAt(0) + str.charAt(1);
        var strG = str.charAt(2) + str.charAt(3);
        var strB = str.charAt(4) + str.charAt(5);
        var r = parseInt(strR, 16);
        var g = parseInt(strG, 16);
        var b = parseInt(strB, 16);
        return new Color(r, g, b, 1.0);
    }
    reg = new RegExp("rgb\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
    if (reg.test(str))
    {
        var colorArray = str.replace("rgb(", "").replace(")", "").split(",");
        var r = parseInt(colorArray[0]);
        var g = parseInt(colorArray[1]);
        var b = parseInt(colorArray[2]);
        var a = 1.00;
        return new Color(r, g, b, a);
    }
    reg = new RegExp("rgba\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
    if (reg.test(str))
    {
        var colorArray = str.replace("rgba(", "").replace(")", "").split(",");
        var r = parseInt(colorArray[0]);
        var g = parseInt(colorArray[1]);
        var b = parseInt(colorArray[2]);
        var a = parseFloat(colorArray[3]);
        return new Color(r, g, b, a);
    }
    return Colors[str] || new Color(0, 0, 0, 1.0);
}
/**
 * @returns {Color}
 */
Color.prototype.copy = function ()
{
    return new Color(this.red, this.green, this.blue, this.alpha);
}
Color.prototype.clone = Color.prototype.copy;
/**
 * @returns {String}
 */
Color.prototype.toString = function ()
{
    this.red = this.red > 255 ? 255 : this.red;
    this.green = this.green > 255 ? 255 : this.green;
    this.blue = this.blue > 255 ? 255 : this.blue;
    this.alpha = this.realphad > 1.0 ? 1.0 : this.alpha;

    this.red = this.red < 0 ? 0 : this.red;
    this.green = this.green < 0 ? 0 : this.green;
    this.blue = this.blue < 0 ? 0 : this.blue;
    this.alpha = this.alpha < 0.0 ? 0.0 : this.alpha;
    return "rgba(" + parseInt(this.red).toString() + "," + parseInt(this.green).toString() + "," + parseInt(this.blue).toString() + "," + this.alpha.toString() + ")";
}
/**
 * 
 * @param {Color} color 
 * @returns {Boolean}
 */
Color.prototype.equal = function (color)
{
    if (!color instanceof Color)
        return false;
    if (color.red == this.red && color.green == this.green && color.blue == this.blue && color.alpha == this.alpha)
        return true;
    return false;
}
const Colors = {
    transparent: new Color(255, 255, 255, 0),
    aliceblue: new Color(240, 248, 255, 1.0),
    antiquewhite: new Color(250, 235, 215, 1.0),
    aqua: new Color(0, 255, 255, 1.0),
    aquamarine: new Color(127, 255, 212, 1.0),
    azure: new Color(240, 255, 255, 1.0),
    beige: new Color(245, 245, 220, 1.0),
    bisque: new Color(255, 228, 196, 1.0),
    black: new Color(0, 0, 0, 1.0),
    blanchedalmond: new Color(255, 235, 205, 1.0),
    blue: new Color(0, 0, 255, 1.0),
    blueviolet: new Color(138, 43, 226, 1.0),
    brown: new Color(165, 42, 42, 1.0),
    burlywood: new Color(222, 184, 135, 1.0),
    cadetblue: new Color(95, 158, 160, 1.0),
    chartreuse: new Color(127, 255, 0, 1.0),
    chocolate: new Color(210, 105, 30, 1.0),
    coral: new Color(255, 127, 80, 1.0),
    cornflowerblue: new Color(100, 149, 237, 1.0),
    cornsilk: new Color(255, 248, 220, 1.0),
    crimson: new Color(220, 20, 60, 1.0),
    cyan: new Color(0, 255, 255, 1.0),
    darkblue: new Color(0, 0, 139, 1.0),
    darkcyan: new Color(0, 139, 139, 1.0),
    darkgoldenrod: new Color(184, 134, 11, 1.0),
    darkgray: new Color(169, 169, 169, 1.0),
    darkgreen: new Color(0, 100, 0, 1.0),
    darkgrey: new Color(169, 169, 169, 1.0),
    darkkhaki: new Color(189, 183, 107, 1.0),
    darkmagenta: new Color(139, 0, 139, 1.0),
    darkolivegreen: new Color(85, 107, 47, 1.0),
    darkorange: new Color(255, 140, 0, 1.0),
    darkorchid: new Color(153, 50, 204, 1.0),
    darkred: new Color(139, 0, 0, 1.0),
    darksalmon: new Color(233, 150, 122, 1.0),
    darkseagreen: new Color(143, 188, 143, 1.0),
    darkslateblue: new Color(72, 61, 139, 1.0),
    darkslategray: new Color(47, 79, 79, 1.0),
    darkslategrey: new Color(47, 79, 79, 1.0),
    darkturquoise: new Color(0, 206, 209, 1.0),
    darkviolet: new Color(148, 0, 211, 1.0),
    deeppink: new Color(255, 20, 147, 1.0),
    deepskyblue: new Color(0, 191, 255, 1.0),
    dimgray: new Color(105, 105, 105, 1.0),
    dimgrey: new Color(105, 105, 105, 1.0),
    dodgerblue: new Color(30, 144, 255, 1.0),
    firebrick: new Color(178, 34, 34, 1.0),
    floralwhite: new Color(255, 250, 240, 1.0),
    forestgreen: new Color(34, 139, 34, 1.0),
    fuchsia: new Color(255, 0, 255, 1.0),
    gainsboro: new Color(220, 220, 220, 1.0),
    ghostwhite: new Color(248, 248, 255, 1.0),
    gold: new Color(255, 215, 0, 1.0),
    goldenrod: new Color(218, 165, 32, 1.0),
    gray: new Color(128, 128, 128, 1.0),
    green: new Color(0, 128, 0, 1.0),
    greenyellow: new Color(173, 255, 47, 1.0),
    grey: new Color(128, 128, 128, 1.0),
    honeydew: new Color(240, 255, 240, 1.0),
    hotpink: new Color(255, 105, 180, 1.0),
    indianred: new Color(205, 92, 92, 1.0),
    indigo: new Color(75, 0, 130, 1.0),
    ivory: new Color(255, 255, 240, 1.0),
    khaki: new Color(240, 230, 140, 1.0),
    lavender: new Color(230, 230, 250, 1.0),
    lavenderblush: new Color(255, 240, 245, 1.0),
    lawngreen: new Color(124, 252, 0, 1.0),
    lemonchiffon: new Color(255, 250, 205, 1.0),
    lightblue: new Color(173, 216, 230, 1.0),
    lightcoral: new Color(240, 128, 128, 1.0),
    lightcyan: new Color(224, 255, 255, 1.0),
    lightgoldenrodyellow: new Color(250, 250, 210, 1.0),
    lightgray: new Color(211, 211, 211, 1.0),
    lightgreen: new Color(144, 238, 144, 1.0),
    lightgrey: new Color(211, 211, 211, 1.0),
    lightpink: new Color(255, 182, 193, 1.0),
    lightsalmon: new Color(255, 160, 122, 1.0),
    lightseagreen: new Color(32, 178, 170, 1.0),
    lightskyblue: new Color(135, 206, 250, 1.0),
    lightslategray: new Color(119, 136, 153, 1.0),
    lightslategrey: new Color(119, 136, 153, 1.0),
    lightsteelblue: new Color(176, 196, 222, 1.0),
    lightyellow: new Color(255, 255, 224, 1.0),
    lime: new Color(0, 255, 0, 1.0),
    limegreen: new Color(50, 205, 50, 1.0),
    linen: new Color(250, 240, 230, 1.0),
    magenta: new Color(255, 0, 255, 1.0),
    maroon: new Color(128, 0, 0, 1.0),
    mediumaquamarine: new Color(102, 205, 170, 1.0),
    mediumblue: new Color(0, 0, 205, 1.0),
    mediumorchid: new Color(186, 85, 211, 1.0),
    mediumpurple: new Color(147, 112, 219, 1.0),
    mediumseagreen: new Color(60, 179, 113, 1.0),
    mediumslateblue: new Color(123, 104, 238, 1.0),
    mediumspringgreen: new Color(0, 250, 154, 1.0),
    mediumturquoise: new Color(72, 209, 204, 1.0),
    mediumvioletred: new Color(199, 21, 133, 1.0),
    midnightblue: new Color(25, 25, 112, 1.0),
    mintcream: new Color(245, 255, 250, 1.0),
    mistyrose: new Color(255, 228, 225, 1.0),
    moccasin: new Color(255, 228, 181, 1.0),
    navajowhite: new Color(255, 222, 173, 1.0),
    navy: new Color(0, 0, 128, 1.0),
    oldlace: new Color(253, 245, 230, 1.0),
    olive: new Color(128, 128, 0, 1.0),
    olivedrab: new Color(107, 142, 35, 1.0),
    orange: new Color(255, 165, 0, 1.0),
    orangered: new Color(255, 69, 0, 1.0),
    orchid: new Color(218, 112, 214, 1.0),
    palegoldenrod: new Color(238, 232, 170, 1.0),
    palegreen: new Color(152, 251, 152, 1.0),
    paleturquoise: new Color(175, 238, 238, 1.0),
    palevioletred: new Color(219, 112, 147, 1.0),
    papayawhip: new Color(255, 239, 213, 1.0),
    peachpuff: new Color(255, 218, 185, 1.0),
    peru: new Color(205, 133, 63, 1.0),
    pink: new Color(255, 192, 203, 1.0),
    plum: new Color(221, 160, 221, 1.0),
    powderblue: new Color(176, 224, 230, 1.0),
    purple: new Color(128, 0, 128, 1.0),
    red: new Color(255, 0, 0, 1.0),
    rosybrown: new Color(188, 143, 143, 1.0),
    royalblue: new Color(65, 105, 225, 1.0),
    saddlebrown: new Color(139, 69, 19, 1.0),
    salmon: new Color(250, 128, 114, 1.0),
    sandybrown: new Color(244, 164, 96, 1.0),
    seagreen: new Color(46, 139, 87, 1.0),
    seashell: new Color(255, 245, 238, 1.0),
    sienna: new Color(160, 82, 45, 1.0),
    silver: new Color(192, 192, 192, 1.0),
    skyblue: new Color(135, 206, 235, 1.0),
    slateblue: new Color(106, 90, 205, 1.0),
    slategray: new Color(112, 128, 144, 1.0),
    slategrey: new Color(112, 128, 144, 1.0),
    snow: new Color(255, 250, 250, 1.0),
    springgreen: new Color(0, 255, 127, 1.0),
    steelblue: new Color(70, 130, 180, 1.0),
    tan: new Color(210, 180, 140, 1.0),
    teal: new Color(0, 128, 128, 1.0),
    thistle: new Color(216, 191, 216, 1.0),
    tomato: new Color(255, 99, 71, 1.0),
    turquoise: new Color(64, 224, 208, 1.0),
    violet: new Color(238, 130, 238, 1.0),
    wheat: new Color(245, 222, 179, 1.0),
    white: new Color(255, 255, 255, 1.0),
    whitesmoke: new Color(245, 245, 245, 1.0),
    yellow: new Color(255, 255, 0, 1.0),
    yellowgreen: new Color(154, 205, 50, 1.0)
}