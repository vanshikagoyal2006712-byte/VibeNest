import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  RefreshCw,
  Users,
  AlertCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { AppRoute, FlatmateProfile, SearchFilters, UserProfile } from '../types';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCitiesForCountry,
  inferCountryForCity,
} from '../data/locations';
import { DEMO_DISCOVERY_PROFILES, DEMO_FLATMATES } from '../data/mockData';
import { CitySearchSelect } from '../components/CitySearchSelect';
import { FlatmateCard } from '../components/FlatmateCard';
import { MatchedFlatmateCard } from '../components/MatchedFlatmateCard';
import { MatchBreakdownModal } from '../components/MatchBreakdownModal';
import { Reveal } from '../components/MotionPrimitives';
import {
  calculateCompatibility,
  sortMatchesDescending,
  toPublicMatchProfile,
  type MatchResult,
} from '../utils/compatibility';

interface ExplorePageProps {
  currentUser: User | null;
  userProfile: UserProfile | null;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSelectProfile: (profile: FlatmateProfile) => void;
  onNavigate: (route: AppRoute) => void;
}

type DiscoveryMode = 'real' | 'demo';

const FOOD_FILTER_OPTIONS = [
  'Any',
  'Vegetarian',
  'Vegan',
  'Eggetarian',
  'Non-Vegetarian',
  'No Preference',
];

const SLEEP_FILTER_OPTIONS = ['Any', 'Early Bird', 'Balanced', 'Night Owl'];

const SMOKING_FILTER_OPTIONS = ['Any', 'Non-Smoker', 'Outside Only', 'Smoker-Friendly'];

const BUDGET_FILTER_OPTIONS = [
  { value: 0, label: 'Any monthly budget' },
  { value: 1200, label: 'Up to $1,200 / mo' },
  { value: 1500, label: 'Up to $1,500 / mo' },
  { value: 1800, label: 'Up to $1,800 / mo' },
  { value: 2000, label: 'Up to $2,000 / mo' },
  { value: 2500, label: 'Up to $2,500 / mo' },
  { value: 3500, label: 'Up to $3,500 / mo' },
];

const DEMO_FOOD_BY_ID: Record<string, string> = {
  'demo-maya': 'Vegetarian',
  'demo-liam': 'Non-Vegetarian',
  'demo-sofia': 'Vegan',
  'demo-devon': 'No Preference',
  'demo-elena': 'Vegetarian',
  'demo-noah': 'Non-Vegetarian',
  'demo-aarav': 'Vegetarian',
  'demo-kavya': 'Eggetarian',
  'demo-rohan': 'No Preference',
};

const DEMO_SMOKING_BY_ID: Record<string, string> = {
  'demo-maya': 'Non-Smoker',
  'demo-liam': 'Non-Smoker',
  'demo-sofia': 'Non-Smoker',
  'demo-devon': 'Outside Only',
  'demo-elena': 'Non-Smoker',
  'demo-noah': 'Non-Smoker',
  'demo-aarav': 'Non-Smoker',
  'demo-kavya': 'Non-Smoker',
  'demo-rohan': 'Non-Smoker',
};

function matchesSleepFilter(schedule: string | undefined, filterValue: string): boolean {
  if (!filterValue || filterValue === 'Any') return true;
  if (!schedule) return false;
  return schedule.toLowerCase().includes(filterValue.toLowerCase());
}

function matchesCountryFilter(
  profileCountry: string | undefined,
  profileCity: string | undefined,
  countryFilter: string
): boolean {
  if (!countryFilter || countryFilter === 'All Countries') return true;
  const effectiveCountry = profileCountry?.trim() || inferCountryForCity(profileCity);
  if (!effectiveCountry) {
    // Preserve legacy profiles with unrecognized custom cities under default India or when cleared
    return countryFilter === DEFAULT_COUNTRY;
  }
  return effectiveCountry.toLowerCase() === countryFilter.trim().toLowerCase();
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  currentUser,
  userProfile,
  filters,
  onFiltersChange,
  onSelectProfile,
  onNavigate,
}) => {
  const isMemberReady = Boolean(currentUser && userProfile?.profileCompleted);

  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>('real');
  const [realMatches, setRealMatches] = useState<MatchResult[]>([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  const countryFilter = filters.country || DEFAULT_COUNTRY;
  const foodFilter = filters.foodPreference || 'Any';
  const smokingFilter = filters.smokingPreference || 'Any';

  const fetchRealProfiles = useCallback(async () => {
    if (!currentUser || !userProfile?.profileCompleted) return;

    setLoadingReal(true);
    setLoadError(null);
    setPermissionDenied(false);

    try {
      const snapshot = await get(ref(db, 'profiles'));
      if (!snapshot.exists()) {
        setRealMatches([]);
        return;
      }

      const rawMap = snapshot.val() as Record<string, Partial<UserProfile> | null>;
      const results: MatchResult[] = [];

      for (const [uidKey, rawCandidate] of Object.entries(rawMap)) {
        if (!rawCandidate || typeof rawCandidate !== 'object') continue;
        const candidateUid = rawCandidate.uid || uidKey;

        // Exclude currently logged-in user and incomplete profiles
        if (candidateUid === currentUser.uid || uidKey === currentUser.uid) continue;
        if (rawCandidate.profileCompleted !== true) continue;

        const sanitized = toPublicMatchProfile(uidKey, rawCandidate);
        results.push(calculateCompatibility(userProfile, sanitized));
      }

      setRealMatches(sortMatchesDescending(results));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('PERMISSION_DENIED') || message.includes('permission_denied')) {
        setPermissionDenied(true);
        setLoadError(
          'Firebase Realtime Database rules currently restrict reading the /profiles list for discovery.'
        );
      } else {
        setLoadError(
          'Unable to fetch member profiles right now. Please verify your connection and retry.'
        );
      }
    } finally {
      setLoadingReal(false);
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    if (isMemberReady) {
      fetchRealProfiles();
    }
  }, [isMemberReady, fetchRealProfiles]);

  // Score Demo Preview profiles dynamically against userProfile (never saved to Firebase)
  const demoPreviewMatches = useMemo(() => {
    if (!userProfile) return [];
    const scored = DEMO_DISCOVERY_PROFILES.map((sample) =>
      calculateCompatibility(userProfile, sample)
    );
    return sortMatchesDescending(scored);
  }, [userProfile]);

  const activeSourceMatches = discoveryMode === 'real' ? realMatches : demoPreviewMatches;

  const availableCountries = useMemo(() => {
    const set = new Set<string>(COUNTRIES);
    if (isMemberReady) {
      for (const item of activeSourceMatches) {
        if (item.profile.country?.trim()) {
          set.add(item.profile.country.trim());
        }
      }
    }
    return [...Array.from(set), 'All Countries'];
  }, [isMemberReady, activeSourceMatches]);

  const availableCities = useMemo(() => {
    const extraCities: string[] = [];
    if (isMemberReady) {
      for (const item of activeSourceMatches) {
        if (
          item.profile.city?.trim() &&
          matchesCountryFilter(item.profile.country, item.profile.city, countryFilter)
        ) {
          extraCities.push(item.profile.city.trim());
        }
      }
    }
    return getCitiesForCountry(countryFilter, extraCities);
  }, [isMemberReady, activeSourceMatches, countryFilter]);

  const filteredMatches = useMemo(() => {
    const filtered = activeSourceMatches.filter(({ profile }) => {
      if (!matchesCountryFilter(profile.country, profile.city, countryFilter)) {
        return false;
      }

      if (
        filters.city !== 'All Cities' &&
        (profile.city || '').trim().toLowerCase() !== filters.city.trim().toLowerCase()
      ) {
        return false;
      }

      if (
        filters.maxBudget > 0 &&
        typeof profile.monthlyRentBudget === 'number' &&
        profile.monthlyRentBudget > filters.maxBudget
      ) {
        return false;
      }

      if (
        foodFilter !== 'Any' &&
        (profile.foodPreference || '').toLowerCase() !== foodFilter.toLowerCase()
      ) {
        return false;
      }

      if (!matchesSleepFilter(profile.sleepSchedule, filters.sleepSchedule)) {
        return false;
      }

      if (
        smokingFilter !== 'Any' &&
        (profile.smokingPreference || '').toLowerCase() !== smokingFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    });

    // Always preserve descending compatibility score sorting
    return sortMatchesDescending(filtered);
  }, [
    activeSourceMatches,
    countryFilter,
    filters.city,
    filters.maxBudget,
    filters.sleepSchedule,
    foodFilter,
    smokingFilter,
  ]);

  // Public fallback filtering for signed-out visitors
  const filteredPublicDemo = useMemo(() => {
    const filtered = DEMO_FLATMATES.filter((p) => {
      if (!matchesCountryFilter(undefined, p.city, countryFilter)) {
        return false;
      }
      if (
        filters.city !== 'All Cities' &&
        p.city.toLowerCase() !== filters.city.toLowerCase()
      ) {
        return false;
      }
      if (filters.maxBudget > 0 && p.budgetMax > filters.maxBudget) return false;
      if (filters.moveInMonth !== 'any' && p.moveInMonth !== filters.moveInMonth) return false;
      if (!matchesSleepFilter(p.sleepSchedule, filters.sleepSchedule)) return false;

      if (foodFilter !== 'Any') {
        const sampleFood = DEMO_FOOD_BY_ID[p.id] || 'No Preference';
        if (sampleFood.toLowerCase() !== foodFilter.toLowerCase()) return false;
      }

      if (smokingFilter !== 'Any') {
        const sampleSmoking = DEMO_SMOKING_BY_ID[p.id] || 'Non-Smoker';
        if (sampleSmoking.toLowerCase() !== smokingFilter.toLowerCase()) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => b.matchScore - a.matchScore);
  }, [countryFilter, filters, foodFilter, smokingFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (countryFilter !== 'All Countries') count += 1;
    if (filters.city !== 'All Cities') count += 1;
    if (filters.maxBudget > 0) count += 1;
    if (foodFilter !== 'Any') count += 1;
    if (filters.sleepSchedule !== 'Any') count += 1;
    if (smokingFilter !== 'Any') count += 1;
    if (!isMemberReady && filters.moveInMonth !== 'any') count += 1;
    return count;
  }, [
    countryFilter,
    filters.city,
    filters.maxBudget,
    filters.sleepSchedule,
    filters.moveInMonth,
    foodFilter,
    smokingFilter,
    isMemberReady,
  ]);

  const handleClearFilters = () => {
    onFiltersChange({
      country: 'All Countries',
      city: 'All Cities',
      maxBudget: 0,
      moveInMonth: 'any',
      sleepSchedule: 'Any',
      foodPreference: 'Any',
      smokingPreference: 'Any',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-8">
      {/* Header + Mode Switch */}
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-[#145C4B]">
              {isMemberReady
                ? discoveryMode === 'real'
                  ? 'Live Member Discovery · Ranked by Compatibility'
                  : 'Demo Preview Mode · Sample Profiles Only'
                : 'Public Preview · Sample Lifestyle Matches'}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#252B29] text-balance">
              Discover compatible flatmates
            </h1>
            <p className="text-base text-[#5A6460]">
              {isMemberReady
                ? 'Search Indian and international cities, monthly budget, food, sleep rhythm, and smoking preference—always ranked highest match first.'
                : 'Search sample profiles across India and international hubs by city, budget, diet, sleep schedule, and smoking habits.'}
            </p>
          </div>

          {isMemberReady ? (
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
              <div
                role="tablist"
                aria-label="Discovery data source"
                className="inline-flex items-center gap-1 p-1 bg-[#F3EFE4] rounded-xl border border-[#252B29]/10"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={discoveryMode === 'real'}
                  onClick={() => setDiscoveryMode('real')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    discoveryMode === 'real'
                      ? 'bg-white text-[#145C4B] shadow-xs'
                      : 'text-[#5A6460] hover:text-[#252B29]'
                  }`}
                >
                  Real Profiles ({realMatches.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={discoveryMode === 'demo'}
                  onClick={() => setDiscoveryMode('demo')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    discoveryMode === 'demo'
                      ? 'bg-white text-[#145C4B] shadow-xs'
                      : 'text-[#5A6460] hover:text-[#252B29]'
                  }`}
                >
                  Demo Preview ({demoPreviewMatches.length})
                </button>
              </div>

              {discoveryMode === 'real' && (
                <button
                  type="button"
                  onClick={fetchRealProfiles}
                  disabled={loadingReal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F3EFE4] border border-[#252B29]/12 text-xs font-semibold text-[#252B29] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#145C4B] ${loadingReal ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  Refresh
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start lg:self-auto"
            >
              Sign Up for Real Matches
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </Reveal>

      {/* Demo Preview Notice Banner (explicitly isolated from Firebase) */}
      {isMemberReady && discoveryMode === 'demo' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EFEBF9]/75 border border-[#B9A7E8]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-[#145C4B] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#252B29]">
                Demo Preview Active — Sample Flatmate Profiles
              </p>
              <p className="text-xs text-[#5A6460] leading-relaxed">
                These sample profiles let you preview filters and compatibility scoring without extra accounts. They are stored locally and never saved to Firebase or mixed into real matches.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDiscoveryMode('real')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F2] border border-[#252B29]/12 text-xs font-semibold text-[#145C4B] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
          >
            Back to Real Profiles
          </button>
        </div>
      )}

      {/* Location + Lifestyle Filter Bar */}
      <section
        aria-label="Filter flatmates"
        className="bg-white rounded-2xl p-4 sm:p-5 border border-[#252B29]/10 shadow-[0_8px_28px_-14px_rgba(37,43,41,0.1)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-end">
          <div>
            <label htmlFor="explore-country" className="block text-xs font-semibold text-[#5A6460] mb-1.5">
              Country
            </label>
            <select
              id="explore-country"
              value={countryFilter}
              onChange={(e) => {
                const nextCountry = e.target.value;
                const validCities = getCitiesForCountry(nextCountry);
                const keepCity =
                  filters.city === 'All Cities' ||
                  validCities.some(
                    (c) => c.toLowerCase() === filters.city.trim().toLowerCase()
                  );
                onFiltersChange({
                  ...filters,
                  country: nextCountry,
                  city: keepCity ? filters.city : 'All Cities',
                });
              }}
              className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer"
            >
              {availableCountries.map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="explore-city" className="block text-xs font-semibold text-[#5A6460] mb-1.5">
              City
            </label>
            <CitySearchSelect
              id="explore-city"
              value={filters.city}
              onChange={(selectedCity) =>
                onFiltersChange({ ...filters, city: selectedCity })
              }
              cities={availableCities}
              placeholder="All Cities"
              allowAllCities={true}
            />
          </div>

          <div>
            <label htmlFor="explore-budget" className="block text-xs font-semibold text-[#5A6460] mb-1.5">
              Monthly Rent Budget
            </label>
            <select
              id="explore-budget"
              value={filters.maxBudget}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxBudget: Number(e.target.value) })
              }
              className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer tabular-nums"
            >
              {BUDGET_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="explore-food" className="block text-xs font-semibold text-[#5A6460] mb-1.5">
              Food Preference
            </label>
            <select
              id="explore-food"
              value={foodFilter}
              onChange={(e) =>
                onFiltersChange({ ...filters, foodPreference: e.target.value })
              }
              className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer"
            >
              {FOOD_FILTER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Any' ? 'Any food preference' : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="explore-sleep" className="block text-xs font-semibold text-[#5A6460] mb-1.5">
              Sleep Schedule
            </label>
            <select
              id="explore-sleep"
              value={filters.sleepSchedule}
              onChange={(e) =>
                onFiltersChange({ ...filters, sleepSchedule: e.target.value })
              }
              className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer"
            >
              {SLEEP_FILTER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Any' ? 'Any sleep schedule' : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="explore-smoking" className="block text-xs font-semibold text-[#5A6460] mb-1.5">
              Smoking Preference
            </label>
            <select
              id="explore-smoking"
              value={smokingFilter}
              onChange={(e) =>
                onFiltersChange({ ...filters, smokingPreference: e.target.value })
              }
              className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer"
            >
              {SMOKING_FILTER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Any' ? 'Any smoking habit' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#252B29]/8">
          <p className="text-xs text-[#5A6460]">
            Showing cities for <span className="font-semibold text-[#252B29]">{countryFilter}</span> · Type inside the City selector to search
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={activeFilterCount === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F2] hover:bg-[#F3EFE4] text-[#252B29] border border-[#252B29]/12 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
            Clear Filters
          </button>
        </div>
      </section>

      {/* Results Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#5A6460]">
        <p className="inline-flex items-center gap-2 tabular-nums">
          <SlidersHorizontal className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
          {isMemberReady ? (
            <>
              Showing{' '}
              <span className="font-semibold text-[#252B29]">{filteredMatches.length}</span>{' '}
              {discoveryMode === 'real' ? 'real flatmate' : 'demo sample'}
              {filteredMatches.length === 1 ? '' : 's'}
              {activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active` : ''}
            </>
          ) : (
            <>
              Showing{' '}
              <span className="font-semibold text-[#252B29]">{filteredPublicDemo.length}</span>{' '}
              demo flatmates
              {activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active` : ''}
            </>
          )}
        </p>

        <p className="text-xs">
          Sorted by highest compatibility · Select View Profile for full lifestyle details
        </p>
      </div>

      {/* Main Content Area */}
      {isMemberReady ? (
        discoveryMode === 'real' && loadingReal ? (
          <div
            aria-live="polite"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="h-72 rounded-2xl bg-white border border-[#252B29]/8 p-6 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F2EB]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#F3EFE4] rounded w-2/3" />
                    <div className="h-3 bg-[#F3EFE4] rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[#F3EFE4] rounded w-full" />
                  <div className="h-3 bg-[#F3EFE4] rounded w-4/5" />
                </div>
                <div className="h-9 bg-[#E6F2EB]/60 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : discoveryMode === 'real' && loadError ? (
          <div
            role="alert"
            className="p-6 sm:p-8 rounded-3xl bg-[#FFF0E8] border border-[#FFBFA3] space-y-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-[#9F2D20] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1.5">
                <h2 className="font-display text-lg font-bold text-[#252B29]">
                  Could not load real member profiles
                </h2>
                <p className="text-sm text-[#252B29]/85 leading-relaxed">{loadError}</p>
                {permissionDenied && (
                  <p className="text-xs text-[#5A6460] leading-relaxed">
                    Ensure Firebase Realtime Database Rules permit{' '}
                    <code className="px-1.5 py-0.5 rounded bg-white/80 text-[#145C4B]">
                      &quot;.read&quot;: &quot;auth != null&quot;
                    </code>{' '}
                    on <code className="px-1.5 py-0.5 rounded bg-white/80">/profiles</code> while keeping per-user write rules intact. You can also test the interface immediately in Demo Preview mode.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchRealProfiles}
                className="px-4 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-xs font-semibold transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => setDiscoveryMode('demo')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/12 text-xs font-semibold transition-colors cursor-pointer"
              >
                Switch to Demo Preview
              </button>
            </div>
          </div>
        ) : activeSourceMatches.length === 0 ? (
          <div className="p-10 sm:p-12 rounded-3xl bg-white border border-[#252B29]/8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F2EB] text-[#145C4B] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#252B29]">
              No completed flatmate profiles available yet
            </h2>
            <p className="text-sm text-[#5A6460] max-w-md mx-auto leading-relaxed">
              No other VibeNest members have finished their lifestyle profile in Firebase yet. Check back soon or turn on Demo Preview to explore how filters and compatibility cards work.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={fetchRealProfiles}
                className="px-5 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
              >
                Refresh Profiles
              </button>
              <button
                type="button"
                onClick={() => setDiscoveryMode('demo')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F2] hover:bg-[#F3EFE4] border border-[#252B29]/12 text-[#252B29] text-sm font-semibold transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
                Open Demo Preview
              </button>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-10 sm:p-12 rounded-3xl bg-white border border-[#252B29]/8 text-center space-y-4">
            <h2 className="font-display text-xl font-bold text-[#252B29]">
              No {discoveryMode === 'real' ? 'member profiles' : 'demo samples'} match your active filters
            </h2>
            <p className="text-sm text-[#5A6460] max-w-md mx-auto leading-relaxed">
              Try clearing your filters to view profiles across all countries and cities, or adjusting your monthly budget ceiling.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
              {discoveryMode === 'real' && (
                <button
                  type="button"
                  onClick={() => setDiscoveryMode('demo')}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF8F2] hover:bg-[#F3EFE4] border border-[#252B29]/12 text-[#252B29] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Try Demo Preview
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMatches.map((match) => (
                <MatchedFlatmateCard
                  key={match.profile.uid}
                  match={match}
                  onInspect={setSelectedMatch}
                  isDemoPreview={discoveryMode === 'demo'}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )
      ) : (
        /* Signed-out Public Preview Mode */
        <div className="space-y-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E6F2EB]/70 border border-[#145C4B]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#145C4B] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#252B29]">
                  Browsing Sample Demo Profiles
                </p>
                <p className="text-xs text-[#5A6460]">
                  Sign in and complete your lifestyle profile to unlock real Firebase member profiles ranked specifically to your habits.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F2] border border-[#252B29]/12 text-xs font-semibold text-[#145C4B] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
            >
              Sign In
            </button>
          </div>

          {filteredPublicDemo.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#252B29]/8 text-center space-y-4">
              <h2 className="font-display text-xl font-bold text-[#252B29]">
                No demo flatmates match those exact filters
              </h2>
              <p className="text-sm text-[#5A6460] max-w-md mx-auto">
                Try clearing filters to view profiles across all countries and cities, or adjusting your monthly budget ceiling.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
              >
                Show All Countries & Cities
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPublicDemo.map((profile) => (
                  <FlatmateCard
                    key={profile.id}
                    profile={profile}
                    onSelect={onSelectProfile}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* Detailed Profile & Compatibility Breakdown Modal */}
      <MatchBreakdownModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        isDemoPreview={discoveryMode === 'demo'}
      />
    </div>
  );
};
