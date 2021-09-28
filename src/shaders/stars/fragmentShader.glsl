varying vec3 vPosition;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uCameraPos;
uniform float uTransparency;

varying float vScale;
varying float vElevation;




void main() {
    
    vec3 circle = vec3(pow(1.0 - distance(gl_PointCoord, vec2(0.5)), 10.0));


    // Orange
    circle.g -= .2;
    circle.b -= .5;
    circle.rgb *= vElevation * 2.0 + .8;
    circle.b -= .5;
 

    
    // Alpha

    float alpha = uTransparency - smoothstep(.1, 80., distance(vPosition, vec3(0.)));
    gl_FragColor = vec4(circle, uTransparency * alpha);
}