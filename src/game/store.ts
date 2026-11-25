import { create } from 'zustand'
import { DEFAULT_DISTRICT, districtInfo, type DistrictId } from './districts/registry'
import { busTrip, type BusTrip } from './city/transit'

type Phase = 'intro' | 'create' | 'play'

export type TrackStage = 'fly' | 'hold' | 'walk' | 'found' | null

type Toast = { msg: string; tone: 'good' | 'info' | 'bad'; id: number } | null

type GameState = {
  phase: Phase
  ready: boolean
  enteredAt: number
  landmark: string
  pointerLocked: boolean
  /** Person you're close enough to talk to. */
  focusId: string | null
  /** Person whose profile panel is open. */
  openId: string | null
  searchOpen: boolean
  /** Your status editor (Phase 5F). */
  statusOpen: boolean
  /** Connections screen (Phase 5G). */
  connectOpen: boolean
  /** Your invites screen (Phase 5D). */
  invitesOpen: boolean
  /** the YOU panel's PROFILE tab (STATUS = statusOpen, INVITES = invitesOpen; one at a time) */
  profileOpen: boolean
  /** Pause menu (Esc while exploring). */
  paused: boolean
  pausedAt: number
  /** Person being located / walked to. */
  trackId: string | null
  trackStage: TrackStage
  trackT0: number
  toast: Toast
  /** Current neighbourhood and the one chosen when entering the city. */
  district: DistrictId
  entryArea: DistrictId
  cityOverlay: 'map' | 'bus' | null
  nearbyStop: string | null
  ride: BusTrip | null
  mapTarget: string | null
  setArea: (area: DistrictId) => void
  setCityOverlay: (overlay: GameState['cityOverlay']) => void
  setMapTarget: (id: string | null) => void
  board: (destination: string) => void
  finishRide: () => void
  setReady: () => void
  enter: (area?: DistrictId) => void
  /** Open "become visible" (character creation + profile). */
  startCreate: () => void
  endCreate: () => void
  setLandmark: (l: string) => void
  setPointerLocked: (v: boolean) => void
  setFocus: (id: string | null) => void
  openProfile: (id: string) => void
  closeProfile: () => void
  setSearch: (open: boolean) => void
  setStatusOpen: (open: boolean) => void
  setConnectOpen: (open: boolean) => void
  setInvitesOpen: (open: boolean) => void
  setProfileOpen: (open: boolean) => void
  setPaused: (paused: boolean) => void
  track: (id: string, fly?: boolean) => void
  setTrackStage: (stage: TrackStage) => void
  stopTracking: () => void
  showToast: (msg: string, tone?: 'good' | 'info' | 'bad') => void
}

const releaseMouse = () => {
  if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock()
}

export const useGame = create<GameState>((set, get) => ({
  phase: 'intro',
  ready: false,
  enteredAt: 0,
  landmark: districtInfo(DEFAULT_DISTRICT).title,
  pointerLocked: false,
  focusId: null,
  openId: null,
  searchOpen: false,
  statusOpen: false,
  connectOpen: false,
  invitesOpen: false,
  profileOpen: false,
  paused: false,
  pausedAt: 0,
  trackId: null,
  trackStage: null,
  trackT0: 0,
  toast: null,
  district: DEFAULT_DISTRICT,
  entryArea: DEFAULT_DISTRICT,
  cityOverlay: null,
  nearbyStop: null,
  ride: null,
  mapTarget: null,
  setArea: (district) => set({ district }),
  setCityOverlay: (cityOverlay) => {
    set({ cityOverlay })
    if (cityOverlay) releaseMouse()
  },
  setMapTarget: (mapTarget) => set({ mapTarget, cityOverlay: null, trackId: null, trackStage: null }),
  board: (destination) => {
    const { cityOverlay, nearbyStop, ride } = get()
    if (cityOverlay !== 'bus' || !nearbyStop || ride) return
    const trip = busTrip(nearbyStop, destination)
    if (trip) set({ ride: trip, cityOverlay: null, focusId: null, trackId: null, trackStage: null, mapTarget: null })
  },
  finishRide: () => set({ ride: null, nearbyStop: null }),
  setReady: () => set({ ready: true }),
  enter: (entryArea = DEFAULT_DISTRICT) => set({ phase: 'play', entryArea, enteredAt: performance.now() }),
  startCreate: () => {
    releaseMouse()
    set({ phase: 'create', openId: null, searchOpen: false, profileOpen: false, paused: false, focusId: null, trackId: null, trackStage: null, cityOverlay: null, mapTarget: null, ride: null })
  },
  endCreate: () => set({ phase: 'play', enteredAt: performance.now() }),
  setLandmark: (landmark) => set({ landmark }),
  setPointerLocked: (pointerLocked) => set({ pointerLocked }),
  setFocus: (focusId) => set({ focusId }),
  openProfile: (openId) => {
    releaseMouse()
    set({ openId })
  },
  closeProfile: () => set({ openId: null }),
  setSearch: (searchOpen) => {
    if (searchOpen) releaseMouse()
    set({ searchOpen })
  },
  setStatusOpen: (statusOpen) => {
    if (statusOpen) releaseMouse()
    set(statusOpen ? { statusOpen, openId: null, searchOpen: false, connectOpen: false, invitesOpen: false, profileOpen: false } : { statusOpen })
  },
  setConnectOpen: (connectOpen) => {
    if (connectOpen) releaseMouse()
    set(connectOpen ? { connectOpen, openId: null, searchOpen: false, statusOpen: false, invitesOpen: false, profileOpen: false } : { connectOpen })
  },
  setInvitesOpen: (invitesOpen) => {
    if (invitesOpen) releaseMouse()
    set(invitesOpen ? { invitesOpen, openId: null, searchOpen: false, statusOpen: false, connectOpen: false, profileOpen: false } : { invitesOpen })
  },
  setProfileOpen: (profileOpen) => {
    if (profileOpen) releaseMouse()
    set(profileOpen ? { profileOpen, openId: null, searchOpen: false, statusOpen: false, connectOpen: false, invitesOpen: false } : { profileOpen })
  },
  setPaused: (paused) => {
    if (paused) releaseMouse()
    set(paused ? { paused, pausedAt: performance.now() } : { paused })
  },
  track: (trackId, fly = true) => set({ trackId, trackStage: fly ? 'fly' : 'walk', trackT0: performance.now(), searchOpen: false, openId: null, mapTarget: null }),
  setTrackStage: (trackStage) => set({ trackStage, trackT0: performance.now() }),
  stopTracking: () => set({ trackId: null, trackStage: null }),
  showToast: (msg, tone = 'info') => set({ toast: { msg, tone, id: Date.now() } }),
}))

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  ;(window as unknown as { __game?: typeof useGame }).__game = useGame
}
