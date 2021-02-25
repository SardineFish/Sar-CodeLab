import { minus, Rect, vec2 } from "zogra-renderer";
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
                raindrop.destroied = true;
            
            if (raindrop.destroied)
                continue;
            
            // continue;
            
            for (let j = i + 1; j < this.raindrops.length; j++)
            {
                if (this.raindrops[j].parent === raindrop || this.raindrops[j].destroied)
                    continue;
                
                let dx = (raindrop.pos.x - this.raindrops[j].pos.x);
                let dy = raindrop.pos.y - this.raindrops[j].pos.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance - raindrop.mergeDistance - this.raindrops[j].mergeDistance < 0)
                {
                    if (raindrop.mass >= this.raindrops[j].mass)
                    {
                        raindrop.merge(this.raindrops[j]);
                        this.raindrops[j].destroied = true;
                    }
                    else
                    {
                        this.raindrops[j].merge(raindrop);
                        raindrop.destroied = true;
                    }
                }
            }
        }

        for (let i = 0; i < this.raindrops.length; i++)
        {
            if (this.raindrops[i].destroied)
            {
                this.raindrops[i] = this.raindrops[this.raindrops.length - 1];
                this.raindrops.length--;
            }
        }
    }
}