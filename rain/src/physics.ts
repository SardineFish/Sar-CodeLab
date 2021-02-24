import { RainDrop } from "./raindrop";
import { Time } from "./utils";

export class RaindropSimulator
{
    raindrops: RainDrop[] = [];
    add(raindrop: RainDrop)
    {
        this.raindrops.push(raindrop);
    }

    update(time: Time)
    {
        for (let i = 0; i < this.raindrops.length; i++)
        {
            this.raindrops[i].update(time);
        }
    }
}