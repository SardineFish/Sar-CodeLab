const Width = innerWidth;
const Height = innerHeight;
const Size = vec2(Width, Height);

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

interface Vector2 
{
    x: number;
    y: number;
}

interface Triangle
{
    points: [Vector2, Vector2, Vector2];
    edges: [Edge, Edge, Edge];
}

interface Edge
{
    points: [Vector2, Vector2];
    triangles: Triangle[];
}

function vec2(x: number, y: number)
{
    return {
        x: x,
        y: y
    } as Vector2;
}

function drawCircle(ctx: CanvasRenderingContext2D, center: Vector2, radius: number = 1, fill = "transparent", stroke = "black")
{
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.fill();
    ctx.stroke();
}

function drawLine(ctx: CanvasRenderingContext2D, start: Vector2, end: Vector2, color = "black")
{
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawText(ctx: CanvasRenderingContext2D, text: string, pos: Vector2, size: number = 24, color = "black")
{
    ctx.fillStyle = color;
    ctx.fillText(text, pos.x, pos.y);
}

function orderPoints(sites: [Vector2, Vector2, Vector2]): [Vector2, Vector2, Vector2]
{
    let [a, b, c] = sites;
    if (a.x > b.x)
        [a, b] = [b, a];
    if (b.x > c.x)
        [b, c] = [c, b];
    if (a.x > b.x)
        [a, b] = [b, a];
    return [a, b, c];
}

window.addEventListener("load", () =>
{
    const points: Vector2[] = [];
    const Grids = vec2(5, 3);
    for (var x = 0; x < Grids.x; x++)
    {
        for (var y = 0; y < Grids.y; y++)
        {
            const pos = vec2(
                (x + Math.random()) * canvas.width / Grids.x,
                (y + Math.random()) * canvas.height / Grids.y
            );
            pos.x = pos.x / 2 + canvas.width / 4;
            pos.y = pos.y / 2 + canvas.height / 4;
            points.push(pos);

            drawCircle(ctx, pos, 1, "black", "transparent");
        }
    }
});

async function bowyerWatson(points: Vector2[])
{
    const extendPoints = [vec2(0, 0), vec2(Width, 0), vec2(Width, Height), vec2(0, Height), ...points];
    const edges: Array<Array<Edge | null>> = new Array(extendPoints.length);
    for (let i = 0; i < extendPoints.length; i++)
    {
        edges[i] = new Array(extendPoints.length);
    }
    const insertTriangle = (a: number, b: number, c: number) =>
    {

        const u = edges[a][b] || {
            points: [extendPoints[a], extendPoints[b]],
            triangles: []
        };

        const v = edges[b][c] || {
            points: [extendPoints[b], extendPoints[c]],
            triangles: []
        };

        const w = edges[c][a] || {
            points: [extendPoints[c], extendPoints[a]],
            triangles: []
        };

        const triangle: Triangle = {
            edges: [u, v, w],
            points: [extendPoints[a], extendPoints[b], extendPoints[c]]
        };

        u.triangles.push(triangle);
        v.triangles.push(triangle);
        
        edges[a][b] = edges[b][a] = u;
        edges[b][c] = edges[c][b] = v;
        edges[c][a] = edges[a][c] = w;
    }

    insertTriangle(0, 1, 2);
    insertTriangle(0, 2, 3);
}