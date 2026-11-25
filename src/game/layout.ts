
import type { SignSpec } from './textures'

export { BOUNDS } from '../../shared/net/config'

export const BASE = 0.15
export const FH = 3.2

export type AABB = { min: [number, number, number]; max: [number, number, number] }

export type ShopSpec = {
  x: number
  w?: number
  d?: number
  floors: number
  wall: string
  sign: SignSpec
  front?: 'counter' | 'glass' | 'shutter'
  shutter: 'open' | 'half' | 'closed'
  goods: string[]
  balcony: boolean
  seed: number
}

export type BuildingSpec = {
  x: number
  z: number
  rot: number
  w: number
  d: number
  floors: number
  wall: string
  kind?: 'residential' | 'commercial' | 'mixed-use' | 'civic'
  trim?: string
  accent?: string
  stilt?: boolean
  balconies?: 'alt' | 'all' | 'none'
  tanks?: number
  mumty?: boolean
  seed: number
}

const HOME_ROOFS = ['parapet', 'tiles', 'terrace', 'stepped'] as const
const SHOP_ROOFS = ['parapet', 'cornice', 'shed'] as const
const SHOP_FRONTS = ['glass', 'counter', 'glass', 'shutter', 'counter'] as const
const ENTRANCES = ['left', 'centre', 'right'] as const
const GROUND_FLOORS = {
  residential: 'residential',
  commercial: 'glass',
  'mixed-use': 'shops',
  civic: 'portico',
} as const

export function shopFootprint({ w = 6, d = 8 }: Pick<ShopSpec, 'w' | 'd'>) {
  return { w, d }
}

export function shopArchitecture({ seed, front }: Pick<ShopSpec, 'seed' | 'front'>) {
  return {
    front: front ?? SHOP_FRONTS[seed % SHOP_FRONTS.length],
    roof: SHOP_ROOFS[Math.floor(seed / 2) % SHOP_ROOFS.length],
    entry: ENTRANCES[seed % ENTRANCES.length],
  }
}

export function buildingArchitecture({ seed, kind = 'residential' }: Pick<BuildingSpec, 'seed' | 'kind'>) {
  return {
    ground: GROUND_FLOORS[kind],
    roof: kind === 'residential' || kind === 'mixed-use' ? HOME_ROOFS[seed % HOME_ROOFS.length] : 'stepped',
    entry: ENTRANCES[Math.floor(seed / 2) % ENTRANCES.length],
    windowStyle: seed % 3,
    balconyPhase: Math.floor(seed / 3) % 2,
  } as const
}

export type TreeSpec = { x: number; z: number; s: number; seed: number; kind: 'rain' | 'gulmohar' }
