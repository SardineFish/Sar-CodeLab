import { Rect, vec2 } from "zogra-renderer";
import { RaindropRenderer, RenderOptions } from "./renderer";
import { RaindropSimulator, SimulatorOptions } from "./simulator";
import { Time } from "./utils";

export interface Options extends SimulatorOptions, RenderOptions
{
}

export class RaindropFX
{
    public options: Options;
    public renderer: RaindropRenderer;
    public simulator: RaindropSimulator;

    private animFrameId: number = -1;

    constructor(options: Partial<Options> & {canvas: HTMLCanvasElement})
    {
        const canvas = options.canvas;
        const defaultOptions: Options = {
            spawnInterval: [0.1, 0.1],
            spawnSize: [60, 100],
            viewport: new Rect(vec2.zero(), vec2(canvas.width, canvas.height)),
            canvas: canvas,
            width: canvas.width,
            height: canvas.height,
            background: "",
            gravity: 2400,
            dropletSize: [10, 30],
            slipRate: 0.5,
            motionInterval: [0.1, 0.4],
            colliderSize: 1,
            trailDropDensity: 0.2,
            trailDistance: [20, 30],
            trailDropSize: [0.3, 0.5],
            trailSpread: 0.6,
            initialSpread: 0.5,
            shrinkRate: 0.01,
            velocitySpread: 0.3,
            evaporate: 10,
            xShifting: [0, 0.1],
        };
        this.options = { ...defaultOptions, ...options };

        this.simulator = new RaindropSimulator(this.options);
        this.renderer = new RaindropRenderer(this.options);
    }
    
    async start()
    {
        await this.renderer.loadAssets();

        let lastFrameTime = 0;
        const update = (delay: number) =>
        {
            const dt = (delay - lastFrameTime) / 1000;
            lastFrameTime = delay;
            const time = <Time>{
                dt: 0.03,
                total: delay / 1000
            };

            this.update(time);

            this.animFrameId = requestAnimationFrame(update);
        };

        this.animFrameId =  requestAnimationFrame(update);
    }

    resize(width: number, height: number)
    {
        this.options.width = width;
        this.options.height = height;
        this.options.viewport = new Rect(vec2.zero(), vec2(width, height));
        this.renderer.resize();
    }
    
    private update(time: Time)
    {
        this.simulator.update(time);

        this.renderer.render(this.simulator.raindrops);
    }

}

(window as any).SarRaindropFX = RaindropFX;

declare global
{
    const SarRaindropFX: typeof RaindropFX;
}