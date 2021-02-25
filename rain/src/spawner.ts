import { Rect, vec2 } from "zogra-renderer";
import { RainDrop } from "./raindrop";
import { randomJittered, JitterOption, randomInRect, randomRange } from "./random";
import { RaindropSimulator, SimulatorOptions } from "./simulator";

export class Spawner
{


    currentTime = 0;
    nextSpawn = 0;

    private simulator: RaindropSimulator;

    constructor(simulator: RaindropSimulator, options: SimulatorOptions)
    {

        this.simulator = simulator;
    }
    
    get interval() { return this.simulator.options.spawnInterval }
    get size() { return this.simulator.options.spawnSize }
    get spawnRect() { return this.simulator.options.viewport }

    update(dt: number): this
    {
        this.currentTime += dt;
        return this;
    }
    trySpawn(): RainDrop | undefined
    {
        if (this.currentTime >= this.nextSpawn)
        {
            this.nextSpawn = this.currentTime + randomRange(...this.interval);

            const size = randomRange(...this.size);
            const pos = randomInRect(this.spawnRect.shrink(100));
            return new RainDrop(this.simulator, pos, size);
        }
        return undefined;
    }
    spawn(pos: vec2, mass: number)
    {
        return new RainDrop(this.simulator, pos, Math.pow(mass, 1 / 2));
    }
}