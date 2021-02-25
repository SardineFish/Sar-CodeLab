import { AssetsImporter, Blending, Color, DepthTest, mat4, MaterialFromShader, MeshBuilder, quat, RenderTexture, Shader, shaderProp, Texture, Texture2D, TextureData, TextureResizing, vec4, ZograRenderer } from "zogra-renderer";
import { RenderTarget } from "zogra-renderer/dist/core/render-target";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";
import raindropTexture from "../assets/img/raindrop.png";
import { BlurRenderer } from "./blur";
import { RainDrop } from "./raindrop";
import defaultVert from "./shader/2d-vert.glsl";
import raindropNormal from "./shader/raindrop-normal.glsl";
import raindropReflect from "./shader/reflect.glsl";

export class MaterialRaindropNormal extends MaterialFromShader(new Shader(defaultVert, raindropNormal, {
    blendRGB: [Blending.OneMinusDstColor, Blending.OneMinusSrcColor],
    depth: DepthTest.Disable,
    zWrite: false,
}))
{
    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;

    @shaderProp("uSize", "float")
    size: number = 0;
}

export class RaindropCompose extends MaterialFromShader(new Shader(defaultVert, raindropReflect, {
    blend: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha],
    depth: DepthTest.Disable,
    zWrite: false
}))
{
    @shaderProp("uMainTex", "tex2d")
    background: Texture | null = null;

    @shaderProp("uBackgroundSize", "vec4")
    backgroundSize: vec4 = vec4.one();

    @shaderProp("uNormalTex", "tex2d")
    raindropTex: Texture | null = null;
}


export interface RenderOptions
{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    background: TextureData | string;
}

export class RaindropRenderer
{
    renderer: ZograRenderer;
    options: RenderOptions;

    private raindropTex: Texture2D = null as any;
    private background: Texture2D = null as any;
    private raindropComposeTex: RenderTexture;
    private blurRenderer: BlurRenderer;
    private matRefract = new RaindropCompose();
    private matRaindrop = new MaterialRaindropNormal();
    private mesh = MeshBuilder.quad();
    private projectionMatrix: mat4;

    constructor(options: RenderOptions)
    {
        this.renderer = new ZograRenderer(options.canvas);
        this.options = options;

        this.projectionMatrix = mat4.ortho(0, options.width, 0, options.height, 1, -1);
        this.raindropComposeTex = new RenderTexture(options.width, options.height, false, TextureFormat.RGBA);
        this.blurRenderer = new BlurRenderer(this.renderer);
    }
    async loadAssets()
    {
        // this.renderer.blit(null, RenderTarget.CanvasTarget);
        this.raindropTex = (await AssetsImporter.url(raindropTexture).then(r => r.img({}))).mainAsset as Texture2D;
        this.matRaindrop.texture = this.raindropTex;

        if (typeof (this.options.background) === "string")
        {
            this.background = (await AssetsImporter.url(this.options.background).then(r => r.img({}))).mainAsset as Texture2D;
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
        this.renderer.blit(this.background, RenderTarget.CanvasTarget);
        this.renderer.setRenderTarget(this.raindropComposeTex);
        this.renderer.clear(Color.black.transparent());
        this.renderer.setViewProjection(mat4.identity(), this.projectionMatrix);
        for (const raindrop of raindrops)
        {
            this.matRaindrop.size = raindrop.size.x / 100;
            this.renderer.drawMesh(this.mesh, mat4.rts(quat.identity(), raindrop.pos.toVec3(), raindrop.size.toVec3(1)), this.matRaindrop);

            // return;
        }
        this.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        this.renderer.clear(Color.black);

        let bluredBackground = this.blurRenderer.blur(this.background);
        this.renderer.blit(bluredBackground, RenderTarget.CanvasTarget);

        this.matRefract.background = bluredBackground;
        this.matRefract.backgroundSize = vec4(this.background.width, this.background.height, 1 / this.background.width, 1 / this.background.height);

        this.matRefract.raindropTex = this.raindropComposeTex;

        this.renderer.blit(null, RenderTarget.CanvasTarget, this.matRefract);
    }
}