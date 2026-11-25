'use client'

import { useEffect, useState } from 'react'
import { getCharacter } from '../characters/roster'
import type { Profile } from '../people/profiles'
import { getPeople } from '../people/directory'
import { useGame } from '../store'
import { activeStatus } from '../status'
import { isTyping } from '../player/input'
import { ConnectBlock, ConnectFlow } from './Connections'
import { useNet } from '../net/useNet'
import { placeLabel } from '../districts/registry'

const byId = (id: string | null) => (id ? getPeople().find((p) => p.id === id) : undefined)

/**
 * Approach prompt: just the action. Who they are (name, role, open to work, status) is
 * already on their nameplate right above them, and the ring on the ground marks who it's for.
 */
function Prompt({ p, onOpen }: { p: Profile; onOpen: () => void }) {
  return (
    <button className="prompt prompt--person slant" key={p.id} onClick={onOpen} aria-label={`View ${p.name}'s profile`}>
      <span className="unslant prompt-body">
        <span className="prompt-action">
          <span className="keycap">E</span> VIEW PROFILE
        </span>
      </span>
    </button>
  )
}

/** A link they added; links they haven't added are simply not shown. */
function LinkButton({ label, href, primary }: { label: string; href?: string; primary?: boolean }) {
  if (!href) return null
  return (
    <a className={`pp-btn slant${primary ? ' pp-btn--primary' : ''}`} href={href} target="_blank" rel="noopener noreferrer">
      <span className="unslant">{label} ↗</span>
    </a>
  )
}

/**
 * Online / offline for a real member (Phase 8A). Only shown once we know who's online (members on the
 * live map; guests never connect, so to them nobody would ever look online). Elsewhere = another district.
 */
function Presence({ p }: { p: Profile }) {
  const known = useNet((s) => s.cityCounts !== null)
  const here = useNet((s) => s.live.has(p.id))
  const online = useNet((s) => !!s.online[p.id])
  if (p.sample || !known) return null
  if (!here && !online)
    return (
      <span className="pp-presence pp-presence--off">
        <span className="pp-presence-dot" /> OFFLINE
      </span>
    )
  return (
    <span className="pp-presence">
      <span className="pp-presence-dot" /> ONLINE
    </span>
  )
}

/** Profile panel (CLAUDE.md §13) — slides in from the right; the world stays visible. */
// Sample people are bots: say so in the panel only, never on the nameplate.
// Hover or focus shows why they're here; a tap toggles it on touch.
function BotTag() {
  const [open, setOpen] = useState(false)
  return (
    <span className={`pp-bot${open ? ' is-open' : ''}`} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="pp-sample" aria-describedby="pp-bot-tip" onClick={() => setOpen((o) => !o)}>
        BOT <span className="pp-bot-i">?</span>
      </button>
      <span id="pp-bot-tip" role="tooltip" className="pp-bot-tip">
        These bots roam the city until it fills up with real people.
      </span>
    </span>
  )
}

function Panel({ p, onClose }: { p: Profile; onClose: () => void }) {
  const style = getCharacter(p.character)
  // CONNECT takes over the whole panel as a stepper; the profile comes back after
  const [connecting, setConnecting] = useState(false)
  if (connecting)
    return (
      <aside className="pp" style={{ ['--accent' as string]: style.accent }}>
        <ConnectFlow p={p} onExit={() => setConnecting(false)} />
      </aside>
    )
  return (
    <aside className="pp" style={{ ['--accent' as string]: style.accent }}>
      <div className="pp-inner">
        <div className="pp-top">
          <span className="pp-tag">PROFILE</span>
          {p.sample && <BotTag />}
          <Presence p={p} />
          <button className="pp-close" onClick={onClose} aria-label="Close profile">
            <span className="keycap">ESC</span>
          </button>
        </div>

        <h2 className="pp-name">{p.name}</h2>
        <div className="pp-role">
          {p.role}
          {p.company && (
            <>
              {' '}
              <span>·</span> {p.company}
            </>
          )}
        </div>
        <div className="pp-loc">
          <span className="pp-pin" /> {placeLabel(p.location)}
        </div>

        {activeStatus(p.status) && (
          <div className="pp-note">
            {p.status!.emoji && <span className="pp-note-e">{p.status!.emoji}</span>}
            <span className="pp-note-body">
              <span className="pp-note-k">STATUS</span>
              <span className="pp-note-t">{p.status!.text}</span>
            </span>
          </div>
        )}

        {p.openToWork && (
          <div className="pp-status slant pp-status--open">
            <span className="unslant">
              <span className="np-dot" /> OPEN TO WORK
            </span>
          </div>
        )}

        {p.building && (
          <section className="pp-section">
            <h3>CURRENTLY BUILDING</h3>
            <p>{p.building}</p>
          </section>
        )}
        {p.previously && (
          <section className="pp-section">
            <h3>PREVIOUSLY</h3>
            <p>{p.previously}</p>
          </section>
        )}
        <section className="pp-section">
          <h3>PLAYS AS</h3>
          <p>
            <span className="pp-swatch" /> {style.name}
          </p>
        </section>

        <div className="pp-links">
          <ConnectBlock p={p} onConnect={() => setConnecting(true)} />
          <LinkButton label="PORTFOLIO" href={p.links.portfolio} />
          {(p.links.linkedin || p.links.x) && (
            <div className="pp-links-row">
              <LinkButton label="LINKEDIN" href={p.links.linkedin} />
              <LinkButton label="X" href={p.links.x} />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export function Interaction() {
  const phase = useGame((s) => s.phase)
  const focusId = useGame((s) => s.focusId)
  const openId = useGame((s) => s.openId)
  const openProfile = useGame((s) => s.openProfile)
  const closeProfile = useGame((s) => s.closeProfile)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = useGame.getState()
      if (g.phase !== 'play' || isTyping(e) || g.searchOpen || g.statusOpen || g.connectOpen || g.invitesOpen || g.profileOpen || g.paused || g.cityOverlay || g.ride) return
      if (e.code === 'KeyE' && !e.repeat) {
        if (g.openId) g.closeProfile()
        else if (g.focusId) g.openProfile(g.focusId)
      }
      if (e.code === 'Escape' && g.openId) g.closeProfile()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (phase !== 'play') return null
  const open = byId(openId)
  const focus = byId(focusId)
  return (
    <>
      {focus && !open && <Prompt p={focus} onOpen={() => openProfile(focus.id)} />}
      {open && <Panel key={open.id} p={open} onClose={closeProfile} />}
    </>
  )
}
