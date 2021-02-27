#version 300 es
precision mediump float;

in vec4 vColor;
in vec4 vPos;
in vec2 vUV;

uniform sampler2D uMainTex;
uniform vec4 uBackgroundSize; // (x, y, 1/x, 1/y)
uniform sampler2D uRaindropTex;
uniform sampler2D uDropletTex;
uniform vec4 uColor;

out vec4 fragColor;

void main()
{
    // vec3 lightPos = vec3(0.5, 1, 1);

    vec4 raindrop = texture(uRaindropTex, vUV.xy).rgba;
    vec4 droplet = texture(uDropletTex, vUV.xy).rgba;

    vec4 compose = vec4(raindrop.rgb + droplet.rgb - vec3(2.0) * raindrop.rgb * droplet.rgb, max(droplet.a, raindrop.a));

    float mask = smoothstep(0.96, 0.99, compose.a);
    
    vec2 uv = vUV.xy + -(compose.xy - vec2(0.5)) * vec2(compose.b * 0.6 + 0.4);
    vec3 normal = normalize(vec3((compose.xy - vec2(0.5)) * vec2(2), 1));

    // vec3 lightDir = lightPos - vec3(vUV, 0);
    vec3 lightDir = vec3(-1, 1, 2);
    float lambertian = clamp(dot(normalize(lightDir), normal), 0.0, 1.0);


    // offset = pow(offset, vec2(2));
    vec4 color = texture(uMainTex, uv.xy).rgba;

    color.rgb += vec3((lambertian - 0.8) * 0.3);
    

    // fragColor = vec4(mask, mask, mask, 1);
    // color = color * vec3(uColor);

    fragColor = vec4(color.rgb, mask);// vec4(color.rgb, mask);
}