import { active } from './districts/active'
import { districtRect } from './districts/blocks'

// Walkability grid + A* for both landmark directions and finding people.

const CELL = 0.75
const INFLATE = 0.45

type Grid = { cells: Uint8Array; width: number; height: number; x0: number; z0: number }
const grids = new WeakMap<typeof active.def, Grid>()

function build(): Grid {
  const world = active.def
  const { x0, x1, z0, z1 } = world.bounds ?? districtRect
  const width = Math.ceil((x1 - x0) / CELL)
  const height = Math.ceil((z1 - z0) / CELL)
  const cells = new Uint8Array(width * height)
  if (world.contains) {
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        if (!world.contains(center(i, x0), center(j, z0))) cells[j * width + i] = 1
      }
    }
  }
  for (const b of world.colliders) {
    if (b.min[1] > 1.6 || b.max[1] < 0.3) continue
    const i0 = Math.max(0, cell(b.min[0] - INFLATE, x0))
    const i1 = Math.min(width - 1, cell(b.max[0] + INFLATE, x0))
    const j0 = Math.max(0, cell(b.min[2] - INFLATE, z0))
    const j1 = Math.min(height - 1, cell(b.max[2] + INFLATE, z0))
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) cells[j * width + i] = 1
  }
  return { cells, width, height, x0, z0 }
}

const cell = (v: number, origin: number) => Math.floor((v - origin) / CELL)
const center = (i: number, origin: number) => origin + (i + 0.5) * CELL
const free = (g: Grid, i: number, j: number) =>
  i >= 0 && j >= 0 && i < g.width && j < g.height && g.cells[j * g.width + i] === 0

function nearestFree(g: Grid, i: number, j: number): [number, number] | null {
  if (free(g, i, j)) return [i, j]
  for (let r = 1; r < 8; r++)
    for (let dj = -r; dj <= r; dj++)
      for (let di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue
        if (free(g, i + di, j + dj)) return [i + di, j + dj]
      }
  return null
}

function lineOfSight(g: Grid, ax: number, az: number, bx: number, bz: number) {
  const d = Math.hypot(bx - ax, bz - az)
  const steps = Math.ceil(d / (CELL * 0.4))
  for (let k = 1; k < steps; k++) {
    const t = k / steps
    if (!free(g, cell(ax + (bx - ax) * t, g.x0), cell(az + (bz - az) * t, g.z0))) return false
  }
  return true
}

/** Grid A* (8-way, no corner cutting) + line-of-sight smoothing. Returns world XZ waypoints. */
export function findPath(fx: number, fz: number, tx: number, tz: number): [number, number][] | null {
  let g = grids.get(active.def)
  if (!g) grids.set(active.def, (g = build()))
  const N = g.width
  const si = cell(fx, g.x0)
  const sj = cell(fz, g.z0)
  const ei = cell(tx, g.x0)
  const ej = cell(tz, g.z0)
  if (free(g, si, sj) && free(g, ei, ej) && lineOfSight(g, fx, fz, tx, tz)) return [[fx, fz], [tx, tz]]
  const s = nearestFree(g, si, sj)
  const e = nearestFree(g, ei, ej)
  if (!s || !e) return null
  const start = s[1] * N + s[0]
  const goal = e[1] * N + e[0]

  const gScore = new Float64Array(g.cells.length).fill(Infinity)
  const came = new Int32Array(g.cells.length).fill(-1)
  const closed = new Uint8Array(g.cells.length)
  const heap: [number, number][] = [] // [f, idx]
  const push = (f: number, idx: number) => {
    heap.push([f, idx])
    let c = heap.length - 1
    while (c > 0) {
      const p = (c - 1) >> 1
      if (heap[p][0] <= heap[c][0]) break
      ;[heap[p], heap[c]] = [heap[c], heap[p]]
      c = p
    }
  }
  const pop = () => {
    const top = heap[0]
    const last = heap.pop()!
    if (heap.length) {
      heap[0] = last
      let c = 0
      for (;;) {
        const l = c * 2 + 1
        const r = l + 1
        let m = c
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r
        if (m === c) break
        ;[heap[m], heap[c]] = [heap[c], heap[m]]
        c = m
      }
    }
    return top
  }
  const h = (idx: number) => {
    const dx = Math.abs((idx % N) - e[0])
    const dz = Math.abs(Math.floor(idx / N) - e[1])
    return Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz)
  }

  gScore[start] = 0
  push(h(start), start)
  while (heap.length) {
    const [, cur] = pop()
    if (cur === goal) break
    if (closed[cur]) continue
    closed[cur] = 1
    const ci = cur % N
    const cj = Math.floor(cur / N)
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue
        const ni = ci + di
        const nj = cj + dj
        if (!free(g, ni, nj)) continue
        if (di && dj && (!free(g, ci + di, cj) || !free(g, ci, cj + dj))) continue
        const n = nj * N + ni
        const cost = gScore[cur] + (di && dj ? Math.SQRT2 : 1)
        if (cost < gScore[n]) {
          gScore[n] = cost
          came[n] = cur
          push(cost + h(n), n)
        }
      }
  }
  if (came[goal] === -1 && goal !== start) return null

  const raw: [number, number][] = []
  for (let c = goal; c !== -1; c = came[c]) raw.push([center(c % N, g.x0), center(Math.floor(c / N), g.z0)])
  raw.reverse()
  raw[0] = [fx, fz]
  if (free(g, ei, ej)) raw.push([tx, tz])

  // string-pull: keep only the corners we actually need
  const out: [number, number][] = [raw[0]]
  let a = 0
  while (a < raw.length - 1) {
    let b = raw.length - 1
    while (b > a + 1 && !lineOfSight(g, raw[a][0], raw[a][1], raw[b][0], raw[b][1])) b--
    out.push(raw[b])
    a = b
  }
  return out
}
