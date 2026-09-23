import { Body, GeoVector, RotateVector, Rotation_EQJ_EQD, SiderealTime } from 'astronomy-engine'
import { Vector3 } from 'three'
import { geoToVector, normalizeLongitude } from './coordinates'

export interface SunPosition {
  latitude: number
  longitude: number
  direction: Vector3
}

export function calculateSunPosition(date: Date): SunPosition {
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date')
  const eqj = GeoVector(Body.Sun, date, true)
  const eqd = RotateVector(Rotation_EQJ_EQD(date), eqj)
  const radius = Math.hypot(eqd.x, eqd.y, eqd.z)
  const rightAscension = Math.atan2(eqd.y, eqd.x) * 180 / Math.PI
  const latitude = Math.asin(eqd.z / radius) * 180 / Math.PI
  const longitude = normalizeLongitude(rightAscension - SiderealTime(date) * 15)
  return { latitude, longitude, direction: geoToVector(latitude, longitude) }
}
