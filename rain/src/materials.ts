import { Blending, DepthTest, materialDefine, MaterialFromShader, Shader, shaderProp, SimpleTexturedMaterial, Texture, Texture2D, vec4 } from "zogra-renderer";
import defaultVert from "./shader/2d-vert.glsl";
import raindropNormal from "./shader/raindrop-normal.glsl";
import raindropReflect from "./shader/reflect.glsl";
import blur from "./shader/blur.glsl";

export const MaterialRaindropNormal = SimpleTexturedMaterial(new Shader(defaultVert, raindropNormal, {
    // blendAlpha: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha],
    blendRGB: [Blending.One, Blending.OneMinusSrcAlpha],
    depth: DepthTest.Disable,
    zWrite: false,
}));

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
    raindropNormal: Texture | null = null;
}
