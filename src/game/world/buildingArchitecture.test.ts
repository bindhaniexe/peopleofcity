import { describe, expect, it } from 'vitest'
import { buildingArchitecture, shopArchitecture, shopFootprint } from '../layout'

describe('Bhubaneswar façades', () => {
  it('gives the existing residential row stable architectural differences', () => {
    const addresses = Array.from({ length: 8 }, (_, index) => ({ seed: 101 + index }))
    const profiles = addresses.map(buildingArchitecture)

    expect(addresses.map(buildingArchitecture)).toEqual(profiles)
    expect(new Set(profiles.map(({ roof }) => roof)).size).toBeGreaterThan(1)
    expect(new Set(profiles.map(({ entry }) => entry)).size).toBeGreaterThan(1)
    expect(new Set(profiles.map((profile) => JSON.stringify(profile))).size).toBe(profiles.length)
  })

  it('uses different street-level architecture for homes, offices and civic buildings', () => {
    expect(buildingArchitecture({ seed: 101 }).ground).toBe('residential')
    expect(buildingArchitecture({ seed: 101, kind: 'commercial' }).ground).toBe('glass')
    expect(buildingArchitecture({ seed: 101, kind: 'mixed-use' }).ground).toBe('shops')
    expect(buildingArchitecture({ seed: 101, kind: 'civic' }).ground).toBe('portico')
  })

  it('preserves authored storefronts and the original default collision footprint', () => {
    expect(shopFootprint({})).toEqual({ w: 6, d: 8 })
    expect(shopFootprint({ w: 4.5, d: 6 })).toEqual({ w: 4.5, d: 6 })
    expect(shopArchitecture({ seed: 202, front: 'counter' }).front).toBe('counter')
    expect(shopArchitecture({ seed: 202, front: 'glass' }).front).toBe('glass')
    expect(shopArchitecture({ seed: 202, front: 'shutter' }).front).toBe('shutter')
    const profiles = Array.from({ length: 6 }, (_, index) => shopArchitecture({ seed: 202 + index }))
    expect(new Set(profiles.map(({ front }) => front)).size).toBe(3)
    expect(new Set(profiles.map(({ roof }) => roof)).size).toBeGreaterThan(1)
  })
})
