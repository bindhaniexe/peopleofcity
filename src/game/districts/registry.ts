
import { ROOM_DISTRICTS, type RoomDistrict } from '../../../shared/net/config'

export const DEFAULT_DISTRICT = ROOM_DISTRICTS[0]
export const CITY_MARK = '@'

export type DistrictId = RoomDistrict | 'old-town' | 'unit-ii' | 'jayadev-vihar'
export type DistrictInfo = {
  id: DistrictId
  name: string
  title: string
  odia: string
  identity: string
  accent: string
  built: boolean
}

export const DISTRICTS: DistrictInfo[] = [
  { id: 'saheed-nagar', name: 'Saheed Nagar', title: 'SAHEED NAGAR', odia: 'ଶହୀଦ ନଗର', identity: 'Janpath · Shops · Neighbourhood lanes', accent: '#C45233', built: true },
  { id: 'patia', name: 'Patia', title: 'PATIA', odia: 'ପଟିଆ', identity: 'KIIT · Campus shops · Infocity', accent: '#207666', built: true },
  { id: 'old-town', name: 'Old Town', title: 'OLD TOWN', odia: 'ଏକାମ୍ର କ୍ଷେତ୍ର', identity: 'Ekamra Kshetra · Bindu Sagar', accent: '#A45F3C', built: true },
  { id: 'unit-ii', name: 'Unit II', title: 'UNIT II', odia: 'ୟୁନିଟ୍ ୨', identity: 'Market Building · Street stalls', accent: '#996423', built: true },
  { id: 'jayadev-vihar', name: 'Jayadev Vihar', title: 'JAYADEV VIHAR', odia: 'ଜୟଦେବ ବିହାର', identity: 'Pal Heights · Kalinga Stadium', accent: '#376F85', built: true },
]

export const districtInfo = (id: DistrictId) => DISTRICTS.find((district) => district.id === id)!

const aliases: ReadonlyMap<string, DistrictId> = new Map([
  ['sahid nagar', 'saheed-nagar'], ['shaheed nagar', 'saheed-nagar'], ['saheednagar', 'saheed-nagar'],
  ['ekamra kshetra', 'old-town'], ['market building', 'unit-ii'], ['unit 2', 'unit-ii'],
  ['jaydev vihar', 'jayadev-vihar'], ['nayapalli', 'jayadev-vihar'],
])
const legacyAreas = new Set([
  'koramangala', 'hsr', 'hsr layout', 'bellandur', 'whitefield', 'domlur',
  'jayanagar', 'indiranagar', 'malleshwaram', 'bengaluru', 'bangalore',
])

function matchDistrict(location: string) {
  const name = location.trim().toLowerCase()
  return DISTRICTS.find((district) => district.name.toLowerCase() === name || district.id === aliases.get(name))
}

export const homeArea = (location: string): DistrictId => matchDistrict(location)?.id ?? DEFAULT_DISTRICT

export function districtOfLocation(location: string): DistrictInfo {
  return matchDistrict(location) ?? districtInfo(DEFAULT_DISTRICT)
}

export type PlaceKind = 'district' | 'local' | 'city'

export function placeKind(location: string): PlaceKind {
  if (location.startsWith(CITY_MARK) || legacyAreas.has(location.trim().toLowerCase())) return 'city'
  return matchDistrict(location) ? 'district' : 'local'
}

export const placeName = (location: string) => location.startsWith(CITY_MARK) ? location.slice(1) : location

export function placeLabel(location: string) {
  if (location.startsWith(CITY_MARK)) return placeName(location)
  const name = location.trim().toLowerCase()
  if (name === 'bengaluru' || name === 'bangalore') return 'Bengaluru'
  return `${location}, ${legacyAreas.has(name) ? 'Bengaluru' : 'Bhubaneswar'}`
}

export function homeDistrict(location: string): RoomDistrict {
  const id = matchDistrict(location)?.id
  return ROOM_DISTRICTS.find((district) => district === id) ?? DEFAULT_DISTRICT
}

export function districtForSearch(location: string, onlineDistrict?: string): RoomDistrict {
  return ROOM_DISTRICTS.find((district) => district === onlineDistrict) ?? homeDistrict(location)
}
