
'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { C } from '@/lib/palette'
import { type Block, type Rect, groundTiles } from '../districts/blocks'
import { asphaltTex, grassTex, paverTex } from '../textures'
import { texMat } from '../materials'
import { Box } from './kit'

/** UVs stay in world space across tiles, so the pavers line up at every junction. */
function surfaceGeometry({ x0, x1, z0, z1 }: Rect, y: number, repeat: number) {
  const geometry = new THREE.PlaneGeometry(x1 - x0, z1 - z0)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate((x0 + x1) / 2, y, (z0 + z1) / 2)
  const vertices = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, vertices.getX(i) / repeat, -vertices.getZ(i) / repeat)
  return geometry
}

export function Ground({ block, bounds, water }: { block: Block; bounds: Rect; water?: Rect[] }) {
  const materials = {
    asphalt: texMat('district-asphalt', asphaltTex, { rough: 0.96 }),
    pavers: texMat('district-pavers', paverTex, { rough: 0.92 }),
    grass: texMat('district-grass', grassTex, { rough: 0.97 }),
  }
  const pieces = useMemo(() => {
    const tiles = groundTiles(block, bounds)
    const byOrigin = new Map(tiles.map((tile) => [`${tile.rect.x0},${tile.rect.z0}`, tile]))
    return tiles.map(({ rect, height, surface }) => ({
      surface,
      geometry: surfaceGeometry(rect, height, surface === 'pavers' ? 2.8 : 5),
      edges: [
        { next: byOrigin.get(`${rect.x1},${rect.z0}`), x: rect.x1, z: (rect.z0 + rect.z1) / 2, w: 0.13, d: rect.z1 - rect.z0 },
        { next: byOrigin.get(`${rect.x0},${rect.z1}`), x: (rect.x0 + rect.x1) / 2, z: rect.z1, w: rect.x1 - rect.x0, d: 0.13 },
      ].filter(({ next }) => next && next.height !== height).map((edge) => ({
        ...edge,
        low: Math.min(height, edge.next!.height),
        high: Math.max(height, edge.next!.height),
      })),
    }))
  }, [block, bounds])

  return (
    <>
      {pieces.map(({ surface, geometry, edges }, i) => (
        <group key={i}>
          <mesh geometry={geometry} material={materials[surface]} receiveShadow />
          {edges.map(({ x, z, w, d, low, high }) => (
            <Box key={`${x},${z}`} s={[w, high - low + 0.008, d]} p={[x, (low + high) / 2, z]} c={low === 0 ? C.CONCRETE_AGED : C.WALL_WHITE} radius={0.018} shadow={false} />
          ))}
        </group>
      ))}
      {water?.map(({ x0, x1, z0, z1 }) => (
        <Box key={`${x0},${z0}`} s={[x1 - x0, 0.08, z1 - z0]} p={[(x0 + x1) / 2, 0.14, (z0 + z1) / 2]} c="#3D7675" rough={0.22} metal={0.24} shadow={false} radius={0.02} />
      ))}
      {block.lanes.map(({ x, z, length, rot }) => (
        <group key={`${x},${z}`} position={[x, 0.012, z]} rotation={[0, rot, 0]}>
          {Array.from({ length: Math.floor(length / 4) }, (_, i) => (
            <Box key={i} s={[2, 0.013, 0.115]} p={[2.5 + i * 4 - length / 2, 0, 0]} c="#DDD6BC" grade={false} shadow={false} />
          ))}
        </group>
      ))}
      {block.crossings.map(({ x, z, width, rot }) => {
        const stripes = Math.floor(width / 0.82)
        return (
          <group key={`${x},${z}`} position={[x, 0.022, z]} rotation={[0, rot, 0]}>
            {Array.from({ length: stripes }, (_, i) => (
              <Box key={i} s={[0.48, 0.014, 2.3]} p={[(i - (stripes - 1) / 2) * 0.82, 0, 0]} c={C.WALL_WHITE} grade={false} shadow={false} />
            ))}
          </group>
        )
      })}
    </>
  )
}
