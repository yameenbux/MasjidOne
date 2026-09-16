"use client";

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * Card grid adapted from the supplied features block. Card chrome, grid and
 * motion are the block's: rounded-xl, p-8, min-h-[280px], the whileInView rise
 * and the whileHover/whileTap scale.
 *
 * The one class that changed is the card fill, bg-secondary -> bg-muted. In
 * the block's own palette --secondary is a near-white surface; in this repo it
 * carries board brass, which is an accent. Left as supplied the cards rendered
 * as solid tan blocks with muted text on them, well under AA. --muted is this
 * palette's subtle surface (--paper-2), which is what the block meant by it.
 *
 * The three demo visuals could not be reused as they stand. "100ms / Load
 * Time" on a donations card is a performance figure nobody here has measured,
 * and the site's rule is that a claim it cannot defend does not go on the
 * page. Each module gets a visual drawn from something that is actually true
 * of it instead; LayoutAnimation is the block's own, kept for the screens
 * card, which is what it was already describing.
 *
 * Every loop is interval-driven, so each one checks prefers-reduced-motion and
 * simply does not start. The cards are also listed in html:not(.js) in
 * globals.css, because framer bakes the pre-animation transform into the
 * exported HTML and without JS they would sit 30px low at zero opacity.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** Register marks landing one after another. */
function RegisterTick() {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? 3 : 0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setN((p) => (p + 1) % 4), 900)
    return () => clearInterval(id)
  }, [reduced])
  return (
    <div className="flex flex-col justify-center h-full gap-2 w-full max-w-[150px] mx-auto">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-foreground/10" />
          <motion.span
            className="text-accent text-sm leading-none"
            animate={{ opacity: i < n ? 1 : 0.15 }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-hidden="true"
          >
            ✓
          </motion.span>
        </div>
      ))}
    </div>
  )
}

/** A message reaching a parent, then clearing. */
function ParentPing() {
  const reduced = useReducedMotion()
  const [on, setOn] = useState(true)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setOn((p) => !p), 2000)
    return () => clearInterval(id)
  }, [reduced])
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-[84px] h-[132px] rounded-[14px] border border-foreground/20">
        <motion.div
          className="absolute left-2 right-2 top-4 h-7 rounded-md bg-primary/20"
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : -6 }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <div className="absolute left-2 right-2 top-14 h-1.5 rounded-full bg-foreground/10" />
        <div className="absolute left-2 right-6 top-[4.5rem] h-1.5 rounded-full bg-foreground/10" />
      </div>
    </div>
  )
}

/** The board's begins / jamāʿah rhythm. */
function JamaahRhythm() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((p) => (p + 1) % 3), 2000)
    return () => clearInterval(id)
  }, [reduced])
  const rows = [
    ["Fajr", "05:12", "05:45"],
    ["Ẓuhr", "13:04", "13:30"],
    ["ʿAṣr", "16:38", "17:15"],
  ]
  return (
    <div className="flex flex-col justify-center h-full gap-2 w-full max-w-[160px] mx-auto">
      {rows.map(([name, begins, jamaah], r) => (
        <motion.div
          key={name}
          className="flex items-baseline justify-between text-sm"
          animate={{ opacity: r === i ? 1 : 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="text-foreground">{name}</span>
          <span className="tabular-nums text-muted-foreground">{begins}</span>
          <span className="tabular-nums text-accent">{jamaah}</span>
        </motion.div>
      ))}
    </div>
  )
}

/** The block's own layout animation, kept for the card it already suited. */
export default function LayoutAnimation() {
  const reduced = useReducedMotion()
  const [layout, setLayout] = useState(0)

  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [reduced])

  const layouts = ["grid-cols-2 grid-rows-2", "grid-cols-3 grid-rows-1", "grid-cols-1 grid-rows-3"]

  return (
    <div className="h-full p-4 flex items-center justify-center">
      <motion.div className={`grid ${layouts[layout]} gap-2 w-full max-w-[140px]`} layout>
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-primary/20 rounded-md min-h-[30px]"
            layout
            transition={{ duration: 0.5, ease: EASE }}
          />
        ))}
      </motion.div>
    </div>
  )
}

/** 0% commission — a committed fact, in the block's scaling-type shape. */
function CommissionMark() {
  const reduced = useReducedMotion()
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.15 : 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [reduced])
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <motion.span
        className="font-serif text-5xl md:text-6xl text-foreground"
        animate={{ scale }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        0%
      </motion.span>
      <span className="text-sm text-muted-foreground">Commission, permanently</span>
    </div>
  )
}

type Card = {
  key: string
  title: string
  status: "Live" | "In development"
  body: React.ReactNode
  Visual: React.ComponentType
}

const CARDS: Card[] = [
  {
    key: "portal",
    title: "Madrasah portal",
    status: "In development",
    body: "Students, classes, daily registers, Hifz and sabaq progress, reports and certificates. Fees by direct debit and card with automatic chasing. Unlimited students and teachers — no per-pupil pricing, no paid add-ons.",
    Visual: RegisterTick,
  },
  {
    key: "parent",
    title: "Parent access",
    status: "In development",
    body: "Absence alerts the same evening, fees paid in two taps, progress a parent can actually read — inside the congregation app they already have. No second app to install. This is the bridge, and it is the whole claim.",
    Visual: ParentPing,
  },
  {
    key: "app",
    title: "Congregation app",
    status: "Live",
    body: "The masjid's own timetable, not a calculated one. Jamāʿah reminders with a per-person offset, so a man who needs twenty minutes gets twenty minutes. Qibla, Zakat calculator, announcements, one-tap giving.",
    Visual: JamaahRhythm,
  },
  {
    key: "screens",
    title: "Website and hall screens",
    status: "Live",
    body: "A managed mosque website kept current from the same place as everything else, and unlimited screens on any TV with a browser. Live announcements and janāzah notices reach the hall and the phone together.",
    Visual: LayoutAnimation,
  },
  {
    key: "giving",
    title: "Donations and Gift Aid",
    status: "Live",
    body: (
      <>
        Card, Apple Pay and Google Pay. One-off or recurring, appeal campaigns,
        Gift Aid claimed at the point of giving. <b>0% commission, permanently.</b>{" "}
        Every pound given reaches the masjid.
      </>
    ),
    Visual: CommissionMark,
  },
]

export function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          className="mod-card bg-muted rounded-xl p-8 min-h-[280px] flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2, delay: i * 0.1 }}
        >
          <div className="flex-1">
            <card.Visual />
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-xl text-foreground flex items-baseline gap-2 flex-wrap">
              {card.title}
              <span className={card.status === "Live" ? "tag tag--live" : "tag tag--dev"}>
                {card.status}
              </span>
            </h3>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{card.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
