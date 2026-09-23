uniform sampler2D earthTexture;
uniform vec3 sunDirection;
uniform bool showTerminator;
uniform bool textureLoaded;
varying vec2 vUv;
varying vec3 vObjectNormal;
varying vec3 vObjectPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 normal = normalize(vObjectNormal);
  vec3 lightDir = normalize(sunDirection);
  float nDotL = dot(normal, lightDir);
  float daylight = smoothstep(-0.06, 0.08, nDotL);
  vec3 albedo = textureLoaded ? texture2D(earthTexture, vUv).rgb : vec3(0.025, 0.16, 0.32);
  float ocean = smoothstep(0.055, 0.22, albedo.b - max(albedo.r, albedo.g * 0.72));

  // A broad, physically plausible ocean reflection gives the globe depth without
  // baking a highlight into the map (and therefore follows the simulated Sun).
  vec3 viewDir = normalize(cameraPosition - vObjectPosition);
  vec3 reflected = reflect(-lightDir, normal);
  float specular = pow(max(dot(reflected, viewDir), 0.0), 72.0) * ocean;
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
  vec3 dayColor = pow(albedo, vec3(0.88));
  dayColor *= 0.34 + max(nDotL, 0.0) * 0.88;
  dayColor += vec3(0.62, 0.78, 0.92) * specular * 0.72;
  dayColor += vec3(0.02, 0.12, 0.22) * fresnel * ocean;

  // Sparse warm lights are visible only over land on the night side.
  float lightNoise = hash(floor(vUv * vec2(980.0, 490.0)));
  float settlements = smoothstep(0.965, 1.0, lightNoise) * (1.0 - ocean);
  settlements *= smoothstep(0.12, 0.48, albedo.r + albedo.g);
  vec3 nightColor = albedo * 0.018 + vec3(1.0, 0.44, 0.12) * settlements * 0.82;
  vec3 color = mix(nightColor, dayColor, daylight);
  if (showTerminator) {
    float line = 1.0 - smoothstep(0.0, 0.018, abs(nDotL));
    color += vec3(0.10, 0.38, 0.62) * line * 0.16;
  }
  gl_FragColor = vec4(color, 1.0);
}
