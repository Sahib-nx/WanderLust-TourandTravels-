'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PackageType, AccommodationTier } from '@/types'

const PACKAGE_TYPES: { value: PackageType; icon: string; description: string }[] = [
  { value: 'Luxury Retreat',   icon: '✦', description: 'Ultra-premium stays & experiences'   },
  { value: 'Adventure Trek',   icon: '⛰', description: 'Guided multi-day mountain journeys'  },
  { value: 'Romantic Escape',  icon: '🌸', description: 'Curated honeymoon & couple retreats' },
  { value: 'Family Journey',   icon: '🏡', description: 'Safe, engaging family experiences'   },
  { value: 'Snow Expedition',  icon: '❄', description: 'Skiing, sledding & winter magic'      },
  { value: 'Nature Explorer',  icon: '🌿', description: 'Wildlife, forests & valley walks'    },
]

const ACCOMMODATION_TIERS: { value: AccommodationTier; label: string; sublabel: string }[] = [
  { value: 'Hostel',      label: 'Hostel',      sublabel: 'Budget-friendly'   },
  { value: 'Hotel',       label: 'Hotel',       sublabel: 'Comfortable'        },
  { value: 'Resort',      label: 'Resort',      sublabel: 'Full-service'       },
  { value: 'Luxury Camp', label: 'Luxury Camp', sublabel: 'Glamping'           },
  { value: 'Villa',       label: 'Villa',       sublabel: 'Private villa'      },
]

interface PackageStepProps {
  packageType: PackageType
  accommodationTier: AccommodationTier
  onPackageType: (p: PackageType) => void
  onAccommodationTier: (a: AccommodationTier) => void
}

export function PackageStep({
  packageType,
  accommodationTier,
  onPackageType,
  onAccommodationTier,
}: PackageStepProps) {
  return (
    <div className="space-y-8">
      {/* Package type */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold">Journey Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PACKAGE_TYPES.map((pkg, i) => {
            const isActive = packageType === pkg.value
            return (
              <motion.button
                key={pkg.value}
                onClick={() => onPackageType(pkg.value)}
                aria-pressed={isActive}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-2xl text-left border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  isActive
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-gold'
                    : 'bg-white/5 border-white/8 hover:border-white/20 hover:bg-white/8',
                )}
              >
                <span className="text-lg leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
                  {pkg.icon}
                </span>
                <div className="min-w-0">
                  <p className={cn(
                    'text-sm font-semibold leading-tight transition-colors',
                    isActive ? 'text-gold-400' : 'text-sand-100/80',
                  )}>
                    {pkg.value}
                  </p>
                  <p className="text-xs text-sand-100/40 mt-0.5 leading-snug">{pkg.description}</p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500"
                    aria-hidden="true"
                  >
                    <svg className="w-2.5 h-2.5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Accommodation */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold">Accommodation</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Accommodation tier">
          {ACCOMMODATION_TIERS.map((tier) => {
            const isActive = accommodationTier === tier.value
            return (
              <button
                key={tier.value}
                onClick={() => onAccommodationTier(tier.value)}
                aria-pressed={isActive}
                className={cn(
                  'flex flex-col items-center px-5 py-3 rounded-2xl border text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  isActive
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-gold'
                    : 'bg-white/5 border-white/8 hover:border-white/20',
                )}
              >
                <span className={cn(
                  'font-semibold text-sm transition-colors',
                  isActive ? 'text-gold-400' : 'text-sand-100/80',
                )}>
                  {tier.label}
                </span>
                <span className="text-[10px] text-sand-100/40 mt-0.5">{tier.sublabel}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}