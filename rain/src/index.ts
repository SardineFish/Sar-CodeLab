import { AssetsImporter, Blending, Color, Culling, Default2DRenderPipeline, DepthTest, mat4, Material, materialDefine, MaterialFromShader, Mesh, MeshBuilder, quat, Rect, RenderTexture, Shader, shaderProp, Texture, Texture2D, TextureData, TextureResizing, vec2, vec3, vec4, ZograEngine, ZograRenderer } from "zogra-renderer";
import image from "../assets/img/raindrop.png";
import vert from "./shader/2d-vert.glsl";
import frag from "./shader/2d-frag.glsl";
import { JitterOption } from "./random";
import { Spawner } from "./spawner";
import { RaindropSimulator } from "./physics";
import { MaterialRaindropNormal, RaindropCompose } from "./materials";
import { RenderTarget } from "zogra-renderer/dist/core/render-target";
import { Time } from "./utils";
import background from "../assets/img/87747832_p0.jpg";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";

export interface Options
{
    spawnInterval: JitterOption<number>;
    spawnSize: JitterOption<number>;
}

export class RaindropFX
{
    renderer: ZograRenderer;
    animFrameId: number = -1;

    private options: Options;

    private spawner: Spawner;
    private physics: RaindropSimulator = new RaindropSimulator();
    private projectionMatrix: mat4;
    private mesh: Mesh = MeshBuilder.quad();

    private raindropNormalMat = new MaterialRaindropNormal();
    private matReflect = new RaindropCompose();
    private normalTexture: RenderTexture;

    private backgroundOringinal: Texture2D | null = null;
    private background: Texture2D | null = null;



    constructor(canvas: HTMLCanvasElement, options: Options)
    {
        this.renderer = new ZograRenderer(canvas);

        this.options = options;

        this.spawner = new Spawner(
            options.spawnInterval,
            options.spawnSize,
            new Rect(vec2.zero(), vec2(canvas.width, canvas.height)));
        this.projectionMatrix = mat4.ortho(0, canvas.width, 0, canvas.height, 1, -1);

        this.normalTexture = new RenderTexture(canvas.width, canvas.height, false, TextureFormat.RGBA16F);

        this.mesh = MeshBuilder.quad();
    }
    async setBackground(bgSource: string | TextureData)
    {
        if (typeof (bgSource) === "string")
        {
            const asset = await AssetsImporter.url(bgSource).then(r => r.img({}));
            const texture = asset.mainAsset as Texture2D;
            this.backgroundOringinal = texture;
            this.background = this.backgroundOringinal;
            this.background.resize(this.renderer.canvasSize.x, this.renderer.canvasSize.y, TextureResizing.Cover);
            this.background.generateMipmap();
        }
    }
    async start()
    {
        const asset = await AssetsImporter.url(image).then(t => t.img({}));
        this.raindropNormalMat.texture = asset.mainAsset as Texture2D;

        let lastFrameTime = 0;

        // const backgroundAsset = await AssetsImporter.url(background).then(t => t.img({}));
        // const backgroundTex = backgroundAsset.mainAsset as Texture2D;
        // const f = () =>
        // {
        //     let rect = this.renderer.canvas.getBoundingClientRect();
        //     this.renderer.setSize(rect.width, rect.height);
        //     backgroundTex.resize(this.renderer.canvasSize.x, this.renderer.canvasSize.y, TextureResizing.Cover);
        //     this.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        //     // console.log(backgroundTex);
        //     this.renderer.clear(Color.white);
        //     this.renderer.blit(backgroundTex, RenderTarget.CanvasTarget);
        //     requestAnimationFrame(f);
        // };
        // requestAnimationFrame(f);

        // return;

        const update = (delay: number) =>
        {
            const dt = (delay - lastFrameTime) / 1000;
            lastFrameTime = delay;
            const time = <Time>{
                dt: dt,
                total: delay / 1000
            };

            this.update(time);

            this.animFrameId = requestAnimationFrame(update);
        };

        this.animFrameId =  requestAnimationFrame(update);
    }
    
    update(time: Time)
    {
        let newDrop = this.spawner.update(time.dt).trySpawn();
        if (newDrop)
        {
            this.physics.add(newDrop);
        }

        this.physics.update(time);

        if (this.background)
            this.renderer.blit(this.background, RenderTarget.CanvasTarget);

        this.renderer.setRenderTarget(this.normalTexture);
        this.renderer.clear(Color.black.transparent());
        this.renderer.setViewProjection(mat4.identity(), this.projectionMatrix);
        for (const raindrop of this.physics.raindrops)
        {
            this.renderer.drawMesh(this.mesh, mat4.rts(quat.identity(), raindrop.pos.toVec3(), vec3(raindrop.size)), this.raindropNormalMat);
        }
        this.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        this.renderer.clear(Color.black);

        if (this.background)
        {
            this.matReflect.background = this.background;
            this.matReflect.backgroundSize = vec4(this.background.width, this.background.height, 1 / this.background.width, 1 / this.background.height);
        }
        this.matReflect.raindropNormal = this.normalTexture;

        this.renderer.blit(this.background, RenderTarget.CanvasTarget);
        this.renderer.blit(this.background, RenderTarget.CanvasTarget, this.matReflect);
    }
}

(window as any).SarRaindropFX = RaindropFX;

declare global
{
    const SarRaindropFX: typeof RaindropFX;
}