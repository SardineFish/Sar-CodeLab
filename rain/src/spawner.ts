import { Rect, vec2 } from "zogra-renderer";
import { RainDrop } from "./raindrop";
import { randomJittered, JitterOption, randomInRect } from "./random";

export class Spawner
{
    interval: JitterOption<number>;
    size: JitterOption<number>;
    spawnRect: Rect;


    currentTime = 0;
    nextSpawn = 0;

    constructor(spawnInterval: JitterOption<number>, spawnSize: JitterOption<number>, spawnRect: Rect)
    {
        this.interval = spawnInterval;
        this.size = spawnSize;
        this.spawnRect = spawnRect;
    }

    update(dt: number): this
    {
        this.currentTime += dt;
        return this;
    }
    trySpawn(): RainDrop | undefined
    {
        if (this.currentTime >= this.nextSpawn)
        {
            this.nextSpawn = this.currentTime + randomJittered(this.interval);

            const size = randomJittered(this.size);
            const pos = randomInRect(this.spawnRect.shrink(100));
            return new RainDrop(pos, size);
        }
        return undefined;
    }
}