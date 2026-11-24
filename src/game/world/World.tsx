
'use client'

import type { ReactNode } from 'react'
import { C } from '@/lib/palette'
import { type Block, type Fixture } from '../districts/blocks'
import type { Pose } from '../districts/active'
import { BASE } from '../layout'
import { Portal } from './Portal'
import { Background } from './Background'
import { Building } from './Building'
import { BusStop } from './BusStop'
import { Ground } from './Ground'
import { ShopUnit } from './ShopRow'
import { StaticMerge } from './StaticMerge'
import { StreetPoles } from './StreetPoles'
import { Bush, StreetTrees } from './Trees'
import { Box, Sign } from './kit'

function StreetSign({ x, z, rot, title, odia, sub }: Fixture) {
  return (
    <group position={[x, BASE, z]} rotation={[0, rot, 0]}>
      <Box s={[0.12, 2.65, 0.12]} p={[0, 1.32, 0]} c={C.GRILLE} />
      <Sign p={[0, 2.37, 0.08]} w={3.25} h={0.91} spec={{ title, odia, sub, bg: '#255950', fg: '#FFF6E5' }} />
      <Sign p={[0, 2.37, -0.08]} r={[0, Math.PI, 0]} w={3.25} h={0.91} spec={{ title, odia, sub, bg: '#255950', fg: '#FFF6E5' }} />
    </group>
  )
}

export function World({ block, portal, skyline, children }: {
  block: Block
  portal: Pose
  skyline: 'neighbourhood' | 'campus'
  children: ReactNode
}) {
  return (
    <>
      <StaticMerge>
        <Ground block={block} />
        {block.buildings.map((building) => <Building key={building.seed} {...building} />)}
        {block.shops.map((shop) => <ShopUnit key={shop.seed} {...shop} />)}
        {block.stops.map((stop) => <BusStop key={stop.title} {...stop} />)}
        {block.signs.map((sign) => <StreetSign key={sign.title} {...sign} />)}
        {block.median?.flatMap(({ x0, x1, z0, z1 }, i) =>
          Array.from({ length: Math.floor((z1 - z0) / 3) }, (_, n) => (
            <Bush key={`${i}-${n}`} p={[(x0 + x1) / 2, BASE + 0.06, z0 + 1.5 + n * 3]} s={0.6} seed={1100 + i * 20 + n} flower={C.WALL_PINK} />
          )),
        )}
        <StreetTrees trees={block.trees} />
        <StreetPoles runs={block.poleRuns} />
        <Background skyline={skyline} />
        {children}
      </StaticMerge>
      <Portal pose={portal} />
    </>
  )
}
