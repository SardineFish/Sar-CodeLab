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
            dropletSize: [10, 30],
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
    
    update(time: Time)
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