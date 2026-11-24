
import { registerDistrict } from '../active'
import { buildDistrict } from '../blocks'
import { block, RUPALI_PORTAL } from './layout'

registerDistrict(buildDistrict(block, {
  id: 'saheed-nagar',
  area: 'SAHEED NAGAR',
  spawn: { x: 0, z: -27.5, face: 0 },
  portal: RUPALI_PORTAL,
  arrival: { x: 0, z: -27.5, face: 0 },
  landmarks: [
    { x: 0, z: -34, r: 5, label: 'PORTAL PLAZA' },
    { x: -13, z: -18, r: 10, label: 'RUPALI SQUARE' },
    { x: 15, z: -23.5, r: 9, label: 'RUPALI STREET' },
    { x: -27, z: -32, r: 7, label: 'RAMA DEVI WOMEN’S UNIVERSITY' },
    { x: 23, z: 19, r: 13, label: 'BMC BHAWANI MALL' },
    { x: 4, z: 24, r: 11, label: 'MAHARISHI COLLEGE ROAD' },
    { x: -18, z: 4, r: 12, label: 'JANPATH' },
  ],
  spots: {
    'rupali-square': { label: 'RUPALI SQUARE', blurb: 'On the plaza by Janpath', slots: [[-6, -25, 0], [-4, -23, 0.5], [3, -24, -0.5]] },
    'rupali-snacks': { label: 'RUPALI BARA & GHUGUNI', blurb: 'Beside the snack counter', slots: [[11, -23.5, Math.PI], [14, -23.5, Math.PI], [17, -23.5, Math.PI]] },
    'bhawani-forecourt': { label: 'BHAWANI MALL', blurb: 'On the mall forecourt', slots: [[15, 18.8, Math.PI], [22, 19, Math.PI], [28, 18.8, Math.PI]] },
  },
  breaks: [{ x: 12.5, z: -23.6, face: Math.PI }, { x: 21, z: -23.4, face: Math.PI }],
  radio: [13, 2.2, -26],
  streetAudio: [{ kind: 'market', x: 13, z: -25 }, { kind: 'market', x: 23, z: 18 }],
  orbit: [5, 2.8, -21],
}))
