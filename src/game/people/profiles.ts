
import type { Status } from '../status'

export type Profile = {
  id: string
  name: string
  role: string
  company: string
  /** Where they say they are from, independent of their position in the game. */
  location: string
  building?: string
  previously?: string
  openToWork: boolean
  skills: string[]
  links: { portfolio?: string; linkedin?: string; x?: string }
  character: string
  spot?: { x: number; z: number; face: number }
  path?: [number, number][]
  pause?: number
  sample?: boolean
  status?: Status
}

type Sample = Omit<Profile, 'sample' | 'links' | 'openToWork'> & { spot: NonNullable<Profile['spot']> }

/** Fictional residents use separate anchors so they can coexist with members. */
const SAMPLES: Sample[] = [
  {
    id: 'sample-meera',
    name: 'MEERA MAHAPATRA',
    role: 'Textile Illustrator',
    company: 'Independent',
    location: 'Saheed Nagar',
    character: 'textile',
    spot: { x: -7.8, z: -27.2, face: 0 },
    skills: ['Textiles', 'Illustration', 'Printmaking'],
    building: 'A pattern library for handloom labels',
    status: { emoji: '🎨', text: 'Sketching old shop signs along Janpath', expiresAt: null },
  },
  {
    id: 'sample-bikash',
    name: 'BIKASH SAHOO',
    role: 'Print-shop Owner',
    company: 'Janpath Print & Bind',
    location: 'Saheed Nagar',
    character: 'pm',
    spot: { x: 15.6, z: -25.15, face: Math.PI },
    skills: ['Print production', 'Lettering', 'Binding'],
    building: 'Small-run zines for local artists',
  },
  {
    id: 'sample-farah',
    name: 'FARAH KHAN',
    role: 'Product Designer',
    company: 'Independent',
    location: 'Saheed Nagar',
    character: 'designer',
    spot: { x: 5.5, z: -25.6, face: 0 },
    skills: ['Research', 'Prototyping', 'Accessibility'],
    building: 'An easier way to find a bus stop',
  },
  {
    id: 'sample-om',
    name: 'OM PRADHAN',
    role: 'Street Photographer',
    company: 'Independent',
    location: 'Saheed Nagar',
    character: 'maker',
    spot: { x: 12, z: 19.3, face: Math.PI },
    skills: ['Photography', 'Editing', 'Storytelling'],
    building: 'A photo walk through the city after dusk',
  },
  {
    id: 'sample-aditi',
    name: 'ADITI DAS',
    role: 'Student Developer',
    company: '',
    location: 'Patia',
    character: 'developer:f',
    spot: { x: -14, z: -15.5, face: 0 },
    skills: ['Web development', 'Maps', 'Open source'],
    building: 'A walking map for new students',
    status: { emoji: '💻', text: 'Looking for a hackathon teammate', expiresAt: null },
  },
  {
    id: 'sample-sai',
    name: 'SAI MOHANTY',
    role: 'Engineering Student',
    company: '',
    location: 'Patia',
    character: 'maker',
    spot: { x: -12.7, z: -28.4, face: Math.PI },
    skills: ['CAD', 'Electronics', 'Robotics'],
    building: 'A repairable bike light',
  },
  {
    id: 'sample-riya',
    name: 'RIYA NAYAK',
    role: 'Indie Founder',
    company: 'Independent',
    location: 'Patia',
    character: 'founder',
    spot: { x: -3.8, z: -28.5, face: Math.PI },
    skills: ['Product', 'Community', 'Prototyping'],
    building: 'A studio booking tool for local makers',
  },
  {
    id: 'sample-arif',
    name: 'ARIF ALI',
    role: 'Software Designer',
    company: 'Independent',
    location: 'Patia',
    character: 'rockstar',
    spot: { x: -34.5, z: 13.8, face: 0 },
    skills: ['Interface design', 'Type', 'Design systems'],
    building: 'Odia examples for an open UI kit',
  },
]

export function samplePeople(): Profile[] {
  return SAMPLES.map((profile) => ({ ...profile, sample: true, links: {}, openToWork: false }))
}
