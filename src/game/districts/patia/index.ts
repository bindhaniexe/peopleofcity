
import { registerDistrict } from '../active'
import { buildDistrict } from '../blocks'
import { block, KIIT_PORTAL } from './layout'

registerDistrict(buildDistrict(block, {
  id: 'patia',
  area: 'PATIA',
  spawn: { x: 4, z: -13.5, face: Math.PI },
  portal: KIIT_PORTAL,
  arrival: { x: 4, z: -13.5, face: Math.PI },
  landmarks: [
    { x: 21, z: -23, r: 9, label: 'KIIT SQUARE' },
    { x: 4, z: -7, r: 4.5, label: 'PORTAL PLAZA' },
    { x: -11, z: -15, r: 7, label: 'KIIT CAMPUS' },
    { x: -10, z: -28, r: 13, label: 'KIIT ROAD' },
    { x: 35, z: -28, r: 7, label: 'MARUTI MALL' },
    { x: 21, z: 24, r: 9, label: 'PATIA SQUARE' },
    { x: -32, z: 18, r: 13, label: 'INFOCITY' },
    { x: -4, z: 24, r: 15, label: 'INFOCITY ROAD' },
    { x: 21, z: 2, r: 11, label: 'NANDANKANAN ROAD' },
  ],
  spots: {
    'kiit-plaza': { label: 'KIIT CAMPUS', blurb: 'Outside the campus gate', slots: [[-11, -16, 0], [-7, -16, -0.4], [-4, -16, 0.4]] },
    'campus-cha': { label: 'CAMPUS CHA', blurb: 'At the tea counter on KIIT Road', slots: [[-10, -28, Math.PI], [-7, -28, Math.PI], [-15, -28, Math.PI]] },
    'infocity-walk': { label: 'INFOCITY WALK', blurb: 'Along the shaded path to Infocity', slots: [[-32, 12, 0], [-33, 16, 0.4], [-30, 18, -0.5]] },
  },
  breaks: [{ x: -11, z: -28, face: Math.PI }, { x: -16, z: -28, face: Math.PI }, { x: -3, z: 29, face: 0 }],
  radio: [-9, 2.2, -30],
  streetAudio: [{ kind: 'bicycle', x: -32, z: 4 }, { kind: 'campus', x: -11, z: -15 }],
  orbit: [1, 3, -18],
}))
