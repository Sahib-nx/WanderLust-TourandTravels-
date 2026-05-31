'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Region } from '@/types'

interface DestinationSearchProps {
  query: string
  onChange: (q: string) => void
  isSearching: boolean
  region: Region
  resultCount: number
}

export function DestinationSearch({
  query,
  onChange,
  isSearching,
  region,
  resultCount,
}: DestinationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const placeholder =
    region === 'Kashmir'
      ? 'Search valleys, lakes, meadows, retreats…'
      : 'Search peaks, base camps, temples, trails…'

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white/5 backdrop-blur-sm transition-all duration-300',
        query.length > 0
          ? 'border-gold-500/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]'
          : 'border-white/10 hover:border-white/20',
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-4 h-4 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"
            />
          ) : (
            <motion.svg
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-4 h-4 text-sand-100/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search destinations"
        className="flex-1 bg-transparent text-sm text-sand-100 placeholder:text-sand-100/25 focus:outline-none min-w-0"
      />

      {/* Result count */}
      <AnimatePresence>
        {query.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex-shrink-0 text-xs text-sand-100/30 tabular-nums"
          >
            {resultCount} found
          </motion.span>
        )}
      </AnimatePresence>

      {/* Clear */}
      <AnimatePresence>
        {query.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-sand-100/40 hover:text-sand-100 hover:bg-white/15 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {query.length === 0 && (
        <kbd className="hidden sm:flex flex-shrink-0 items-center px-1.5 py-0.5 rounded border border-white/10 text-[10px] text-sand-100/25 font-mono">
          /
        </kbd>
      )}
    </div>
  )
}