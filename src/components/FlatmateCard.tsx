import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { FlatmateProfile } from '../types';
import { SafeImage } from './SafeImage';

interface FlatmateCardProps {
  profile: FlatmateProfile;
  onSelect: (profile: FlatmateProfile) => void;
  compatibilityOverride?: number;
}

const ACCENT_WASH: Record<FlatmateProfile['accentTone'], string> = {
  sage: 'bg-[#E6F2EB]',
  lavender: 'bg-[#EFEBF9]',
  peach: 'bg-[#FFF0E8]',
};

export const FlatmateCard: React.FC<FlatmateCardProps> = ({
  profile,
  onSelect,
  compatibilityOverride,
}) => {
  const score = compatibilityOverride ?? profile.matchScore;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-2xl border border-[#252B29]/8 shadow-[0_8px_28px_-12px_rgba(37,43,41,0.1)] hover:shadow-[0_16px_36px_-14px_rgba(20,92,75,0.16)] transition-shadow overflow-hidden flex flex-col"
    >
      <div className={`relative aspect-[4/3] overflow-hidden ${ACCENT_WASH[profile.accentTone]}`}>
        <SafeImage
          src={profile.avatar}
          alt={`${profile.name}, ${profile.role} in ${profile.city}`}
          fallbackTitle={profile.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#252B29]/75 via-[#252B29]/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-[#FAF8F2]">
          <div>
            <p className="text-xs font-medium text-[#FAF8F2]/85">
              Demo profile · {profile.neighborhood}
            </p>
            <h3 className="font-display text-lg font-bold leading-snug">
              {profile.name}, {profile.age}
            </h3>
          </div>
          <span className="text-sm font-semibold tabular-nums bg-[#145C4B] text-[#FAF8F2] px-2.5 py-1 rounded-lg">
            {score}% fit
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#5A6460]">
            <span>{profile.role}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.city}</span>
            {profile.verifiedId && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-[#145C4B]">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  ID Verified
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-[#252B29]/85 leading-relaxed line-clamp-2">
            {profile.bio}
          </p>

          <div className="pt-2 border-t border-[#252B29]/6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6460]">
            <span>{profile.sleepSchedule}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.cleanliness}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.socialStyle}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#252B29]/8 flex items-center justify-between gap-4">
          <div>
            <span className="block text-xs text-[#5A6460]">Target budget</span>
            <span className="font-display text-base font-bold text-[#252B29] tabular-nums">
              ${profile.budgetMax.toLocaleString()}/mo
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(profile)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#145C4B] bg-[#E6F2EB] hover:bg-[#B7D9C5]/70 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Match
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
