import { trimEnd } from "*.png";
import { div, minus, mul, plus, vec2, Vector2 } from "zogra-renderer";
import { goldNoise, random, randomRange } from "./random";
import { RaindropSimulator } from "./simulator";
import { clamp, Time } from "./utils";

export class RainDrop
{
    pos: vec2;
    // size: number;
    seed: number;
    density: number = 1;
    velocity: vec2 = vec2.zero();
    spread: vec2;
    destroied = false;
    evaporate = 1;
    parent?: RainDrop;
    grid?: Set<RainDrop>;

    // mergeRadius = 0.1;

    private _mass: number = 0;
    private _size: vec2 = vec2.zero();
    private simulator: RaindropSimulator;
    private resistance = 0;
    private shifting = 0;
    private gravity = 2400;
    private lastTrailPos: vec2;
    private nextTrailDistance: number;

    private nextRandomTime = 0;

    constructor(simulator: RaindropSimulator, pos: vec2, size: number, density = 1)
    {
        this.pos = pos;
        this.seed = Math.floor(Math.random() * 2147483647) + 1;
        this.simulator = simulator;
        this.density = density;
        // this.velocity.x = Math.random() * 20 - 10;
        // this.velocity.y = -Math.random() * 60;

        this.lastTrailPos = pos.clone();
        this.nextTrailDistance = randomRange(10, 20);

        this.spread = vec2(0.5, 0.5);

        this.mass = (size * density) ** 2;
    }

    get mass() { return this._mass; }
    set mass(m: number)
    {
        this._mass = m;
        const sqrtM = Math.sqrt(m) / this.density;
        this._size.x = (this.spread.x + 1) * sqrtM;
        this._size.y = (this.spread.y + 1) * sqrtM;
        // this._size = mul(plus(this.spread, vec2.one()), Math.sqrt(m));
    }
    
    get size(): vec2
    {
        return this._size;
    }

    get mergeDistance()
    {
        return this.size.x * (1 + this.spread.x) * 0.16;
    }

    updateRaindrop(time: Time)
    {
        if (this.nextRandomTime <= time.total)
        {
            this.nextRandomTime = time.total + Math.random() * 0.4;
            this.randomMotion();
        }

        this.mass -= this.evaporate * time.dt;
        const force = this.gravity * this.mass - this.resistance;
        const acceleration = force / this.mass;
        this.velocity.y -= acceleration * time.dt;
        if (this.velocity.y > 0)
            this.velocity.y = 0;
        this.velocity.x = Math.abs(this.velocity.y) * this.shifting;
        this.pos.x += this.velocity.x * time.dt;
        this.pos.y += this.velocity.y * time.dt;
        // this.pos.plus(mul(this.velocity, vec2(time.dt)));

        this.spread.y = Math.max(this.spread.y, 0.3 * 2 * Math.atan(Math.abs(this.velocity.y * 0.005)) / Math.PI);
        this.spread.x *= 0.7;
        this.spread.y *= 0.85;
        // this.spread.y +=  Math.abs(this.velocity.y) * 0.0001;

        if (Vector2.distanceSquared(this.lastTrailPos, this.pos) > this.nextTrailDistance * this.nextTrailDistance)
        {
            this.split();
        }
    }

    split()
    {
        // return;
        if (this.mass < 1000)
            return;
        let size = this.size.x * randomRange(0.3, 0.5);
        const pos = plus(vec2(randomRange(-5, 5), this.size.y / 4), this.pos);
        let trailDrop = this.simulator.spawner.spawn(pos.clone(), size, 0.2);
        trailDrop.spread = vec2(1, Math.abs(this.velocity.y) * 0.006);
        trailDrop.parent = this;
        this.mass -= trailDrop.mass;
        this.simulator.add(trailDrop);
        this.lastTrailPos = this.pos.clone();
        this.nextTrailDistance = randomRange(20, 30);
    }

    randomMotion()
    {
        this.resistance = randomRange(0.3, 1) * this.gravity * 12000;
        this.shifting = random() * 0.1;
    }

    merge(target: RainDrop)
    {
        const selfMomentum = mul(this.velocity, this.mass);
        const targetMomentum = mul(target.velocity, target.mass);
        const momentum = plus(selfMomentum, targetMomentum);
        this.mass += target.mass;
        this.velocity = div(momentum, this.mass);
    }
}