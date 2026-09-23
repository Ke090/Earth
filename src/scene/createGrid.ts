import * as THREE from 'three'

function geographicPoint(latitude: number, longitude: number, radius = 1.006): THREE.Vector3 {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)
  return new THREE.Vector3(Math.cos(lat) * Math.sin(lon) * radius, Math.sin(lat) * radius, Math.cos(lat) * Math.cos(lon) * radius)
}

function line(points: THREE.Vector3[], opacity: number): THREE.Line {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x73c8ff, transparent: true, opacity }))
}

export function createGrid(): { grid: THREE.Group; equator: THREE.Line } {
  const grid = new THREE.Group()
  for (let lat = -60; lat <= 60; lat += 30) grid.add(line(Array.from({ length: 121 }, (_, i) => geographicPoint(lat, i * 3 - 180)), 0.24))
  for (let lon = -150; lon <= 180; lon += 30) grid.add(line(Array.from({ length: 61 }, (_, i) => geographicPoint(i * 3 - 90, lon)), 0.2))
  const equator = line(Array.from({ length: 181 }, (_, i) => geographicPoint(0, i * 2 - 180, 1.009)), 0.8)
  ;(equator.material as THREE.LineBasicMaterial).color.set(0x62e6ff)
  grid.visible = false
  equator.visible = false
  return { grid, equator }
}
