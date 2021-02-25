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
    // vec3 lightPos = vec3(0.5, 1, 1);

    vec4 raindrop = texture(uNormalTex, vUV.xy).rgba;
    float mask = smoothstep(0.8, 0.99, raindrop.a);
    float normalMask = smoothstep(0.2, 1.0, raindrop.a);
    
    vec2 uv = vUV.xy + -(raindrop.xy - vec2(0.5)) * vec2(raindrop.b * 0.8 + 0.1);
    vec3 normal = normalize(vec3((raindrop.xy - vec2(0.5)) * vec2(2), 1));

    // vec3 lightDir = lightPos - vec3(vUV, 0);
    vec3 lightDir = vec3(-1, 1, 2);
    float lambertian = clamp(dot(normalize(lightDir), normal), 0.0, 1.0);


    // offset = pow(offset, vec2(2));
    vec4 color = texture(uMainTex, uv.xy).rgba;

    color.rgb += vec3((lambertian - 0.7) * 0.3);
    

    // fragColor = vec4(mask, mask, mask, 1);
    // color = color * vec3(uColor);
    fragColor = vec4(color.rgb, mask);// vec4(color.rgb, mask);
}