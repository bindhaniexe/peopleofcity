
import { C } from '../../../lib/palette'
import { footprint, type Block, type BlockShop } from '../blocks'

const H = Math.PI / 2
const shop = (
  x: number, z: number, rot: number, title: string, odia: string, sub: string, wall: string, bg: string, seed: number,
): BlockShop => ({
  x, z, rot, floors: 2, wall, seed,
  sign: { title, odia, sub, bg, fg: '#FFF6E5' },
  balcony: seed % 2 === 0,
  shutter: seed % 3 === 0 ? 'half' : 'open',
  goods: [C.WALL_MINT, C.WALL_BUTTER, C.WALL_WHITE, C.WALL_SALMON],
})

export const CAMPUS = footprint(-12, 0, 23, 11)
export const CAMPUS_GATE = { x: -11, z: -12 }
export const MARUTI = footprint(37, -35, 12, 10)
export const INFOCITY = footprint(-22, 36, 22, 10)
export const INFOCITY_GATE = { x: -39, z: 18 }
export const KIIT_PORTAL = { x: 4, z: -7, face: Math.PI }

export const block: Block = {
  roads: [
    { x0: 14, x1: 28, z0: -46, z1: 46 },
    { x0: -46, x1: 46, z0: -26.5, z1: -19.5 },
    { x0: -46, x1: 14, z0: 20.5, z1: 27.5 },
  ],
  median: [
    { x0: 20.4, x1: 21.6, z0: -46, z1: -30 },
    { x0: 20.4, x1: 21.6, z0: -16, z1: 17 },
    { x0: 20.4, x1: 21.6, z0: 31, z1: 46 },
  ],
  paving: [
    { x0: -23, x1: 14, z0: -19.5, z1: -10 },
    { x0: -35, x1: -29, z0: -19.5, z1: 20.5 },
    { x0: -35, x1: -5, z0: 16.5, z1: 20.5 },
  ],
  lawns: [
    { x0: -46, x1: 7, z0: -16, z1: 20.5 },
    { x0: 32, x1: 46, z0: -15, z1: 18 },
  ],
  solids: [
    { rect: CAMPUS, height: 11 },
    { rect: MARUTI, height: 10 },
    { rect: INFOCITY, height: 12 },
    { rect: footprint(-21.5, CAMPUS_GATE.z, 15, 0.36), height: 2 },
    // The sidewalk opening on this side also leaves the portal's arrival camera clear.
    { rect: footprint(-3.5, CAMPUS_GATE.z, 10, 0.36), height: 2 },
    { rect: footprint(CAMPUS_GATE.x - 3, CAMPUS_GATE.z, 0.95, 0.9), height: 4.3 },
    { rect: footprint(CAMPUS_GATE.x + 3, CAMPUS_GATE.z, 0.95, 0.9), height: 4.3 },
    { rect: footprint(INFOCITY_GATE.x - 2.5, INFOCITY_GATE.z, 0.8, 0.8), height: 3.8 },
    { rect: footprint(INFOCITY_GATE.x + 2.5, INFOCITY_GATE.z, 0.8, 0.8), height: 3.8 },
  ],
  buildings: [
    { x: -39, z: -36, rot: 0, w: 11, d: 11, floors: 3, wall: C.WALL_WHITE, accent: C.TERRACOTTA, seed: 401 },
    { x: 8.5, z: 7, rot: H, w: 13, d: 9, floors: 3, wall: C.WALL_BUTTER, balconies: 'alt', seed: 402 },
    { x: 39, z: 32, rot: -H, w: 17, d: 10, floors: 3, wall: C.WALL_MINT, seed: 403 },
    { x: 6.5, z: 39, rot: Math.PI, w: 10, d: 9, floors: 3, wall: C.WALL_POWDER, seed: 404 },
    { x: -39, z: 37, rot: Math.PI, w: 9, d: 10, floors: 3, wall: C.WALL_WHITE, seed: 405 },
    { x: 36.5, z: -10, rot: -H, w: 10, d: 9, floors: 2, wall: C.WALL_SALMON, seed: 406 },
  ],
  shops: [
    shop(-25, -33.5, 0, 'PATIA CYCLE WORKS', 'ପଟିଆ ସାଇକେଲ ଦୋକାନ', 'REPAIRS · PARTS', C.WALL_MINT, '#30584F', 501),
    shop(-17, -33.5, 0, 'JUGAAD JN', 'ଜୁଗାଡ଼ ଜେଏନ୍', 'KIIT ROAD', C.WALL_SALMON, '#90462C', 502),
    shop(-9, -33.5, 0, 'CAMPUS CHA', 'କ୍ୟାମ୍ପସ ଚା', 'CHA · BARA', C.WALL_BUTTER, '#745126', 503),
    shop(-1, -33.5, 0, 'FIRSTCRY', 'ଫାର୍ଷ୍ଟକ୍ରାଇ', 'KIIT ROAD', C.WALL_POWDER, '#365687', 504),
    shop(-3, 34, Math.PI, 'INFOCITY TIFFIN', 'ଇନ୍‌ଫୋସିଟି ଜଳଖିଆ', 'DALMA · THALI', C.WALL_BUTTER, '#803D27', 505),
  ],
  trees: [
    { x: -36, z: -12, s: 1.05, seed: 601, kind: 'rain' },
    { x: -27, z: -4, s: 1.15, seed: 602, kind: 'rain' },
    { x: -37, z: 4, s: 0.85, seed: 603, kind: 'gulmohar' },
    { x: -26, z: 11, s: 0.94, seed: 604, kind: 'rain' },
    { x: -39, z: 9, s: 1.05, seed: 605, kind: 'rain' },
    { x: -10, z: 12, s: 1.22, seed: 606, kind: 'rain' },
    { x: 32, z: 1, s: 0.85, seed: 607, kind: 'gulmohar' },
    { x: 34, z: 14, s: 1.4, seed: 608, kind: 'rain' },
  ],
  crossings: [
    { x: 21, z: -28.4, width: 13, rot: 0 },
    { x: 21, z: 29.3, width: 13, rot: 0 },
    { x: 10, z: -23, width: 6.5, rot: H },
    { x: 10, z: 24, width: 6.5, rot: H },
  ],
  lanes: [
    { x: 16.8, z: -36, length: 17, rot: H }, { x: 25.2, z: -36, length: 17, rot: H },
    { x: 16.8, z: 0, length: 30, rot: H }, { x: 25.2, z: 0, length: 30, rot: H },
    { x: 16.8, z: 38, length: 15, rot: H }, { x: 25.2, z: 38, length: 15, rot: H },
    { x: -19, z: -23, length: 50, rot: 0 }, { x: -19, z: 24, length: 50, rot: 0 },
  ],
  signs: [
    { x: 11.8, z: -17.6, rot: Math.PI, title: 'KIIT SQUARE', odia: 'କିଟ୍ ଛକ', sub: 'KIIT ROAD · NANDANKANAN ROAD' },
    { x: 11.8, z: 18.4, rot: 0, title: 'PATIA SQUARE', odia: 'ପଟିଆ ଛକ', sub: '← INFOCITY ROAD' },
  ],
  poleRuns: [[[29.5, -37, -1, 0], [29.5, -14, -1, 0], [29.5, 12, -1, 0], [29.5, 36, -1, 0]], [[-40, 19.4, 0, 1], [-19, 19.4, 0, 1], [1, 19.4, 0, 1]]],
  stops: [
    { x: 31, z: -16, rot: -H, title: 'KIIT SQUARE', odia: 'କିଟ୍ ଛକ', sub: 'PATIA SQUARE · INFOCITY' },
  ],
}
