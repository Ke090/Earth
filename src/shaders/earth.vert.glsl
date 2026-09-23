varying vec2 vUv;
varying vec3 vObjectNormal;
void main() {
  vUv = uv;
  vObjectNormal = normalize(normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
