import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createAtmosphere } from './createAtmosphere'
import { createClouds } from './createClouds'
import { createEarth } from './createEarth'
import { createGrid } from './createGrid'

export function createScene(container: HTMLElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0.15, 0.25, 3.35)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  container.append(renderer.domElement)
  const earth = createEarth()
  const clouds = createClouds()
  scene.add(earth.mesh, clouds.mesh, createAtmosphere())
  const { grid, equator } = createGrid()
  scene.add(grid, equator)
  const sunArrow = new THREE.Group()
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1.65, 0xffd678, 0.15, 0.08)
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd787 }))
  sunArrow.add(arrow, sun)
  sunArrow.visible = false
  scene.add(sunArrow)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false
  controls.minDistance = 2.05
  controls.maxDistance = 5.3
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.18
  controls.addEventListener('start', () => { controls.autoRotate = false })

  function setSunDirection(direction: THREE.Vector3) {
    earth.setSunDirection(direction)
    clouds.setSunDirection(direction)
    arrow.setDirection(direction)
    sun.position.copy(direction).multiplyScalar(1.72)
  }
  function resize() {
    const width = container.clientWidth, height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }
  new ResizeObserver(resize).observe(container)
  resize()
  let frame = 0
  const render = () => { frame = requestAnimationFrame(render); controls.update(); renderer.render(scene, camera) }
  render()
  return { earth, grid, equator, sunArrow, setSunDirection, dispose: () => cancelAnimationFrame(frame) }
}
