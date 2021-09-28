varying vec3 vPosition;
varying vec2 vUv;
uniform float uTime;
uniform float uTransparency;

varying float vScale;
varying float vElevation;


void main() {
    
    vec3 circle = vec3(pow(1.0 - distance(gl_PointCoord, vec2(0.5)), 10.0));

    // Shadow
    // circle -= vPosition.y + vUv.y * vUv.y;

    // Orange
    circle.g -= .2;
    circle.b -= .5;
    circle.rgb *= vElevation * 2.0 + .8;
    circle.b -= .5;


    
    // Alpha
    float alpha = sin(uTime / 4. * vPosition.y * vScale * vScale);
    gl_FragColor = vec4(circle, uTransparency);
}