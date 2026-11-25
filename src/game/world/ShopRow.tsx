'use client'

import type { ReactElement } from 'react'
import { C } from '@/lib/palette'
import { BASE, FH, shopArchitecture, shopFootprint } from '../layout'
import type { BlockShop } from '../districts/blocks'
import { rng } from '../textures'
import { Awning, Balcony, Box, Door, Parapet, Shutter, Sign, Tank, Win } from './kit'

const GROUND_HEIGHT = 3.6

function CounterShelves({ w, z, goods, seed }: { w: number; z: number; goods: string[]; seed: number }) {
  const random = rng(seed)
  const shelves: ReactElement[] = []
  let key = 0
  for (const y of [0.95, 1.65, 2.35]) {
    shelves.push(<Box key={key++} s={[w - 0.4, 0.06, 0.5]} p={[0, y, z]} c={C.WOOD} grade={false} />)
    if (!goods.length) continue
    for (let x = -w / 2 + 0.28; x < w / 2 - 0.45;) {
      const width = 0.21 + random() * 0.23
      const height = 0.16 + random() * 0.23
      const colour = goods[Math.floor(random() * goods.length)]
      shelves.push(<Box key={key++} s={[width, height, 0.29]} p={[x + width / 2, y + 0.04 + height / 2, z]} c={colour} grade={false} shadow={false} />)
      x += width + 0.07
    }
  }
  return <>{shelves}</>
}

/** Shophouses share construction details while the frontage reflects each business. */
export function ShopUnit({ x, floors, wall, sign, shutter, goods, balcony, seed, z, rot, upperSign, front: authoredFront, w: authoredWidth, d: authoredDepth }: BlockShop) {
  const { w, d } = shopFootprint({ w: authoredWidth, d: authoredDepth })
  const architecture = shopArchitecture({ seed, front: authoredFront })
  const { front, roof, entry } = architecture
  const H = GROUND_HEIGHT + (floors - 1) * FH
  const face = d / 2
  const frontDepth = Math.min(3, d * 0.45)
  const opening = w - 1.08
  const rightEntry = entry === 'right'
  const doorSide = rightEntry ? 1 : -1
  const glassDoorX = entry === 'centre' ? 0 : doorSide * (opening / 2 - 0.57)
  const awningColour = [C.SIGN_RED, C.RAIL_GREEN, C.TRANSIT_BLUE][seed % 3]
  const compact = w < 5

  return (
    <group position={[x, BASE, z]} rotation={[0, rot, 0]}>
      <Box s={[w, GROUND_HEIGHT, d - frontDepth]} p={[0, GROUND_HEIGHT / 2, -frontDepth / 2]} c={wall} />
      {[-1, 1].map((side) => (
        <Box key={side} s={[0.54, GROUND_HEIGHT, frontDepth]} p={[side * (w / 2 - 0.27), GROUND_HEIGHT / 2, face - frontDepth / 2]} c={wall} />
      ))}
      <Box s={[opening, 0.065, frontDepth]} p={[0, 0.033, face - frontDepth / 2]} c={C.KOTA} grade={false} shadow={false} />
      <Box s={[opening, 0.72, frontDepth]} p={[0, GROUND_HEIGHT - 0.36, face - frontDepth / 2]} c={wall} />

      {front === 'glass' && (
        <>
          <Box s={[opening, 2.71, 0.11]} p={[0, 1.39, face - 0.14]} c={C.GRILLE} />
          {entry === 'centre' ? [-1, 1].map((side) => (
            <Win key={side} p={[side * (opening + 1.2) / 4, 1.42, face - 0.07]} w={(opening - 1.55) / 2} h={2.17} shade={false} frame={C.STEEL} />
          )) : <Win p={[-doorSide * 0.58, 1.42, face - 0.07]} w={opening - 1.44} h={2.17} shade={false} frame={C.STEEL} />}
          <Win p={[glassDoorX, 1.32, face - 0.066]} w={0.98} h={2.47} shade={false} door frame={C.STEEL} />
          <Box s={[opening + 0.2, 0.13, 0.68]} p={[0, 3.02, face + 0.13]} c={C.GRILLE} />
        </>
      )}

      {front === 'counter' && (
        <>
          <Box s={[opening, 2.65, 0.1]} p={[0, 1.35, face - frontDepth + 0.09]} c={C.INTERIOR} rough={0.95} />
          {shutter !== 'closed' && <CounterShelves w={opening} z={face - frontDepth + 0.45} goods={goods} seed={seed} />}
          <Box s={[opening * (compact ? 0.9 : 0.71), 0.94, 0.56]} p={[-doorSide * (compact ? 0.05 : opening * 0.1), 0.47, face - 0.66]} c={C.WOOD} />
          <Box s={[opening * (compact ? 0.92 : 0.74), 0.065, 0.63]} p={[-doorSide * (compact ? 0.05 : opening * 0.1), 0.97, face - 0.66]} c={C.WALL_WHITE} />
          {shutter === 'closed' ? <Shutter p={[0, 1.39, face - 0.03]} w={opening} h={2.68} /> : (
            <>
              {shutter === 'half' && <Shutter p={[0, 2.22, face - 0.03]} w={opening} h={1.02} />}
              <Awning p={[0, 2.88, face - 0.25]} w={w - 0.26} depth={compact ? 0.69 : 1.03} a={awningColour} b={C.WALL_WHITE} />
            </>
          )}
        </>
      )}

      {front === 'shutter' && (
        <>
          <Box s={[opening, 2.7, 0.14]} p={[0, 1.39, face - 0.13]} c={C.WOOD} />
          <Shutter p={[-doorSide * 0.58, 1.38, face - 0.027]} w={opening - 1.25} h={2.61} />
          <Door p={[doorSide * (opening / 2 - 0.51), 0.04, face - 0.07]} w={0.79} h={2.29} frame={C.CONCRETE_AGED} c={C.GRILLE} />
          <Box s={[w - 0.22, 0.18, 0.45]} p={[0, 2.93, face + 0.11]} c={C.CONCRETE_AGED} />
        </>
      )}

      {floors > 1 && <Box s={[w, H - GROUND_HEIGHT, d]} p={[0, GROUND_HEIGHT + (H - GROUND_HEIGHT) / 2, 0]} c={wall} />}
      {Array.from({ length: floors - 1 }, (_, floor) => {
        const base = GROUND_HEIGHT + floor * FH
        const balconyX = doorSide * w * 0.22
        return (
          <group key={floor}>
            <Box s={[w + 0.12, 0.17, d + 0.12]} p={[0, base, 0]} c={C.WALL_WHITE} />
            {balcony && floor === 0 ? (
              <Balcony p={[balconyX, base, face]} w={Math.min(w * 0.42, 2.7)} depth={0.8} wall={C.WALL_WHITE} plant curtain={C.TERRACOTTA} />
            ) : (
              <Win p={[balconyX, base + 1.61, face]} w={Math.min(w * 0.24, 1.65)} h={1.36} grille={front !== 'glass'} curtain={C.WALL_BUTTER} />
            )}
            <Win p={[-balconyX, base + 1.61, face]} w={Math.min(w * 0.28, 1.8)} h={roof === 'cornice' ? 1.76 : 1.3} curtain={C.WALL_POWDER} />
          </group>
        )
      })}
      {roof === 'parapet' && <Parapet w={w} d={d} wall={wall} y={H} />}
      {roof === 'cornice' && (
        <>
          <Box s={[w + 0.08, 0.22, d + 0.08]} p={[0, H + 0.09, 0]} c={C.CONCRETE_AGED} />
          <Box s={[w * 0.93, 0.42, 0.23]} p={[0, H + 0.37, face - 0.12]} c={wall} />
        </>
      )}
      {roof === 'shed' && <Box s={[w + 0.08, 0.16, d / Math.cos(0.08)]} p={[0, H + Math.sin(0.08) * d / 2 + 0.04, 0]} r={[0.08, 0, 0]} c={awningColour} />}
      {roof !== 'shed' && floors > 2 && <Tank p={[w * 0.23, H, -d * 0.23]} />}

      {upperSign && <Sign p={[0, 3.35, face + 0.18]} w={w - 0.42} h={0.7} spec={{ title: 'ANUJ TIME SQUARE', bg: C.GRILLE, fg: C.WALL_WHITE }} />}
      <Sign p={[0, upperSign ? H - 0.14 : 3.35, face + 0.23]} w={w - 0.48} h={roof === 'cornice' ? 0.72 : 0.83} spec={sign} />
    </group>
  )
}
