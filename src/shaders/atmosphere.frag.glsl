varying vec3 vNormal;
void main() {
  float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 3.2);
  gl_FragColor = vec4(0.18, 0.58, 1.0, rim * 0.52);
}
