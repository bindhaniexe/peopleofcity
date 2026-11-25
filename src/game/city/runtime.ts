import '../districts'
import { activateDistrict, getDistrict, registerDistrict, type DistrictDef, type Pose, type Spot } from '../districts/active'
import { blockColliders, blockSurface, contains, heightOf } from '../districts/blocks'
import { districtInfo, homeArea } from '../districts/registry'
import { BASE, type AABB } from '../layout'
import { CITY_PLACES, CITY_SECTIONS, type CityArea, type CitySection } from './layout'

type Section = CitySection & { worldBounds: CitySection['bounds'] }

export const citySections: Section[] = CITY_SECTIONS.map((section) => {
  const [x, z] = section.origin
  const { x0, x1, z0, z1 } = section.bounds
  return { ...section, worldBounds: { x0: x0 + x, x1: x1 + x, z0: z0 + z, z1: z1 + z } }
})

export const cityBounds = {
  x0: Math.min(...citySections.map(({ worldBounds }) => worldBounds.x0)),
  x1: Math.max(...citySections.map(({ worldBounds }) => worldBounds.x1)),
  z0: Math.min(...citySections.map(({ worldBounds }) => worldBounds.z0)),
  z1: Math.max(...citySections.map(({ worldBounds }) => worldBounds.z1)),
}

export const citySectionAt = (x: number, z: number) => citySections.find((section) => contains(section.worldBounds, x, z))
export const cityAreaAt = (x: number, z: number) => citySectionAt(x, z)?.area

function legacySection(area: CityArea) {
  return area === 'patia' || area === 'saheed-nagar' ? citySections.find((s) => s.id === area) : undefined
}

export function cityPose(area: CityArea, pose: Pose) {
  const origin = legacySection(area)?.origin
  return origin ? { ...pose, x: pose.x + origin[0], z: pose.z + origin[1] } : pose
}

export function citySpawn(area: CityArea): Pose {
  if (area === 'patia' || area === 'saheed-nagar') return cityPose(area, getDistrict(area).spawn)
  const place = CITY_PLACES.find((item) => item.area === area)
  return place ? { x: place.point[0], z: place.point[1], face: 0 } : citySpawn('saheed-nagar')
}

export function citySpots(location: string): Record<string, Spot> {
  const area = homeArea(location)
  if (area === 'patia' || area === 'saheed-nagar') {
    return Object.fromEntries(Object.entries(getDistrict(area).spots).map(([id, spot]) => [id, {
      ...spot,
      slots: spot.slots.map(([x, z, face]) => {
        const p = cityPose(area, { x, z, face })
        return [p.x, p.z, face]
      }),
    }]))
  }
  const local = CITY_PLACES.filter((place) => place.area === area)
  return Object.fromEntries(local.map(({ id, label, point: [x, z] }) => [id, { label, blurb: 'On the street nearby', slots: [[x, z, 0]] }]))
}

const landmarks = CITY_PLACES.map(({ point: [x, z], label }) => ({ x, z, r: 10, label: label.toUpperCase() }))

export function cityLabelAt(x: number, z: number) {
  const area = cityAreaAt(x, z)
  if (!area) return 'BHUBANESWAR'
  return landmarks.find((place) => Math.hypot(place.x - x, place.z - z) < place.r)?.label ?? districtInfo(area).title
}

export function activateConnectedCity() {
  if (!getDistrict('bhubaneswar')) registerDistrict(buildCity())
  activateDistrict('bhubaneswar')
}

function buildCity(): DistrictDef {
  const spawn = citySpawn('saheed-nagar')
  const residents = ['saheed-nagar', 'patia'] as const
  const moveTuple = ([x, y, z]: [number, number, number], [dx, dz]: readonly number[]): [number, number, number] =>
    [x + dx, y, z + dz]
  const colliders = citySections.flatMap(({ block, origin, water }) => {
    const obstacles = blockColliders(block)
    for (const { x0, x1, z0, z1 } of water ?? []) {
      obstacles.push({ min: [x0, 0, z0], max: [x1, 1.7, z1] })
    }
    return obstacles.map(({ min, max }): AABB => ({ min: moveTuple(min, origin), max: moveTuple(max, origin) }))
  })
  return {
    id: 'bhubaneswar',
    area: 'BHUBANESWAR',
    bounds: cityBounds,
    contains: (x, z) => !!citySectionAt(x, z),
    colliders,
    ground: (x, z) => {
      const section = citySectionAt(x, z)
      return section ? heightOf(section.block, x - section.origin[0], z - section.origin[1]) : BASE
    },
    surface: (x, z) => {
      const section = citySectionAt(x, z)
      return section ? blockSurface(section.block, x - section.origin[0], z - section.origin[1]) : 'pavers'
    },
    landmarks,
    spawn,
    arrival: spawn,
    portal: spawn,
    spots: {},
    trees: citySections.flatMap(({ block, origin: [x, z] }) => block.trees.map((tree) => ({ x: x + tree.x, z: z + tree.z }))),
    breaks: residents.flatMap((area) => getDistrict(area).breaks.map((pose) => cityPose(area, pose))),
    streetAudio: residents.flatMap((area) => getDistrict(area).streetAudio.map(({ kind, x, z }) => ({ kind, ...cityPose(area, { x, z, face: 0 }) }))),
    radio: [spawn.x + 13, 2.2, spawn.z + 1.5],
    orbit: [spawn.x + 5, 2.8, spawn.z + 6.5],
  }
}
