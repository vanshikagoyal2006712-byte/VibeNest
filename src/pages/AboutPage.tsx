import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, HeartHandshake, Home } from 'lucide-react';
import { AppRoute } from '../types';
import { ABOUT_INTERIOR_IMAGE } from '../data/mockData';
import { SafeImage } from '../components/SafeImage';
import { Reveal } from '../components/MotionPrimitives';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 space-y-20">
      {/* Intro Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <p className="text-sm font-semibold text-[#145C4B]">About VibeNest</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252B29] leading-tight text-balance">
            Great apartments fall apart when daily rhythms clash
          </h1>
          <p className="text-base sm:text-lg text-[#5A6460] leading-relaxed">
            Most people spend weeks comparing floor plans and commute times, then pick a flatmate after a ten-minute apartment tour. VibeNest flips that order—matching compatible humans first.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-[#252B29]/8 shadow-[0_20px_50px_-20px_rgba(20,92,75,0.18)] bg-[#E6F2EB]">
            <SafeImage
              src={ABOUT_INTERIOR_IMAGE}
              alt="Sunlit shared kitchen and oak dining table in a calm apartment"
              fallbackTitle="Shared modern apartment dining space"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* The Problem vs VibeNest Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Reveal>
          <div className="h-full p-8 rounded-3xl bg-[#FFF0E8] border border-[#FFBFA3]/45 space-y-4">
            <p className="text-xs font-semibold text-[#252B29]/70">The Problem</p>
            <h2 className="font-display text-2xl font-bold text-[#252B29]">
              Why random flatmate boards create household burnout
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-[#252B29]/85 leading-relaxed">
              <li>· Unspoken differences in dishwashing, clutter, and shared-space standards turn into quiet resentment.</li>
              <li>· Clashing sleep schedules and remote-work calls collide in thin-walled city apartments.</li>
              <li>· Public classifieds expose personal phone numbers and attract rushed, unverified inquiries.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="h-full p-8 rounded-3xl bg-[#E6F2EB] border border-[#145C4B]/15 space-y-4">
            <p className="text-xs font-semibold text-[#145C4B]">How VibeNest Solves It</p>
            <h2 className="font-display text-2xl font-bold text-[#252B29]">
              Structured lifestyle alignment before you ever sign a lease
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-[#252B29]/85 leading-relaxed">
              <li>· Explicit habit baselines translate "tidy" and "quiet" into concrete everyday expectations.</li>
              <li>· Compatibility scoring surfaces people whose work and rest clocks naturally complement yours.</li>
              <li>· Privacy-first messaging lets you verify fit calmly before sharing personal contact details.</li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Core Principles */}
      <section className="space-y-10">
        <Reveal>
          <div className="max-w-xl space-y-2">
            <p className="text-sm font-semibold text-[#145C4B]">Our Philosophy</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29]">
              Find your people. Share your space.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Compass,
              title: 'Clarity over guesswork',
              desc: 'We surface practical living details—cleaning habits, guest frequency, temperature preferences—upfront so there are zero awkward week-two surprises.',
            },
            {
              icon: HeartHandshake,
              title: 'Respectful boundaries',
              desc: 'Whether you want a close-knit dinner-party flat or a quiet sanctuary after long shifts, both styles deserve honest matching.',
            },
            {
              icon: Home,
              title: 'Safety without friction',
              desc: 'Identity checks, masked conversations, and instant reporting tools protect your peace of mind from your very first search.',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={idx * 0.06}>
                <div className="h-full p-7 rounded-2xl bg-white border border-[#252B29]/8 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFEBF9] text-[#145C4B] flex items-center justify-center">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#252B29]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#5A6460] leading-relaxed">{pillar.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <Reveal>
        <div className="p-8 sm:p-12 rounded-3xl bg-[#145C4B] text-[#FAF8F2] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              See how lifestyle matching works in practice
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F2]/85">
              Test our interactive lifestyle calibration or browse sample profiles in your city.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('/how-it-works')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FAF8F2] hover:bg-[#B7D9C5] text-[#145C4B] text-sm font-semibold transition-colors cursor-pointer"
            >
              How It Works
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="px-5 py-3 rounded-xl border border-white/25 hover:bg-white/10 text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
