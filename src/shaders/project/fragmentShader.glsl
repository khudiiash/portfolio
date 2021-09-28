
varying vec3 vPosition;
varying vec2 vUv;
uniform float uTime;
uniform float uOpacity;
uniform float uSaturate;
uniform sampler2D uTexture;

varying float vScale;


vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main() {
   
    float color = max(smoothstep(0., 1., 1.0 - vUv.y), .8) * uSaturate;
    vec2 uv = rotateUV(vUv, 3.1415926535);
    float elevation = sin(vPosition.y * 15. - uTime) * 0.01;
    vec4 t = texture2D(uTexture, uv);
    t *= vec4(color);
    t.a = uOpacity;
    // Alpha

    gl_FragColor = t;
}