import { Vector3 } from 'three'

export const degreesToRadians = (degrees: number) => degrees * Math.PI / 180

export function normalizeLongitude(degrees: number): number {
  return ((degrees + 180) % 360 + 360) % 360 - 180
}

/** Converts geographic coordinates to our Earth-fixed frame (+Y north, +Z Greenwich). */
export function geoToVector(latitude: number, longitude: number): Vector3 {
  const lat = degreesToRadians(latitude)
  const lon = degreesToRadians(longitude)
  const radius = Math.cos(lat)
  return new Vector3(radius * Math.sin(lon), Math.sin(lat), radius * Math.cos(lon)).normalize()
}
