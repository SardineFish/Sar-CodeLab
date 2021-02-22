"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Width = innerWidth;
var Height = innerHeight;
var Size = vec2(Width, Height);
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
function vec2(x, y) {
    return {
        x: x,
        y: y
    };
}
function drawCircle(ctx, center, radius, fill, stroke) {
    if (radius === void 0) { radius = 1; }
    if (fill === void 0) { fill = "transparent"; }
    if (stroke === void 0) { stroke = "black"; }
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.fill();
    ctx.stroke();
}
function drawLine(ctx, start, end, color) {
    if (color === void 0) { color = "black"; }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function drawText(ctx, text, pos, size, color) {
    if (size === void 0) { size = 24; }
    if (color === void 0) { color = "black"; }
    ctx.fillStyle = color;
    ctx.fillText(text, pos.x, pos.y);
}
function orderPoints(sites) {
    var _a, _b, _c;
    var a = sites[0], b = sites[1], c = sites[2];
    if (a.x > b.x)
        _a = [b, a], a = _a[0], b = _a[1];
    if (b.x > c.x)
        _b = [c, b], b = _b[0], c = _b[1];
    if (a.x > b.x)
        _c = [b, a], a = _c[0], b = _c[1];
    return [a, b, c];
}
window.addEventListener("load", function () {
    var points = [];
    var Grids = vec2(5, 3);
    for (var x = 0; x < Grids.x; x++) {
        for (var y = 0; y < Grids.y; y++) {
            var pos = vec2((x + Math.random()) * canvas.width / Grids.x, (y + Math.random()) * canvas.height / Grids.y);
            pos.x = pos.x / 2 + canvas.width / 4;
            pos.y = pos.y / 2 + canvas.height / 4;
            points.push(pos);
            drawCircle(ctx, pos, 1, "black", "transparent");
        }
    }
});
function bowyerWatson(points) {
    return __awaiter(this, void 0, void 0, function () {
        var extendPoints, edges, i, insertTriangle;
        return __generator(this, function (_a) {
            extendPoints = __spreadArrays([vec2(0, 0), vec2(Width, 0), vec2(Width, Height), vec2(0, Height)], points);
            edges = new Array(extendPoints.length);
            for (i = 0; i < extendPoints.length; i++) {
                edges[i] = new Array(extendPoints.length);
            }
            insertTriangle = function (a, b, c) {
                var u = edges[a][b] || {
                    points: [extendPoints[a], extendPoints[b]],
                    triangles: []
                };
                var v = edges[b][c] || {
                    points: [extendPoints[b], extendPoints[c]],
                    triangles: []
                };
                var w = edges[c][a] || {
                    points: [extendPoints[c], extendPoints[a]],
                    triangles: []
                };
                var triangle = {
                    edges: [u, v, w],
                    points: [extendPoints[a], extendPoints[b], extendPoints[c]]
                };
                u.triangles.push(triangle);
                v.triangles.push(triangle);
                edges[a][b] = edges[b][a] = u;
                edges[b][c] = edges[c][b] = v;
                edges[c][a] = edges[a][c] = w;
            };
            insertTriangle(0, 1, 2);
            insertTriangle(0, 2, 3);
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=script.js.map