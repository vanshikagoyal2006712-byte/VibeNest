import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  ShieldCheck,
  Calendar,
  Briefcase,
  Moon,
  Sparkles,
  Users,
  Flag,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { FlatmateProfile } from '../types';
import { SafeImage } from './SafeImage';

interface ProfileModalProps {
  profile: FlatmateProfile | null;
  onClose: () => void;
  onRequestAuth: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onRequestAuth,
}) => {
  const [introSent, setIntroSent] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);

  useEffect(() => {
    setIntroSent(false);
    setSafetyNotice(null);
  }, [profile?.id]);

  useEffect(() => {
    if (!profile) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [profile, onClose]);

  return (
    <AnimatePresence>
      {profile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
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
            <div className="relative h-56 sm:h-64 shrink-0">
              <SafeImage
                src={profile.avatar}
                alt={profile.name}
                fallbackTitle={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252B29]/85 via-[#252B29]/25 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close profile details"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF8F2]/90 hover:bg-white text-[#252B29] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4 text-[#FAF8F2]">
                <div>
                  <p className="text-xs font-medium text-[#FAF8F2]/85">
                    Demo profile · {profile.neighborhood}, {profile.city}
                  </p>
                  <h2 id="profile-modal-title" className="font-display text-2xl font-bold">
                    {profile.name}, {profile.age}
                  </h2>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#145C4B] text-[#FAF8F2] text-sm font-semibold tabular-nums shrink-0">
                  {profile.matchScore}% Lifestyle Fit
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5A6460]">
                <span className="inline-flex items-center gap-1.5 text-[#252B29] font-medium">
                  <Briefcase className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
                  {profile.role}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#145C4B]" aria-hidden="true" />
                  Move-in {profile.moveInDate}
                </span>
                {profile.verifiedId && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-[#145C4B] font-medium">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                      ID Verified
                    </span>
                  </>
                )}
              </div>

              <p className="text-base text-[#252B29] leading-relaxed">{profile.bio}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#252B29]/8">
                  <div className="flex items-center gap-2 text-xs text-[#5A6460] mb-1">
                    <Moon className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                    <span>Sleep Rhythm</span>
                  </div>
                  <p className="text-sm font-semibold text-[#252B29]">{profile.sleepSchedule}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#252B29]/8">
                  <div className="flex items-center gap-2 text-xs text-[#5A6460] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                    <span>Tidy Standard</span>
                  </div>
                  <p className="text-sm font-semibold text-[#252B29]">{profile.cleanliness}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#252B29]/8">
                  <div className="flex items-center gap-2 text-xs text-[#5A6460] mb-1">
                    <Users className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                    <span>Home Energy</span>
                  </div>
                  <p className="text-sm font-semibold text-[#252B29]">{profile.socialStyle}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#252B29]/8">
                <p className="text-xs font-semibold text-[#5A6460]">
                  Work Setup & Everyday Notes
                </p>
                <p className="text-sm text-[#252B29]">
                  {profile.workSetup} · {profile.highlights.join(' · ')}
                </p>
              </div>

              {safetyNotice && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-[#EFEBF9] text-[#252B29] text-sm flex items-center justify-between gap-3"
                >
                  <span>{safetyNotice}</span>
                  <button
                    type="button"
                    onClick={() => setSafetyNotice(null)}
                    className="text-xs font-semibold text-[#145C4B] underline cursor-pointer shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {introSent && (
                <div
                  role="status"
                  className="p-4 rounded-2xl bg-[#E6F2EB] text-[#145C4B] text-sm flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Demo intro queued for {profile.name}</p>
                    <p className="text-xs text-[#145C4B]/85 mt-0.5">
                      Create an account to save your lifestyle calibration and send real intros while keeping contact details private.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#252B29]/8 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSafetyNotice(
                      `Demo report logged for ${profile.name}. Real reports pause chat immediately and notify Trust & Safety.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5A6460] hover:text-[#252B29] py-2 px-2.5 rounded-lg hover:bg-[#252B29]/5 transition-colors cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                  Report
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSafetyNotice(
                      `${profile.name} hidden in this preview. Blocking immediately hides your profile from them.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5A6460] hover:text-[#252B29] py-2 px-2.5 rounded-lg hover:bg-[#252B29]/5 transition-colors cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                  Block
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onRequestAuth}
                  className="px-4 py-2.5 text-sm font-semibold text-[#145C4B] hover:bg-[#E6F2EB]/60 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Create Account
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIntroSent(true)}
                  className="px-5 py-2.5 text-sm font-semibold text-[#FAF8F2] bg-[#145C4B] hover:bg-[#0F493B] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  {introSent ? 'Intro Requested' : 'Request Intro'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
