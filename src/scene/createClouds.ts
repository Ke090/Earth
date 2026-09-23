import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vObjectPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vObjectPosition = position;
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vObjectPosition;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0, amplitude = 0.52;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = mat2(1.62, 1.18, -1.18, 1.62) * p + 7.3;
      amplitude *= 0.48;
    }
    return value;
  }
  void main() {
    vec2 p = vec2(vUv.x * 7.0, vUv.y * 3.5);
    float broad = fbm(p + vec2(fbm(p * 1.7), fbm(p * 1.7 + 5.2)) * 0.9);
    float wisps = fbm(p * 3.1 + broad * 2.2);
    float coverage = smoothstep(0.54, 0.73, broad * 0.78 + wisps * 0.28);
    coverage *= smoothstep(0.0, 0.09, vUv.y) * smoothstep(1.0, 0.91, vUv.y);
    float lit = 0.22 + max(dot(normalize(vNormal), normalize(sunDirection)), 0.0) * 0.9;
    float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(cameraPosition - vObjectPosition)), 0.0), 2.4);
    vec3 cloud = mix(vec3(0.34, 0.39, 0.43), vec3(1.0, 0.98, 0.93), lit);
    gl_FragColor = vec4(cloud + vec3(0.18, 0.34, 0.50) * rim, coverage * (0.48 + lit * 0.38));
  }
`

export interface CloudObject {
  mesh: THREE.Mesh
  setSunDirection(direction: THREE.Vector3): void
}

export function createClouds(): CloudObject {
  const sunDirection = { value: new THREE.Vector3(0, 0, 1) }
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.012, 128, 64),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { sunDirection },
      transparent: true,
      depthWrite: false,
    }),
  )
  mesh.rotation.y = 0.22
  return { mesh, setSunDirection: direction => sunDirection.value.copy(direction) }
}
