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
const Grids = vec2(5, 3);
const PointCount = Grids.x * Grids.y;
function vec2(x, y) {
    return {
        x: x,
        y: y
    };
}
function drawCircle(ctx, center, radius = 1, fill = "transparent", stroke = "black") {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.fill();
    ctx.stroke();
}
function drawLine(ctx, start, end, color = "black") {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function drawText(ctx, text, pos, size = 24, color = "black") {
    ctx.font.fontsize("64px");
    ctx.fillStyle = color;
    ctx.fillText(text, pos.x, pos.y);
}
function startCoroutine(iterator, defaultDeltaTime = 16) {
    const runner = () => {
        const result = iterator.next();
        if (!result.done) {
            if (result.value)
                setTimeout(runner, result.value);
            else
                setTimeout(runner, defaultDeltaTime);
        }
    };
    setTimeout(runner, 0);
}
function allDiff(a, b, c) {
    return a != b && b != c && a != c;
}
// Reference: https://www.w3resource.com/cpp-exercises/basic/cpp-basic-exercise-67.php 
function circumscribedCircle(p1, p2, p3) {
    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const a = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    const b = Math.sqrt((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1));
    const c = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2));
    const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    const radius = (a * b * c) / (Math.sqrt((a + b + c) * (b + c - a) * (c + a - b) * (a + b - c)));
    const xp = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / d;
    const yp = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / d;
    return [vec2(xp, yp), radius];
}
function createCircleEvent(arcLow, arcMid, arcHigh) {
    const [center, radius] = circumscribedCircle(arcLow.site.pos, arcMid.site.pos, arcHigh.site.pos);
    const circle = {
        center: center,
        radius: radius,
        arcs: [arcLow, arcMid, arcHigh],
        sites: orderSites([arcLow.site, arcMid.site, arcHigh.site])
    };
    arcMid.circle = circle;
    drawCircle(ctx, center, radius, "transparent", "cyan");
    return circle;
}
let ctx;
window.addEventListener("load", () => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    if (!ctx)
        throw new Error("Missing canvas.");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const points = [];
    for (var x = 0; x < Grids.x; x++) {
        for (var y = 0; y < Grids.y; y++) {
            const pos = vec2((x + Math.random()) * canvas.width / Grids.x, (y + Math.random()) * canvas.height / Grids.y);
            pos.x = pos.x / 2 + canvas.width / 4;
            pos.y = pos.y / 2 + canvas.height / 4;
            points.push(pos);
            drawCircle(ctx, pos, 1, "black", "transparent");
        }
    }
    // fortuneAlgorithm(points);
    // clickToContinue(fortuneAlgorithm(points));
    yield fortuneAlgorithm(points);
}));
function clickToContinue(iterator) {
    window.onclick = () => iterator.next();
}
function drawParabola(f, line, yMin = 0, yMax = innerHeight, color = "black") {
    ctx.beginPath();
    const p = Math.abs(f.x - line);
    for (let y = yMin; y < yMax; y++) {
        const x = (f.x + line) / 2 - (Math.pow((y - f.y), 2)) / (2 * p);
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
}
function parabolaIntersect(f1, f2, line) {
    const p1 = Math.abs(f1.x - line);
    const p2 = Math.abs(f2.x - line);
    var x1 = line + p1 / 2;
    var x2 = line + p2 / 2;
    var y1 = f1.y;
    var y2 = f2.y;
    var r1 = (-p2 * y1 +
        p1 * y2 - Math.sqrt(-p1 * p2 * (-2 * p1 * x1 + 2 * p2 * x1 + 2 * p1 * x2 - 2 * p2 * x2 - (Math.pow(y1, 2)) +
        2 * y1 * y2 - (Math.pow(y2, 2))))) / (p1 - p2);
    var r2 = (-p2 * y1 +
        p1 * y2 + Math.sqrt(-p1 * p2 * (-2 * p1 * x1 + 2 * p2 * x1 + 2 * p1 * x2 - 2 * p2 * x2 - (Math.pow(y1, 2)) +
        2 * y1 * y2 - (Math.pow(y2, 2))))) / (p1 - p2);
    if (r2 < r1)
        return [r2, r1];
    return [r1, r2];
}
function waitClick() {
    return new Promise(resolve => {
        const listener = () => {
            resolve();
            window.removeEventListener("click", listener);
        };
        window.addEventListener("click", listener);
    });
}
function createArcs(newSite, baseArc) {
    if (!baseArc) {
        return [{
                site: newSite,
                upbound: () => Number.POSITIVE_INFINITY,
                lowbound: () => Number.NEGATIVE_INFINITY,
            }];
    }
    else {
        return [{
                site: baseArc.site,
                vertLow: baseArc.vertLow,
                lowbound: baseArc.lowbound,
                upbound: (l) => parabolaIntersect(baseArc.site.pos, newSite.pos, l)[0],
            },
            {
                site: newSite,
                lowbound: l => parabolaIntersect(baseArc.site.pos, newSite.pos, l)[0],
                upbound: l => parabolaIntersect(baseArc.site.pos, newSite.pos, l)[1],
            },
            {
                site: baseArc.site,
                vertHigh: baseArc.vertHigh,
                upbound: baseArc.upbound,
                lowbound: l => parabolaIntersect(baseArc.site.pos, newSite.pos, l)[1],
            }];
    }
}
function mergeArcs(arcLow, arcMid, arcUp, line) {
    return __awaiter(this, void 0, void 0, function* () {
        const upperBound = arcUp.upbound(line);
        const lowerBound = arcLow.lowbound(line);
        const [y1, y2] = parabolaIntersect(arcLow.site.pos, arcUp.site.pos, line);
        let resultIndex = 0;
        if (lowerBound < y1 && y1 < upperBound)
            resultIndex = 0;
        else if (lowerBound < y2 && y2 < upperBound)
            resultIndex = 1;
        else
            console.warn("Intersect not found.");
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        drawParabola(arcLow.site.pos, line, 0, innerHeight, "blue");
        drawParabola(arcMid.site.pos, line, 0, innerHeight, "green");
        drawParabola(arcUp.site.pos, line, 0, innerHeight, "red");
        if (resultIndex == 0)
            drawLine(ctx, vec2(0, y1), vec2(innerWidth, y1), "orange");
        else
            drawLine(ctx, vec2(0, y2), vec2(innerWidth, y2), "orange");
        yield waitClick();
        const newArcs = [
            {
                site: arcLow.site,
                vertLow: arcLow.vertLow,
                vertHigh: arcLow.vertHigh,
                lowbound: arcLow.lowbound,
                upbound: l => parabolaIntersect(arcLow.site.pos, arcUp.site.pos, l)[resultIndex],
            },
            {
                site: arcUp.site,
                vertLow: arcUp.vertLow,
                vertHigh: arcUp.vertHigh,
                upbound: arcUp.upbound,
                lowbound: l => parabolaIntersect(arcLow.site.pos, arcUp.site.pos, l)[resultIndex],
            }
        ];
        return newArcs;
    });
}
function orderSites(sites) {
    let [a, b, c] = sites;
    if (a.pos.x > b.pos.x)
        [a, b] = [b, a];
    if (b.pos.x > c.pos.x)
        [b, c] = [c, b];
    if (a.pos.x > b.pos.x)
        [a, b] = [b, a];
    return [a, b, c];
}
function equalSites(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function fortuneAlgorithm(points) {
    return __awaiter(this, void 0, void 0, function* () {
        const sites = points.sort((a, b) => a.x - b.x).map((pos, idx) => ({
            id: idx,
            pos: pos,
            edges: [],
            vertices: []
        }));
        const verts = [];
        const edges = [];
        function* drawPoints(ctx, points) {
            for (const p of points) {
                drawCircle(ctx, p, 5, "red", "transparent");
                yield null;
            }
        }
        const beachLine = [...createArcs(sites[0])];
        let circleEvents = [];
        drawCircle(ctx, sites[0].pos, 5, "red", "transparent");
        function consumeCircleEvent(createVertex) {
            return __awaiter(this, void 0, void 0, function* () {
                function repaintAll(sweepLine) {
                    ctx.clearRect(0, 0, innerWidth, innerHeight);
                    sites.forEach(s => drawCircle(ctx, s.pos, 1, "black", "black"));
                    // sites.filter((s, idx) => idx <= i).forEach(s => drawCircle(ctx, s.pos, 5, "red", "transparent"));
                    circleEvents.forEach(c => drawCircle(ctx, c.center, c.radius, "transparent", "cyan"));
                    edges.forEach(e => drawLine(ctx, e.vertices[0].pos, e.vertices[1].pos));
                    beachLine.forEach(arc => drawParabola(arc.site.pos, sweepLine));
                    drawLine(ctx, vec2(sweepLine, 0), vec2(sweepLine, innerHeight), "green");
                }
                const circle = circleEvents[0];
                circleEvents.splice(0, 1);
                const sweepLine = circle.center.x + circle.radius;
                repaintAll(circle.center.x + circle.radius);
                drawCircle(ctx, circle.center, circle.radius, "transparent", "black");
                // Generate new vertex
                const arcTop = circle.arcs[2];
                const arcCenter = circle.arcs[1];
                const arcBottom = circle.arcs[0];
                if (createVertex) {
                    const vertex = {
                        pos: circle.center,
                        sites: orderSites([arcTop.site, arcCenter.site, arcBottom.site]),
                        edges: [],
                    };
                    if (arcBottom.vertHigh) {
                        const edge = {
                            sites: [arcBottom.site, arcCenter.site],
                            vertices: [arcBottom.vertHigh, vertex],
                        };
                        arcBottom.vertHigh.edges.push(edge);
                        vertex.edges.push(edge);
                        arcBottom.site.edges.push(edge);
                        arcBottom.site.vertices.push(vertex);
                        arcCenter.site.edges.push(edge);
                        arcCenter.site.vertices.push(vertex);
                        edges.push(edge);
                        drawLine(ctx, edge.vertices[0].pos, edge.vertices[1].pos);
                    }
                    arcBottom.vertHigh = vertex;
                    arcCenter.vertLow = vertex;
                    if (arcTop.vertLow) {
                        const edge = {
                            sites: [arcCenter.site, arcTop.site],
                            vertices: [arcTop.vertLow, vertex],
                        };
                        arcTop.vertLow.edges.push(edge);
                        vertex.edges.push(edge);
                        arcCenter.site.edges.push(edge);
                        arcCenter.site.vertices.push(vertex);
                        arcTop.site.edges.push(edge);
                        arcTop.site.vertices.push(vertex);
                        edges.push(edge);
                        drawLine(ctx, edge.vertices[0].pos, edge.vertices[1].pos);
                    }
                    arcCenter.vertHigh = vertex;
                    arcTop.vertLow = vertex;
                }
                // remove center arc
                // beachLine.splice(beachLine.indexOf(arcCenter), 1);
                const [newArcBottom, newArcTop] = yield mergeArcs(arcBottom, arcCenter, arcTop, sweepLine);
                let indexCenter = beachLine.indexOf(arcCenter);
                beachLine[indexCenter - 1] = newArcBottom;
                beachLine[indexCenter + 1] = newArcTop;
                beachLine.splice(indexCenter, 1);
                { // remove circle event related to removed arc
                    let indexCircle = circleEvents.findIndex(c => c.arcs[1] == arcBottom);
                    if (indexCircle >= 0)
                        circleEvents.splice(indexCircle, 1);
                    indexCircle = circleEvents.findIndex(c => c.arcs[1] == arcTop);
                    if (indexCircle >= 0)
                        circleEvents.splice(indexCircle, 1);
                }
                if (indexCenter - 2 >= 0) {
                    circleEvents.push(createCircleEvent(beachLine[indexCenter - 2], newArcBottom, newArcTop));
                    console.log(`merge: create arc ${circleEvents[circleEvents.length - 1].arcs.map(arc => arc.site.id)}`);
                }
                if (indexCenter + 1 < beachLine.length) {
                    circleEvents.push(createCircleEvent(newArcBottom, newArcTop, beachLine[indexCenter + 1]));
                    console.log(`merge: create arc ${circleEvents[circleEvents.length - 1].arcs.map(arc => arc.site.id)}`);
                }
                circleEvents = circleEvents.sort((a, b) => (a.center.x + a.radius) - (b.center.x + b.radius));
            });
        }
        for (let i = 1; i < sites.length; i++) {
            let minCircleEventArc = null;
            let minCircleEventCoord = Number.MAX_VALUE;
            function repaintAll(sweepLine) {
                return __awaiter(this, void 0, void 0, function* () {
                    ctx.clearRect(0, 0, innerWidth, innerHeight);
                    sites.forEach(s => drawCircle(ctx, s.pos, 1, "black", "black"));
                    sites.filter((s, idx) => idx <= i).forEach(s => drawCircle(ctx, s.pos, 5, "red", "transparent"));
                    circleEvents.forEach(c => drawCircle(ctx, c.center, c.radius, "transparent", "cyan"));
                    edges.forEach(e => drawLine(ctx, e.vertices[0].pos, e.vertices[1].pos));
                    beachLine.forEach(arc => drawParabola(arc.site.pos, sweepLine, 0, innerHeight, "rgba(0, 255, 0, 0.3)"));
                    drawLine(ctx, vec2(sweepLine, 0), vec2(sweepLine, innerHeight), "green");
                    yield waitClick();
                    let minY = 0;
                    for (let i = 0; i < beachLine.length; i++) {
                        let maxY = innerHeight;
                        /*if (i + 1 < beachLine.length)
                        {
                            const [y1, y2] = parabolaIntersect(beachLine[i].site.pos, beachLine[i + 1].site.pos, sweepLine);
                            console.log(`y1=${y1}, y2=${y2}`);
                            if (y1 >= minY && (y1 <= y2 || y2 <= minY))
                                maxY = y1;
                            else if (y2 > minY && (y2 < y1 || y1 <= minY))
                                maxY = y2;
                            drawLine(ctx, vec2(0, maxY), vec2(innerWidth, maxY));
                            // drawLine(ctx, vec2(0, y1), vec2(innerWidth, y1));
                            // drawLine(ctx, vec2(0, y2), vec2(innerWidth, y2));
                            const x = 0;
                        }*/
                        minY = Math.max(0, beachLine[i].lowbound(sweepLine));
                        maxY = Math.min(innerHeight, beachLine[i].upbound(sweepLine));
                        drawParabola(beachLine[i].site.pos, sweepLine, minY, maxY, "red");
                        drawLine(ctx, vec2(0, maxY), vec2(innerWidth, maxY));
                        yield waitClick();
                    }
                });
            }
            let sweepLineCoord = 0;
            while (circleEvents.length > 0 && circleEvents[0].center.x + circleEvents[0].radius < sites[i].pos.x) {
                var x = circleEvents[0].center.x + circleEvents[0].radius;
                const circle = circleEvents[0];
                const upper = circle.arcs[1].upbound(x);
                const lower = circle.arcs[1].lowbound(x);
                if (Math.abs(upper - lower) > 0.00001) {
                    circleEvents.splice(0, 1);
                    continue;
                }
                if (x <= sweepLineCoord || verts.some(vert => equalSites(vert.sites, circleEvents[0].sites))) {
                    consumeCircleEvent(false);
                    continue;
                }
                sweepLineCoord = x;
                yield repaintAll(x);
                // await waitClick();
                //repaintAll(x);
                yield consumeCircleEvent(true);
                yield repaintAll(x);
            }
            // Site event
            const newSite = sites[i];
            yield repaintAll(newSite.pos.x);
            yield waitClick();
            //repaintAll(newSite.pos.x);
            let arcToSplitIdx = -1;
            let minX = Number.MAX_VALUE;
            for (let arcIdx = 0; arcIdx < beachLine.length; arcIdx++) {
                // (y - y0) ^ 2 = 4 (x0 - lineX) x
                const arc = beachLine[arcIdx];
                const p = Math.abs(newSite.pos.x - arc.site.pos.x);
                var x = p / 2 + Math.pow(newSite.pos.y - arc.site.pos.y, 2) / (2 * p);
                if (x < minX) {
                    arcToSplitIdx = arcIdx;
                    minX = x;
                }
            }
            drawLine(ctx, vec2(0, newSite.pos.y), vec2(innerWidth, newSite.pos.y), "blue");
            drawText(ctx, `${arcToSplitIdx}`, newSite.pos);
            console.log(arcToSplitIdx);
            yield waitClick();
            minX = Number.MAX_VALUE;
            for (let arcIdx = 0; arcIdx < beachLine.length; arcIdx++) {
                // (y - y0) ^ 2 = 4 (x0 - lineX) x
                // const arc = beachLine[arcIdx];
                // const p = Math.abs(newSite.pos.x - arc.site.pos.x);
                // var x = p / 2 + Math.pow(newSite.pos.y - arc.site.pos.y, 2) / (2 * p);
                // if (x < minX)
                // {
                //     arcToSplitIdx = arcIdx;
                //     minX = x;
                // }
                const arc = beachLine[arcIdx];
                if (arc.upbound(newSite.pos.x) >= newSite.pos.y) {
                    arcToSplitIdx = arcIdx;
                    break;
                }
            }
            const arcToSplit = beachLine[arcToSplitIdx];
            if (arcToSplit.circle)
                circleEvents.splice(circleEvents.indexOf(arcToSplit.circle), 1);
            const newArcs = createArcs(newSite, arcToSplit);
            beachLine.splice(arcToSplitIdx, 1, ...newArcs);
            if (arcToSplitIdx - 1 >= 0) {
                circleEvents.push(createCircleEvent(beachLine[arcToSplitIdx - 1], newArcs[0], newArcs[1]));
                console.log(`insert: create arc ${circleEvents[circleEvents.length - 1].arcs.map(arc => arc.site.id)}`);
            }
            if (arcToSplitIdx + 3 < beachLine.length) {
                circleEvents.push(createCircleEvent(newArcs[1], newArcs[2], beachLine[arcToSplitIdx + 3]));
                console.log(`insert: create arc ${circleEvents[circleEvents.length - 1].arcs.map(arc => arc.site.id)}`);
            }
            circleEvents = circleEvents.sort((a, b) => (a.center.x + a.radius) - (b.center.x + b.radius));
            console.log(circleEvents.map(c => c.center.x + c.radius));
            //repaintAll(newSite.pos.x);
        }
        while (circleEvents.length > 0) {
            consumeCircleEvent();
        }
    });
}
//# sourceMappingURL=script.js.map