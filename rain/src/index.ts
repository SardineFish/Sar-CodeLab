import { AssetsImporter, Blending, Color, Default2DRenderPipeline, mat4, materialDefine, MaterialFromShader, MeshBuilder, Shader, shaderProp, Texture, Texture2D, ZograEngine, ZograRenderer } from "zogra-renderer";
import image from "../assets/img/unknown.png";
import vert from "./shader/2d-vert.glsl";
import frag from "./shader/2d-frag.glsl";

@materialDefine
class DefaultMaterial extends MaterialFromShader(new Shader(vert, frag, {
    blend: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha]
}))
{
    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;

    @shaderProp("uColor", "color")
    color: Color = Color.white;
}

export class RaindropFX
{
    renderer: ZograRenderer;
    constructor(canvas: HTMLCanvasElement)
    {
        this.renderer = new ZograRenderer(canvas);
    }
    async start()
    {
        // const quad = MeshBuilder.quad();
        // let pack = await AssetsImporter.url(image).then(t => t.img({}));
        
        // let texture = pack.mainAsset as Texture2D;
        // let mat = new DefaultMaterial();
        // mat.texture = texture;

        // this.renderer.drawMesh(quad, mat4.identity(), mat);
    }

}

(window as any).SarRaindropFX = RaindropFX;

declare global
{
    const SarRaindropFX: typeof RaindropFX;
}