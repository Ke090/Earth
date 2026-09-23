import * as THREE from 'three'
import vertexShader from '../shaders/earth.vert.glsl?raw'
import fragmentShader from '../shaders/earth.frag.glsl?raw'

// NASA's cloud-free Blue Marble composite is the primary surface. Keeping the
// URL here (rather than baking it into the shader) also lets TextureLoader use
// the browser cache across visits.
const BLUE_MARBLE_TEXTURE =
  'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74393/world.200412.3x5400x2700.jpg'
const OFFLINE_TEXTURE = `${import.meta.env.BASE_URL}textures/earth-topography.svg`

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
  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')

  const applyTexture = (texture: THREE.Texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 16
    texture.minFilter = THREE.LinearMipmapLinearFilter
    uniforms.earthTexture.value.dispose()
    uniforms.earthTexture.value = texture
    uniforms.textureLoaded.value = true
  }

  // If the NASA host cannot be reached (for example while developing offline),
  // the local physical map is still preferable to an empty blue sphere.
  loader.load(BLUE_MARBLE_TEXTURE, applyTexture, undefined, () => {
    loader.load(OFFLINE_TEXTURE, applyTexture)
  })
  return {
    mesh,
    setSunDirection(direction) { uniforms.sunDirection.value.copy(direction) },
    setTerminator(visible) { uniforms.showTerminator.value = visible },
  }
}
