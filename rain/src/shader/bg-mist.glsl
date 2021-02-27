#version 300 es
precision mediump float;

in vec2 vUV;

uniform sampler2D uMainTex;
uniform sampler2D uMistTex;
uniform float uMistAlpha;

out vec4 fragColor;

void main()
{
    vec4 color = texture(uMainTex, vUV.xy).rgba;
    color.rgb += vec3(uMistAlpha);
    color.a = texture(uMistTex, vUV.xy).r;
    fragColor = color.rgba;
}