import { mul, vec2 } from "zogra-renderer";
import { goldNoise } from "./random";
import { Time } from "./utils";

export class RainDrop
{
    pos: vec2;
    size: number;
    seed: number;
    velocity: vec2 = vec2.zero();

    private nextRandomTime = 0;

    constructor(pos: vec2, size: number)
    {
        this.pos = pos;
        this.size = size;
        this.seed = Math.floor(Math.random() * 2147483647) + 1;
        this.velocity.x = Math.random() * 20 - 10;
    }

    update(time: Time)
    {
        this.pos.plus(mul(this.velocity, vec2(time.dt)));
        if (this.nextRandomTime <= time.total)
        {
            this.nextRandomTime = time.total + Math.random() * 3;
            this.velocity.x = Math.random() * 40 - 20;
        }
    }
}