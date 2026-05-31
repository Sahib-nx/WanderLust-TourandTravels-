'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Destination, PackageEstimate, PackageType, AccommodationTier } from '@/types'

// ─── Count-up — exact same logic as original TripPlanner ─────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = null
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease-out quart — same as original
      setValue(Math.round(target * eased))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
      else setValue(target)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])

  return value
}

// ─── PriceLine — mirrors original exactly ────────────────────────────────────

function PriceLine({
  icon,
  label,
  amount,
  delay = 0,
  bold = false,
  separator = false,
}: {
  icon: string
  label: string
  amount: number
  delay?: number
  bold?: boolean
  separator?: boolean
}) {
  const displayed = useCountUp(amount, 1200 + delay)

  return (
    <>
      {separator && <div className="my-3 h-px bg-white/10" />}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay / 1000, duration: 0.4 }}
        className={cn('flex items-center justify-between py-2', bold && 'pt-3')}
      >
        <span
          className={cn(
            'flex items-center gap-2.5',
            bold ? 'text-sand-100 font-semibold text-base' : 'text-sand-100/70 text-sm',
          )}
        >
          <span aria-hidden="true">{icon}</span>
          {label}
        </span>
        <span
          className={cn(
            'font-display tabular-nums',
            bold ? 'text-gold-400 text-xl font-bold' : 'text-sand-100 text-sm',
          )}
        >
          ${displayed.toLocaleString()}
        </span>
      </motion.div>
    </>
  )
}

// ─── Season context ───────────────────────────────────────────────────────────

const MONTH_SEASONS: Record<number, string> = {
  0: 'Winter', 1: 'Winter', 2: 'Spring', 3: 'Spring',  4: 'Spring',  5: 'Summer',
  6: 'Summer', 7: 'Summer', 8: 'Autumn', 9: 'Autumn', 10: 'Autumn', 11: 'Winter',
}

const SEASON_LABELS: Record<string, { text: string; cls: string }> = {
  Spring: { text: 'Peak season',  cls: 'text-gold-400 border-gold-500/30 bg-gold-500/10' },
  Summer: { text: 'Regular',      cls: 'text-sand-100/60 border-white/15 bg-white/5'     },
  Autumn: { text: 'Peak season',  cls: 'text-gold-400 border-gold-500/30 bg-gold-500/10' },
  Winter: { text: 'Off-season',   cls: 'text-sand-100/40 border-white/10 bg-white/5'     },
}

// ─── Main component ───────────────────────────────────────────────────────────

interface EstimatePanelProps {
  destination: Destination | null
  estimate: PackageEstimate | null
  packageType: PackageType
  accommodationTier: AccommodationTier
  adults: number
  children: number
  checkIn: number | null
  onEditDetails: () => void
}

export function EstimatePanel({
  destination,
  estimate,
  packageType,
  accommodationTier,
  adults,
  children,
  checkIn,
  onEditDetails,
}: EstimatePanelProps) {
  const season = checkIn !== null ? MONTH_SEASONS[checkIn] : null
  const seasonMeta = season ? SEASON_LABELS[season] : null

  if (!destination || !estimate) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sand-100/30 text-sm italic">Complete the previous steps to see your estimate.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Destination recap — matches original summary pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 p-4"
      >
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={destination.thumbnail}
            alt={destination.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-sand-100">{destination.name}</p>
          <p className="text-xs text-sand-100/50">{destination.region}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-sand-100/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
              {packageType}
            </span>
            <span className="text-[10px] text-sand-100/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
              {accommodationTier}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0 space-y-1">
          <p className="text-sm text-sand-100/60">{estimate.nights} nights</p>
          <p className="text-xs text-sand-100/40">
            {adults}A{children > 0 ? ` · ${children}C` : ''}
          </p>
          {seasonMeta && (
            <span className={cn('inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium', seasonMeta.cls)}>
              {seasonMeta.text}
            </span>
          )}
        </div>
      </motion.div>

      {/* Price breakdown — mirrors original PriceLine block */}
      <div className="rounded-2xl bg-white/4 border border-white/8 px-6 py-2">
        <PriceLine icon="🏨" label={`Accommodation (${estimate.nights} nights)`} amount={estimate.stay}            delay={0}   />
        <PriceLine icon="🚌" label="Transport & transfers"                        amount={estimate.transport}        delay={150} />
        <PriceLine icon="🎫" label="Guided activities"                            amount={estimate.guidedActivities} delay={300} />
        {estimate.seasonalAdjustment > 0 && (
          <PriceLine
            icon={season === 'Winter' ? '💰' : '📈'}
            label={season === 'Winter' ? 'Off-season saving' : 'Peak season adjustment'}
            amount={estimate.seasonalAdjustment}
            delay={400}
          />
        )}
        <PriceLine icon="💳" label="Total estimate" amount={estimate.total} delay={500} bold separator />
      </div>

      {/* Per-person note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="text-center text-xs text-sand-100/30"
      >
        ~ <span className="text-gold-400 font-semibold font-display">${estimate.perPerson.toLocaleString()}</span> per person · All prices USD · Indicative only
      </motion.p>

      {/* Included activities */}
      {destination.popularActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="space-y-2"
        >
          <p className="text-xs uppercase tracking-widest text-sand-100/40 font-semibold">Included experiences</p>
          <div className="flex flex-wrap gap-1.5">
            {destination.popularActivities.slice(0, 6).map((activity) => (
              <span
                key={activity}
                className="text-xs text-sand-100/50 bg-white/5 border border-white/8 px-2.5 py-1 rounded-full"
              >
                {activity}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTAs — match original button styles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <a
          href="#book"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-gold-lg transition-all duration-300 hover:bg-gold-400 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
        >
          Book This Journey
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a
          href="#enquire"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-sand-100/70 transition-all duration-300 hover:border-white/30 hover:text-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Enquire Now
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </motion.div>

      {/* Edit details link */}
      <div className="mt-2 flex justify-start border-t border-white/8 pt-4">
        <button
          onClick={onEditDetails}
          className="flex items-center gap-2 text-sm text-sand-100/40 hover:text-sand-100/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Edit journey details
        </button>
      </div>
    </div>
  )
}