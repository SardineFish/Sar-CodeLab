import { trimEnd } from "*.png";
import { minus, mul, plus, vec2 } from "zogra-renderer";
import { goldNoise, random, randomRange } from "./random";
import { RaindropSimulator } from "./simulator";
import { clamp, Time } from "./utils";

export class RainDrop
{
    pos: vec2;
    // size: number;
    seed: number;
    velocity: vec2 = vec2.zero();
    spread: vec2;
    destroy = false;
    evaporate = 0;
    mass: number = 0;

    private simulator: RaindropSimulator;
    private resistance = 0;
    private shifting = 0;
    private gravity = 2400;
    private lastTrailPos: vec2;
    private nextTrailDistance: number;

    private nextRandomTime = 0;

    constructor(simulator: RaindropSimulator, pos: vec2, size: number)
    {
        this.pos = pos;
        this.seed = Math.floor(Math.random() * 2147483647) + 1;
        this.simulator = simulator;
        // this.velocity.x = Math.random() * 20 - 10;
        // this.velocity.y = -Math.random() * 60;

        this.lastTrailPos = pos.clone();
        this.nextTrailDistance = randomRange(10, 20);

        this.spread = vec2(0.5, 0.5);

        this.mass = size ** 2;
    }
    
    get size(): vec2
    {
        return mul(plus(this.spread, vec2.one()), Math.sqrt(this.mass));
    }

    update(time: Time)
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
        this.pos.plus(mul(this.velocity, vec2(time.dt)));

        this.spread.y = Math.max(this.spread.y, 0.3 * 2 * Math.atan(Math.abs(this.velocity.y * 0.005)) / Math.PI);
        this.spread.x *= 0.7;
        this.spread.y *= 0.85;
        // this.spread.y +=  Math.abs(this.velocity.y) * 0.0001;

        if (minus(this.lastTrailPos, this.pos).magnitude > this.nextTrailDistance)
        {
            this.split();
        }
    }

    split()
    {
        if (this.mass < 1000)
            return;
        let mass = randomRange(0.05, 0.1) * this.mass;
        this.mass -= mass * 0.5;
        const pos = plus(vec2(randomRange(-5, 5), this.size.y / 4), this.pos);
        let trailDrop = this.simulator.spawner.spawn(pos.clone(), mass);
        trailDrop.spread = vec2(1, Math.abs(this.velocity.y) * 0.006);
        this.simulator.add(trailDrop);
        this.lastTrailPos = this.pos.clone();
        this.nextTrailDistance = randomRange(20, 30);
    }

    randomMotion()
    {
        this.resistance = randomRange(0.1, 1) * this.gravity * 3000;
        this.shifting = random() * 0.1;
    }
}