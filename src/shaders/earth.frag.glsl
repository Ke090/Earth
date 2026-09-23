uniform sampler2D earthTexture;
uniform vec3 sunDirection;
uniform bool showTerminator;
uniform bool textureLoaded;
varying vec2 vUv;
varying vec3 vObjectNormal;
void main() {
  float nDotL = dot(normalize(vObjectNormal), normalize(sunDirection));
  float daylight = smoothstep(-0.035, 0.035, nDotL);
  vec3 dayColor = textureLoaded ? texture2D(earthTexture, vUv).rgb : vec3(0.035, 0.23, 0.43);
  dayColor = pow(dayColor, vec3(0.82)) * (0.88 + max(nDotL, 0.0) * 0.22);
  vec3 nightColor = dayColor * 0.065 + vec3(0.002, 0.008, 0.018);
  vec3 color = mix(nightColor, dayColor, daylight);
  if (showTerminator) {
    float line = 1.0 - smoothstep(0.0, 0.025, abs(nDotL));
    color += vec3(0.20, 0.55, 0.84) * line * 0.28;
  }
  gl_FragColor = vec4(color, 1.0);
}
