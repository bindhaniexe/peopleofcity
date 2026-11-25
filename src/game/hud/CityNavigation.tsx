'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cityBounds, citySections } from '../city/runtime'
import { CITY_BUS_STOPS, CITY_PLACES, type CityPlace, type CityPoint } from '../city/layout'
import { walkingDirections } from '../city/walkingDirections'
import { footprint } from '../districts/blocks'
import { districtInfo } from '../districts/registry'
import { shopFootprint } from '../layout'
import { useNet } from '../net/useNet'
import { player } from '../people/bodies'
import { isTyping, requestLook } from '../player/input'
import { useGame } from '../store'
import styles from './CityNavigation.module.css'

const areas = [...new Set(CITY_PLACES.map(({ area }) => area))]
const { x0, x1, z0, z1 } = cityBounds
const mapSections = citySections.map((section) => ({
  ...section,
  footprints: [
    ...section.block.buildings.map(({ x, z, w, d, rot }) => footprint(x, z, w, d, rot)),
    ...section.block.shops.map((shop) => {
      const { w, d } = shopFootprint(shop)
      return footprint(shop.x, shop.z, w, d, shop.rot)
    }),
    ...section.block.solids.filter(({ height }) => height > 3.5).map(({ rect }) => rect),
  ],
}))
const placeLabels: { label: string; x: number; z: number; align?: 'end' }[] = [
  { label: 'Patia', x: -25, z: -230 },
  { label: 'Jayadev Vihar', x: -72, z: -101, align: 'end' },
  { label: 'Saheed Nagar', x: 91, z: -24 },
  { label: 'Unit II', x: -29, z: 82, align: 'end' },
  { label: 'Old Town', x: -29, z: 190, align: 'end' },
]

function MapView({ at, target, route, select }: {
  at: CityPoint
  target?: CityPlace
  route: CityPoint[] | null
  select: (id: string) => void
}) {
  return (
    <svg className={styles.map} viewBox={`${x0 - 31} ${z0 - 12} ${x1 - x0 + 109} ${z1 - z0 + 24}`} aria-label="North-up map of playable Bhubaneswar">
      {mapSections.map(({ id, bounds, origin, block, water, footprints }) => (
        <g key={id} transform={`translate(${origin.join(' ')})`}>
          <rect x={bounds.x0} y={bounds.z0} width={bounds.x1 - bounds.x0} height={bounds.z1 - bounds.z0} fill="#E0DDC9" />
          {block.lawns.map((rect, i) => (
            <rect key={i} x={rect.x0} y={rect.z0} width={rect.x1 - rect.x0} height={rect.z1 - rect.z0} fill="#CDD5B7" />
          ))}
          {block.roads.map((rect, i) => (
            <rect key={i} x={rect.x0} y={rect.z0} width={rect.x1 - rect.x0} height={rect.z1 - rect.z0} fill="#F9F6EA" />
          ))}
          {footprints.map((rect, i) => (
            <rect key={i} x={rect.x0} y={rect.z0} width={rect.x1 - rect.x0} height={rect.z1 - rect.z0} fill="#BFB69F" />
          ))}
          {water?.map((rect, i) => (
            <rect key={i} x={rect.x0} y={rect.z0} width={rect.x1 - rect.x0} height={rect.z1 - rect.z0} fill="#79A5A3" />
          ))}
        </g>
      ))}
      {placeLabels.map(({ label, x, z, align }) => (
        <text key={label} className={styles.mapLabel} x={x} y={z} textAnchor={align}>{label}</text>
      ))}
      {route && <polyline points={route.map((point) => point.join(',')).join(' ')} stroke="#A64829" strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" fill="none" />}
      {CITY_PLACES.map(({ id, point: [x, z], label }) => (
        <circle key={id} className={styles.pin} cx={x} cy={z} r={target?.id === id ? 5 : 3} fill={target?.id === id ? '#AC4829' : '#634C32'} onClick={() => select(id)}>
          <title>{label}</title>
        </circle>
      ))}
      {CITY_BUS_STOPS.map(({ id, point: [x, z], label }) => (
        <rect key={id} x={x - 3.6} y={z - 3.6} width={7.2} height={7.2} rx={1.3} fill="#28566D" stroke="#F9F6EA" strokeWidth={0.8}>
          <title>{label} bus stop</title>
        </rect>
      ))}
      <circle cx={at[0]} cy={at[1]} r={5.4} fill="#216848" stroke="#F9F6EA" strokeWidth={1.4}><title>Your location</title></circle>
    </svg>
  )
}

function MapPanel() {
  const tracked = useGame((s) => s.mapTarget)
  const [selected, setSelected] = useState(tracked)
  const at = useRef<CityPoint>(player.pos ? [player.pos.x, player.pos.z] : [0, 0]).current
  const target = CITY_PLACES.find(({ id }) => id === selected)
  const route = useMemo(() => target ? walkingDirections(at, target.point) : null, [at, target])
  const distance = route?.slice(1).reduce((sum, [x, z], i) => sum + Math.hypot(x - route[i][0], z - route[i][1]), 0)

  return (
    <>
      <div className={styles.mapContent}>
        <div className={styles.chart}>
          <MapView at={at} target={target} route={route} select={setSelected} />
          <span className={styles.north} aria-label="North">N ↑</span>
          <div className={styles.legend}>
            <span><i className={styles.you} /> You</span>
            <span><i className={styles.place} /> Landmark</span>
            <span><i className={styles.stop} /> Bus stop</span>
          </div>
        </div>
        <div className={styles.places} aria-label="Landmarks">
          {areas.map((area) => (
            <section key={area}>
              <h3>{districtInfo(area).name}</h3>
              {CITY_PLACES.filter((place) => place.area === area).map((place) => (
                <button key={place.id} type="button" aria-pressed={selected === place.id} onClick={() => setSelected(place.id)}>
                  {place.label}
                </button>
              ))}
            </section>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <p>{target ? route ? `${target.label} · ${Math.round(distance ?? 0)} m on foot` : 'No walking route available' : 'Choose a landmark for walking directions'}</p>
        {target && route && (
          <button type="button" className={styles.primary} onClick={() => {
            useGame.getState().setMapTarget(target.id)
            requestLook()
          }}>Follow route</button>
        )}
      </div>
    </>
  )
}

export function CityNavigation() {
  const phase = useGame((s) => s.phase)
  const overlay = useGame((s) => s.cityOverlay)
  const ride = useGame((s) => s.ride)
  const nearby = useGame((s) => s.nearbyStop)
  const target = useGame((s) => s.mapTarget)
  const blocked = useGame((s) => !!s.openId || s.searchOpen || s.statusOpen || s.connectOpen || s.invitesOpen || s.profileOpen || s.paused || s.trackStage === 'fly' || s.trackStage === 'hold')
  const elsewhere = useNet((s) => s.status === 'replaced')
  const dialog = useRef<HTMLDialogElement>(null)
  const close = () => {
    useGame.getState().setCityOverlay(null)
    requestLook()
  }

  useEffect(() => {
    if (overlay && !elsewhere && !dialog.current?.open) dialog.current?.showModal()
  }, [overlay, elsewhere])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.repeat || phase !== 'play' || blocked || elsewhere || ride) return
      const game = useGame.getState()
      if (e.code === 'KeyM' && game.cityOverlay !== 'bus') {
        e.preventDefault()
        if (game.cityOverlay === 'map') close()
        else game.setCityOverlay('map')
      }
      if (e.code === 'KeyE' && game.nearbyStop && !game.focusId && !game.cityOverlay) game.setCityOverlay('bus')
      if (e.code === 'KeyX' && game.mapTarget && !game.cityOverlay) game.setMapTarget(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, blocked, elsewhere, ride])

  if (phase !== 'play' || elsewhere) return null
  const stop = CITY_BUS_STOPS.find(({ id }) => id === nearby)
  const destination = CITY_PLACES.find(({ id }) => id === target)
  if (overlay) return (
    <dialog ref={dialog} className={`${styles.dialog} ${overlay === 'bus' ? styles.busDialog : ''}`} aria-labelledby="city-navigation-title" onCancel={(e) => {
      e.preventDefault()
      close()
    }}>
      <header className={styles.header}>
        <h2 id="city-navigation-title">{overlay === 'map' ? 'City map' : stop?.label ?? 'Ama Bus'}</h2>
        <button type="button" className={styles.close} onClick={close} aria-label="Close">×</button>
      </header>
      {overlay === 'map' ? <MapPanel /> : (
        <div className={styles.busStops}>
          <p>Choose where to get off</p>
          {CITY_BUS_STOPS.filter(({ id }) => id !== nearby).map(({ id, label }) => (
            <button type="button" key={id} onClick={() => useGame.getState().board(id)}>{label}<span aria-hidden="true">›</span></button>
          ))}
        </div>
      )}
    </dialog>
  )
  if (blocked) return null
  return (
    <>
      {destination && (
        <div className={styles.trip}>
          <span><small>Walking to</small>{destination.label}</span>
          <button type="button" onClick={() => useGame.getState().setMapTarget(null)} aria-keyshortcuts="X" aria-label="Clear walking route">×</button>
        </div>
      )}
      {stop && !ride && (
        <button type="button" className={styles.board} onClick={() => useGame.getState().setCityOverlay('bus')}>
          <kbd>E</kbd> Take the bus
        </button>
      )}
      {ride && (
        <div className={styles.trip}>
          <span><small>Ama Bus</small>{ride.destination.label}</span>
          <button type="button" onClick={() => useGame.getState().setPaused(true)}>Pause ride</button>
        </div>
      )}
    </>
  )
}
