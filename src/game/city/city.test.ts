import { afterEach, describe, expect, it } from 'vitest'
import '../districts'
import { active, activateDistrict } from '../districts/active'
import { findPath } from '../nav'
import { WALK, RUN } from '../../../shared/net/config'
import { CITY_BUS_PATH, CITY_BUS_STOPS, CITY_PLACES, CITY_SPINE } from './layout'
import { activateConnectedCity, cityAreaAt, citySpawn } from './runtime'
import { busTrip, ridePose } from './transit'
import { walkingDirections } from './walkingDirections'

afterEach(() => activateDistrict('saheed-nagar'))

describe('connected Bhubaneswar', () => {
  it('joins the existing neighbourhoods and new destinations without a scene swap', () => {
    activateConnectedCity()
    const rupali = citySpawn('saheed-nagar')
    for (const place of CITY_PLACES) {
      const [x, z] = place.point
      expect(cityAreaAt(x, z), place.label).toBe(place.area)
      expect(active.def.contains?.(x, z), place.label).toBe(true)
      expect(findPath(rupali.x, rupali.z, x, z)?.length, place.label).toBeGreaterThanOrEqual(2)
    }
    expect(active.def.id).toBe('bhubaneswar')
  })

  it('keeps the authored walking corridor within the agreed walking time', () => {
    const metres = CITY_SPINE.slice(1).reduce((total, [x, z], i) => {
      const [startX, startZ] = CITY_SPINE[i]
      return total + Math.hypot(x - startX, z - startZ)
    }, 0)
    expect(metres / WALK).toBeGreaterThanOrEqual(120)
    expect(metres / WALK).toBeLessThanOrEqual(180)
  })

  it('guides people through the real junction sequence on cross-city walks', () => {
    activateConnectedCity()
    const route = walkingDirections(CITY_SPINE[0], CITY_SPINE[CITY_SPINE.length - 1])!
    expect(route).toContainEqual([-52, -97]) // Jayadev Vihar
    expect(route).toContainEqual([26, -97]) // Vani Vihar
    expect(route).toContainEqual([28, 113]) // Raj Mahal
    expect(route).toContainEqual([55, 113]) // Kalpana
  })

  it('keeps the bus road path on connected asphalt across section boundaries', () => {
    activateConnectedCity()
    for (let i = 1; i < CITY_BUS_PATH.length; i++) {
      const [x, z] = CITY_BUS_PATH[i - 1]
      const [nextX, nextZ] = CITY_BUS_PATH[i]
      const steps = Math.ceil(Math.hypot(nextX - x, nextZ - z))
      for (let j = 0; j < steps; j++) {
        const part = j / steps
        expect(active.def.surface(x + (nextX - x) * part, z + (nextZ - z) * part)).toBe('asphalt')
      }
    }
  })

  it('boards and disembarks at reachable curbs and rides both ways at normal movement speed', () => {
    activateConnectedCity()
    const rupali = citySpawn('saheed-nagar')
    for (const from of CITY_BUS_STOPS) {
      expect(findPath(rupali.x, rupali.z, ...from.point)?.length, from.label).toBeGreaterThan(0)
      expect(busTrip(from.id, from.id)).toBeNull()
      for (const to of CITY_BUS_STOPS.filter((stop) => stop.id !== from.id)) {
        const trip = busTrip(from.id, to.id)!
        expect(ridePose(trip, 0).point).toEqual(from.point)
        expect(ridePose(trip, trip.length).point).toEqual(to.point)
        const early = ridePose(trip, RUN * 0.1).point
        expect(Math.hypot(early[0] - from.point[0], early[1] - from.point[1])).toBeLessThanOrEqual(RUN * 0.1 + 0.01)
      }
    }
  })
})
