
'use client'

import { C } from '@/lib/palette'
import { BASE } from '../../layout'
import { Box, Door, Sign, Win } from '../../world/kit'
import { MALL, UNIVERSITY } from './layout'

function BhawaniMall() {
  const w = MALL.x1 - MALL.x0
  const d = MALL.z1 - MALL.z0
  return (
    <group position={[(MALL.x0 + MALL.x1) / 2, BASE, (MALL.z0 + MALL.z1) / 2]}>
      <Box s={[w, 13.5, d - 1.45]} p={[0, 6.75, -0.73]} c="#C6BAAB" radius={0.31} />
      {[-1, 1].map((side) => <Box key={side} s={[2.1, 13.5, 2.5]} p={[side * 7.9, 6.75, d / 2 - 1.4]} c="#A75D4D" radius={0.2} />)}
      {Array.from({ length: 9 }, (_, i) => {
        const x = (i - 4) * 1.62
        const z = d / 2 - 0.32 - 0.024 * x * x
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, 0.048 * x, 0]}>
            {[5.4, 8.5, 11.6].map((y) => <Win key={y} p={[0, y, 0]} w={1.61} h={2.78} shade={false} frame="#657985" />)}
          </group>
        )
      })}
      <Box s={[13.4, 3, 0.8]} p={[0, 1.5, d / 2 - 0.46]} c={C.INTERIOR} />
      {[-2.4, 0, 2.4].map((x) => <Win key={x} p={[x, 1.55, d / 2]} w={2.05} h={2.75} shade={false} frame={C.GRILLE} />)}
      <Box s={[14.2, 0.24, 2.55]} p={[0, 3.36, d / 2 + 0.63]} c="#364959" radius={0.12} />
      <Sign p={[0, 3.72, d / 2 + 1.92]} w={10.8} h={1.08} spec={{ title: 'BMC BHAWANI MALL', odia: 'ବିଏମ୍‌ସି ଭବାନୀ ମଲ୍', bg: '#293A43', fg: '#FFF1D3' }} />
      <Box s={[w - 1, 0.48, d - 1]} p={[0, 13.67, -0.36]} c={C.GRILLE} radius={0.16} />
    </group>
  )
}

function RamaDeviFrontage() {
  const w = UNIVERSITY.z1 - UNIVERSITY.z0
  const d = UNIVERSITY.x1 - UNIVERSITY.x0
  return (
    <group position={[(UNIVERSITY.x0 + UNIVERSITY.x1) / 2, BASE, (UNIVERSITY.z0 + UNIVERSITY.z1) / 2]} rotation={[0, Math.PI / 2, 0]}>
      <Box s={[w, 7.7, d - 0.75]} p={[0, 3.85, -0.38]} c="#E6C692" radius={0.17} />
      <Box s={[w + 0.2, 0.42, d - 0.6]} p={[0, 7.85, -0.38]} c="#B45E45" />
      <Box s={[w, 0.2, d - 0.55]} p={[0, 3.55, -0.38]} c={C.WALL_WHITE} />
      {[-7, -4.7, -2.35, 0, 2.35, 4.7, 7].map((x) => <Win key={x} p={[x, 5.6, d / 2 - 0.74]} w={1.5} h={1.65} frame={C.WALL_WHITE} />)}
      <Door p={[0, 0, d / 2 - 0.75]} w={2.45} h={2.7} />
      <Sign p={[0, 3.12, d / 2 - 0.65]} w={8.8} h={0.88} spec={{ title: 'RAMA DEVI WOMEN’S UNIVERSITY', odia: 'ରମାଦେବୀ ମହିଳା ବିଶ୍ୱବିଦ୍ୟାଳୟ', bg: '#744038', fg: '#FFF4D8' }} />
    </group>
  )
}

export function SaheedNagarLandmarks() {
  return (
    <>
      <BhawaniMall />
      <RamaDeviFrontage />
    </>
  )
}
