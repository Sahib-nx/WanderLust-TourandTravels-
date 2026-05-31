import type {
  EstimateInput,
  PackageEstimate,
  PackageType,
  AccommodationTier,
  Season,
} from '@/types'

// ─── Season detection ─────────────────────────────────────────────────────────

const SEASON_MAP: Record<number, Season> = {
  0: 'Winter',   // Jan
  1: 'Winter',   // Feb
  2: 'Spring',   // Mar
  3: 'Spring',   // Apr
  4: 'Spring',   // May
  5: 'Summer',   // Jun
  6: 'Summer',   // Jul
  7: 'Summer',   // Aug
  8: 'Autumn',   // Sep
  9: 'Autumn',   // Oct
  10: 'Autumn',  // Nov
  11: 'Winter',  // Dec
}

const SEASON_MULTIPLIER: Record<Season, number> = {
  Spring: 1.2,   // peak — tulips in Kashmir, rhododendrons in Nepal
  Summer: 1.0,   // monsoon in Nepal, pleasant in Kashmir
  Autumn: 1.25,  // peak — golden foliage, clear skies for trekking
  Winter: 0.75,  // off-season (snow access for ski/snow packages)
}

// ─── Package type multipliers ─────────────────────────────────────────────────

const PACKAGE_MULTIPLIER: Record<PackageType, number> = {
  'Luxury Retreat': 2.2,
  'Adventure Trek': 1.3,
  'Romantic Escape': 1.6,
  'Family Journey': 1.4,
  'Snow Expedition': 1.5,
  'Nature Explorer': 1.1,
}

// ─── Accommodation tier multipliers ──────────────────────────────────────────

const ACCOM_MULTIPLIER: Record<AccommodationTier, number> = {
  'Hostel': 0.3,
  'Hotel': 1.0,
  'Resort': 1.6,
  'Villa': 2.4,
  'Luxury Camp': 1.8,
}

// ─── Core calculation ─────────────────────────────────────────────────────────

export function calculateEstimate(input: EstimateInput): PackageEstimate | null {
  const {
    destination,
    packageType,
    accommodationTier,
    checkInMonth,
    checkOutMonth,
    adults,
    children,
  } = input

  if (!destination || checkInMonth === null || checkOutMonth === null) return null

  // Night count (month-based approximation: each month = 7 nights)
  const monthDiff = checkOutMonth - checkInMonth
  const nights = Math.max(1, monthDiff * 7)

  // Effective pax (children count as 0.6 of an adult for pricing)
  const pax = adults + children * 0.6

  // Season from check-in month
  const season = SEASON_MAP[checkInMonth]
  const seasonMultiplier = SEASON_MULTIPLIER[season]
  const packageMultiplier = PACKAGE_MULTIPLIER[packageType]
  const accomMultiplier = ACCOM_MULTIPLIER[accommodationTier]

  // Base prices from destination data
  const stayPerNightPerPerson = destination.avgStayPrice * accomMultiplier
  const transportPerPerson = destination.avgTransportPrice
  const activitiesPerPersonPerNight = destination.avgActivityPrice * packageMultiplier

  // Component totals
  const stay = stayPerNightPerPerson * nights * pax * seasonMultiplier
  const transport = transportPerPerson * pax
  const guidedActivities = activitiesPerPersonPerNight * nights * pax * packageMultiplier
  const seasonalAdjustment = (stay + guidedActivities) * (seasonMultiplier - 1)
  const total = Math.round(stay + transport + guidedActivities)
  const perPerson = Math.round(total / Math.max(1, pax))

  return {
    stay: Math.round(stay),
    transport: Math.round(transport),
    guidedActivities: Math.round(guidedActivities),
    seasonalAdjustment: Math.round(Math.abs(seasonalAdjustment)),
    total,
    perPerson,
    nights,
    currency: 'USD',
  }
}