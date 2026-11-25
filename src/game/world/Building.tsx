'use client'

import { useMemo, type ReactElement } from 'react'
import { Shape } from 'three'
import { C } from '@/lib/palette'
import { BASE, FH, buildingArchitecture, type BuildingSpec } from '../layout'
import { mat } from '../materials'
import { rng } from '../textures'
import { ACUnit, Balcony, Box, ClothesLine, Cyl, Dish, Door, Mumty, Parapet, Tank, Win } from './kit'

const CURTAINS = [C.TERRACOTTA, C.WALL_BUTTER, '#E9E4DA', C.WALL_POWDER, '#D9846B']
const CLOTHS = [C.FLAME, C.TRANSIT_BLUE, C.KERB_YELLOW, C.WALL_PINK, C.WALL_WHITE]

function TiledRoof({ w, d, y, wall }: { w: number; d: number; y: number; wall: string }) {
  const pitch = 0.21
  const rise = w * Math.tan(pitch) / 2
  const gable = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-w / 2, 0)
    shape.lineTo(w / 2, 0)
    shape.lineTo(0, rise)
    shape.closePath()
    return shape
  }, [w, rise])

  return (
    <group position={[0, y, 0]}>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box s={[w / (2 * Math.cos(pitch)) + 0.08, 0.24, d + 0.16]} p={[side * w / 4, rise / 2, 0]} r={[0, 0, -side * pitch]} c={C.ROOF_TILE} />
          <mesh position={[0, 0, side * d / 2]} rotation={[0, side < 0 ? Math.PI : 0, 0]} material={mat(wall)} castShadow receiveShadow>
            <shapeGeometry args={[gable]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * A building assembled from its use and address. Local +Z is the street-facing front.
 */
export function Building({
  x,
  z,
  rot,
  w,
  d,
  floors,
  wall,
  kind,
  trim = C.WALL_WHITE,
  accent = C.TERRACOTTA,
  stilt = false,
  balconies = 'alt',
  tanks = 2,
  mumty = true,
  seed,
}: BuildingSpec) {
  const architecture = buildingArchitecture({ seed, kind })
  const home = architecture.ground === 'residential'
  const office = architecture.ground === 'glass'
  const H = floors * FH
  const hasStilt = home && stilt
  const y0 = hasStilt ? FH : 0
  const r = rng(seed)
  const curtain = () => (r() < 0.5 ? CURTAINS[Math.floor(r() * CURTAINS.length)] : null)
  const els: ReactElement[] = []
  let k = 0

  els.push(<Box key={k++} s={[w, H - y0, d]} p={[0, y0 + (H - y0) / 2, 0]} c={wall} />)

  for (let f = 1; f < floors; f++) {
    els.push(<Box key={k++} s={[w + 0.24, 0.22, d + 0.24]} p={[0, f * FH, 0]} c={trim} />)
  }

  if (hasStilt) {
    const nx = Math.max(2, Math.round(w / 4.5) + 1)
    for (let i = 0; i < nx; i++) {
      const px = -w / 2 + 0.3 + (i * (w - 0.6)) / (nx - 1)
      for (const pz of [d / 2 - 0.3, -d / 2 + 0.3]) {
        els.push(<Box key={k++} s={[0.5, FH, 0.5]} p={[px, FH / 2, pz]} c={trim} />)
      }
    }
    els.push(<Box key={k++} s={[w * 0.32, FH, d * 0.45]} p={[w * 0.22, FH / 2, -d * 0.24]} c={wall} />)
    els.push(<Box key={k++} s={[w - 0.2, 0.05, d - 0.2]} p={[0, 0.025, 0]} c="#B5AC9C" grade={false} shadow={false} />)
    els.push(<Door key={k++} p={[w * 0.22 - 0.6, 0, -d * 0.24 + d * 0.225]} c={C.WOOD} frame={trim} />)
  }

  const n = Math.max(1, Math.round(w / (2.9 + architecture.windowStyle * 0.5)))
  const bay = w / n
  const m = Math.max(1, Math.round(d / 3.6))
  const entryBay = { left: 0, centre: Math.floor(n / 2), right: n - 1 }[architecture.entry]
  const windowWidth = Math.min(bay - 0.45, 1.15 + architecture.windowStyle * 0.37)
  const windowHeight = architecture.windowStyle === 1 ? 1.85 : 1.3
  const front = d / 2
  if (architecture.ground === 'portico') {
    const header = Math.min(w - 0.12, 5.8)
    els.push(<Box key={k++} s={[header, 0.3, 0.88]} p={[0, 2.93, front - 0.09]} c={trim} />)
    for (const side of [-1, 1]) {
      els.push(<Box key={k++} s={[0.29, 2.9, 0.35]} p={[side * (header / 2 - 0.25), 1.43, front + 0.19]} c={trim} />)
    }
  }
  for (let f = hasStilt ? 1 : 0; f < floors; f++) {
    const base = f * FH
    for (let i = 0; i < n; i++) {
      const bx = -w / 2 + (i + 0.5) * bay
      const isBal = !office && architecture.ground !== 'portico' && f > 0 &&
        (balconies === 'all' || (balconies === 'alt' && (i + f + architecture.balconyPhase) % 2 === 1))
      if (f === 0 && i === entryBay && !office) {
        const entryWidth = architecture.ground === 'portico' ? Math.min(bay - 0.25, 2.1) : 1.1
        els.push(<Door key={k++} p={[bx, 0, front]} w={entryWidth} frame={trim} c={C.WOOD} />)
        if (home) {
          els.push(<Box key={k++} s={[1.7, 0.15, 0.48]} p={[bx, 2.49, front + 0.11]} c={accent} />)
        }
      } else if (office || (f === 0 && architecture.ground === 'shops')) {
        els.push(<Win key={k++} p={[bx, base + 1.55, front]} w={bay - 0.4} h={f === 0 ? 2.7 : 1.9} frame={C.GRILLE} shade={false} door={f === 0 && i === entryBay} />)
        if (f === 0 && architecture.ground === 'shops') {
          els.push(<Box key={k++} s={[bay - 0.16, 0.18, 0.58]} p={[bx, base + 2.98, front + 0.2]} c={accent} />)
        }
      } else if (isBal) {
        els.push(
          <Balcony
            key={k++}
            p={[bx, base, front]}
            w={Math.min(bay - 0.5, 2.8)}
            depth={0.72 + architecture.windowStyle * 0.2}
            slab={trim}
            wall={accent}
            plant={r() < 0.55}
            curtain={curtain()}
            cloth={r() < 0.35 ? CLOTHS[Math.floor(r() * CLOTHS.length)] : null}
          />,
        )
      } else {
        els.push(<Win key={k++} p={[bx, base + 1.65, front]} w={windowWidth} h={windowHeight} frame={trim} grille={r() < 0.5} curtain={curtain()} />)
      }
      els.push(<Win key={k++} p={[bx, base + 1.65, -d / 2]} r={[0, Math.PI, 0]} frame={trim} curtain={curtain()} />)
    }
    for (let j = 0; j < m; j++) {
      const bz = -d / 2 + (j + 0.5) * (d / m)
      els.push(<Win key={k++} p={[w / 2, base + 1.65, bz]} r={[0, Math.PI / 2, 0]} frame={trim} grille={r() < 0.4} curtain={curtain()} />)
      els.push(<Win key={k++} p={[-w / 2, base + 1.65, bz]} r={[0, -Math.PI / 2, 0]} frame={trim} curtain={curtain()} />)
      if (f > 0 && r() < 0.3) els.push(<ACUnit key={k++} p={[w / 2, base + 0.75, bz + 1.32]} r={[0, Math.PI / 2, 0]} />)
      if (f > 0 && r() < 0.2) els.push(<ACUnit key={k++} p={[-w / 2, base + 0.75, bz - 1.32]} r={[0, -Math.PI / 2, 0]} />)
    }
  }

  if (architecture.roof === 'tiles') {
    els.push(<TiledRoof key={k++} w={w} d={d} y={H} wall={wall} />)
  } else {
    els.push(<Parapet key={k++} w={w} d={d} wall={architecture.roof === 'terrace' ? trim : wall} trim={trim} y={H} />)
    if (architecture.roof === 'stepped') {
      els.push(<Box key={k++} s={[w * (0.48 + architecture.windowStyle * 0.07), 1.45, d * 0.44]} p={[(architecture.windowStyle - 1) * w * 0.1, H + 0.72, -d * 0.12]} c={trim} />)
    }
    if (!office && architecture.ground !== 'portico') {
      for (let t = 0; t < tanks; t++) els.push(<Tank key={k++} p={[w / 2 - 1.5 - t * 2.0, H, -d / 2 + 1.5]} />)
      if (mumty && architecture.roof !== 'stepped') els.push(<Mumty key={k++} p={[-w / 2 + 2.2, H, -d / 2 + 2.0]} wall={wall} trim={trim} />)
      if (r() < 0.8) els.push(<Dish key={k++} p={[-w / 2 + 0.9, H, front - 0.9]} yaw={0.4 + r() * 0.6} />)
      if (r() < 0.65) els.push(<ClothesLine key={k++} p={[0.3, H, front - 2.0]} len={Math.min(w - 3.2, 6)} seed={seed * 13} />)
    }
  }
  els.push(<Cyl key={k++} rt={0.07} h={H} p={[w / 2 - 0.35, H / 2, front + 0.12]} c={C.GRILLE} rough={0.5} />)

  return (
    <group position={[x, BASE, z]} rotation={[0, rot, 0]}>
      {els}
    </group>
  )
}
