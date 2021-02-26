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
    grid: Set<RainDrop>[] = [];
    constructor(options: SimulatorOptions)
    {
        this.options = options;

        this.spawner = new Spawner(this, options);

        this.resize();
    }
    get gridSize() { return this.options.spawnSize[1] * 0.3 } // max collide distance

    resize()
    {
        const w = Math.ceil(this.options.viewport.size.x / this.gridSize);
        const h = Math.ceil(this.options.viewport.size.y / this.gridSize);
        let base = 0;
        if (this.grid.length < w * h)
        {
            base = this.grid.length;
            this.grid.length = w * h;
        }
        for (let i = base; i < this.grid.length; i++)
            this.grid[i] = new Set();
    }
    gridAt(gridX: number, gridY: number)
    {
        if (gridX < 0 || gridY < 0)
            return undefined;
        const gridWidth = Math.ceil((this.options.viewport.xMax - this.options.viewport.xMin) / this.gridSize);
        const idx = gridY * gridWidth + gridX;
        if (idx >= this.grid.length)
            return undefined;
        return this.grid[idx];
    }
    gridAtWorldPos(x: number, y: number)
    {
        return this.gridAt(...this.worldToGrid(x, y));
    }
    worldToGrid(x: number, y: number): [number, number]
    {
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        return [gridX, gridY];
    }
    add(raindrop: RainDrop)
    {

        this.raindrops.push(raindrop);
        let grid = this.gridAtWorldPos(raindrop.pos.x, raindrop.pos.y);
        grid?.add(raindrop);
        raindrop.grid = grid;
    }

    update(time: Time)
    {
        if (this.raindrops.length < 2000)
        {
            let newDrop = this.spawner.update(time.dt).trySpawn();
            if (newDrop)
                this.raindrops.push(newDrop); 
        }

        this.raindropUpdate(time);
        this.collisionUpdate();

        for (let i = 0; i < this.raindrops.length; i++)
        {
            if (this.raindrops[i].destroied)
            {
                this.raindrops[i].grid?.delete(this.raindrops[i]);
                this.raindrops[i] = this.raindrops[this.raindrops.length - 1];
                this.raindrops.length--;
            }
        }
    }

    raindropUpdate(time: Time)
    {
        for (let i = 0; i < this.raindrops.length; i++)
        {
            const raindrop = this.raindrops[i];
            if (raindrop.destroied)
                continue;
            
            raindrop.updateRaindrop(time);
            if (raindrop.pos.y < -100)
                raindrop.destroied = true;
            

            if (raindrop.destroied)
                continue;


            const [gridX, gridY] = this.worldToGrid(raindrop.pos.x, raindrop.pos.y);
            const grid = this.gridAt(gridX, gridY);
            if (grid !== raindrop.grid)
            {
                raindrop.grid?.delete(raindrop);
                grid?.add(raindrop);
                raindrop.grid = grid;
            }
        }
    }

    collisionUpdate()
    {
        for (let i = 0; i < this.raindrops.length; i++)
        {
            const raindrop = this.raindrops[i];

            if (raindrop.destroied)
                continue;
            
            const [gridX, gridY] = this.worldToGrid(raindrop.pos.x, raindrop.pos.y);

            for (let x = -1; x <= 1; x++)
            {
                for (let y = -1; y <= 1; y++)
                {
                    const grid = this.gridAt(gridX + x, gridY + y);
                    if (!grid)
                        continue;

                    for (const other of grid)
                    {
                        const isSame = other === raindrop;
                        const isParent = other.parent === raindrop || raindrop.parent === other;
                        const isAdjacent = raindrop.parent && (raindrop.parent === other.parent);
                        if (other.destroied || isParent || isAdjacent || isSame)
                            continue;

                        let dx = raindrop.pos.x - other.pos.x;
                        let dy = raindrop.pos.y - other.pos.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance - raindrop.mergeDistance - other.mergeDistance < 0)
                        {
                            if (raindrop.mass >= other.mass)
                            {
                                raindrop.merge(other);
                                other.destroied = true;
                            }
                            else
                            {
                                other.merge(raindrop);
                                raindrop.destroied = true;
                            }
                        }
                    }
                }
            }
        }
    }
}