'use client'

import useSWR from 'swr'
import type { Destination, DestinationFilters, PaginatedDestinations } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useDestinations(filters: DestinationFilters) {
  const params = new URLSearchParams()
  if (filters.region) params.set('region', filters.region)
  if (filters.categories?.length) filters.categories.forEach((c) => params.append('categories', c))
  if (filters.featured) params.set('featured', 'true')
  if (filters.season) params.set('season', filters.season)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize))
  if (filters.sortBy) params.set('sortBy', filters.sortBy)

  const { data, error, isLoading, mutate } = useSWR<PaginatedDestinations>(
    `/api/destinations?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  )

  return {
    destinations: data?.destinations ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useFeaturedDestinations(region?: string) {
  const params = region ? `?featured=true&region=${region}` : '?featured=true'
  const { data, isLoading } = useSWR<PaginatedDestinations>(
    `/api/destinations${params}`,
    fetcher,
    { revalidateOnFocus: false }
  )
  return { featured: data?.destinations ?? [], isLoading }
}