
import type { SignSpec } from './textures'

export { BOUNDS } from '../../shared/net/config'

export const BASE = 0.15
export const FH = 3.2

export type AABB = { min: [number, number, number]; max: [number, number, number] }

export type ShopSpec = {
  x: number
  floors: number
  wall: string
  sign: SignSpec
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
  trim?: string
  accent?: string
  stilt?: boolean
  balconies?: 'alt' | 'all' | 'none'
  tanks?: number
  mumty?: boolean
  seed: number
}

export type TreeSpec = { x: number; z: number; s: number; seed: number; kind: 'rain' | 'gulmohar' }
