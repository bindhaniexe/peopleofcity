import { C } from '../../lib/palette'
import { districtRect, type Block, type Rect } from '../districts/blocks'
import { block as patia } from '../districts/patia/layout'
import { block as saheed } from '../districts/saheed-nagar/layout'
import type { CityLandmark } from '../world/CityLandmark'
import { NEW_CITY_SECTIONS } from './sections'

export type CityPoint = readonly [x: number, z: number]
export type CityArea = 'patia' | 'jayadev-vihar' | 'saheed-nagar' | 'unit-ii' | 'old-town'
export type CitySection = {
  id: string
  area: CityArea
  /** Translation of the authored block into the common city coordinates. */
  origin: CityPoint
  bounds: Rect
  block: Block
  landmarks: CityLandmark[]
  water?: Rect[]
}

export type CityPlace = { id: string; label: string; area: CityArea; point: CityPoint }
export type CityBusStop = { id: string; label: string; point: CityPoint; road: CityPoint }

const patiaBlock: Block = {
  ...patia,
  buildings: patia.buildings.map((building) => ({
    ...building,
    kind: building.seed === 404 ? 'commercial' : building.seed === 406 ? 'mixed-use' : 'residential',
  })),
  shops: patia.shops.map((shop) => {
    switch (shop.seed) {
      case 501: return { ...shop, w: 5.2, d: 6.5, front: 'shutter', floors: 1 }
      case 502: return { ...shop, w: 6.4, d: 8.2, front: 'glass' }
      case 503: return { ...shop, w: 4.9, d: 6.8, front: 'counter', floors: 1 }
      case 504: return { ...shop, w: 7.2, d: 7.4, front: 'glass', floors: 3 }
      default: return { ...shop, w: 5.4, d: 7.5, front: 'counter' }
    }
  }),
}

const saheedBlock: Block = {
  ...saheed,
  buildings: saheed.buildings.map((building) => ({
    ...building,
    kind: building.seed === 107 ? 'commercial' : building.seed === 104 || building.seed === 106 ? 'mixed-use' : 'residential',
  })),
  shops: saheed.shops.map((shop) => {
    switch (shop.seed) {
      case 202: return { ...shop, w: 7.5, d: 8.7, front: 'glass' }
      case 203: return { ...shop, w: 6.8, d: 9.4, front: 'glass' }
      case 204: return { ...shop, w: 6.6, d: 8.3, front: 'shutter' }
      case 205: return { ...shop, w: 4.9, d: 6.5, front: 'counter', floors: 1 }
      case 206: return {
        ...shop,
        w: 6.4,
        d: 8.9,
        front: 'glass',
        sign: {
          title: 'BIKALANANDA KAR’S RASAGOLA',
          odia: 'ବିକଳାନନ୍ଦ କରଙ୍କ ରସଗୋଲା',
          sub: 'METRO CLASSIC · RUPALI STREET',
          bg: C.SIGN_RED,
          fg: C.WALL_WHITE,
        },
      }
      default: return { ...shop, w: 5.7, d: 7.7, front: 'counter' }
    }
  }),
}

export const CITY_SECTIONS: CitySection[] = [
  { id: 'patia', area: 'patia', origin: [-76, -210], bounds: districtRect, block: patiaBlock, landmarks: [] },
  NEW_CITY_SECTIONS.jayadev,
  NEW_CITY_SECTIONS.acharya,
  { id: 'saheed-nagar', area: 'saheed-nagar', origin: [44, -12], bounds: districtRect, block: saheedBlock, landmarks: [] },
  NEW_CITY_SECTIONS.unitTwo,
  NEW_CITY_SECTIONS.oldTown,
]

export const CITY_PLACES: CityPlace[] = [
  { id: 'kiit-square', label: 'KIIT Square', area: 'patia', point: [-46.9, -226] },
  { id: 'kiit-campus', label: 'KIIT Campus', area: 'patia', point: [-87, -226] },
  { id: 'jugaad-jn', label: 'Jugaad JN', area: 'patia', point: [-93, -238] },
  { id: 'patia-square', label: 'Patia Square', area: 'patia', point: [-58, -185] },
  { id: 'infocity', label: 'Infocity', area: 'patia', point: [-108, -192] },
  { id: 'pal-heights', label: 'Pal Heights Mall', area: 'jayadev-vihar', point: [-68, -114] },
  { id: 'damana', label: 'Damana Square', area: 'jayadev-vihar', point: [-60, -140] },
  { id: 'kalinga-hospital', label: 'Kalinga Hospital Square', area: 'jayadev-vihar', point: [-45, -129] },
  { id: 'xavier', label: 'Xavier Square', area: 'jayadev-vihar', point: [-45, -118] },
  { id: 'jayadev-square', label: 'Jayadev Vihar Square', area: 'jayadev-vihar', point: [-60, -104] },
  { id: 'kalinga-stadium', label: 'Kalinga Stadium', area: 'jayadev-vihar', point: [-67, -69] },
  { id: 'science-centre', label: 'Regional Science Centre', area: 'jayadev-vihar', point: [-2, -107] },
  { id: 'vani-vihar', label: 'Vani Vihar', area: 'jayadev-vihar', point: [34, -85] },
  { id: 'rupali-square', label: 'Rupali Square', area: 'saheed-nagar', point: [34, -38] },
  { id: 'bhawani-mall', label: 'Bhawani Mall', area: 'saheed-nagar', point: [66, 7.8] },
  { id: 'house-of-pattachitra', label: 'House of Pattachitra', area: 'saheed-nagar', point: [45, -25] },
  { id: 'bikalananda-kar', label: 'Bikalananda Kar’s Rasagola', area: 'saheed-nagar', point: [65, -36.5] },
  { id: 'ram-mandir', label: 'Ram Mandir', area: 'unit-ii', point: [14, 44] },
  { id: 'master-canteen', label: 'Master Canteen', area: 'unit-ii', point: [34, 84] },
  { id: 'market-building', label: 'Market Building', area: 'unit-ii', point: [-7, 77] },
  { id: 'utkalika', label: 'Utkalika', area: 'unit-ii', point: [2, 91.5] },
  { id: 'boyanika', label: 'Boyanika', area: 'unit-ii', point: [11, 92.7] },
  { id: 'utkal-galleria', label: 'Utkal Kanika Galleria', area: 'unit-ii', point: [63.5, 114] },
  { id: 'bindu-sagar', label: 'Bindu Sagar', area: 'old-town', point: [40, 183] },
  { id: 'lingaraj', label: 'Lingaraj Temple', area: 'old-town', point: [24, 223] },
]

export const CITY_BUS_STOPS: CityBusStop[] = [
  { id: 'kiit', label: 'KIIT Square', point: [-46.9, -226], road: [-52, -226] },
  { id: 'rupali', label: 'Rupali Square', point: [19.2, -20], road: [26, -20] },
  { id: 'market-building', label: 'Market Building', point: [-7, 92.1], road: [-7, 86] },
  { id: 'bindu-sagar', label: 'Bindu Sagar', point: [49.2, 182], road: [58, 182] },
]

const [kiit, rupali, market, binduSagar] = CITY_BUS_STOPS
const JAYADEV_JUNCTION: CityPoint = [-52, -97]
const VANI_VIHAR_JUNCTION: CityPoint = [26, -97]
const RAJ_MAHAL_JUNCTION: CityPoint = [28, 113]
const KALPANA_JUNCTION: CityPoint = [58, 113]

export const CITY_BUS_PATH: CityPoint[] = [
  kiit.road, JAYADEV_JUNCTION, VANI_VIHAR_JUNCTION, rupali.road,
  [26, 19], [28, 27], [28, 86], market.road, [-12, 86], [-12, 113],
  RAJ_MAHAL_JUNCTION, KALPANA_JUNCTION, binduSagar.road,
]

/** The measured through-route. Market Building has its own pedestrian turn off Janpath. */
export const CITY_SPINE: CityPoint[] = [
  kiit.point, kiit.road, JAYADEV_JUNCTION, VANI_VIHAR_JUNCTION, rupali.road, [26, 19], [28, 27],
  RAJ_MAHAL_JUNCTION, [55, 113], [55, 178.8], [40, 178.8], [40, 183],
]
