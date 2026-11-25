
import { BASE, BOUNDS, shopFootprint, type AABB, type BuildingSpec, type ShopSpec, type TreeSpec } from '../layout'
import type { DistrictDef, Surface } from './active'

export type Rect = { x0: number; x1: number; z0: number; z1: number }
export type BlockShop = ShopSpec & { z: number; rot: number; upperSign?: boolean }
export type Fixture = { x: number; z: number; rot: number; title: string; odia: string; sub?: string }

export type Block = {
  roads: Rect[]
  paving: Rect[]
  lawns: Rect[]
  median?: Rect[]
  buildings: BuildingSpec[]
  shops: BlockShop[]
  solids: { rect: Rect; height: number }[]
  trees: TreeSpec[]
  crossings: { x: number; z: number; width: number; rot: number }[]
  lanes: { x: number; z: number; length: number; rot: number }[]
  signs: Fixture[]
  stops: Fixture[]
  poleRuns: [number, number, number, number][][]
}

export const districtRect = { x0: -BOUNDS, x1: BOUNDS, z0: -BOUNDS, z1: BOUNDS }
export const footprint = (x: number, z: number, w: number, d: number, rot = 0): Rect => {
  const swapped = Math.abs(Math.sin(rot)) > 0.5
  const hx = (swapped ? d : w) / 2
  const hz = (swapped ? w : d) / 2
  return { x0: x - hx, x1: x + hx, z0: z - hz, z1: z + hz }
}

export const contains = ({ x0, x1, z0, z1 }: Rect, x: number, z: number) => x >= x0 && x < x1 && z >= z0 && z < z1
const inAny = (rects: Rect[], x: number, z: number) => rects.some((rect) => contains(rect, x, z))
const collider = (rect: Rect, height: number): AABB => ({
  min: [rect.x0, 0, rect.z0],
  max: [rect.x1, height, rect.z1],
})

export function blockSurface(block: Block, x: number, z: number): Exclude<Surface, 'kota'> {
  if (block.median && inAny(block.median, x, z)) return 'grass'
  if (inAny(block.roads, x, z)) return 'asphalt'
  if (inAny(block.paving, x, z)) return 'pavers'
  return inAny(block.lawns, x, z) ? 'grass' : 'pavers'
}

export const heightOf = (block: Block, x: number, z: number) => {
  if (block.median && inAny(block.median, x, z)) return BASE + 0.06
  return blockSurface(block, x, z) === 'asphalt' ? 0 : BASE
}

/** Partition the ground at authored edges so roads, footpaths and walking surfaces agree. */
export function groundTiles(block: Block, bounds = districtRect) {
  const zones = [bounds, ...block.roads, ...block.paving, ...block.lawns, ...(block.median ?? [])]
  const xs = [...new Set(zones.flatMap(({ x0, x1 }) => [x0, x1]))].filter((x) => x >= bounds.x0 && x <= bounds.x1).sort((a, b) => a - b)
  const zs = [...new Set(zones.flatMap(({ z0, z1 }) => [z0, z1]))].filter((z) => z >= bounds.z0 && z <= bounds.z1).sort((a, b) => a - b)
  return xs.slice(1).flatMap((x1, i) => zs.slice(1).map((z1, j) => {
    const x0 = xs[i]
    const z0 = zs[j]
    const x = (x0 + x1) / 2
    const z = (z0 + z1) / 2
    return { rect: { x0, x1, z0, z1 }, surface: blockSurface(block, x, z), height: heightOf(block, x, z) }
  }))
}

export function blockColliders(block: Block): AABB[] {
  return [
    ...block.buildings.map((b) => collider(footprint(b.x, b.z, b.w, b.d, b.rot), 30)),
    ...block.shops.map((s) => {
      const { w, d } = shopFootprint(s)
      return collider(footprint(s.x, s.z, w, d, s.rot), 14)
    }),
    ...block.solids.map(({ rect, height }) => collider(rect, height)),
    ...block.trees.map(({ x, z, s }) => collider(footprint(x, z, s * 0.65, s * 0.65), 4)),
    ...block.signs.map(({ x, z }) => collider(footprint(x, z, 0.12, 0.12), 2.65)),
    ...block.poleRuns.flat().map(([x, z]) => collider(footprint(x, z, 0.28, 0.28), 8.4)),
    ...block.stops.map(({ x, z, rot }) => collider(footprint(x - Math.sin(rot) * 0.75, z - Math.cos(rot) * 0.75, 4.2, 0.35, rot), 2.7)),
  ]
}

export function buildDistrict(block: Block, def: Omit<DistrictDef, 'colliders' | 'ground' | 'surface' | 'trees'>): DistrictDef {
  const { portal } = def
  const trees = block.trees.map(({ x, z }) => ({ x, z }))
  const colliders = [...blockColliders(block), ...[-2.45, 2.45].map((offset) => collider(footprint(
    portal.x + Math.cos(portal.face) * offset, portal.z - Math.sin(portal.face) * offset, 1, 1,
  ), 6))]
  return {
    ...def,
    colliders,
    trees,
    ground: (x, z) => heightOf(block, x, z) + (Math.hypot(x - portal.x, z - portal.z) < 3.4 ? 0.1 : 0),
    surface: (x, z) => Math.hypot(x - portal.x, z - portal.z) < 3.4 ? 'kota' : blockSurface(block, x, z),
  }
}
