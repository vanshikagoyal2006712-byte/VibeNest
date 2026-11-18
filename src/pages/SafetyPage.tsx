import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Flag,
  Coffee,
  CheckSquare,
  Square,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AppRoute } from '../types';
import { Reveal } from '../components/MotionPrimitives';

interface SafetyPageProps {
  onNavigate: (route: AppRoute) => void;
}

const MEETUP_CHECKLIST = [
  'Meet in a well-lit public cafe near the target neighborhood during daytime.',
  'Keep initial messaging inside VibeNest until after your first in-person coffee.',
  'Share your meetup time and location with a trusted friend or family member.',
  'Confirm lease rules, sublet permission, and utility splits in writing before transferring deposits.',
];

export const SafetyPage: React.FC<SafetyPageProps> = ({ onNavigate }) => {
  const [checkedItems, setCheckedItems] = useState<number[]>([0]);
  const [reportCategory, setReportCategory] = useState('Suspicious profile or scam');
  const [reportEmail, setReportEmail] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportEmail.trim() || !reportEmail.includes('@')) {
      setReportError('Please enter a valid email address so our safety team can follow up.');
      return;
    }
    if (reportDetails.trim().length < 10) {
      setReportError('Please share a brief description (at least 10 characters).');
      return;
    }
    setReportError(null);
    setReportSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 space-y-20">
      {/* Header */}
      <section className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-[#145C4B]">Safety & Trust</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252B29] leading-tight text-balance">
          Built for peace of mind from your first intro to move-in day
        </h1>
        <p className="text-base sm:text-lg text-[#5A6460] leading-relaxed">
          Inviting someone to share your living space requires real safeguards. VibeNest protects your personal data, verifies member authenticity, and gives you immediate control over every interaction.
        </p>
      </section>

      {/* Four Safety Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal>
          <div className="h-full p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F2EB] text-[#145C4B] flex items-center justify-center">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#252B29]">
              Privacy by default
            </h2>
            <p className="text-sm text-[#5A6460] leading-relaxed">
              Your full last name, phone number, email address, and exact workplace never appear on public search cards. Only approximate neighborhood preferences and first name are shown until you choose to connect.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="h-full p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EFEBF9] text-[#145C4B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#252B29]">
              Member verification
            </h2>
            <p className="text-sm text-[#5A6460] leading-relaxed">
              Members verify identity through government ID checks and optional work or university email confirmation, deterring spam listings and duplicate accounts.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF0E8] text-[#145C4B] flex items-center justify-center">
              <Flag className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#252B29]">
              Instant blocking & reporting
            </h2>
            <p className="text-sm text-[#5A6460] leading-relaxed">
              One tap on any profile or chat thread immediately blocks the user, hides your profile from their search results, and flags the conversation for our Trust & Safety team.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="h-full p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F2EB] text-[#145C4B] flex items-center justify-center">
              <Coffee className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#252B29]">
              Safe first meetups
            </h2>
            <p className="text-sm text-[#5A6460] leading-relaxed">
              Before touring an apartment alone or signing documents, VibeNest prompts a daylight cafe meetup and a guided discussion covering lease verification and deposit protection.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Interactive Meetup Checklist + Report Preview Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 p-7 sm:p-8 rounded-3xl bg-[#E6F2EB] border border-[#145C4B]/12 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#145C4B]">Interactive Guide</p>
            <h2 className="font-display text-2xl font-bold text-[#252B29]">
              Safe First-Meetup Checklist
            </h2>
          </div>

          <div className="space-y-3">
            {MEETUP_CHECKLIST.map((item, idx) => {
              const checked = checkedItems.includes(idx);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleCheck(idx)}
                  aria-pressed={checked}
                  className="w-full text-left p-4 rounded-2xl bg-white/85 hover:bg-white border border-[#145C4B]/10 flex items-start gap-3 transition-colors cursor-pointer"
                >
                  {checked ? (
                    <CheckSquare
                      className="w-5 h-5 text-[#145C4B] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Square
                      className="w-5 h-5 text-[#5A6460] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-sm leading-relaxed ${
                      checked ? 'text-[#252B29] font-medium' : 'text-[#5A6460]'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-medium text-[#145C4B] tabular-nums">
            {checkedItems.length} of {MEETUP_CHECKLIST.length} safety steps reviewed
          </p>
        </div>

        <div className="lg:col-span-6 p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/10 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#145C4B]">Trust & Safety Desk</p>
            <h2 className="font-display text-2xl font-bold text-[#252B29]">
              Report a profile or safety concern
            </h2>
            <p className="text-sm text-[#5A6460]">
              Submit a report preview below—ready for backend moderation queue integration.
            </p>
          </div>

          {reportSubmitted ? (
            <div
              role="status"
              className="p-5 rounded-2xl bg-[#E6F2EB] text-[#145C4B] space-y-3"
            >
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Safety report preview logged</span>
              </div>
              <p className="text-sm text-[#145C4B]/90">
                Category: {reportCategory}. In production, this dispatches immediately to our 24/7 Trust & Safety queue and sends confirmation to {reportEmail}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setReportSubmitted(false);
                  setReportDetails('');
                }}
                className="text-xs font-semibold underline cursor-pointer"
              >
                Submit another preview
              </button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="safety-category"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Concern Type
                </label>
                <select
                  id="safety-category"
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5 cursor-pointer"
                >
                  <option>Suspicious profile or scam</option>
                  <option>Harassment or disrespectful behavior</option>
                  <option>Requesting off-platform wire transfer</option>
                  <option>Privacy concern</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="safety-email"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Your Email
                </label>
                <input
                  id="safety-email"
                  type="email"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label
                  htmlFor="safety-details"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Details
                </label>
                <textarea
                  id="safety-details"
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Share context so our team can review quickly..."
                  className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5"
                />
              </div>

              {reportError && (
                <p role="alert" className="text-xs font-medium text-[#9F2D20]">
                  {reportError}
                </p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 px-5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
              >
                Submit Safety Report
              </motion.button>
            </form>
          )}
        </div>
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onNavigate('/signup')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#145C4B] hover:text-[#0F493B] cursor-pointer"
        >
          Create a verified VibeNest profile
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
