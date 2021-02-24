#version 300 es
precision mediump float;

in vec4 vColor;
in vec4 vPos;
in vec2 vUV;

uniform sampler2D uMainTex;
uniform vec4 uBackgroundSize; // (x, y, 1/x, 1/y)
uniform sampler2D uNormalTex;
uniform vec4 uColor;

out vec4 fragColor;

void main()
{
    vec4 normal = texture(uNormalTex, vUV.xy).rgba;
    float mask = smoothstep(0.2, 0.3, normal.a);
    float normalMask = smoothstep(0.2, 1.0, normal.a);
    // vec2 offset = clamp(normalize(normal.xy), vec2(0), vec2(1)) * (1.0 - normalMask);// + vec2(0) * normalMask;
    vec2 uv = vUV.xy + -normal.xy * vec2(0.6);//clamp(-normal.xy + vec2(0.5), vec2(0), vec2(1));
    // offset = pow(offset, vec2(2));
    vec4 color = texture(uMainTex, uv.xy).rgba;
    

    // fragColor = vec4(mask, mask, mask, 1);
    // color = color * vec3(uColor);
    fragColor = vec4(color.rgb, mask);// vec4(color.rgb, mask);
}