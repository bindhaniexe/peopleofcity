
import { C } from '../../../lib/palette'
import { footprint, type Block, type BlockShop } from '../blocks'

const H = Math.PI / 2
const shop = (
  x: number, z: number, rot: number, title: string, odia: string, sub: string,
  wall: string, bg: string, seed: number, floors = 2, upperSign = false,
): BlockShop => ({
  x, z, rot, floors, wall, seed, upperSign,
  sign: { title, odia, sub, bg, fg: '#FFF6E5' },
  balcony: seed % 2 === 0,
  shutter: seed % 3 === 0 ? 'half' : 'open',
  goods: [C.WALL_BUTTER, C.WALL_POWDER, C.TERRACOTTA, C.WALL_WHITE],
})

export const MALL = footprint(23, 11, 18, 12)
export const UNIVERSITY = footprint(-36, -31, 12, 19)
export const RUPALI_PORTAL = { x: 0, z: -34, face: 0 }

export const block: Block = {
  roads: [
    { x0: -24, x1: -12, z0: -46, z1: 46 },
    { x0: -12, x1: 46, z0: -21.5, z1: -14.5 },
    { x0: -12, x1: 46, z0: 20.5, z1: 27.5 },
  ],
  paving: [
    { x0: -12, x1: 7, z0: -39, z1: -21.5 },
    { x0: 33, x1: 39, z0: -14.5, z1: 20.5 },
    { x0: 10, x1: 33, z0: 17, z1: 20.5 },
  ],
  lawns: [
    { x0: -46, x1: -28, z0: -46, z1: -19 },
    { x0: 30, x1: 46, z0: -12, z1: 20.5 },
  ],
  solids: [
    { rect: MALL, height: 15 },
    { rect: UNIVERSITY, height: 9 },
  ],
  buildings: [
    { x: -36, z: -6, rot: H, w: 14, d: 11, floors: 3, wall: C.WALL_BUTTER, seed: 101 },
    { x: -37, z: 13, rot: H, w: 14, d: 12, floors: 3, wall: C.WALL_POWDER, balconies: 'all', seed: 102 },
    { x: -34, z: 35, rot: H, w: 14, d: 13, floors: 3, wall: C.WALL_MINT, seed: 103 },
    { x: 5, z: 36, rot: Math.PI, w: 21, d: 10, floors: 3, wall: C.WALL_SALMON, accent: C.WALL_WHITE, balconies: 'alt', seed: 104 },
    { x: 31, z: 37, rot: Math.PI, w: 20, d: 10, floors: 2, wall: C.WALL_BUTTER, seed: 105 },
    { x: 44, z: -31, rot: 0, w: 7, d: 12, floors: 3, wall: C.WALL_MINT, seed: 106 },
    { x: 17, z: -42, rot: 0, w: 20, d: 7, floors: 3, wall: C.WALL_PINK, seed: 107 },
    { x: 29, z: -6, rot: Math.PI, w: 7, d: 9, floors: 2, wall: C.WALL_POWDER, seed: 108 },
  ],
  shops: [
    shop(-5, -42, -H, 'PANTALOONS', 'ପାଣ୍ଟାଲୁନ୍ସ', 'JANPATH', C.WALL_WHITE, '#285D58', 202, 3),
    shop(-5, 9, -H, 'KHIMJI DHANLAXMI', 'ଖିମଜି ଧନଲକ୍ଷ୍ମୀ', 'JEWELLERY', C.WALL_BUTTER, '#873D3E', 203, 3),
    shop(1, -7.5, Math.PI, 'HOUSE OF PATTACHITRA', 'ପଟ୍ଟଚିତ୍ର', 'ANUJ TIME SQUARE · THIRD FLOOR', C.WALL_MINT, '#7D4230', 204, 4, true),
    shop(13, -30, 0, 'RUPALI BARA & GHUGUNI', 'ରୂପାଲି ବରା ଓ ଘୁଗୁନି', 'HOT SNACKS · CHA', C.WALL_BUTTER, '#A53C28', 205),
    shop(21, -30, 0, 'SAHI CHHENA PODA', 'ସାହି ଛେନାପୋଡ଼', 'ODIA SWEETS', C.WALL_PINK, '#763B36', 206),
    shop(6, 13.5, 0, 'JANPATH PRINT & BIND', 'ଜନପଥ ପ୍ରିଣ୍ଟ ଓ ବାଇଣ୍ଡ', 'COPIES · POSTERS', C.WALL_POWDER, '#364F70', 207, 3),
  ],
  trees: [
    { x: -28, z: -22, s: 1.05, seed: 301, kind: 'rain' },
    { x: -28, z: 7, s: 1.08, seed: 302, kind: 'rain' },
    { x: -28, z: 30, s: 0.9, seed: 303, kind: 'gulmohar' },
    { x: 7.5, z: -35, s: 0.87, seed: 304, kind: 'gulmohar' },
    { x: 31, z: -26, s: 0.95, seed: 305, kind: 'rain' },
    { x: 40.5, z: -8, s: 1.15, seed: 306, kind: 'rain' },
    { x: 41, z: 8, s: 0.95, seed: 307, kind: 'gulmohar' },
    { x: 42, z: 17, s: 1.05, seed: 308, kind: 'rain' },
    { x: 11, z: 17, s: 0.75, seed: 309, kind: 'gulmohar' },
  ],
  crossings: [
    { x: -18, z: -24, width: 11, rot: 0 },
    { x: -18, z: 18, width: 11, rot: 0 },
    { x: -7, z: -18, width: 6.3, rot: H },
    { x: -7, z: 24, width: 6.3, rot: H },
  ],
  lanes: [
    { x: -18, z: -36, length: 19, rot: H },
    { x: -18, z: -2, length: 30, rot: H },
    { x: -18, z: 37, length: 17, rot: H },
    { x: 20, z: -18, length: 43, rot: 0 },
    { x: 20, z: 24, length: 43, rot: 0 },
  ],
  signs: [
    { x: -10.2, z: -25, rot: 0, title: 'RUPALI SQUARE', odia: 'ରୂପାଲି ଛକ', sub: 'JANPATH · VANI VIHAR ↑' },
    { x: 32, z: -22.6, rot: 0, title: 'RUPALI STREET', odia: 'ରୂପାଲି ସାହି ରାସ୍ତା' },
    { x: 35, z: 18.7, rot: 0, title: 'MAHARISHI COLLEGE ROAD', odia: 'ମହର୍ଷି କଲେଜ ରାସ୍ତା' },
  ],
  poleRuns: [[[-10.8, -30, -1, 0], [-10.8, -9, -1, 0], [-10.8, 13, -1, 0], [-10.8, 33, -1, 0]], [[10, -22.5, 0, 1], [21, -22.5, 0, 1], [38, -22.5, 0, 1]]],
  stops: [
    { x: -26, z: -8, rot: H, title: 'RUPALI SQUARE', odia: 'ରୂପାଲି ଛକ', sub: 'VANI VIHAR · JANPATH' },
  ],
}
