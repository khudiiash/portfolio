uniform vec3 uMouse;
uniform float uTime;
uniform float uScroll;

varying vec3 vPosition;
varying vec2 vUv;

attribute float aScale;
varying float vScale;


void main() {
    vPosition = position;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z *= distance(modelPosition, vec4(-uMouse.x, -uMouse.y, vPosition.z, 1.)) * .8;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_PointSize = 12. * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    if (uScroll > 1000.) gl_PointSize += uScroll * aScale * .0005;
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
    vScale = aScale;
}