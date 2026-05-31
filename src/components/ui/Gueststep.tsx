'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// Peak months for Kashmir & Nepal — March–May, September–November
const PEAK_MONTHS = [2, 3, 4, 8, 9, 10]

interface CounterProps {
  label: string
  sublabel: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}

function Counter({ label, sublabel, value, min, max, onChange }: CounterProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/8 last:border-0">
      <div>
        <p className="text-sand-100 font-medium">{label}</p>
        <p className="text-xs text-sand-100/45 mt-0.5">{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sand-100/70 transition-all hover:border-white/30 hover:text-sand-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        <motion.span
          key={value}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="w-6 text-center font-display text-xl text-sand-100 tabular-nums"
        >
          {value}
        </motion.span>

        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sand-100/70 transition-all hover:border-white/30 hover:text-sand-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface MonthGridProps {
  label: string
  selected: number | null
  onSelect: (i: number) => void
  minMonth?: number
}

function MonthGrid({ label, selected, onSelect, minMonth }: MonthGridProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold">{label}</p>
      <div className="grid grid-cols-6 gap-2">
        {MONTHS.map((m, i) => {
          const disabled = minMonth !== undefined && i <= minMonth
          const isSelected = selected === i
          const isPeak = PEAK_MONTHS.includes(i)
          return (
            <button
              key={m}
              disabled={disabled}
              onClick={() => onSelect(i)}
              aria-pressed={isSelected}
              aria-label={`${m}${isPeak ? ' — peak season' : ''}`}
              className={cn(
                'relative rounded-xl py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                isSelected
                  ? 'bg-gold-500 text-navy-900 shadow-gold font-semibold'
                  : disabled
                    ? 'text-sand-100/20 cursor-not-allowed'
                    : isPeak
                      ? 'bg-gold-500/8 text-sand-100/70 border border-gold-500/20 hover:bg-gold-500/15 hover:text-sand-100'
                      : 'bg-white/5 text-sand-100/70 hover:bg-white/10 hover:text-sand-100',
              )}
            >
              {m}
              {/* Peak season dot */}
              {isPeak && !isSelected && !disabled && (
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-gold-500/60" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>
      <p className="text-[10px] text-sand-100/25 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500/50" aria-hidden="true" />
        Gold dots mark peak season months
      </p>
    </div>
  )
}

interface GuestStepProps {
  adults: number
  children: number
  checkIn: number | null
  checkOut: number | null
  onAdults: (v: number) => void
  onChildren: (v: number) => void
  onCheckIn: (i: number) => void
  onCheckOut: (i: number) => void
}

export function GuestStep({
  adults,
  children,
  checkIn,
  checkOut,
  onAdults,
  onChildren,
  onCheckIn,
  onCheckOut,
}: GuestStepProps) {
  const nights =
    checkIn !== null && checkOut !== null && checkOut > checkIn
      ? (checkOut - checkIn) * 7
      : 0

  return (
    <div className="space-y-8">
      {/* Traveler counters */}
      <div>
        <p className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold mb-1">Travelers</p>
        <div className="rounded-2xl bg-white/4 border border-white/8 px-5 py-1">
          <Counter label="Adults"   sublabel="Ages 18+" value={adults}   min={1} max={12} onChange={onAdults}   />
          <Counter label="Children" sublabel="Ages 2–17" value={children} min={0} max={6}  onChange={onChildren} />
        </div>
      </div>

      {/* Month pickers */}
      <div className="space-y-6">
        <MonthGrid label="Arrival month" selected={checkIn} onSelect={onCheckIn} />

        {/* Nights indicator — identical to original */}
        <AnimatePresence mode="wait">
          {checkIn !== null && checkOut !== null && nights > 0 ? (
            <motion.div
              key="nights"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="h-px flex-1 bg-gold-500/30" />
              <span className="rounded-full border border-gold-500/40 px-4 py-1.5 text-sm font-semibold text-gold-500">
                ~{nights} nights
              </span>
              <div className="h-px flex-1 bg-gold-500/30" />
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <span className="text-xs text-sand-100/30 italic">Select arrival then departure month</span>
            </motion.div>
          )}
        </AnimatePresence>

        <MonthGrid
          label="Departure month"
          selected={checkOut}
          onSelect={onCheckOut}
          minMonth={checkIn ?? undefined}
        />
      </div>
    </div>
  )
}