import { div, FilterMode, MaterialFromShader, mul, RenderTexture, Shader, shaderProp, Texture, Texture2D, TextureResizing, vec2, vec4, ZograRenderer } from "zogra-renderer";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";
import vert from "./shader/2d-vert.glsl";
import frag from "./shader/blur.glsl";

class MaterialBlur extends MaterialFromShader(new Shader(vert, frag))
{
    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;

    @shaderProp("uTexSize", "vec4")
    textureSize: vec4 = vec4.one();
}

export class BlurRenderer
{
    renderer: ZograRenderer;
    tempTextures: RenderTexture[] = [];
    mateiralBlur = new MaterialBlur();

    constructor(renderer: ZograRenderer)
    {
        this.renderer = renderer;
    }

    blur(texture: Texture, iteration: number = 4)
    {
        let input = texture;
        if (!this.tempTextures[0])
            this.tempTextures[0] = new RenderTexture(texture.width, texture.height, false, texture.format, texture.filterMode);
        if (this.tempTextures[0].width !== texture.width || this.tempTextures[0].height !== texture.height)
            this.tempTextures[0].resize(texture.width, texture.height, TextureResizing.Discard);
        
        for (let i = 1; i <= iteration; i++)
        {
            const downSize = vec2.floor(div(input.size, vec2(2)));
            if (!this.tempTextures[i])
                this.tempTextures[i] = new RenderTexture(downSize.x, downSize.y, false, TextureFormat.RGBA, FilterMode.Linear);
            
            const output = this.tempTextures[i];
            if (output.width !== downSize.x || output.height !== downSize.y)
                output.resize(downSize.x, downSize.y, TextureResizing.Discard);

            this.mateiralBlur.texture = input;
            this.mateiralBlur.textureSize = vec4(input.width, input.height, 1 / input.width, 1 / input.height);
            this.renderer.blit(input, output, this.mateiralBlur);
            input = output;
        }

        for (let i = iteration - 1; i >= 0; i--)
        {
            const upSize = mul(input.size, vec2(2));
            if (!this.tempTextures[i])
                this.tempTextures[i] = new RenderTexture(upSize.x, upSize.y, false, TextureFormat.RGBA, FilterMode.Linear);
            
            const output = this.tempTextures[i];
            
            this.mateiralBlur.texture = input;
            this.mateiralBlur.textureSize = vec4(input.width, input.height, 1 / input.width, 1 / input.height);
            this.renderer.blit(input, output, this.mateiralBlur);
            input = output;
        }

        return input;
    }
}