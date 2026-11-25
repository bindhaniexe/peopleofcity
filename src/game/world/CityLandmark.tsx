'use client'

import { Vector2 } from 'three'
import { C } from '@/lib/palette'
import { BASE } from '../layout'
import { mat } from '../materials'
import { Awning, Box, Cyl, Door, Sign, Win } from './kit'

export type CityLandmark = {
  kind: 'pal-heights' | 'stadium' | 'science-centre' | 'ram-mandir' | 'market-building' | 'utkal-galleria' | 'lingaraj'
  x: number
  z: number
  w: number
  d: number
  rot?: number
}

type Footprint = Pick<CityLandmark, 'w' | 'd'>

function PalHeights({ w, d }: Footprint) {
  const face = d / 2
  const bays = Array.from({ length: 6 }, (_, i) => (i - 2.5) * w * 0.146)
  return (
    <>
      <Box s={[w, 10.1, d * 0.9]} p={[0, 5.05, -d * 0.05]} c={C.CONCRETE_AGED} />
      <Box s={[w * 0.34, 12.8, d * 0.65]} p={[-w * 0.3, 6.4, -d * 0.1]} c={C.CONCRETE_WARM} />
      <Box s={[w * 0.6, 8.4, 0.28]} p={[w * 0.18, 5.42, face - d * 0.093]} c={C.GLASS} />
      {[3.6, 6.3, 8.56].map((y) => (
        <group key={y}>
          <Box s={[w, 0.21, 0.4]} p={[0, y, face - d * 0.085]} c={C.WALL_WHITE} />
          {bays.slice(0, 2).map((x) => <Win key={x} p={[x, y + 1.04, face - d * 0.1]} w={w * 0.083} h={1.46} shade={false} />)}
        </group>
      ))}
      {bays.slice(2).map((x) => (
        <Box key={x} s={[0.13, 8, 0.29]} p={[x, 5.46, face - d * 0.081]} c={C.STEEL} />
      ))}
      <Box s={[w * 0.47, 0.22, d * 0.17]} p={[w * 0.13, 3.23, face - d * 0.085]} c={C.SIGN_RED} />
      <Win p={[w * 0.13, 1.42, face - d * 0.085]} w={w * 0.23} h={2.72} door shade={false} frame={C.STEEL} />
      <Sign p={[w * 0.13, 3.6, face - 0.12]} w={w * 0.43} h={0.96} spec={{ title: 'PAL HEIGHTS MALL', odia: 'ପାଲ ହାଇଟ୍ସ ମଲ୍', bg: C.GRILLE, fg: C.WALL_WHITE }} />
    </>
  )
}

const STADIUM_BOWL = [
  [0.95, 0.04], [0.95, 2.15], [1, 2.5], [1, 3.65], [0.96, 3.65], [0.96, 3.17],
  [0.91, 3.17], [0.91, 2.76], [0.86, 2.76], [0.86, 2.35], [0.81, 2.35], [0.81, 1.94],
  [0.76, 1.94], [0.76, 1.53], [0.71, 1.53], [0.71, 1.12], [0.66, 1.12], [0.66, 0.04], [0.95, 0.04],
].map(([r, y]) => new Vector2(r, y))

function Stadium({ w, d }: Footprint) {
  return (
    <>
      <Box s={[w, 0.14, d]} p={[0, 0.07, 0]} c={C.PAVER} radius={0.1} />
      <group position={[0, 0.12, -d * 0.035]} scale={[w * 0.445, 1, d * 0.395]}>
        <mesh castShadow receiveShadow material={mat(C.CONCRETE_WARM, { rough: 0.75 })}>
          <latheGeometry args={[STADIUM_BOWL, 64]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={mat(C.TERRACOTTA)} receiveShadow>
          <circleGeometry args={[0.66, 64]} />
        </mesh>
        {[0.535, 0.59, 0.642].map((radius) => (
          <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.027, 0]} material={mat(C.ROAD_PAINT)}>
            <ringGeometry args={[radius - 0.006, radius, 64]} />
          </mesh>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]} material={mat(C.LEAF_MID)}>
          <circleGeometry args={[0.51, 64]} />
        </mesh>
      </group>
      <Box s={[w * 0.38, 0.4, d * 0.17]} p={[0, 5, -d * 0.32]} c={C.TRANSIT_BLUE} />
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => (
        <group key={`${x},${z}`} position={[x * w * 0.4, 0, z * d * 0.34]}>
          <Cyl rt={0.16} rb={0.26} h={9.3} p={[0, 4.65, 0]} c={C.STEEL} />
          <Box s={[1.7, 0.66, 0.21]} p={[0, 9.3, 0]} c={C.WALL_WHITE} />
        </group>
      )))}
      <Box s={[w * 0.45, 0.38, d * 0.1]} p={[0, 3.05, d * 0.44]} c={C.TRANSIT_BLUE} />
      {[-1, 1].map((x) => <Box key={x} s={[0.43, 3, 0.43]} p={[x * w * 0.21, 1.5, d * 0.45]} c={C.STEEL} />)}
      <Sign p={[0, 3.27, d / 2 - 0.24]} w={w * 0.39} h={0.92} spec={{ title: 'KALINGA STADIUM', odia: 'କଳିଙ୍ଗ ଷ୍ଟାଡିୟମ୍', bg: C.TRANSIT_BLUE, fg: C.WALL_WHITE }} />
    </>
  )
}

function ScienceCentre({ w, d }: Footprint) {
  const face = d / 2
  return (
    <>
      <Box s={[w, 5.3, d * 0.75]} p={[0, 2.65, -d * 0.125]} c={C.TERRACOTTA} />
      <Box s={[w * 0.72, 0.24, d * 0.77]} p={[-w * 0.14, 5.25, -d * 0.113]} c={C.WALL_WHITE} />
      <Box s={[w * 0.29, 3.2, d * 0.26]} p={[-w * 0.17, 1.6, face - d * 0.131]} c={C.CONCRETE_WARM} />
      <Win p={[-w * 0.17, 1.49, face]} w={w * 0.19} h={2.55} door shade={false} frame={C.GRILLE} />
      {[-0.36, -0.16, 0.08, 0.28, 0.4].map((x) => (
        <Win key={x} p={[x * w, 4.03, d * 0.25]} w={w * 0.08} h={1.28} shade={false} />
      ))}
      <group position={[w * 0.29, 0, d * 0.34]}>
        <Cyl rt={0.88} h={0.58} p={[0, 0.29, 0]} c={C.CONCRETE_AGED} />
        <Cyl rt={0.09} h={1.58} p={[0, 1.25, 0]} c={C.STEEL} />
        {[-1, 1].map((side) => (
          <mesh key={side} rotation={[side * 0.48, 0, side * 0.4]} position={[0, 2.17, 0]} material={mat(side > 0 ? C.TRANSIT_BLUE : C.KERB_YELLOW)}>
            <torusGeometry args={[0.75, 0.07, 8, 28]} />
          </mesh>
        ))}
      </group>
      <Sign p={[-w * 0.17, 3.45, face - 0.11]} w={w * 0.4} h={0.91} spec={{ title: 'REGIONAL SCIENCE CENTRE', odia: 'ଆଞ୍ଚଳିକ ବିଜ୍ଞାନ କେନ୍ଦ୍ର', bg: C.GRILLE, fg: C.WALL_WHITE }} />
    </>
  )
}

function RamSpire({ x, z, y, radius, height }: { x: number; z: number; y: number; radius: number; height: number }) {
  return (
    <group position={[x, y, z]}>
      {Array.from({ length: 7 }, (_, layer) => {
        const step = layer / 7
        const width = radius * (1 - step * 0.85)
        return (
          <Cyl key={layer} seg={8} rt={width * 0.84} rb={width} h={height / 7 + 0.01} p={[0, height * (step + 1 / 14), 0]} c={layer % 2 === 0 ? C.FLAME : C.TERRACOTTA} />
        )
      })}
      <Cyl seg={12} rt={radius * 0.11} rb={radius * 0.21} h={height * 0.14} p={[0, height * 1.06, 0]} c={C.KERB_YELLOW} />
    </group>
  )
}

function RamMandir({ w, d }: Footprint) {
  const face = d / 2
  return (
    <>
      <Box s={[w, 0.38, d]} p={[0, 0.19, 0]} c={C.PATH} />
      <Box s={[w * 0.81, 3.1, d * 0.71]} p={[0, 1.79, -d * 0.065]} c={C.TERRACOTTA} />
      <Box s={[w * 0.87, 0.26, d * 0.75]} p={[0, 3.47, -d * 0.065]} c={C.WALL_SALMON} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <RamSpire x={w * 0.29 * side} z={-d * 0.069} y={3.53} radius={w * 0.108} height={5.6} />
          <RamSpire x={w * 0.18 * side} z={d * 0.205} y={3.52} radius={w * 0.074} height={3.8} />
          <Cyl seg={8} rt={0.22} rb={0.31} h={2.65} p={[side * w * 0.16, 1.65, face - d * 0.16]} c={C.FLAME} />
        </group>
      ))}
      <RamSpire x={0} z={-d * 0.13} y={3.56} radius={w * 0.148} height={8.1} />
      <Box s={[w * 0.37, 0.3, d * 0.16]} p={[0, 3.27, face - d * 0.135]} c={C.FLAME} />
      <Door p={[0, 0.35, face - d * 0.205]} w={w * 0.13} h={2.4} c={C.WOOD} frame={C.CONCRETE_WARM} />
      <Sign p={[0, 2.88, face - d * 0.205]} w={w * 0.26} h={0.56} spec={{ title: 'RAM MANDIR', odia: 'ରାମ ମନ୍ଦିର', bg: C.SIGN_RED, fg: C.WALL_WHITE }} />
    </>
  )
}

function MarketBuilding({ w, d }: Footprint) {
  const face = d / 2
  const bays = [-0.36, -0.12, 0.12, 0.36]
  return (
    <>
      <Box s={[w, 4.7, d * 0.82]} p={[0, 2.35, -d * 0.09]} c={C.CONCRETE_WARM} />
      <Box s={[w, 0.34, d * 0.18]} p={[0, 3.3, face - d * 0.09]} c={C.WALL_WHITE} />
      {[-0.49, -0.25, 0, 0.25, 0.49].map((x) => (
        <Box key={x} s={[0.39, 3.22, 0.36]} p={[x * w, 1.61, face - 0.22]} c={C.CONCRETE_AGED} />
      ))}
      {bays.map((x, i) => (
        <group key={x} position={[x * w, 0, 0]}>
          <Win p={[0, 1.49, face - d * 0.176]} w={w * 0.16} h={2.62} shade={false} frame={C.WOOD} />
          <Awning p={[0, 2.96, face - d * 0.156]} w={w * 0.205} depth={Math.min(d * 0.1, 1.3)} a={i % 2 === 0 ? C.SIGN_RED : C.RAIL_GREEN} b={C.WALL_BUTTER} />
          <Box s={[w * 0.13, 0.37, 0.16]} p={[0, 4.01, face - d * 0.17]} c={C.TERRACOTTA} />
        </group>
      ))}
      <Box s={[w * 0.56, 0.33, d * 0.34]} p={[0, 4.72, -d * 0.11]} c={C.PATH} />
      <Sign p={[0, 3.77, face - 0.17]} w={w * 0.43} h={0.79} spec={{ title: 'MARKET BUILDING', odia: 'ମାର୍କେଟ ବିଲ୍ଡିଂ', sub: 'UNIT II', bg: C.SIGN_RED, fg: C.WALL_WHITE }} />
    </>
  )
}

function UtkalGalleria({ w, d }: Footprint) {
  const face = d / 2
  return (
    <>
      <Box s={[w, 11, d * 0.92]} p={[0, 5.5, -d * 0.04]} c={C.GRILLE} />
      <Box s={[w * 0.67, 9.22, 0.24]} p={[-w * 0.135, 5.81, face - d * 0.078]} c={C.GLASS} />
      <Box s={[w * 0.24, 9.95, 0.31]} p={[w * 0.313, 5.64, face - d * 0.075]} c={C.TRUNK} />
      {Array.from({ length: 7 }, (_, i) => -0.4 + i * 0.087).map((x) => (
        <Box key={x} s={[0.13, 8.96, 0.23]} p={[w * x, 5.82, face - d * 0.067]} c={C.STEEL} />
      ))}
      {[2.9, 5.95, 8.8].map((y) => (
        <Box key={y} s={[w * 0.61, 0.16, 0.25]} p={[-w * 0.12, y, face - d * 0.064]} c={C.WALL_WHITE} />
      ))}
      {Array.from({ length: 13 }, (_, i) => 0.212 + i * 0.017).map((x, i) => (
        <Box key={x} s={[0.24, 8.89, 0.28]} p={[w * x, 5.7 + (i % 3) * 0.18, face - d * 0.064]} c={i % 3 === 0 ? C.CONCRETE_AGED : C.PATH} />
      ))}
      <Box s={[w * 0.52, 0.24, d * 0.12]} p={[-w * 0.11, 3.1, face - d * 0.062]} c={C.GRILLE} />
      <Win p={[-w * 0.13, 1.44, face - d * 0.069]} w={w * 0.28} h={2.8} frame={C.STEEL} door shade={false} />
      <Sign p={[-w * 0.08, 9.7, face - d * 0.038]} w={w * 0.57} h={1.04} spec={{ title: 'UTKAL KANIKA GALLERIA', odia: 'ଉତ୍କଳ କନିକା ଗ୍ୟାଲେରିଆ', bg: C.GRILLE, fg: C.WALL_WHITE }} />
    </>
  )
}

function StoneTower({ x, z, width, height }: { x: number; z: number; width: number; height: number }) {
  const courses = [1, 0.995, 0.98, 0.965, 0.94, 0.9, 0.85, 0.79, 0.71, 0.61, 0.49, 0.35]
  const courseHeight = height / courses.length
  return (
    <group position={[x, 0.45, z]}>
      {courses.map((scale, i) => (
        <group key={i} position={[0, (i + 0.5) * courseHeight, 0]}>
          <Box s={[width * scale, courseHeight + 0.02, width * scale]} c={i % 3 === 0 ? C.CONCRETE_AGED : C.CONCRETE_WARM} />
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
            <group key={angle} rotation={[0, angle, 0]}>
              <Box s={[width * scale * 0.29, courseHeight * 0.96, width * scale * 0.08]} p={[0, 0, width * scale * 0.51]} c={C.CONCRETE_AGED} />
            </group>
          ))}
        </group>
      ))}
      <Cyl rt={width * 0.22} rb={width * 0.24} h={0.36} p={[0, height + 0.19, 0]} c={C.CONCRETE_WARM} seg={16} />
      <Cyl rt={width * 0.035} rb={width * 0.14} h={0.58} p={[0, height + 0.65, 0]} c={C.CONCRETE_AGED} />
    </group>
  )
}

function Lingaraj({ w, d }: Footprint) {
  const stepCount = 6
  return (
    <>
      <Box s={[w, 0.5, d]} p={[0, 0.25, 0]} c={C.CONCRETE_AGED} />
      <Box s={[w * 0.92, 0.22, d * 0.94]} p={[0, 0.53, 0]} c={C.CONCRETE_WARM} />
      <StoneTower x={0} z={-d * 0.24} width={Math.min(w * 0.51, d * 0.46)} height={15.4} />
      {[-1, 1].map((side) => (
        <StoneTower key={side} x={side * w * 0.34} z={d * 0.075} width={w * 0.19} height={4.15} />
      ))}
      <Box s={[w * 0.45, 2.95, d * 0.47]} p={[0, 1.91, d * 0.225]} c={C.CONCRETE_AGED} />
      {Array.from({ length: stepCount }, (_, i) => {
        const width = 1 - i / 7
        return <Box key={i} s={[w * 0.51 * width, 0.47, d * 0.46 * width]} p={[0, 3.38 + i * 0.45, d * 0.185]} c={i % 2 === 0 ? C.CONCRETE_WARM : C.CONCRETE_AGED} />
      })}
      <Door p={[0, 0.52, d * 0.46]} w={w * 0.11} h={2.32} c={C.WOOD} frame={C.CONCRETE_WARM} />
    </>
  )
}

const MODELS = {
  'pal-heights': PalHeights,
  stadium: Stadium,
  'science-centre': ScienceCentre,
  'ram-mandir': RamMandir,
  'market-building': MarketBuilding,
  'utkal-galleria': UtkalGalleria,
  lingaraj: Lingaraj,
}

/** Each landmark has its own geometry within the footprint reserved in the city layout. */
export function CityLandmark({ kind, x, z, w, d, rot = 0 }: CityLandmark) {
  const Model = MODELS[kind]
  return (
    <group position={[x, BASE, z]} rotation={[0, rot, 0]}>
      <Model w={w} d={d} />
    </group>
  )
}
