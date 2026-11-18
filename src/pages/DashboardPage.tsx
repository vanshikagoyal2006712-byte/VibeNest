import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Edit3,
  LogOut,
  MapPin,
  Briefcase,
  DollarSign,
  Utensils,
  Moon,
  Sparkles,
  CigaretteOff,
  Wine,
  ArrowRight,
  RefreshCw,
  Users,
  AlertCircle,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { AppRoute, UserProfile } from '../types';
import { Reveal } from '../components/MotionPrimitives';
import {
  calculateCompatibility,
  sortMatchesDescending,
  toPublicMatchProfile,
  type MatchResult,
} from '../utils/compatibility';
import { MatchedFlatmateCard } from '../components/MatchedFlatmateCard';
import { MatchBreakdownModal } from '../components/MatchBreakdownModal';

interface DashboardPageProps {
  currentUser: User;
  userProfile: UserProfile;
  onSignOut: () => Promise<void>;
  onNavigate: (route: AppRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  userProfile,
  onSignOut,
  onNavigate,
}) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  const loadMatches = useCallback(async () => {
    setLoadingMatches(true);
    setMatchError(null);
    setPermissionDenied(false);

    try {
      const snapshot = await get(ref(db, 'profiles'));
      if (!snapshot.exists()) {
        setMatches([]);
        return;
      }

      const rawMap = snapshot.val() as Record<string, Partial<UserProfile> | null>;
      const eligibleResults: MatchResult[] = [];

      for (const [uidKey, rawProfile] of Object.entries(rawMap)) {
        if (!rawProfile || typeof rawProfile !== 'object') continue;
        const candidateUid = rawProfile.uid || uidKey;

        // Exclude the currently logged-in user and incomplete profiles
        if (candidateUid === currentUser.uid || uidKey === currentUser.uid) continue;
        if (rawProfile.profileCompleted !== true) continue;

        const sanitized = toPublicMatchProfile(uidKey, rawProfile);
        const result = calculateCompatibility(userProfile, sanitized);
        eligibleResults.push(result);
      }

      setMatches(sortMatchesDescending(eligibleResults));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('PERMISSION_DENIED') || message.includes('permission_denied')) {
        setPermissionDenied(true);
        setMatchError(
          'Your Firebase Realtime Database rules currently block reading the /profiles list for discovery.'
        );
      } else {
        setMatchError(
          'Could not load compatible flatmates right now. Please check your connection and try again.'
        );
      }
    } finally {
      setLoadingMatches(false);
    }
  }, [currentUser.uid, userProfile]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const displayName =
    userProfile.name || currentUser.displayName || currentUser.email || 'Member';
  const highMatchCount = matches.filter((m) => m.isHighMatch).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
      {/* Header Card */}
      <Reveal>
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#252B29]/10 shadow-[0_14px_40px_-20px_rgba(37,43,41,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145C4B]">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Lifestyle Profile Complete
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#252B29] text-balance">
              Welcome home, {displayName}
            </h1>
            <p className="text-sm sm:text-base text-[#5A6460]">
              {userProfile.city}
              {userProfile.country ? `, ${userProfile.country}` : ''} · {userProfile.occupation} · Budget $
              {userProfile.monthlyRentBudget?.toLocaleString()}/mo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/lifestyle-profile')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F2] hover:bg-[#E6F2EB] border border-[#252B29]/12 text-sm font-semibold text-[#145C4B] transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              Edit Lifestyle Profile
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3EFE4] border border-[#252B29]/12 text-sm font-semibold text-[#252B29] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#5A6460]" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </Reveal>

      {/* Flatmate Compatibility Matches Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#145C4B]">
              Compatibility Ranking
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29]">
              Your Flatmate Matches
            </h2>
            <p className="text-sm text-[#5A6460]">
              Sorted highest to lowest across budget, sleep, cleanliness, food, habits, and shared interests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            {!loadingMatches && !matchError && (
              <span className="text-xs font-medium text-[#5A6460] tabular-nums">
                {matches.length} eligible · {highMatchCount} high match
                {highMatchCount === 1 ? '' : 'es'}
              </span>
            )}
            <button
              type="button"
              onClick={() => onNavigate('/explore')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-xs font-semibold text-[#FAF8F2] transition-colors cursor-pointer whitespace-nowrap"
            >
              Filter & Discover
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={loadMatches}
              disabled={loadingMatches}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3EFE4] border border-[#252B29]/12 text-xs font-semibold text-[#252B29] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#145C4B] ${
                  loadingMatches ? 'animate-spin' : ''
                }`}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>

        {loadingMatches ? (
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
        ) : matchError ? (
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
                <h3 className="font-display text-lg font-bold text-[#252B29]">
                  Unable to load member matches
                </h3>
                <p className="text-sm text-[#252B29]/85 leading-relaxed">
                  {matchError}
                </p>
                {permissionDenied && (
                  <p className="text-xs text-[#5A6460] leading-relaxed">
                    To enable signed-in member discovery without making the database public, allow{' '}
                    <code className="px-1.5 py-0.5 rounded bg-white/80 text-[#145C4B]">
                      &quot;.read&quot;: &quot;auth != null&quot;
                    </code>{' '}
                    on the <code className="px-1.5 py-0.5 rounded bg-white/80">/profiles</code> node in Firebase Realtime Database Rules while keeping per-user write protection.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadMatches}
                className="px-4 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-xs font-semibold transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/explore')}
                className="px-4 py-2.5 rounded-xl bg-white text-[#252B29] border border-[#252B29]/12 text-xs font-semibold transition-colors cursor-pointer"
              >
                Open Flatmate Discovery
              </button>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="p-10 sm:p-12 rounded-3xl bg-white border border-[#252B29]/8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F2EB] text-[#145C4B] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#252B29]">
              No other completed flatmate profiles yet
            </h3>
            <p className="text-sm text-[#5A6460] max-w-md mx-auto leading-relaxed">
              Your lifestyle profile is ready and saved. As soon as other members complete their onboarding in Realtime Database, they will appear here ranked by compatibility.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={loadMatches}
                className="px-5 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
              >
                Check Again
              </button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('/explore')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F2] hover:bg-[#F3EFE4] border border-[#252B29]/12 text-[#252B29] text-sm font-semibold transition-colors cursor-pointer"
              >
                Open Flatmate Discovery
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchedFlatmateCard
                key={match.profile.uid}
                match={match}
                onInspect={setSelectedMatch}
              />
            ))}
          </div>
        )}
      </section>

      {/* Saved Lifestyle Summary Grid */}
      <section className="space-y-5 pt-4 border-t border-[#252B29]/8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#252B29]">
            Your Saved Lifestyle Baseline
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('/lifestyle-profile')}
            className="text-xs font-semibold text-[#145C4B] hover:underline cursor-pointer"
          >
            Update Preferences
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#252B29]/8 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6460]">
              <MapPin className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
              <span>Location & Age</span>
            </div>
            <p className="font-display text-lg font-bold text-[#252B29]">
              {userProfile.city}
              {userProfile.country ? `, ${userProfile.country}` : ''} · {userProfile.age} yrs
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#252B29]/8 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6460]">
              <Briefcase className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
              <span>Occupation</span>
            </div>
            <p className="font-display text-lg font-bold text-[#252B29]">
              {userProfile.occupation}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#252B29]/8 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6460]">
              <DollarSign className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
              <span>Monthly Rent Budget</span>
            </div>
            <p className="font-display text-lg font-bold text-[#252B29] tabular-nums">
              ${userProfile.monthlyRentBudget?.toLocaleString()} / mo
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#E6F2EB]/65 border border-[#145C4B]/12 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#145C4B]">
              <Moon className="w-4 h-4" aria-hidden="true" />
              <span>Sleep Schedule</span>
            </div>
            <p className="font-display text-lg font-bold text-[#252B29]">
              {userProfile.sleepSchedule}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#EFEBF9]/70 border border-[#B9A7E8]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#145C4B]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Cleanliness Preference</span>
            </div>
            <p className="font-display text-lg font-bold text-[#252B29]">
              {userProfile.cleanlinessPreference}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF0E8]/80 border border-[#FFBFA3]/40 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#145C4B]">
              <Utensils className="w-4 h-4" aria-hidden="true" />
              <span>Food Preference</span>
            </div>
            <p className="font-display text-lg font-bold text-[#252B29]">
              {userProfile.foodPreference}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#252B29]/8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#5A6460]">Habits & Boundaries</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-[#252B29]">
              <span className="inline-flex items-center gap-1.5">
                <CigaretteOff className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
                {userProfile.smokingPreference}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Wine className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
                Drinking: {userProfile.drinkingPreference}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#5A6460]">Hobbies & Interests</p>
            <p className="text-sm font-medium text-[#252B29]">
              {userProfile.hobbies && userProfile.hobbies.length > 0
                ? userProfile.hobbies.join(' · ')
                : 'None listed'}
            </p>
          </div>
        </div>
      </section>

      <MatchBreakdownModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
};
