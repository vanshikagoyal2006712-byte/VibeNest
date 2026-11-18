import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  AppRoute,
  CleanlinessLevel,
  FlatmateProfile,
  SleepSchedule,
  SocialStyle,
} from '../types';
import { DEMO_FLATMATES } from '../data/mockData';
import { Reveal } from '../components/MotionPrimitives';
import { FlatmateCard } from '../components/FlatmateCard';

interface HowItWorksPageProps {
  onNavigate: (route: AppRoute) => void;
  onSelectProfile: (profile: FlatmateProfile) => void;
}

const STAGES = [
  {
    num: '01.',
    title: 'Registration & Verification',
    summary: 'Confirm who you are and what kind of housing setup you need.',
    details: [
      'Choose whether you already have a room to fill or want to team up on a new lease.',
      'Set your target neighborhoods, monthly rent ceiling, and ideal move-in window.',
      'Complete quick ID verification so every match knows they are speaking with a real neighbor.',
    ],
  },
  {
    num: '02.',
    title: 'Lifestyle Questionnaire',
    summary: 'Map the everyday habits that shape peace at home.',
    details: [
      'Define your sleep clock, WFH schedule, and preferred weekday quiet hours.',
      'Select concrete kitchen & common-area tidy standards instead of vague labels.',
      'Share guest comfort, pet friendliness, and shared-bill preferences transparently.',
    ],
  },
  {
    num: '03.',
    title: 'Compatibility Matching',
    summary: 'Review ranked matches with transparent habit alignment.',
    details: [
      'Our weighting engine scores overlap across schedule, cleanliness, and social energy.',
      'Each profile card highlights where your routines naturally align—and any gentle differences.',
      'Filter matches anytime without algorithmic pressure or pay-to-boost clutter.',
    ],
  },
  {
    num: '04.',
    title: 'Private Chat & Safe Connection',
    summary: 'Talk expectations inside VibeNest before ever sharing contact info.',
    details: [
      'Send a structured intro referencing shared neighborhood and house priorities.',
      'Use guided conversation prompts covering deposits, chores, and lease length.',
      'Meet in a public coffee shop first using our safe-meetup checklist.',
    ],
  },
];

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigate,
  onSelectProfile,
}) => {
  const [sleepPref, setSleepPref] = useState<SleepSchedule>('Early Bird');
  const [cleanPref, setCleanPref] = useState<CleanlinessLevel>('Very Tidy');
  const [socialPref, setSocialPref] = useState<SocialStyle>('Warm & Occasional');

  const calibratedMatches = useMemo(() => {
    return DEMO_FLATMATES.slice(0, 3)
      .map((profile) => {
        let score = 70;
        if (profile.sleepSchedule === sleepPref) score += 12;
        else if (profile.sleepSchedule === 'Balanced' || sleepPref === 'Balanced') score += 6;

        if (profile.cleanliness === cleanPref) score += 10;
        else if (profile.cleanliness === 'Relaxed Neat') score += 4;

        if (profile.socialStyle === socialPref) score += 8;
        else if (profile.socialStyle === 'Warm & Occasional') score += 4;

        return { profile, dynamicScore: Math.min(99, score) };
      })
      .sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [sleepPref, cleanPref, socialPref]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 space-y-20">
      {/* Header */}
      <section className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-[#145C4B]">How VibeNest Works</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252B29] leading-tight text-balance">
          From lifestyle calibration to keys in hand
        </h1>
        <p className="text-base sm:text-lg text-[#5A6460] leading-relaxed">
          We designed VibeNest to remove guesswork from roommate hunting. Every step turns unspoken household assumptions into clear, comfortable alignment.
        </p>
      </section>

      {/* Four Detailed Stages */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAGES.map((stage, idx) => (
          <Reveal key={stage.num} delay={idx * 0.06}>
            <div className="h-full p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/8 space-y-5">
              <div className="space-y-2">
                <span className="font-display text-xl font-bold text-[#145C4B] tabular-nums">
                  {stage.num}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#252B29]">
                  {stage.title}
                </h2>
                <p className="text-sm font-medium text-[#5A6460]">{stage.summary}</p>
              </div>
              <ul className="space-y-2.5 pt-2 border-t border-[#252B29]/8">
                {stage.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5 text-sm text-[#252B29]/85">
                    <CheckCircle2
                      className="w-4 h-4 text-[#145C4B] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Interactive Lifestyle Calibration Sandbox */}
      <section className="rounded-3xl bg-[#F3EFE4] border border-[#252B29]/10 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-[#145C4B]">
              Interactive Questionnaire Preview
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29]">
              Test how your daily habits shift demo match scores
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer self-start lg:self-auto"
          >
            Save & Create Account
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#252B29]/8">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#5A6460]">Sleep Schedule</p>
            <div className="flex flex-wrap gap-1.5">
              {(['Early Bird', 'Balanced', 'Night Owl'] as SleepSchedule[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSleepPref(opt)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    sleepPref === opt
                      ? 'bg-[#145C4B] text-[#FAF8F2]'
                      : 'bg-[#FAF8F2] text-[#252B29] hover:bg-[#E6F2EB]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#5A6460]">Kitchen & Shared Cleanliness</p>
            <div className="flex flex-wrap gap-1.5">
              {(['Very Tidy', 'Relaxed Neat', 'Flexible'] as CleanlinessLevel[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCleanPref(opt)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    cleanPref === opt
                      ? 'bg-[#145C4B] text-[#FAF8F2]'
                      : 'bg-[#FAF8F2] text-[#252B29] hover:bg-[#E6F2EB]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#5A6460]">Home Social Energy</p>
            <div className="flex flex-wrap gap-1.5">
              {(['Quiet Sanctuary', 'Warm & Occasional', 'Social Host'] as SocialStyle[]).map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSocialPref(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      socialPref === opt
                        ? 'bg-[#145C4B] text-[#FAF8F2]'
                        : 'bg-[#FAF8F2] text-[#252B29] hover:bg-[#E6F2EB]'
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calibratedMatches.map(({ profile, dynamicScore }) => (
            <FlatmateCard
              key={profile.id}
              profile={profile}
              compatibilityOverride={dynamicScore}
              onSelect={onSelectProfile}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
};
