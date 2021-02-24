#version 300 es
precision mediump float;

in vec4 vColor;
in vec4 vPos;
in vec2 vUV;

uniform sampler2D uMainTex;
uniform vec4 uColor;

out vec4 fragColor;

void main()
{
    vec4 color = texture(uMainTex, vUV.xy).rgba;
    // color = color * vec3(uColor);
    vec2 dir = color.rg; //- vec2(.5);
    // dir = normalize(dir);
    dir = dir * color.a;
    fragColor = vec4(dir.xy, 0, color.a);
}