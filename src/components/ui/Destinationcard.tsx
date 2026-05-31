'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Destination } from '@/types'

interface DestinationCardProps {
  destination: Destination
  isSelected: boolean
  onSelect: (d: Destination) => void
}

export function DestinationCard({ destination, isSelected, onSelect }: DestinationCardProps) {
  return (
    <button
      onClick={() => onSelect(destination)}
      aria-pressed={isSelected}
      aria-label={`Select ${destination.name}, ${destination.region}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl aspect-[3/4] w-full text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
        isSelected
          ? 'ring-2 ring-gold-500 shadow-gold'
          : 'ring-1 ring-white/10 hover:ring-white/30',
      )}
    >
      {/* Image */}
      <Image
        src={destination.thumbnail}
        alt={destination.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className={cn(
          'object-cover transition-transform duration-500',
          isSelected ? 'scale-105' : 'group-hover:scale-105',
        )}
      />

      {/* Gradient overlay — matches original exactly */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/30 to-transparent" />

      {/* Category badge top-left */}
      {destination.categories[0] && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-gold-500/20 border border-gold-500/30 text-gold-400 backdrop-blur-sm">
            {destination.categories[0]}
          </span>
        </div>
      )}

      {/* Elevation top-right (when no checkmark) */}
      {destination.elevation && !isSelected && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-sand-100/50 bg-navy-950/50 backdrop-blur-sm border border-white/8">
            {destination.elevation.toLocaleString()}m
          </span>
        </div>
      )}

      {/* Text block — matches original */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="font-display text-sm font-semibold text-sand-100 leading-tight">
          {destination.name}
        </p>
        <p className="text-xs text-sand-100/60 mt-0.5">{destination.region}</p>
        <p className="text-xs text-gold-400/80 mt-1.5 font-medium tabular-nums">
          From ${destination.avgPackagePrice.toLocaleString()}
        </p>
      </div>

      {/* Checkmark — identical spring to original */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500"
            aria-hidden="true"
          >
            <svg className="h-3.5 w-3.5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}