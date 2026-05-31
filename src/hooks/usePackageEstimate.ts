'use client'

import { useMemo } from 'react'
import { calculateEstimate } from '@/lib/pricing'
import type { EstimateInput, PackageEstimate } from '@/types'

export function usePackageEstimate(input: EstimateInput): PackageEstimate | null {
  return useMemo(() => calculateEstimate(input), [
    input.destination?._id,
    input.packageType,
    input.accommodationTier,
    input.checkInMonth,
    input.checkOutMonth,
    input.adults,
    input.children,
  ])
}