varying vec3 vPosition;
varying vec2 vUv;
uniform float uTime;

varying float vScale;


void main() {
    vec3 circle = vec3(distance(vUv, vec2(.5)));

    // Shadow
    circle -= vPosition.y + vUv.y * vUv.y;

    // Orange
    circle.r += vScale * vUv.y;
    circle.g += vScale * vUv.y * .3;

    
    // Alpha
    float alpha = uTime / 20.;

    gl_FragColor = vec4(max(circle, .1), alpha);
}