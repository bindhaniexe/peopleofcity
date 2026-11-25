import { CITY_BUS_PATH, CITY_BUS_STOPS, type CityPoint } from './layout'

type Stop = (typeof CITY_BUS_STOPS)[number]
export type BusTrip = { destination: Stop; points: CityPoint[]; distance: number[]; length: number }

const distance = ([ax, az]: CityPoint, [bx, bz]: CityPoint) => Math.hypot(ax - bx, az - bz)
const pathIndex = ([x, z]: CityPoint) => CITY_BUS_PATH.findIndex(([px, pz]) => px === x && pz === z)

export function busTrip(fromId: string, toId: string): BusTrip | null {
  const from = CITY_BUS_STOPS.find(({ id }) => id === fromId)
  const destination = CITY_BUS_STOPS.find(({ id }) => id === toId)
  if (!from || !destination || from === destination) return null
  const start = pathIndex(from.road)
  const end = pathIndex(destination.road)
  if (start < 0 || end < 0 || start === end) return null
  const road = CITY_BUS_PATH.slice(Math.min(start, end), Math.max(start, end) + 1)
  if (start > end) road.reverse()
  return makeTrip(destination, [from.point, ...road, destination.point])
}

export const boardFrom = (trip: BusTrip, point: CityPoint) => makeTrip(trip.destination, [point, ...trip.points])

function makeTrip(destination: Stop, waypoints: CityPoint[]): BusTrip {
  const points = waypoints.filter((point, i) => i === 0 || distance(point, waypoints[i - 1]) > 0)
  const cumulative = [0]
  for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]))
  return { destination, points, distance: cumulative, length: cumulative[cumulative.length - 1] }
}

export function ridePose(trip: BusTrip, travelled: number): { point: CityPoint; facing: number } {
  const t = Math.max(0, Math.min(travelled, trip.length))
  const next = trip.distance.findIndex((metres, i) => i > 0 && metres >= t)
  const a = trip.points[next - 1]
  const b = trip.points[next]
  const part = (t - trip.distance[next - 1]) / (trip.distance[next] - trip.distance[next - 1])
  return {
    point: [a[0] + (b[0] - a[0]) * part, a[1] + (b[1] - a[1]) * part],
    facing: Math.atan2(b[0] - a[0], b[1] - a[1]),
  }
}
