uniform vec3 uMouse;
uniform float uTime;
uniform float uSize;

varying vec3 vPosition;
varying vec2 vUv;
varying float vElevation;

attribute float aScale;
attribute vec3 aTarget;
varying float vScale;

void main() {
    vPosition = position;
    float speed = 1.;
    float height = .5;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(position.x * .1 + uTime * speed) *
                      sin(position.y * 5. + uTime * speed) *
                      height;
    modelPosition.z += elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    vElevation = elevation;
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
    vScale = aScale;
}