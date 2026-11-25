import { C } from '../../lib/palette'
import { footprint, type Block, type BlockShop, type Fixture, type Rect } from '../districts/blocks'
import type { BuildingSpec, TreeSpec } from '../layout'
import type { CityLandmark } from '../world/CityLandmark'
import type { CityArea, CitySection } from './layout'

const EAST = Math.PI / 2
const WEST = -EAST
const NORTH = Math.PI
const SOUTH = 0

const rect = (x0: number, x1: number, z0: number, z1: number): Rect => ({ x0, x1, z0, z1 })

const cross = (x: number, z: number, width: number, rot = SOUTH) => ({ x, z, width, rot })
const lane = (x: number, z: number, length: number, rot = SOUTH) => ({ x, z, length, rot })
const tree = (x: number, z: number, seed: number, s = 1): TreeSpec => ({
  x, z, s, seed, kind: seed % 3 === 0 ? 'gulmohar' : 'rain',
})
const sign = (x: number, z: number, rot: number, title: string, odia: string, sub?: string): Fixture => ({
  x, z, rot, title, odia, sub,
})

type Storefront = Pick<BlockShop, 'x' | 'z' | 'rot' | 'w' | 'd' | 'front' | 'floors' | 'wall' | 'seed'> & {
  title: string
  odia: string
  description: string
}

function shop({ title, odia, description, ...site }: Storefront): BlockShop {
  return {
    ...site,
    sign: { title, odia, sub: description, bg: C.SIGN_RED, fg: C.WALL_WHITE },
    shutter: 'open',
    balcony: site.floors > 1,
    goods: [C.WALL_SALMON, C.WALL_BUTTER, C.WALL_WHITE, C.WALL_MINT],
  }
}

type LandmarkSite = CityLandmark & { height: number }
type Streets = Pick<Block, 'roads' | 'paving' | 'lawns'> & Partial<Omit<Block, 'roads' | 'paving' | 'lawns' | 'solids'>>

function section(
  id: string,
  area: CityArea,
  bounds: Rect,
  streets: Streets,
  landmarkSites: LandmarkSite[],
  water: Rect[] = [],
): CitySection {
  const { roads, paving, lawns, ...details } = streets
  const landmarks = landmarkSites.map(({ height: _height, ...model }) => model)
  return {
    id,
    area,
    origin: [0, 0],
    bounds,
    water,
    landmarks,
    block: {
      roads, paving, lawns, buildings: [], shops: [], trees: [], crossings: [], lanes: [], signs: [], stops: [], poleRuns: [],
      ...details,
      solids: [
        ...landmarkSites.map(({ x, z, w, d, rot, height }) => ({ rect: footprint(x, z, w, d, rot), height })),
      ],
    },
  }
}

// Shorten the real north–south artery first, then retain the turn east along NH 16.
// The stadium is on the south spur, with its facade facing Bidyut Marg.
const jayadev = section('jayadev-vihar', 'jayadev-vihar', rect(-104, -30, -164, -58), {
  roads: [
    rect(-62, -48, -164, -58),
    rect(-58, -30, -103, -91),
    rect(-104, -62, -145, -138),
    rect(-48, -30, -129, -121),
    rect(-104, -62, -88, -81),
  ],
  paving: [
    rect(-69, -62, -164, -147), rect(-70, -62, -137, -82),
    rect(-48, -40, -162, -131), rect(-48, -34, -120, -106),
    rect(-69, -62, -72, -59), rect(-48, -35, -90, -58),
  ],
  lawns: [
    rect(-104, -72, -164, -148), rect(-102, -88, -133, -108),
    rect(-46, -31, -158, -137), rect(-46, -33, -84, -62),
  ],
  median: [rect(-55.6, -54.4, -164, -149), rect(-55.6, -54.4, -134, -132), rect(-55.6, -54.4, -119, -107)],
  buildings: [
    { x: -81, z: -155, w: 15, d: 7, floors: 2, rot: EAST, kind: 'residential', wall: C.WALL_BUTTER, balconies: 'none', tanks: 1, seed: 710 },
    { x: -93, z: -119, w: 17, d: 10, floors: 3, rot: EAST, kind: 'commercial', wall: C.WALL_WHITE, accent: C.GLASS, balconies: 'none', seed: 711 },
    { x: -39, z: -146, w: 9, d: 11, floors: 3, rot: WEST, kind: 'mixed-use', wall: C.WALL_MINT, balconies: 'alt', seed: 712 },
    { x: -39, z: -113, w: 10, d: 9, floors: 4, rot: WEST, kind: 'commercial', wall: C.CONCRETE_WARM, accent: C.GLASS, seed: 713 },
    { x: -36, z: -75, w: 9, d: 8, floors: 2, rot: WEST, kind: 'residential', wall: C.WALL_SALMON, balconies: 'all', tanks: 1, seed: 714 },
    { x: -90, z: -94, w: 9, d: 6, floors: 2, rot: EAST, kind: 'residential', wall: C.WALL_POWDER, balconies: 'alt', mumty: false, seed: 715 },
  ],
  trees: [
    tree(-68, -155, 721), tree(-71, -130, 722), tree(-66, -111, 723), tree(-84, -105, 724),
    tree(-44, -152, 725), tree(-43, -83, 726), tree(-66, -62, 727), tree(-97, -76, 728),
  ],
  crossings: [cross(-55, -146, 12.5), cross(-55, -129, 12.5), cross(-55, -105, 12.5), cross(-55, -82, 12.5), cross(-39, -97, 10.5, EAST)],
  lanes: [lane(-55, -155, 12), lane(-55, -112, 13), lane(-45, -97, 24, EAST), lane(-55, -69, 17)],
  signs: [
    sign(-45, -143, WEST, 'DAMANA SQUARE', 'ଡମଣା ଛକ', 'CHANDRASEKHARPUR'),
    sign(-46, -129, WEST, 'KALINGA HOSPITAL SQUARE', 'କଳିଙ୍ଗ ହସ୍ପିଟାଲ ଛକ'),
    sign(-46, -117, WEST, 'XAVIER SQUARE', 'ଜାଭିଅର ଛକ'),
    sign(-66, -104, EAST, 'JAYADEVA VIHAR', 'ଜୟଦେବ ବିହାର', 'NH 16 · BIDYUT MARG'),
    sign(-44, -86, WEST, 'BIDYUT MARG', 'ବିଦ୍ୟୁତ ମାର୍ଗ', 'KALINGA STADIUM'),
  ],
  poleRuns: [[[-47, -156, 1, 0], [-47, -135, 1, 0], [-47, -109, 1, 0], [-47, -73, 1, 0]]],
}, [
  { kind: 'pal-heights', x: -78, z: -114, w: 18, d: 15, rot: EAST, height: 13 },
  { kind: 'stadium', x: -85, z: -70, w: 20, d: 30, rot: EAST, height: 10 },
])

const acharya = section('acharya-vihar', 'jayadev-vihar', rect(-30, 58, -126, -58), {
  roads: [
    rect(-30, 58, -103, -91),
    rect(-11, -3, -126, -91),
    rect(20, 32, -103, -58),
  ],
  paving: [
    rect(-30, 18, -108, -103), rect(-30, 19, -91, -85),
    rect(15, 20, -91, -58), rect(32, 38, -91, -58),
    rect(32, 57, -89, -81),
  ],
  lawns: [rect(-28, -13, -125, -111), rect(-27, 12, -82, -62), rect(40, 57, -80, -60), rect(33, 58, -123, -109)],
  buildings: [
    { x: -23, z: -78, w: 12, d: 8, floors: 2, rot: NORTH, kind: 'residential', wall: C.WALL_MINT, balconies: 'none', tanks: 1, mumty: false, seed: 731 },
    { x: -3, z: -76, w: 13, d: 10, floors: 3, rot: NORTH, kind: 'residential', wall: C.WALL_BUTTER, balconies: 'all', seed: 732 },
    { x: 10, z: -63, w: 9, d: 7, floors: 1, rot: EAST, kind: 'residential', wall: C.WALL_SALMON, balconies: 'none', tanks: 1, seed: 733 },
    { x: 45, z: -82, w: 17, d: 9, floors: 4, rot: WEST, kind: 'civic', wall: C.WALL_WHITE, balconies: 'none', seed: 734 },
    { x: 44, z: -115, w: 14, d: 13, floors: 2, rot: SOUTH, kind: 'commercial', wall: C.WALL_POWDER, balconies: 'none', seed: 735 },
    { x: 18, z: -118, w: 12, d: 10, floors: 3, rot: SOUTH, kind: 'residential', wall: C.WALL_WHITE, balconies: 'alt', seed: 736 },
  ],
  trees: [
    tree(-25, -106, 741), tree(-18, -114, 742), tree(3, -108, 743), tree(5, -86, 744),
    tree(38, -75, 745), tree(14, -71, 746), tree(39, -61, 747),
  ],
  crossings: [cross(-12, -97, 10.5, EAST), cross(18, -97, 10.5, EAST), cross(26, -88, 11)],
  lanes: [lane(-12, -97, 32, EAST), lane(39, -97, 35, EAST), lane(26, -74, 25)],
  signs: [
    sign(-12, -105, SOUTH, 'ACHARYA VIHAR', 'ଆଚାର୍ଯ୍ୟ ବିହାର', 'REGIONAL SCIENCE CENTRE'),
    sign(33.5, -88, WEST, 'VANI VIHAR', 'ବାଣୀ ବିହାର', 'JANPATH · RUPALI SQUARE'),
  ],
  poleRuns: [[[-17, -92, 0, 1], [4, -92, 0, 1], [27, -104, 0, -1], [36, -71, 1, 0]]],
}, [
  { kind: 'science-centre', x: 4.5, z: -115, w: 13, d: 10, height: 5.6 },
])

const unitTwoBuildings: BuildingSpec[] = [
  { x: 45, z: 41, w: 11, d: 8, floors: 2, rot: WEST, kind: 'residential', wall: C.WALL_POWDER, balconies: 'none', mumty: false, seed: 751 },
  { x: 64, z: 41, w: 13, d: 9, floors: 3, rot: SOUTH, kind: 'residential', wall: C.WALL_MINT, balconies: 'alt', seed: 752 },
  { x: 79, z: 40, w: 8, d: 8, floors: 1, rot: SOUTH, kind: 'residential', wall: C.WALL_BUTTER, balconies: 'none', tanks: 0, seed: 753 },
  { x: 56, z: 65, w: 13, d: 10, floors: 3, rot: WEST, kind: 'residential', wall: C.WALL_SALMON, balconies: 'all', stilt: true, seed: 754 },
  { x: 76, z: 67, w: 10, d: 9, floors: 2, rot: NORTH, kind: 'residential', wall: C.WALL_WHITE, balconies: 'alt', tanks: 1, seed: 755 },
  { x: 39, z: 74, w: 10, d: 7, floors: 3, rot: WEST, kind: 'mixed-use', wall: C.WALL_MINT, balconies: 'alt', seed: 756 },
  { x: 77, z: 95.5, w: 15, d: 8, floors: 3, rot: SOUTH, kind: 'commercial', wall: C.WALL_WHITE, accent: C.GLASS, balconies: 'none', seed: 757 },
  { x: 6.5, z: 71, w: 12, d: 8, floors: 4, rot: EAST, kind: 'commercial', wall: C.CONCRETE_WARM, accent: C.GLASS, balconies: 'none', seed: 758 },
  { x: -23, z: 61, w: 12, d: 9, floors: 2, rot: EAST, kind: 'mixed-use', wall: C.WALL_BUTTER, balconies: 'alt', seed: 759 },
  { x: -21, z: 101, w: 10, d: 7, floors: 2, rot: EAST, kind: 'residential', wall: C.WALL_PINK, balconies: 'all', tanks: 1, seed: 760 },
]

const unitTwo = section('unit-ii', 'unit-ii', rect(-30, 90, 34, 126), {
  roads: [
    rect(20, 32, 34, 119), rect(9, 90, 47, 55), rect(32, 90, 81, 91),
    rect(-16, 21, 81, 91), rect(-16, -8, 86, 119), rect(-16, 62, 107, 119),
    rect(50, 62, 107, 126),
  ],
  paving: [
    rect(13, 20, 34, 46), rect(11, 20, 55, 81), rect(32, 39, 34, 47),
    rect(32, 39, 55, 81), rect(-18, 20, 76, 81), rect(-8, 20, 91, 106),
    rect(62, 84, 109, 122), rect(9, 19, 119, 126),
  ],
  lawns: [rect(-29, -17, 39, 57), rect(83, 89, 56, 77), rect(65, 88, 100, 107)],
  median: [rect(25.4, 26.6, 34, 43), rect(25.4, 26.6, 58, 76), rect(25.4, 26.6, 96, 103)],
  buildings: unitTwoBuildings,
  shops: [
    shop({ x: 13, z: 60, rot: EAST, w: 3.6, d: 3.1, front: 'counter', floors: 1, wall: C.WALL_BUTTER, seed: 771, title: 'JANPATH CHA', odia: 'ଜନପଥ ଚା', description: 'CHAI · BARA' }),
    shop({ x: 13, z: 66, rot: EAST, w: 4.1, d: 3.5, front: 'counter', floors: 1, wall: C.WALL_SALMON, seed: 772, title: 'FLOWER STALL', odia: 'ଫୁଲ ଦୋକାନ', description: 'RAM MANDIR VENDING ZONE' }),
    shop({ x: 2, z: 95, rot: NORTH, w: 7, d: 5, front: 'glass', floors: 2, wall: C.WALL_WHITE, seed: 773, title: 'UTKALIKA', odia: 'ଉତ୍କଳିକା', description: 'ODISHA HANDICRAFTS' }),
    shop({ x: 11, z: 98, rot: NORTH, w: 8.5, d: 8, front: 'glass', floors: 2, wall: C.WALL_MINT, seed: 774, title: 'BOYANIKA', odia: 'ବୟନିକା', description: 'ODISHA HANDLOOM' }),
    shop({ x: 17.6, z: 99, rot: EAST, w: 5.3, d: 4, front: 'shutter', floors: 1, wall: C.WALL_SALMON, seed: 775, title: 'MARKET BOOKSTALL', odia: 'ବହି ଦୋକାନ', description: 'BOOKS · STATIONERY' }),
    shop({ x: 72, z: 76, rot: SOUTH, w: 6, d: 4.8, front: 'counter', floors: 1, wall: C.WALL_BUTTER, seed: 776, title: 'STATION TIFFIN', odia: 'ଷ୍ଟେସନ ଜଳଖିଆ', description: 'TIFFIN · SNACKS' }),
  ],
  trees: [
    tree(17, 42, 781), tree(35, 61, 782), tree(67, 57, 783), tree(-17, 73, 784), tree(18, 72, 785),
    tree(7, 77, 786), tree(38, 97, 787), tree(12, 103, 788), tree(46, 121, 789),
  ],
  crossings: [cross(26, 44, 11), cross(26, 57, 11), cross(26, 78, 11), cross(26, 94, 11), cross(26, 105, 11), cross(48, 113, 10.5, EAST)],
  lanes: [lane(26, 68, 16), lane(26, 100, 13), lane(62, 86, 32, EAST), lane(39, 113, 23, EAST)],
  signs: [
    sign(34, 52, WEST, 'RAM MANDIR SQUARE', 'ରାମ ମନ୍ଦିର ଛକ', 'KHARAVELA NAGAR'),
    sign(16, 77, EAST, 'MASTER CANTEEN', 'ମାଷ୍ଟର କ୍ୟାଣ୍ଟିନ୍', 'UNIT II · RAILWAY STATION'),
    sign(19, 104, EAST, 'RAJ MAHAL SQUARE', 'ରାଜ ମହଲ ଛକ', 'RAJPATH · KALPANA SQUARE'),
    sign(63.5, 118, WEST, 'KALPANA SQUARE', 'କଳ୍ପନା ଛକ', 'LEWIS ROAD · OLD TOWN'),
  ],
  stops: [sign(-7, 94, NORTH, 'MARKET BUILDING', 'ମାର୍କେଟ ବିଲ୍ଡିଂ', 'UNIT II · OLD TOWN')],
  poleRuns: [[[19, 38, -1, 0], [19, 61, -1, 0], [19, 96, -1, 0], [43, 120, 0, -1]]],
}, [
  { kind: 'ram-mandir', x: 0, z: 43, w: 16, d: 15, rot: EAST, height: 13 },
  { kind: 'market-building', x: -8, z: 70, w: 19, d: 10, height: 5.1 },
  { kind: 'utkal-galleria', x: 75, z: 111, w: 22, d: 18, rot: WEST, height: 11.2 },
])

const oldTown = section('old-town', 'old-town', rect(-30, 90, 126, 245), {
  roads: [
    rect(50, 62, 126, 202), rect(21, 82, 139, 146),
    rect(-16, 50, 172, 179), rect(62, 83, 165, 172),
    rect(46, 82, 196, 202), rect(46, 53, 202, 231), rect(-16, 53, 220, 224),
  ],
  paving: [
    rect(44, 50, 126, 139), rect(45, 50, 146, 171), rect(44, 50, 179, 196),
    rect(62, 69, 126, 139), rect(62, 69, 146, 165), rect(62, 69, 172, 196),
    rect(6, 46, 181, 186), rect(3, 9, 182, 220), rect(9, 46, 217, 220),
    rect(44, 46, 186, 217), rect(9, 42, 232, 238),
  ],
  lawns: [rect(-28, -7, 134, 166), rect(6, 21, 146, 166), rect(-23, 2, 183, 214), rect(55, 88, 205, 234)],
  median: [rect(55.4, 56.6, 151, 161)],
  buildings: [
    { x: 73, z: 132, w: 12, d: 10, floors: 2, rot: WEST, kind: 'civic', wall: C.WALL_WHITE, balconies: 'none', tanks: 0, seed: 791 },
    { x: 42, z: 134, w: 9.4, d: 9, floors: 2, rot: EAST, kind: 'residential', wall: C.WALL_BUTTER, balconies: 'all', seed: 792 },
    { x: 37, z: 157, w: 8, d: 9, floors: 2, rot: EAST, kind: 'residential', wall: C.WALL_PINK, balconies: 'none', tanks: 1, seed: 793 },
    { x: 22, z: 162, w: 11, d: 8, floors: 1, rot: SOUTH, kind: 'residential', wall: C.CONCRETE_WARM, balconies: 'none', tanks: 0, mumty: false, seed: 794 },
    { x: 73, z: 153, w: 12, d: 10, floors: 3, rot: WEST, kind: 'mixed-use', wall: C.WALL_MINT, balconies: 'alt', seed: 795 },
    { x: 75, z: 181, w: 8, d: 7, floors: 2, rot: WEST, kind: 'residential', wall: C.WALL_POWDER, balconies: 'all', seed: 796 },
    { x: -10, z: 194, w: 10, d: 9, floors: 2, rot: EAST, kind: 'residential', wall: C.WALL_SALMON, balconies: 'alt', tanks: 1, seed: 797 },
    { x: -10, z: 209, w: 8, d: 8.5, floors: 1, rot: EAST, kind: 'residential', wall: C.WALL_WHITE, balconies: 'none', tanks: 0, seed: 798 },
    { x: 2, z: 237, w: 9, d: 9, floors: 2, rot: NORTH, kind: 'residential', wall: C.WALL_BUTTER, balconies: 'none', seed: 799 },
    { x: 43, z: 236, w: 9, d: 9.5, floors: 3, rot: NORTH, kind: 'mixed-use', wall: C.WALL_POWDER, balconies: 'all', seed: 800 },
  ],
  shops: [
    shop({ x: 32, z: 168, rot: SOUTH, w: 5.5, d: 5, front: 'counter', floors: 1, wall: C.WALL_SALMON, seed: 801, title: 'OLD TOWN TIFFIN', odia: 'ପୁରୁଣା ଭୁବନେଶ୍ୱର ଜଳଖିଆ', description: 'PITHA · CHA' }),
    shop({ x: -6, z: 233, rot: NORTH, w: 4.6, d: 4.5, front: 'shutter', floors: 1, wall: C.WALL_BUTTER, seed: 802, title: 'POTTER’S WORKSHOP', odia: 'କୁମ୍ଭାର ଶାଳ', description: 'CLAY LAMPS · TERRACOTTA' }),
    shop({ x: 74, z: 189, rot: WEST, w: 5.1, d: 4.2, front: 'glass', floors: 1, wall: C.WALL_MINT, seed: 803, title: 'LEWIS ROAD SWEETS', odia: 'ଲୁଇସ୍ ରୋଡ୍ ମିଠା', description: 'CHHENA PODA · RASABALI' }),
  ],
  trees: [
    tree(45, 137, 811), tree(47, 154, 812), tree(14, 183, 813), tree(4, 197, 814), tree(5, 211, 815),
    tree(35, 220, 816), tree(46, 208, 817), tree(68, 191, 818), tree(12, 238, 819), tree(34, 236, 820),
  ],
  crossings: [cross(56, 136, 11), cross(56, 149, 11), cross(56, 175, 11), cross(56, 192, 11)],
  lanes: [lane(56, 132, 8), lane(56, 156, 10), lane(56, 182, 18), lane(27, 222, 34, EAST)],
  signs: [
    sign(47, 147, EAST, 'LEWIS ROAD', 'ଲୁଇସ୍ ରୋଡ୍', 'KALPANA SQUARE · OLD TOWN'),
    sign(43, 183, NORTH, 'BINDU SAGAR', 'ବିନ୍ଦୁ ସାଗର', 'WATERFRONT · LINGARAJ'),
    sign(47, 220, WEST, 'RATHA ROAD', 'ରଥ ଦାଣ୍ଡ', 'LINGARAJ TEMPLE'),
  ],
  stops: [sign(47, 181.8, EAST, 'BINDU SAGAR', 'ବିନ୍ଦୁ ସାଗର', 'OLD TOWN · EKAMRA KHETRA')],
  poleRuns: [[[63, 130, 1, 0], [63, 151, 1, 0], [63, 179, 1, 0], [63, 193, 1, 0]]],
}, [
  { kind: 'lingaraj', x: 23, z: 234, w: 20, d: 13, rot: EAST, height: 16.9 },
], [rect(9, 44, 186, 217)])

export const NEW_CITY_SECTIONS = { jayadev, acharya, unitTwo, oldTown }
