import { describe, expect, it } from 'vitest'
import { geoToVector, normalizeLongitude } from './coordinates'

describe('geographic coordinates', () => {
  it('maps the north pole to +Y', () => expect(geoToVector(90, 0).y).toBeCloseTo(1))
  it('maps Greenwich to +Z', () => expect(geoToVector(0, 0).z).toBeCloseTo(1))
  it('normalizes longitude', () => expect(normalizeLongitude(270)).toBe(-90))
})
