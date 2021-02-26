import { TextureImporter, Blending, Color, DepthTest, InstanceBuffer, mat4, MaterialFromShader, MeshBuilder, quat, RenderTexture, Shader, shaderProp, Texture, Texture2D, TextureData, TextureResizing, vec4, WrapMode, ZograRenderer, vec3, SimpleTexturedMaterial } from "zogra-renderer";
import { RenderTarget } from "zogra-renderer/dist/core/render-target";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";
import raindropTexture from "../assets/img/raindrop.png";
import { BlurRenderer } from "./blur";
import { RainDrop } from "./raindrop";
import { randomInRect, randomRange } from "./random";
import defaultVert from "./shader/2d-vert.glsl";
import defaultFrag from "./shader/2d-frag.glsl";
import raindropNormal from "./shader/raindrop-normal.glsl";
import raindropVert from "./shader/raindrop-vert.glsl";
import raindropReflect from "./shader/reflect.glsl";
import dropletNormal from "./shader/droplet.glsl";
import raindropErase from "./shader/erase.glsl";


class RaindropMaterial extends MaterialFromShader(new Shader(raindropVert, raindropNormal, {
    blendRGB: [Blending.OneMinusDstColor, Blending.OneMinusSrcColor],
    depth: DepthTest.Disable,
    zWrite: false,
    attributes: {
        size: "aSize",
        modelMatrix: "aModelMatrix",
    }
}))
{
    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;

    @shaderProp("uSize", "float")
    size: number = 0;
}

class DropletMaterial extends MaterialFromShader(new Shader(defaultVert, dropletNormal, {
    blendRGB: [Blending.OneMinusDstColor, Blending.OneMinusSrcColor],
    depth: DepthTest.Disable,
    zWrite: false,
}))
{
    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;
}

class RaindropCompose extends MaterialFromShader(new Shader(defaultVert, raindropReflect, {
    blend: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha],
    depth: DepthTest.Disable,
    zWrite: false
}))
{
    @shaderProp("uMainTex", "tex2d")
    background: Texture | null = null;

    @shaderProp("uBackgroundSize", "vec4")
    backgroundSize: vec4 = vec4.one();

    @shaderProp("uRaindropTex", "tex2d")
    raindropTex: Texture | null = null;

    @shaderProp("uDropletTex", "tex2d")
    dropletTex: Texture | null = null;
}

const RaindropErase = SimpleTexturedMaterial(new Shader(defaultVert, raindropErase, {
    // blend: [Blending.Zero, Blending.OneMinusSrcAlpha],
    blendRGB: [Blending.Zero, Blending.OneMinusSrcAlpha],
    blendAlpha: [Blending.Zero, Blending.OneMinusSrcAlpha],
}));


export interface RenderOptions
{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    background: TextureData | string;
    dropletSize: [number, number];
}

export class RaindropRenderer
{
    renderer: ZograRenderer;
    options: RenderOptions;

    private raindropTex: Texture2D = null as any;
    private background: Texture2D = null as any;
    private raindropComposeTex: RenderTexture;
    private dropletTexture: RenderTexture;
    private blurRenderer: BlurRenderer;
    private matRefract = new RaindropCompose();
    private matRaindrop = new RaindropMaterial();
    private matDroplet = new DropletMaterial();
    private matRaindropErase = new RaindropErase();

    private mesh = MeshBuilder.quad();
    private projectionMatrix: mat4;
    private buffer = new InstanceBuffer({
        size: "float",
        modelMatrix: "mat4",
    }, 3000);

    // deubg: DebugLayerRenderer = new DebugLayerRenderer();

    constructor(options: RenderOptions)
    {
        this.renderer = new ZograRenderer(options.canvas);
        this.options = options;

        this.projectionMatrix = mat4.ortho(0, options.width, 0, options.height, 1, -1);
        this.raindropComposeTex = new RenderTexture(options.width, options.height, false, TextureFormat.RGBA);
        this.dropletTexture = new RenderTexture(options.width, options.height, false, TextureFormat.RGBA);
        this.blurRenderer = new BlurRenderer(this.renderer);

        this.renderer.setViewProjection(mat4.identity(), this.projectionMatrix);
    }
    async loadAssets()
    {
        // this.renderer.blit(null, RenderTarget.CanvasTarget);
        this.raindropTex = await TextureImporter
            .url(raindropTexture)
            .then(t => t.tex2d());
        
        this.matRaindrop.texture = this.raindropTex;
        this.matDroplet.texture = this.raindropTex;

        if (typeof (this.options.background) === "string")
        {
            this.background = await TextureImporter
                .url(this.options.background)
                .then(t => t.tex2d({ wrapMpde: WrapMode.Clamp }));

            this.background.wrapMode = WrapMode.Clamp;
        }
        else
        {
            this.background = new Texture2D();
            this.background.setData(this.options.background);
        }
        this.background.resize(this.options.width, this.options.height, TextureResizing.Cover);
        this.background.generateMipmap();

    }
    render(raindrops: RainDrop[])
    {
        this.drawDroplet();

        this.renderer.setRenderTarget(this.raindropComposeTex);
        this.renderer.clear(Color.black.transparent());
        for (let i = 0; i < raindrops.length; i++)
        {
            const raindrop = raindrops[i];
            const model = mat4.rts(quat.identity(), raindrop.pos.toVec3(), raindrop.size.toVec3(1));
            this.buffer[i].modelMatrix.set(model);
            this.buffer[i].size[0] = raindrop.size.x / 100;
            // this.matRaindrop.size = raindrop.size.x / 100;
            // this.renderer.drawMesh(this.mesh, mat4.rts(quat.identity(), raindrop.pos.toVec3(), raindrop.size.toVec3(1)), this.matRaindrop);

            // return;
        }
        // this.buffer.upload(true);
        this.renderer.drawMeshInstance(this.mesh, this.buffer, this.matRaindrop, raindrops.length);
        
        this.renderer.blit(this.raindropComposeTex, this.dropletTexture, this.matRaindropErase);


        this.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        this.renderer.clear(Color.black);

        let bluredBackground = this.blurRenderer.blur(this.background);
        this.renderer.blit(bluredBackground, RenderTarget.CanvasTarget);

        this.matRefract.background = bluredBackground;
        this.matRefract.backgroundSize = vec4(this.background.width, this.background.height, 1 / this.background.width, 1 / this.background.height);

        this.matRefract.raindropTex = this.raindropComposeTex;
        this.matRefract.dropletTex = this.dropletTexture;

        this.renderer.blit(null, RenderTarget.CanvasTarget, this.matRefract);
    }

    drawDroplet()
    {
        this.renderer.setRenderTarget(this.dropletTexture);
        for (let i = 0; i < 10; i++)
        {
            const pos = vec3(randomRange(0, this.options.width), randomRange(0, this.options.height), 0);
            let size = vec3(randomRange(...this.options.dropletSize), randomRange(...this.options.dropletSize), 1);
            let model = mat4.rts(quat.identity(), pos, size);
            this.renderer.drawMesh(this.mesh, model, this.matDroplet);
        }
    }
}