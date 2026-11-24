
'use client'

import { useGame } from '../store'
import { SaheedNagarWorld } from '../districts/saheed-nagar/World'
import { PatiaWorld } from '../districts/patia/World'

export function DistrictWorld() {
  const district = useGame((s) => s.district)
  return district === 'patia' ? <PatiaWorld /> : <SaheedNagarWorld />
}
