import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Award,
  MapPin,
  Briefcase,
  Utensils,
  Moon,
  Sparkles,
  CigaretteOff,
  Wine,
} from 'lucide-react';
import { MatchResult } from '../utils/compatibility';

interface MatchBreakdownModalProps {
  match: MatchResult | null;
  onClose: () => void;
  isDemoPreview?: boolean;
}

const WEIGHT_META: {
  key: keyof MatchResult['breakdown'];
  label: string;
  max: number;
}[] = [
  { key: 'budget', label: 'Monthly Rent Budget', max: 20 },
  { key: 'food', label: 'Food Preference', max: 15 },
  { key: 'sleep', label: 'Sleep Schedule', max: 15 },
  { key: 'cleanliness', label: 'Cleanliness Preference', max: 15 },
  { key: 'hobbies', label: 'Hobbies & Interests', max: 15 },
  { key: 'smoking', label: 'Smoking Preference', max: 10 },
  { key: 'drinking', label: 'Drinking Preference', max: 10 },
];

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  match,
  onClose,
  isDemoPreview = false,
}) => {
  useEffect(() => {
    if (!match) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [match, onClose]);

  return (
    <AnimatePresence>
      {match && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-breakdown-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#252B29]/55 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl bg-[#FAF8F2] rounded-3xl shadow-2xl border border-[#252B29]/10 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 sm:p-7 bg-white border-b border-[#252B29]/8 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {isDemoPreview && (
                    <span className="text-xs font-semibold text-[#5A6460]">
                      Demo preview sample · Not saved to Firebase
                    </span>
                  )}
                  {isDemoPreview && match.isHighMatch && (
                    <span aria-hidden="true" className="text-xs text-[#5A6460]">
                      ·
                    </span>
                  )}
                  {match.isHighMatch && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#145C4B]">
                      <Award className="w-3.5 h-3.5" aria-hidden="true" />
                      Highly Compatible Match
                    </span>
                  )}
                </div>

                <h2
                  id="match-breakdown-title"
                  className="font-display text-2xl font-bold text-[#252B29]"
                >
                  {match.profile.name}
                  {match.profile.age ? `, ${match.profile.age}` : ''}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5A6460]">
                  {(match.profile.city || match.profile.country) && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      {match.profile.city
                        ? match.profile.country
                          ? `${match.profile.city}, ${match.profile.country}`
                          : match.profile.city
                        : match.profile.country}
                    </span>
                  )}
                  {match.profile.occupation && (
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      {match.profile.occupation}
                    </span>
                  )}
                  {match.profile.monthlyRentBudget && (
                    <span className="font-semibold text-[#252B29] tabular-nums">
                      Budget: ${match.profile.monthlyRentBudget.toLocaleString()}/mo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#145C4B] text-[#FAF8F2] font-display text-base font-bold tabular-nums">
                  {match.score}% Match
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close detailed profile"
                  className="w-9 h-9 rounded-full bg-[#FAF8F2] hover:bg-[#F3EFE4] text-[#252B29] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
              {/* Complete Lifestyle Profile Grid */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#5A6460]">
                  Lifestyle Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#252B29]/8">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6460] mb-1">
                      <Utensils className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      Food
                    </p>
                    <p className="text-sm font-semibold text-[#252B29]">
                      {match.profile.foodPreference || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#252B29]/8">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6460] mb-1">
                      <Moon className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      Sleep Schedule
                    </p>
                    <p className="text-sm font-semibold text-[#252B29]">
                      {match.profile.sleepSchedule || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#252B29]/8">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6460] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      Cleanliness
                    </p>
                    <p className="text-sm font-semibold text-[#252B29]">
                      {match.profile.cleanlinessPreference || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#252B29]/8">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6460] mb-1">
                      <CigaretteOff className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      Smoking
                    </p>
                    <p className="text-sm font-semibold text-[#252B29]">
                      {match.profile.smokingPreference || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#252B29]/8">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6460] mb-1">
                      <Wine className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                      Drinking
                    </p>
                    <p className="text-sm font-semibold text-[#252B29]">
                      {match.profile.drinkingPreference || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#252B29]/8">
                    <p className="text-[11px] font-semibold text-[#5A6460] mb-1">
                      Monthly Budget
                    </p>
                    <p className="text-sm font-semibold text-[#252B29] tabular-nums">
                      {match.profile.monthlyRentBudget
                        ? `$${match.profile.monthlyRentBudget.toLocaleString()} / mo`
                        : 'Flexible'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hobbies & Shared Interests */}
              <div className="p-4 rounded-2xl bg-white border border-[#252B29]/8 space-y-2">
                <p className="text-xs font-semibold text-[#5A6460]">
                  Hobbies & Interests
                </p>
                {match.sharedHobbies.length > 0 && (
                  <p className="text-xs font-semibold text-[#145C4B]">
                    Shared with you: {match.sharedHobbies.join(' · ')}
                  </p>
                )}
                <p className="text-sm text-[#252B29]">
                  {match.profile.hobbies && match.profile.hobbies.length > 0
                    ? match.profile.hobbies.join(' · ')
                    : 'No hobbies listed yet.'}
                </p>
              </div>

              {/* Compatibility Score Breakdown */}
              <div className="space-y-3 pt-2 border-t border-[#252B29]/8">
                <p className="text-xs font-semibold text-[#5A6460]">
                  Compatibility Breakdown (100 Points Total)
                </p>

                {WEIGHT_META.map((item) => {
                  const earned = match.breakdown[item.key];
                  const pct = Math.round((earned / item.max) * 100);
                  return (
                    <div key={item.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-[#252B29]">
                        <span>{item.label}</span>
                        <span className="tabular-nums font-semibold text-[#145C4B]">
                          {earned} / {item.max} pts
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E6F2EB] overflow-hidden">
                        <div
                          className="h-full bg-[#145C4B] rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#252B29]/8 flex items-center justify-between gap-4">
              <p className="text-xs text-[#5A6460]">
                Personal email and account ID remain hidden for privacy.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
