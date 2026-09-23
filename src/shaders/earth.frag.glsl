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
  dayColor = pow(dayColor, vec3(0.9)) * (0.83 + max(nDotL, 0.0) * 0.25);
  // The relief texture stores pale mountain ridges and deep-blue water. Give the
  // oceans a restrained glint while preserving the readable physical geography.
  float ocean = smoothstep(0.08, 0.32, dayColor.b - dayColor.r);
  float oceanGlint = pow(max(nDotL, 0.0), 8.0) * ocean;
  dayColor += vec3(0.08, 0.16, 0.2) * oceanGlint;
  vec3 nightColor = dayColor * 0.065 + vec3(0.002, 0.008, 0.018);
  vec3 color = mix(nightColor, dayColor, daylight);
  if (showTerminator) {
    float line = 1.0 - smoothstep(0.0, 0.025, abs(nDotL));
    color += vec3(0.20, 0.55, 0.84) * line * 0.28;
  }
  gl_FragColor = vec4(color, 1.0);
}
