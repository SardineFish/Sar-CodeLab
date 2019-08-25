import { Vector2, vec2, minus, Vector4, vec4, plus, scale } from "./math.js";
import { Color, removeAt } from "./lib.js";

console.log("t");

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
let Width = 0, Height = 0;
const G = 1000;
let ID = 0;
function init()
{
    const style = getComputedStyle(canvas);
    Width = canvas.width = parseInt(style.width as string);
    Height = canvas.height = parseInt(style.height as string);


    let time = 0;
    const updateHelper = (delay: number) =>
    {
        const dt = delay - time;
        time = delay;
        update(dt / 1000);
        requestAnimationFrame(updateHelper);
    }
    requestAnimationFrame(updateHelper);

    // Handle mouse event

    let holdPos = vec2(0, 0);
    window.onmousedown = (e) =>
    {
        holdPos = vec2(e.clientX, e.clientY);
    }
    window.onmouseup = (e) =>
    {
        const delta = minus(vec2(e.clientX, e.clientY), holdPos);
        const obj = new GravityObject(holdPos, 100, delta);
    }

}

const frameStack = [];
let objects: GravityObject[] = [];


function update(dt: number)
{
    ctx.fillStyle = "rgba(1, 1, 1, 0.1)";
    ctx.fillRect(0, 0, Width, Height);

    for (let i = 0; i < objects.length; i++)
    {
        const obj = objects[i];

        obj.update(dt);
        if (!objects[i] || objects[i].id != obj.id)
        {
            i--;
            continue;
        }
        obj.render(ctx);
    }
}

class GravityObject
{
    id: number = -1;
    r: number = 10;
    m: number = 100;
    v: Vector2 = vec2(0, 0);
    pos: Vector2 = vec2(0, 0);
    color: Color;

    constructor(pos: Vector2, m: number, v: Vector2)
    {
        this.pos = pos.clone();
        this.m = m;
        this.v = v.clone();
        this.color = Color.fromHSL(360 * Math.random(), .8, .8);
        this.id = ID++;
        this.r = Math.pow((3 * m) / (4 * Math.PI), 1 / 3);
        objects.push(this);
    }

    render(ctx: CanvasRenderingContext2D)
    {
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    update(dt: number)
    {
        let f = vec2(0, 0);
        for (let i = 0; i < objects.length; i++)
        {
            const obj = objects[i];
            if (obj.id == this.id)
                continue;
            const dp = minus(obj.pos, this.pos);

            if (dp.magnitude <= obj.r + this.r)
            {
                removeAt(objects, objects.indexOf(this));
                removeAt(objects, objects.indexOf(obj));

                const newObj = new GravityObject(scale(plus(obj.pos, this.pos), 0.5), this.m + obj.m, scale(plus(scale(this.v, this.m), scale(obj.v, obj.m)), 1 / (obj.m + this.m)));
                if (obj.m > this.m)
                    newObj.pos = obj.pos.clone();
                else
                    newObj.pos = this.pos.clone();
                console.log(newObj);
            }
            f.plus(scale(dp.normalized, (G * obj.m * this.m) / Math.pow(dp.magnitude, 2)));
        }
        const a = scale(f, 1 / this.m);
        this.v.plus(scale(a, dt));
        this.pos = plus(this.pos, scale(this.v, dt));
    }
}


init();