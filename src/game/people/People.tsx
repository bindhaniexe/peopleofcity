'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { usePeople } from './directory'
import { Person } from './Person'
import { declutter } from './plates'
import { resetWanderBudget } from './wander'
import { useNet } from '../net/useNet'

export function People() {
  const size = useThree((s) => s.size)
  const live = useNet((s) => s.live)
  const online = useNet((s) => s.online)
  const people = usePeople().filter((p) => live.has(p.id) || !online[p.id])
  // Runs after every <Person/> has posted its plate request this frame.
  useFrame(() => {
    declutter(size.width, size.height)
    resetWanderBudget()
  })
  return (
    <>
      {people.map((p) => (
        <Person key={p.id} p={p} />
      ))}
    </>
  )
}
