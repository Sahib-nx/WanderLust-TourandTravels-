'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import { RegionToggle }       from '../components/ui/Regiontoggle'
import { CategoryFilters }    from '../components/ui/Categoryfilters'
import { DestinationSearch }  from '../components/ui/Destinationsearch'
import { DestinationGrid }    from '../components/ui/Destinationgrid'
import { PackageStep }        from '../components/ui/Packagestep'
import { GuestStep }          from '../components/ui/Gueststep'
import { EstimatePanel }      from '../components/ui/Estimatepanel'

import { useDestinations }        from '@/hooks/useDestinations'
import { useDestinationSearch }   from '@/hooks/useDestinationSearch'
import { usePackageEstimate }     from '@/hooks/usePackageEstimate'

import type {
  Region,
  DestinationCategory,
  PackageType,
  AccommodationTier,
  Destination,
} from '@/types'

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, label: 'Destination', short: 'Where' },
  { id: 1, label: 'Journey Type', short: 'Package' },
  { id: 2, label: 'Travelers & Dates', short: 'Guests' },
  { id: 3, label: 'Your Estimate', short: 'Estimate' },
]

// ─── Slide variants ────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: 1 | -1) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: (dir: 1 | -1) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.26, ease: [0.32, 0.72, 0, 1] as const },
  }),
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  completedSteps,
  onGoTo,
}: {
  currentStep: number
  completedSteps: Set<number>
  onGoTo: (s: number) => void
}) {
  return (
    <div className="mb-10" role="list" aria-label="Configuration steps">
      {/* Progress bar */}
      <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-white/8 mb-4">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      {/* Step labels */}
      <div className="grid grid-cols-4">
        {STEPS.map((s) => {
          const isDone    = completedSteps.has(s.id)
          const isCurrent = currentStep === s.id
          const canClick  = isDone || s.id < currentStep

          return (
            <button
              key={s.id}
              role="listitem"
              onClick={() => canClick && onGoTo(s.id)}
              aria-current={isCurrent ? 'step' : undefined}
              disabled={!canClick && !isCurrent}
              className="flex flex-col items-center gap-1.5 py-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 rounded-lg disabled:cursor-default"
            >
              <span
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                  isDone
                    ? 'bg-amber-500 text-stone-900'
                    : isCurrent
                      ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-400/50'
                      : 'bg-white/8 text-stone-600',
                ].join(' ')}
              >
                {isDone ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.id + 1
                )}
              </span>
              <span
                className={[
                  'hidden sm:block text-[10px] font-medium uppercase tracking-widest transition-colors duration-200',
                  isCurrent  ? 'text-amber-400'  :
                  isDone     ? 'text-stone-500'   : 'text-stone-700',
                ].join(' ')}
              >
                {s.short}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function TripPlanner() {
  // ── UI state ────────────────────────────────────────────────────────────────
  const [step, setStep]         = useState(0)
  const [dir, setDir]           = useState<1 | -1>(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // ── Filter / search state ────────────────────────────────────────────────────
  const [region, setRegion]                 = useState<Region>('Kashmir')
  const [activeCategories, setActiveCategories] = useState<DestinationCategory[]>([])

  // ── Form state ───────────────────────────────────────────────────────────────
  const [selectedDest, setSelectedDest]     = useState<Destination | null>(null)
  const [packageType, setPackageType]       = useState<PackageType>('Luxury Retreat')
  const [accommodationTier, setAccomTier]   = useState<AccommodationTier>('Hotel')
  const [adults, setAdults]                 = useState(2)
  const [children, setChildren]             = useState(0)
  const [checkIn, setCheckIn]               = useState<number | null>(null)
  const [checkOut, setCheckOut]             = useState<number | null>(null)

  // ── Data fetching ────────────────────────────────────────────────────────────
  const { destinations, isLoading } = useDestinations({
    region,
    categories: activeCategories,
    sortBy: 'popularity',
    pageSize: 50,
  })

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    isSearching,
  } = useDestinationSearch(region)

  const displayedDestinations = searchQuery.length >= 2 ? searchResults : destinations

  // ── Pricing ──────────────────────────────────────────────────────────────────
  const estimate = usePackageEstimate({
    destination: selectedDest,
    packageType,
    accommodationTier,
    checkInMonth: checkIn,
    checkOutMonth: checkOut,
    adults,
    children,
  })

  // ── Navigation logic ──────────────────────────────────────────────────────────
  const canAdvance = useCallback((): boolean => {
    if (step === 0) return selectedDest !== null
    if (step === 1) return true  // PackageStep always has a default
    if (step === 2) return checkIn !== null && checkOut !== null && checkOut > checkIn
    return false
  }, [step, selectedDest, checkIn, checkOut])

  function goTo(next: number) {
    setDir(next > step ? 1 : -1)
    if (canAdvance() || next < step) {
      setCompletedSteps((prev) => {
        const s = new Set(prev)
        s.add(step)
        return s
      })
    }
    setStep(next)
  }

  function handleCheckIn(i: number) {
    setCheckIn(i)
    if (checkOut !== null && checkOut <= i) setCheckOut(null)
  }

  function handleDestinationSelect(dest: Destination) {
    setSelectedDest(dest)
    // Auto-advance to next step
    setTimeout(() => goTo(1), 180)
  }

  // Background image: hero of selected destination, otherwise first in list
  const bgImage = selectedDest?.heroImage ?? destinations[0]?.heroImage ?? ''

  // ── Rendered step content ─────────────────────────────────────────────────────
  const stepContent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            {/* Controls row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <RegionToggle active={region} onChange={(r) => { setRegion(r); setSelectedDest(null) }} />
              <div className="flex-1">
                <DestinationSearch
                  query={searchQuery}
                  onChange={setSearchQuery}
                  isSearching={isSearching}
                  region={region}
                  resultCount={displayedDestinations.length}
                />
              </div>
            </div>

            {/* Category filters */}
            <CategoryFilters
              active={activeCategories}
              onChange={setActiveCategories}
            />

            {/* Destination grid */}
            <DestinationGrid
              destinations={displayedDestinations}
              selectedId={selectedDest?._id ?? null}
              onSelect={handleDestinationSelect}
              isLoading={isLoading && searchQuery.length < 2}
            />
          </div>
        )

      case 1:
        return (
          <PackageStep
            packageType={packageType}
            accommodationTier={accommodationTier}
            onPackageType={setPackageType}
            onAccommodationTier={setAccomTier}
          />
        )

      case 2:
        return (
          <GuestStep
            adults={adults}
            children={children}
            checkIn={checkIn}
            checkOut={checkOut}
            onAdults={setAdults}
            onChildren={setChildren}
            onCheckIn={handleCheckIn}
            onCheckOut={setCheckOut}
          />
        )

      case 3:
        return (
          <EstimatePanel
            destination={selectedDest}
            estimate={estimate}
            packageType={packageType}
            accommodationTier={accommodationTier}
            adults={adults}
            children={children}
            checkIn={checkIn}
            onEditDetails={() => goTo(2)}
          />
        )

      default:
        return null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, region, searchQuery, activeCategories, displayedDestinations, isLoading,
      isSearching, selectedDest, packageType, accommodationTier, adults, children,
      checkIn, checkOut, estimate])

  return (
    <section
      id="journey-configurator"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-label="Journey Configurator"
    >
      {/* ── Cinematic background ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {bgImage && (
            <motion.div
              key={bgImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <Image
                src={bgImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deep overlay — preserves cinematic feel without blinding text */}
        <div className="absolute inset-0 bg-stone-950/90" />

        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-stone-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-20">
        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-12 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-semibold mb-3">
            Craft Your Journey
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-stone-100 leading-tight">
            Build Your Himalayan{' '}
            <em className="text-amber-300 not-italic">Experience</em>
          </h2>
          <p className="mt-4 text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
            Select your destination, choose your journey type, and we&apos;ll craft a personalised estimate for your perfect Himalayan adventure.
          </p>
        </motion.div>

        {/* ── Configurator card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-stone-950/70 backdrop-blur-2xl p-8 lg:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Step indicator */}
          <StepIndicator
            currentStep={step}
            completedSteps={completedSteps}
            onGoTo={goTo}
          />

          {/* Step heading */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.h3
              key={`heading-${step}`}
              custom={dir}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="font-serif text-2xl text-stone-100 mb-8"
            >
              {STEPS[step].label}
            </motion.h3>
          </AnimatePresence>

          {/* Step content */}
          <div className="min-h-[380px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`step-${step}`}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation — hidden on last step */}
          {step < 3 && (
            <div className="mt-10 flex items-center justify-between border-t border-white/8 pt-8">
              <button
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-stone-500 transition-all hover:border-white/25 hover:text-stone-300 disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <span className="text-[10px] text-stone-700 hidden sm:block uppercase tracking-widest">
                Step {step + 1} of {STEPS.length}
              </span>

              <button
                onClick={() => goTo(step + 1)}
                disabled={!canAdvance()}
                className={[
                  'flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                  canAdvance()
                    ? 'bg-amber-500 text-stone-900 hover:bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_28px_rgba(251,191,36,0.5)]'
                    : 'bg-white/8 text-stone-600 cursor-not-allowed',
                ].join(' ')}
              >
                {step === 2 ? 'See Estimate' : 'Continue'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}