import * as THREE from 'three'

export function createAtmosphere(): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(1.035, 96, 48),
    new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vNormal; void main(){ float rim=pow(1.0-abs(vNormal.z),3.0); gl_FragColor=vec4(0.12,0.55,1.0,rim*0.65); }`,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    }),
  )
}
