import { Rect } from "zogra-renderer";
import { RainDrop } from "./raindrop";
import { JitterOption } from "./random";
import { Spawner } from "./spawner";
import { Time } from "./utils";

export interface SimulatorOptions
{
    spawnInterval: [number, number];
    spawnSize: [number, number];
    viewport: Rect;
}

export class RaindropSimulator
{
    options: SimulatorOptions;
    spawner: Spawner;
    raindrops: RainDrop[] = [];
    constructor(options: SimulatorOptions)
    {
        this.options = options;

        this.spawner = new Spawner(this, options);
    }
    add(raindrop: RainDrop)
    {
        this.raindrops.push(raindrop);
    }

    update(time: Time)
    {
        let newDrop = this.spawner.update(time.dt).trySpawn();
        if (newDrop)
            this.raindrops.push(newDrop);

        for (let i = 0; i < this.raindrops.length; i++)
        {
            const raindrop = this.raindrops[i];
            raindrop.update(time);
            if (raindrop.pos.y < -100)
                raindrop.destroy = true;
        }

        for (let i = 0; i < this.raindrops.length; i++)
        {
            if (this.raindrops[i].destroy)
            {
                this.raindrops[i] = this.raindrops[this.raindrops.length - 1];
                this.raindrops.length--;
            }
        }
    }
}