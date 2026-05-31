'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Region } from '@/types'

const REGIONS: { value: Region; label: string; tagline: string }[] = [
  { value: 'Kashmir', label: 'Kashmir', tagline: 'Valley of Heaven' },
  { value: 'Nepal',   label: 'Nepal',   tagline: 'Roof of the World' },
]

interface RegionToggleProps {
  active: Region
  onChange: (r: Region) => void
}

export function RegionToggle({ active, onChange }: RegionToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
      {REGIONS.map((r) => {
        const isActive = active === r.value
        return (
          <button
            key={r.value}
            onClick={() => onChange(r.value)}
            aria-pressed={isActive}
            className="relative px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            {isActive && (
              <motion.div
                layoutId="region-pill"
                className="absolute inset-0 rounded-xl bg-gold-500/20 border border-gold-500/40"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  'font-semibold tracking-wide transition-colors duration-200',
                  isActive ? 'text-gold-400' : 'text-sand-100/50 hover:text-sand-100/80',
                )}
              >
                {r.label}
              </span>
              <span
                className={cn(
                  'text-[10px] uppercase tracking-widest transition-colors duration-200',
                  isActive ? 'text-gold-500/70' : 'text-sand-100/25',
                )}
              >
                {r.tagline}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}