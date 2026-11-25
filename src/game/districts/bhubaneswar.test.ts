import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { BOUNDS, ROOM_DISTRICTS, parseRoom, roomName } from '../../../shared/net/config'
import { activateDistrict, active, getDistrict } from './active'
import { DISTRICTS, districtForSearch, homeDistrict, placeLabel } from './registry'
import { samplePeople } from '../people/profiles'
import { rayDistance } from '../player/collision'
import { findPath } from '../nav'
import './index'

describe('Bhubaneswar districts', () => {
  it('starts in Saheed Nagar and registers exactly the built districts as live rooms', () => {
    expect(active.def.id).toBe('saheed-nagar')
    expect(DISTRICTS.filter((district) => district.built).map((district) => district.id)).toEqual(['saheed-nagar', 'patia', 'old-town', 'unit-ii', 'jayadev-vihar'])
    expect(ROOM_DISTRICTS).toEqual(['saheed-nagar', 'patia'])
    for (const district of ROOM_DISTRICTS) {
      expect(parseRoom(roomName(district, 2))).toEqual({ district, shard: 2 })
    }
    expect(parseRoom('koramangala#1')).toBeNull()
    expect(parseRoom('saheed-nagar#0')).toBeNull()
  })

  it('preserves legacy locations while routing visitors to Saheed Nagar', () => {
    expect(homeDistrict('Patia')).toBe('patia')
    expect(homeDistrict('SAHID NAGAR')).toBe('saheed-nagar')
    expect(homeDistrict('Old Town')).toBe('saheed-nagar')
    expect(homeDistrict('HSR Layout')).toBe('saheed-nagar')
    expect(placeLabel('HSR Layout')).toBe('HSR Layout, Bengaluru')
    expect(placeLabel('Nayapalli')).toBe('Nayapalli, Bhubaneswar')
    expect(placeLabel('@Cuttack')).toBe('Cuttack')
    expect(districtForSearch('Saheed Nagar', 'patia')).toBe('patia')
    expect(districtForSearch('Patia', 'retired-room')).toBe('patia')
  })

  it('keeps the follow camera clear on arrival in each district', () => {
    for (const id of ROOM_DISTRICTS) {
      activateDistrict(id)
      const { x, z, face } = active.def.arrival
      const yaw = face + Math.PI
      const shoulder = new Vector3(x + Math.cos(yaw) * 0.55, active.def.ground(x, z) + 1.5, z - Math.sin(yaw) * 0.55)
      const direction = new Vector3(Math.sin(yaw) * Math.cos(0.18), Math.sin(0.18), Math.cos(yaw) * Math.cos(0.18))
      expect(rayDistance(shoulder, direction, 4.3), id).toBe(4.3)
    }
    activateDistrict('saheed-nagar')
  })

  it('connects each arrival to the portal and every resident slot', () => {
    for (const id of ROOM_DISTRICTS) {
      activateDistrict(id)
      const district = getDistrict(id)
      const samples = samplePeople().filter((person) => homeDistrict(person.location) === id)
      const residentSlots = Object.values(district.spots).flatMap((spot) => spot.slots)
      for (const { spot } of samples) {
        expect(spot).toBeDefined()
        expect(residentSlots.every(([x, z]) => Math.hypot(x - spot!.x, z - spot!.z) > 2)).toBe(true)
      }
      const destinations = [
        [district.spawn.x, district.spawn.z],
        [district.arrival.x, district.arrival.z],
        [district.portal.x, district.portal.z],
        ...residentSlots,
        ...samples.map(({ spot }) => [spot!.x, spot!.z]),
      ]
      for (const [x, z] of destinations) {
        expect(Math.abs(x)).toBeLessThan(BOUNDS)
        expect(Math.abs(z)).toBeLessThan(BOUNDS)
        expect(district.colliders.some(({ min, max }) =>
          min[1] < 1.6 && max[1] > 0.3 && x > min[0] - 0.45 && x < max[0] + 0.45 && z > min[2] - 0.45 && z < max[2] + 0.45,
        ), `${id} (${x}, ${z})`).toBe(false)
        expect(findPath(district.spawn.x, district.spawn.z, x, z)).not.toBeNull()
      }
    }
  })
})
