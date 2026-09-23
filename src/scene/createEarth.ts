import * as THREE from 'three'
import vertexShader from '../shaders/earth.vert.glsl?raw'
import fragmentShader from '../shaders/earth.frag.glsl?raw'

export interface EarthObject {
  mesh: THREE.Mesh
  setSunDirection(direction: THREE.Vector3): void
  setTerminator(visible: boolean): void
}

export function createEarth(): EarthObject {
  const uniforms = {
    earthTexture: { value: new THREE.Texture() },
    sunDirection: { value: new THREE.Vector3(0, 0, 1) },
    showTerminator: { value: true },
    textureLoaded: { value: false },
  }
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 64), material)
  new THREE.TextureLoader().load(
    `${import.meta.env.BASE_URL}textures/earth-topography.svg`,
    texture => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 16
      texture.minFilter = THREE.LinearMipmapLinearFilter
      uniforms.earthTexture.value = texture
      uniforms.textureLoaded.value = true
    },
  )
  return {
    mesh,
    setSunDirection(direction) { uniforms.sunDirection.value.copy(direction) },
    setTerminator(visible) { uniforms.showTerminator.value = visible },
  }
}
