import { TextureImporter, Blending, Color, DepthTest, RenderBuffer, mat4, MaterialFromShader, MeshBuilder, quat, RenderTexture, Shader, shaderProp, Texture, Texture2D, TextureData, TextureResizing, vec4, WrapMode, ZograRenderer, vec3, SimpleTexturedMaterial, Utils, vec2 } from "zogra-renderer";
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
import mistBackground from "./shader/bg-mist.glsl";
import { ImageSizing } from "zogra-renderer/dist/utils";
import { Time } from "./utils";


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

class DropletMaterial extends MaterialFromShader(new Shader(raindropVert, dropletNormal, {
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

    @shaderProp("uMistTex", "tex2d")
    mistTex: Texture | null = null;

    @shaderProp("uSmoothRaindrop", "vec2")
    smoothRaindrop: vec2 = vec2(0.95, 1.0);

    @shaderProp("uRefractParams", "vec2")
    refractParams: vec2 = vec2(0.4, 0.6);

    @shaderProp("uLightPos", "vec4")
    lightPos: vec4 = vec4(.5, .5, 2, 1);

    @shaderProp("uDiffuseColor", "color")
    diffuseLight: Color = new Color(0.3, 0.3, 0.3, 0.8);

    @shaderProp("uSpecularParams", "vec4")
    specularParams: vec4 = vec4(1, 1, 1, 32);

    @shaderProp("uBump", "float")
    bump: number = 1;
}

class RaindropErase extends SimpleTexturedMaterial(new Shader(defaultVert, raindropErase, {
    // blend: [Blending.Zero, Blending.OneMinusSrcAlpha],
    blendRGB: [Blending.Zero, Blending.OneMinusSrcAlpha],
    blendAlpha: [Blending.Zero, Blending.OneMinusSrcAlpha],
}))
{
    @shaderProp("uEraserSmooth", "vec2")
    eraserSize: vec2 = vec2(0.93, 1.0);
}

const MistAccumulate = SimpleTexturedMaterial(new Shader(defaultVert, defaultFrag, {
    blend: [Blending.One, Blending.One]
}));

class MistBackground extends SimpleTexturedMaterial(new Shader(defaultVert, mistBackground, {
    blend: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha]
}))
{
    @shaderProp("uMistColor", "color")
    mistColor: Color = new Color(0.01, 0.01, 0.01, 1);
    
    @shaderProp("uMistTex", "tex2d")
    mistTex: Texture | null = null;
}


export interface RenderOptions
{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    dropletSize: [number, number];
    background: TextureData | string;
    /**
     * Background blur steps used for background & raindrop refract image.
     * Value should be integer from 0 to log2(backgroundSize).
     * Recommend 3 or 4
     */
    backgroundBlurSteps: number;
    /**
     * Enable blurry mist effect
     */
    mist: boolean;
    /**
     * [r, g, b, a] mist color, each component in range (0..1). 
     * The alpha is used for whole mist layer.
     * Recommend [0.01, 0.01, 0.01, 1]
     */
    mistColor: [number, number, number, number];
    /**
     * Describe how long takes mist alpha from 0 to 1
     */
    mistTime: number;
    /**
     * Background blur steps used for mist.
     * Value should be integer from 0 to log2(backgroundSize).
     * Recommended value = backgroundBlurSteps + 1
     */
    mistBlurStep: number;
    /**
     * Smooth range [a, b] of raindrop edge.
     * Recommend [0.96, 1.0]
     * 
     * Larger range of (b - a) have smoother edge.
     * 
     * Lower value b makes raindrop larger with a distort edge
     */
    smoothRaindrop: [number, number];
    /**
     * Refract uv scale of minimal raindrop.
     * Recommend in range (0.2, 0.6)
     */
    refractBase: number,
    /**
     * Refract uv scaled by raindrop size.
     * Rocommend in range (0.4, 0.8)
     */
    refractScale: number,
    /**
     * Describe how raindrops are composed.
     * 
     * - `smoother` compose raindrops normal with 'exclusion' blend mode
     * 
     * - `harder` compose raindrops normal with 'normal' blend mode
     */
    raindropCompose: "smoother" | "harder"
    /**
     * Screen space (0..1) light direction or position.
     * Recommend [-1, 1, 2, 0]
     * 
     * - Use [x, y, z, 0] to indicate a direction
     * 
     * - Use [x, y, z, 1] to indicate a position
     */
    raindropLightPos: [number, number, number, number];
    /**
     * Lambertian diffuse lighting Color.
     * Recommend [0.3, 0.3, 0.3]
     */
    raindropDiffuseLight: [number, number, number];
    /**
     * Higher value makes more shadow.
     * Recommend in range (0.6..0.8)
     */
    raindropShadowOffset: number;
    /**
     * Similar to `smoothRaindrop`. Used to erase droplets & mist.
     * Recommended value [0.93, 1.0]
     */
    raindropEraserSize: [number, number];
    /**
     * Specular light clor.
     * Recommend disable it with [0, 0, 0] :)
     */
    raindropSpecularLight: [number, number, number];
    /**
     * Blinn-Phong exponent representing shininess.
     * Value from 0 to 1024 is ok
     */
    raindropSpecularShininess: number;
    /**
     * Will apply to calculate screen space normal for lighting.
     * Larger value makes raindrops looks more flat.
     * Recommend in range (0.3..1)
     */
    raindropLightBump: number,

}

export class RaindropRenderer
{
    renderer: ZograRenderer;
    options: RenderOptions;

    private raindropTex: Texture2D = null as any;
    private originalBackground: Texture2D = null as any;
    private background: RenderTexture;
    private raindropComposeTex: RenderTexture;
    private dropletTexture: RenderTexture;
    private mistTexture: RenderTexture;
    private blurryBackground: RenderTexture;
    private mistBackground: RenderTexture;
    private blurRenderer: BlurRenderer;

    private matRefract = new RaindropCompose();
    private matRaindrop = new RaindropMaterial();
    private matDroplet = new DropletMaterial();
    private matRaindropErase = new RaindropErase();
    private matMist = new MistAccumulate();
    private matMistBackground = new MistBackground();

    private projectionMatrix: mat4;
    private mesh = MeshBuilder.quad();
    private raindropBuffer = new RenderBuffer({
        size: "float",
        modelMatrix: "mat4",
    }, 3000);
    private dropletBuffer = new RenderBuffer({
        modelMatrix: "mat4",
    }, 100);

    // deubg: DebugLayerRenderer = new DebugLayerRenderer();

    constructor(options: RenderOptions)
    {
        this.renderer = new ZograRenderer(options.canvas);
        this.renderer.gl.getExtension("EXT_color_buffer_float");
        this.options = options;

        this.projectionMatrix = mat4.ortho(0, options.width, 0, options.height, 1, -1);
        this.raindropComposeTex = new RenderTexture(options.width, options.height, false);
        this.background = new RenderTexture(options.width, options.height, false);
        this.dropletTexture = new RenderTexture(options.width, options.height, false);
        this.blurryBackground = new RenderTexture(options.width, options.height, false);
        this.mistBackground = new RenderTexture(options.width, options.height, false);
        this.mistTexture = new RenderTexture(options.width, options.height, false, TextureFormat.R16F);

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

        await this.reloadBackground();

    }
    async reloadBackground()
    {
        if (typeof (this.options.background) === "string")
        {
            this.originalBackground = await TextureImporter
                .url(this.options.background)
                .then(t => t.tex2d({ wrapMpde: WrapMode.Clamp }));

            this.originalBackground.wrapMode = WrapMode.Clamp;
            this.originalBackground.updateParameters();
        }
        else
        {
            this.originalBackground = new Texture2D();
            this.originalBackground.setData(this.options.background);
            this.originalBackground.updateParameters();
        }
        const [srcRect, dstRect] = Utils.imageResize(this.originalBackground.size, this.background.size, ImageSizing.Cover);
        this.renderer.blit(this.originalBackground, this.background, this.renderer.assets.materials.blitCopy, srcRect, dstRect);
        this.background.generateMipmap();

        this.blurBackground();
    }
    resize()
    {
        this.renderer.setSize(this.options.width, this.options.height);
        this.projectionMatrix = mat4.ortho(0, this.options.width, 0, this.options.height, 1, -1);
        this.renderer.setViewProjection(mat4.identity(), this.projectionMatrix);

        this.raindropComposeTex.resize(this.options.width, this.options.height);
        this.background.resize(this.options.width, this.options.height);
        this.dropletTexture.resize(this.options.width, this.options.height);
        this.blurryBackground.resize(this.options.width, this.options.height);
        this.mistBackground.resize(this.options.width, this.options.height);
        this.mistTexture.resize(this.options.width, this.options.height);

        const [srcRect, dstRect] = Utils.imageResize(this.originalBackground.size, this.background.size, ImageSizing.Cover);
        this.renderer.blit(this.originalBackground, this.background, this.renderer.assets.materials.blitCopy, srcRect, dstRect);
        this.background.generateMipmap();

        this.blurBackground();
    }
    resetOptions()
    {
        
    }
    render(raindrops: RainDrop[], time: Time)
    {
        this.drawDroplet();
        this.drawMist(time.dt);
        this.drawRaindrops(raindrops);

        this.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        this.renderer.clear(Color.black);

        this.drawBackground();

        this.matRefract.background = this.blurryBackground;
        this.matRefract.backgroundSize = vec4(this.options.width, this.options.height, 1 / this.options.width, 1 / this.options.height);
        this.matRefract.raindropTex = this.raindropComposeTex;
        this.matRefract.dropletTex = this.dropletTexture;
        this.matRefract.mistTex = this.mistTexture;
        this.matRefract.smoothRaindrop = vec2(...this.options.smoothRaindrop);
        this.matRefract.refractParams = vec2(this.options.refractBase, this.options.refractScale);
        this.matRefract.lightPos = vec4(...this.options.raindropLightPos);
        this.matRefract.diffuseLight = new Color(...this.options.raindropDiffuseLight, this.options.raindropShadowOffset);
        this.matRefract.specularParams = vec4(...this.options.raindropSpecularLight, this.options.raindropSpecularShininess);
        this.matRefract.bump = this.options.raindropLightBump;

        this.renderer.blit(null, RenderTarget.CanvasTarget, this.matRefract);
    }

    private blurBackground()
    {
        // Blur background with N steps downsample + N steps upsample
        if (!this.options.mist)
        {
            this.blurRenderer.blur(this.background, this.options.backgroundBlurSteps, this.blurryBackground);
        }
        else
        {
            // Downsample to max steps
            // Then upsample from a larger texture before smaller texture to avoid override
            this.blurRenderer.init(this.background);
            this.blurRenderer.downSample(this.background, Math.max(this.options.backgroundBlurSteps, this.options.mistBlurStep));
            
            if (this.options.backgroundBlurSteps === this.options.mistBlurStep)
            {
                this.blurRenderer.upSample(this.options.backgroundBlurSteps, this.blurryBackground);
                this.renderer.blit(this.blurryBackground, this.mistBackground);
            }
            else if (this.options.mistBlurStep > this.options.backgroundBlurSteps)
            {
                this.blurRenderer.upSample(this.options.backgroundBlurSteps, this.blurryBackground);
                this.blurRenderer.upSample(this.options.mistBlurStep, this.mistBackground);
            }
            else
            {
                this.blurRenderer.upSample(this.options.mistBlurStep, this.mistBackground);
                this.blurRenderer.upSample(this.options.backgroundBlurSteps, this.blurryBackground);
            }
        }
    }

    private drawMist(dt: number)
    {
        if (!this.options.mist)
            return;
        this.matMist.color.r = dt / this.options.mistTime;
        this.renderer.blit(this.renderer.assets.textures.default, this.mistTexture, this.matMist);
    }

    private drawBackground()
    {
        this.renderer.blit(this.blurryBackground, RenderTarget.CanvasTarget);

        if (this.options.mist)
        {
            this.matMistBackground.mistTex = this.mistTexture;
            this.matMistBackground.texture = this.mistBackground;
            this.matMistBackground.mistColor = new Color(...this.options.mistColor);
            this.renderer.blit(this.mistBackground, RenderTarget.CanvasTarget, this.matMistBackground);
        }
        
    }

    private drawRaindrops(raindrops: RainDrop[])
    {
        if (raindrops.length > this.raindropBuffer.length)
            this.raindropBuffer.resize(this.raindropBuffer.length * 2);
        this.renderer.setRenderTarget(this.raindropComposeTex);
        this.renderer.clear(Color.black.transparent());
        for (let i = 0; i < raindrops.length; i++)
        {
            const raindrop = raindrops[i];
            const model = mat4.rts(quat.identity(), raindrop.pos.toVec3(), raindrop.size.toVec3(1));
            this.raindropBuffer[i].modelMatrix.set(model);
            this.raindropBuffer[i].size[0] = raindrop.size.x / 100;
            // this.matRaindrop.size = raindrop.size.x / 100;
            // this.renderer.drawMesh(this.mesh, mat4.rts(quat.identity(), raindrop.pos.toVec3(), raindrop.size.toVec3(1)), this.matRaindrop);

            // return;
        }
        // this.buffer.upload(true);
        this.renderer.drawMeshInstance(this.mesh, this.raindropBuffer, this.matRaindrop, raindrops.length);
        this.matRaindropErase.eraserSize = vec2(...this.options.raindropEraserSize);
        this.renderer.blit(this.raindropComposeTex, this.dropletTexture, this.matRaindropErase);
        if (this.options.mist)
            this.renderer.blit(this.raindropComposeTex, this.mistTexture, this.matRaindropErase);
    }

    private drawDroplet()
    {
        this.renderer.setRenderTarget(this.dropletTexture);
        for (let i = 0; i < 10; i++)
        {
            const pos = vec3(randomRange(0, this.options.width), randomRange(0, this.options.height), 0);
            let size = vec3(randomRange(...this.options.dropletSize), randomRange(...this.options.dropletSize), 1);
            let model = mat4.rts(quat.identity(), pos, size);

            this.dropletBuffer[i].modelMatrix.set(model);
            // this.renderer.drawMesh(this.mesh, model, this.matDroplet);
        }
        this.renderer.drawMeshInstance(this.mesh, this.dropletBuffer, this.matDroplet, 10);
    }
}