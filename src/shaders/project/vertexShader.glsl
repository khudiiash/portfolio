uniform vec3 uMouse;
uniform float uTime;

varying vec3 vPosition;
varying vec2 vUv;

attribute float aScale;
varying float vScale;


void main() {
    vPosition = position;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_PointSize = 12. * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
    vScale = aScale;
}