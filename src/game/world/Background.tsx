
'use client'

import { C } from '@/lib/palette'
import { Box } from './kit'
import { RainTree } from './Trees'

const outskirts = [
  [-37, -55, 15, 8], [-4, -59, 17, 10], [28, -56, 13, 7], [50, -45, 15, 10],
  [54, -13, 11, 7], [57, 13, 15, 10], [55, 36, 11, 8], [40, 58, 15, 10],
  [10, 58, 19, 8], [-26, 60, 14, 9], [-52, 46, 11, 8], [-57, 16, 14, 9],
  [-57, -14, 13, 8], [-59, -45, 19, 10], [-75, 27, 19, 10], [73, 43, 14, 10],
] as const

export function Background({ skyline }: { skyline: 'neighbourhood' | 'campus' }) {
  const campus = skyline === 'campus'
  const walls = campus ? [C.WALL_WHITE, C.WALL_BUTTER, '#B6C1C8', '#D0B59E'] : [C.WALL_BUTTER, C.WALL_POWDER, C.WALL_SALMON, C.WALL_MINT]
  const offices = [[-79, 10, 19, 20], [-96, 24, 25, 28], [-83, 49, 19, 23], [-112, 56, 23, 32]] as const
  return (
    <>
      {outskirts.map(([x, z, w, h], i) => (
        <group key={`${x},${z}`} position={[x, 0, z]}>
          <Box s={[w, h, 10]} p={[0, h / 2, 0]} c={walls[i % walls.length]} radius={0.24} />
          <Box s={[w + 0.3, 0.45, 10.25]} p={[0, h, 0]} c={C.WALL_WHITE} />
          <Box s={[w * 0.75, 0.68, 10.08]} p={[0, h * 0.63, 0]} c={C.GRILLE} shadow={false} />
          <RainTree p={[w / 2 + 2.8, 0.15, 5]} s={1.12} seed={100 + i % 4} detail={2} />
        </group>
      ))}
      {campus && offices.map(([x, z, w, h]) => (
        <group key={`${x},${z}`} position={[x, 0, z]}>
          <Box s={[w, h, 16]} p={[0, h / 2, 0]} c="#718A99" rough={0.4} radius={0.32} />
          {[0.26, 0.51, 0.76, 0.99].map((level) => (
            <Box key={level} s={[w + 0.2, 0.36, 16.2]} p={[0, h * level, 0]} c="#BCCAD0" shadow={false} />
          ))}
        </group>
      ))}
    </>
  )
}
