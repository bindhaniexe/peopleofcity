'use client'

import { C } from '@/lib/palette'
import { Box, Cyl, Sign } from './kit'

export function BusVehicle() {
  return (
    <group>
      <Box s={[2.4, 1.83, 6.6]} p={[0, 1.48, 0]} c="#F2E8D9" radius={0.19} />
      <Box s={[2.43, 0.52, 6.59]} p={[0, 0.86, 0]} c={C.TRANSIT_BLUE} radius={0.15} />
      <Box s={[2.24, 0.14, 6.3]} p={[0, 2.43, 0]} c={C.TRANSIT_BLUE} radius={0.06} />
      <Box s={[2.07, 0.86, 0.07]} p={[0, 1.79, 3.31]} c="#334C51" rough={0.22} radius={0.08} />
      <Box s={[1.85, 0.62, 0.07]} p={[0, 1.8, -3.31]} c="#334C51" rough={0.25} radius={0.08} />
      {[-1, 1].map((side) => (
        <group key={side}>
          {[-2.35, -1.15, 0.05, 1.25, 2.45].map((z) => (
            <Box key={z} s={[0.05, 0.72, 1.05]} p={[side * 1.21, 1.78, z]} c="#385456" rough={0.25} radius={0.04} />
          ))}
          {[-2, 2.05].map((z) => (
            <Cyl key={z} rt={0.48} h={0.32} p={[side * 1.04, 0.48, z]} r={[0, 0, Math.PI / 2]} c="#263434" seg={14} />
          ))}
          <Box s={[0.36, 0.19, 0.08]} p={[side * 0.87, 0.9, 3.32]} c="#FFF0C6" grade={false} />
          <Box s={[0.28, 0.21, 0.08]} p={[side * 0.95, 1.01, -3.32]} c="#A94A31" grade={false} />
        </group>
      ))}
      <Sign p={[0, 2.28, 3.34]} w={1.62} h={0.25} depth={0.045} spec={{ title: 'AMA BUS', bg: '#254E64', fg: '#FFF6E5' }} />
    </group>
  )
}
