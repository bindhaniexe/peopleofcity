'use client'

import { memo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { citySections, citySpawn } from '../city/runtime'
import { PatiaLandmarks } from '../districts/patia/World'
import { SaheedNagarLandmarks } from '../districts/saheed-nagar/World'
import { player } from '../people/bodies'
import { CityLandmark } from './CityLandmark'
import { World } from './World'
import { Box } from './kit'

const visibleSections = (x: number, z: number) => citySections.filter(({ worldBounds: { x0, x1, z0, z1 } }) => {
  return x >= x0 - 72 && x <= x1 + 72 && z >= z0 - 72 && z <= z1 + 72
})

const Section = memo(function Section({ section }: { section: (typeof citySections)[number] }) {
  return (
    <group position={[section.origin[0], 0, section.origin[1]]}>
      <World block={section.block} bounds={section.bounds} water={section.water}>
        {section.id === 'patia' && <PatiaLandmarks />}
        {section.id === 'saheed-nagar' && <SaheedNagarLandmarks />}
        {section.landmarks.map((model) => <CityLandmark key={model.kind} {...model} />)}
      </World>
    </group>
  )
})

export function CityWorld() {
  const [sections, setSections] = useState(() => {
    const { x, z } = citySpawn('saheed-nagar')
    return visibleSections(x, z)
  })
  const last = useRef({ x: NaN, z: NaN })
  useFrame(() => {
    const p = player.pos
    if (!p || Math.hypot(p.x - last.current.x, p.z - last.current.z) < 4) return
    last.current = { x: p.x, z: p.z }
    const nearby = visibleSections(p.x, p.z)
    if (sections.length !== nearby.length || sections.some((section, i) => section !== nearby[i])) setSections(nearby)
  })

  return (
    <>
      <Box s={[850, 0.12, 850]} p={[0, -0.16, 0]} c="#858566" shadow={false} radius={0.02} />
      {sections.map((section) => <Section key={section.id} section={section} />)}
    </>
  )
}
