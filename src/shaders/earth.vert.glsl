varying vec2 vUv;
varying vec3 vObjectNormal;
varying vec3 vObjectPosition;
void main() {
  vUv = uv;
  vObjectNormal = normalize(normal);
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vObjectPosition = position;
  gl_Position = projectionMatrix * viewPosition;
}
