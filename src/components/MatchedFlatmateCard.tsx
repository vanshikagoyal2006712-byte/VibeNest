import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Briefcase,
  Moon,
  Sparkles,
  Utensils,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { MatchResult } from '../utils/compatibility';

interface MatchedFlatmateCardProps {
  match: MatchResult;
  onInspect: (match: MatchResult) => void;
  isDemoPreview?: boolean;
}

export const MatchedFlatmateCard: React.FC<MatchedFlatmateCardProps> = ({
  match,
  onInspect,
  isDemoPreview = false,
}) => {
  const { profile, score, isHighMatch, sharedHobbies } = match;
  const initial = profile.name.charAt(0).toUpperCase() || 'V';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl bg-white p-6 flex flex-col justify-between gap-5 transition-shadow ${
        isHighMatch
          ? 'border border-[#145C4B]/40 shadow-[0_14px_36px_-14px_rgba(20,92,75,0.22)]'
          : 'border border-[#252B29]/10 shadow-[0_8px_28px_-14px_rgba(37,43,41,0.1)] hover:shadow-[0_14px_34px_-14px_rgba(20,92,75,0.16)]'
      }`}
    >
      <div className="space-y-4">
        {isDemoPreview && (
          <p className="text-[11px] font-semibold text-[#5A6460]">
            Demo preview · Sample profile
          </p>
        )}

        {/* Top Row: Avatar Initial + Name/City + Compatibility Percentage */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              aria-hidden="true"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display text-lg font-bold shrink-0 ${
                isHighMatch
                  ? 'bg-[#145C4B] text-[#FAF8F2]'
                  : 'bg-[#E6F2EB] text-[#145C4B]'
              }`}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-[#252B29] truncate">
                {profile.name}
                {profile.age ? `, ${profile.age}` : ''}
              </h3>
              <p className="inline-flex items-center gap-1 text-xs font-medium text-[#5A6460]">
                <MapPin className="w-3.5 h-3.5 text-[#145C4B] shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {profile.city
                    ? profile.country
                      ? `${profile.city}, ${profile.country}`
                      : profile.city
                    : profile.country || 'Location flexible'}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span
              className={`inline-block font-display text-lg font-bold tabular-nums px-3 py-1 rounded-xl ${
                isHighMatch
                  ? 'bg-[#145C4B] text-[#FAF8F2]'
                  : 'bg-[#F3EFE4] text-[#252B29]'
              }`}
            >
              {score}%
            </span>
          </div>
        </div>

        {/* High Compatibility Indicator */}
        {isHighMatch && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#145C4B]">
            <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Highly Compatible Match</span>
          </div>
        )}

        {/* Occupation & Selected Lifestyle Details */}
        <div className="space-y-2.5 pt-2 border-t border-[#252B29]/8 text-xs text-[#5A6460]">
          {profile.occupation && (
            <div className="flex items-center gap-2 text-[#252B29] font-medium">
              <Briefcase className="w-3.5 h-3.5 text-[#145C4B] shrink-0" aria-hidden="true" />
              <span className="truncate">{profile.occupation}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {profile.sleepSchedule && (
              <span className="inline-flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                {profile.sleepSchedule}
              </span>
            )}
            {profile.cleanlinessPreference && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                  {profile.cleanlinessPreference}
                </span>
              </>
            )}
            {profile.foodPreference && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                  {profile.foodPreference}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {profile.smokingPreference && <span>{profile.smokingPreference}</span>}
            {profile.drinkingPreference && (
              <>
                <span aria-hidden="true">·</span>
                <span>Drinks: {profile.drinkingPreference}</span>
              </>
            )}
          </div>
        </div>

        {/* Hobbies / Shared Interests */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div className="pt-2 border-t border-[#252B29]/8 space-y-1">
            <p className="text-[11px] font-semibold text-[#5A6460]">
              {sharedHobbies.length > 0
                ? `${sharedHobbies.length} shared interest${sharedHobbies.length > 1 ? 's' : ''}`
                : 'Interests'}
            </p>
            <p className="text-xs text-[#252B29]/85 line-clamp-2">
              {profile.hobbies.join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Footer: Monthly Budget + View Profile Action */}
      <div className="pt-3 border-t border-[#252B29]/8 flex items-center justify-between gap-4">
        <div>
          <span className="block text-xs text-[#5A6460]">Monthly budget</span>
          <span className="font-display text-base font-bold text-[#252B29] tabular-nums">
            {profile.monthlyRentBudget
              ? `$${profile.monthlyRentBudget.toLocaleString()}/mo`
              : 'Flexible'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onInspect(match)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#145C4B] bg-[#E6F2EB] hover:bg-[#B7D9C5]/70 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          View Profile
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
};
