
'use client'

import { C } from '@/lib/palette'
import { BASE } from '../../layout'
import { Box, Sign, Win } from '../../world/kit'
import { World } from '../../world/World'
import { block, CAMPUS, CAMPUS_GATE, INFOCITY, INFOCITY_GATE, KIIT_PORTAL, MARUTI } from './layout'

function CampusFrontage() {
  const w = CAMPUS.x1 - CAMPUS.x0
  const d = CAMPUS.z1 - CAMPUS.z0
  return (
    <>
      <group position={[(CAMPUS.x0 + CAMPUS.x1) / 2, BASE, (CAMPUS.z0 + CAMPUS.z1) / 2]} rotation={[0, Math.PI, 0]}>
        <Box s={[w, 9.8, d]} p={[0, 4.9, 0]} c="#E7D5B0" radius={0.23} />
        <Box s={[w + 0.28, 0.34, d + 0.2]} p={[0, 9.85, 0]} c="#983E35" />
        <Box s={[5.1, 11, 0.65]} p={[0, 5.5, d / 2 - 0.25]} c="#AE5442" />
        {[-9, -6, -3.5, 3.5, 6, 9].map((x) => (
          <group key={x}>
            {[1.7, 4.9, 8.1].map((y) => <Win key={y} p={[x, y, d / 2]} w={1.62} h={1.85} frame="#FFF0D6" />)}
          </group>
        ))}
        <Sign p={[0, 4.3, d / 2 + 0.14]} w={4.8} h={1} spec={{ title: 'KIIT UNIVERSITY', odia: 'କିଟ୍ ବିଶ୍ୱବିଦ୍ୟାଳୟ', bg: '#216752', fg: '#FFF3D6' }} />
      </group>
      <group position={[CAMPUS_GATE.x, BASE, CAMPUS_GATE.z]}>
        {block.solids.slice(3, 5).map(({ rect }) => {
          const x = (rect.x0 + rect.x1) / 2 - CAMPUS_GATE.x
          return (
            <group key={x} position={[x, 0, 0]}>
              <Box s={[rect.x1 - rect.x0, 1.7, 0.36]} p={[0, 0.85, 0]} c="#DDD3BC" />
              <Box s={[rect.x1 - rect.x0, 0.16, 0.44]} p={[0, 1.78, 0]} c="#A25042" />
            </group>
          )
        })}
        {[-3, 3].map((x) => <Box key={x} s={[0.95, 4.3, 0.9]} p={[x, 2.15, 0]} c="#B3614D" />)}
        <Box s={[7.65, 0.3, 1.75]} p={[0, 4.32, 0]} c="#2E594C" radius={0.1} />
        <Sign p={[0, 3.93, -0.9]} r={[0, Math.PI, 0]} w={5.5} h={0.93} spec={{ title: 'KIIT CAMPUS', odia: 'କିଟ୍ ପରିସର', bg: '#234D41', fg: '#FFF5DA' }} />
      </group>
    </>
  )
}

function InfocityFrontage() {
  const w = INFOCITY.x1 - INFOCITY.x0
  const d = INFOCITY.z1 - INFOCITY.z0
  return (
    <>
      <group position={[(INFOCITY.x0 + INFOCITY.x1) / 2, BASE, (INFOCITY.z0 + INFOCITY.z1) / 2]} rotation={[0, Math.PI, 0]}>
        <Box s={[w, 10.6, d]} p={[0, 5.3, 0]} c="#B9C6C9" radius={0.24} />
        {[-8.5, -5.1, -1.7, 1.7, 5.1, 8.5].map((x) => (
          <group key={x}>
            {[2.2, 5.5, 8.8].map((y) => <Win key={y} p={[x, y, d / 2]} w={3.05} h={2.55} frame="#58737F" shade={false} />)}
          </group>
        ))}
        <Box s={[w - 0.2, 0.43, d]} p={[0, 10.64, 0]} c="#566E7C" />
      </group>
      <group position={[INFOCITY_GATE.x, BASE, INFOCITY_GATE.z]}>
        {[-2.5, 2.5].map((x) => <Box key={x} s={[0.8, 3.8, 0.8]} p={[x, 1.9, 0]} c={C.CONCRETE_AGED} />)}
        <Box s={[6.1, 0.32, 0.76]} p={[0, 3.82, 0]} c={C.GRILLE} />
        <Sign p={[0, 3.62, 0.48]} w={4.65} h={0.8} spec={{ title: 'INFOCITY', odia: 'ଇନ୍‌ଫୋସିଟି', sub: 'CHANDAKA', bg: '#315562', fg: '#FFF4DF' }} />
      </group>
    </>
  )
}

function MarutiMall() {
  const w = MARUTI.x1 - MARUTI.x0
  const d = MARUTI.z1 - MARUTI.z0
  return (
    <group position={[(MARUTI.x0 + MARUTI.x1) / 2, BASE, (MARUTI.z0 + MARUTI.z1) / 2]}>
      <Box s={[w, 9.2, d]} p={[0, 4.6, 0]} c="#D3BB9F" radius={0.23} />
      <Box s={[w + 0.1, 0.24, 0.9]} p={[0, 4.4, d / 2 + 0.34]} c="#855B4A" />
      {[-3.8, 0, 3.8].map((x) => <Win key={x} p={[x, 6.55, d / 2]} w={3.3} h={2.65} shade={false} frame="#576B74" />)}
      <Sign p={[0, 8.88, d / 2 + 0.1]} w={8.75} h={1.05} spec={{ title: 'MARUTI MALL', odia: 'ମାରୁତି ମଲ୍', bg: '#365351', fg: '#FFF3D6' }} />
      <Sign p={[0, 3.57, d / 2 + 0.14]} w={6.1} h={1.13} spec={{ title: 'V-MART', odia: 'ଭି-ମାର୍ଟ', bg: '#802F2D', fg: '#FFF3D6' }} />
      <Win p={[0, 1.35, d / 2]} w={5.2} h={2.45} shade={false} frame={C.GRILLE} />
    </group>
  )
}

export function PatiaWorld() {
  return (
    <World block={block} portal={KIIT_PORTAL} skyline="campus">
      <CampusFrontage />
      <InfocityFrontage />
      <MarutiMall />
    </World>
  )
}
