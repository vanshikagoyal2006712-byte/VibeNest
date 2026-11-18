import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  MessageCircleHeart,
  Clock,
  CheckCircle2,
  EyeOff,
} from 'lucide-react';
import { AppRoute, FlatmateProfile, SearchFilters } from '../types';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCitiesForCountry,
} from '../data/locations';
import {
  DEMO_FLATMATES,
  FAQS,
  HERO_IMAGE,
  TESTIMONIALS,
} from '../data/mockData';
import { CitySearchSelect } from '../components/CitySearchSelect';
import { SafeImage } from '../components/SafeImage';
import { FloatingAccent, Reveal } from '../components/MotionPrimitives';
import { FlatmateCard } from '../components/FlatmateCard';

interface LandingPageProps {
  onNavigate: (route: AppRoute) => void;
  onSearchSubmit: (filters: SearchFilters) => void;
  onSelectProfile: (profile: FlatmateProfile) => void;
}

const HOW_IT_WORKS_STEPS = [
  {
    num: '01.',
    title: 'Share your daily rhythm',
    description:
      'Set your wake hours, work-from-home days, cooking habits, and guest boundaries in four calm minutes.',
  },
  {
    num: '02.',
    title: 'Calibrate non-negotiables',
    description:
      'Mark what truly matters to your peace of mind—from shared cleaning cadences to quiet weeknights.',
  },
  {
    num: '03.',
    title: 'Review lifestyle-first matches',
    description:
      'Browse verified flatmates ranked by everyday compatibility rather than guesswork or rushed DMs.',
  },
  {
    num: '04.',
    title: 'Connect safely & meet',
    description:
      'Chat inside VibeNest with your phone number hidden until you choose a coffee intro and lease plan.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSearchSubmit,
  onSelectProfile,
}) => {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [city, setCity] = useState('All Cities');
  const [maxBudget, setMaxBudget] = useState(2000);
  const [moveInMonth, setMoveInMonth] = useState('any');
  const [featuredCity, setFeaturedCity] = useState('All Cities');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      country,
      city,
      maxBudget,
      moveInMonth,
      sleepSchedule: 'Any',
    });
  };

  const featuredDemoPool = DEMO_FLATMATES.slice(0, 4);
  const featuredCities = [
    'All Cities',
    ...Array.from(new Set(featuredDemoPool.map((item) => item.city))),
  ];
  const featuredProfiles = featuredDemoPool.filter((item) =>
    featuredCity === 'All Cities' ? true : item.city === featuredCity
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20">
        {/* Subtle floating decorative accents */}
        <FloatingAccent
          duration={8}
          distance={12}
          className="absolute -top-12 right-[12%] w-64 h-64 rounded-full bg-[#B7D9C5]/35 blur-3xl -z-10"
        />
        <FloatingAccent
          duration={10}
          distance={14}
          className="absolute top-36 -left-16 w-56 h-56 rounded-full bg-[#B9A7E8]/25 blur-3xl -z-10"
        />
        <FloatingAccent
          duration={9}
          distance={9}
          className="hidden lg:block absolute bottom-10 right-[45%] w-40 h-40 rounded-full bg-[#FFBFA3]/25 blur-3xl -z-10"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm font-semibold text-[#145C4B]"
              >
                Find your people. Share your space.
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-tight leading-[1.1] text-[#252B29] text-balance"
              >
                Your Perfect Flatmate Is More Than Just a Match.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-[#5A6460] leading-relaxed max-w-xl"
              >
                VibeNest matches roommates by how you actually live—sleep rhythms, kitchen habits, work-from-home schedules, and social energy—so shared apartments feel like home from week one.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onNavigate('/signup')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Find My Flatmate
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onNavigate('/explore')}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3EFE4] text-[#252B29] border border-[#252B29]/15 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="h-full min-h-[300px] lg:min-h-[420px] rounded-3xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(20,92,75,0.22)] border border-[#252B29]/8 bg-[#E6F2EB]">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Two flatmates enjoying morning coffee together in a bright, plant-filled apartment living room"
                  fallbackTitle="Sunlit shared apartment living space"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Search Bar Strip below Hero Split */}
          <motion.form
            onSubmit={handleHeroSearch}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Search flatmates by country, city, budget, and move-in date"
            className="mt-10 bg-white rounded-2xl p-3 sm:p-4 border border-[#252B29]/10 shadow-[0_14px_40px_-16px_rgba(37,43,41,0.12)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
          >
            <div className="px-2 py-1.5">
              <label
                htmlFor="hero-country"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5A6460] mb-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                Country
              </label>
              <select
                id="hero-country"
                value={country}
                onChange={(e) => {
                  const nextCountry = e.target.value;
                  setCountry(nextCountry);
                  const validCities = getCitiesForCountry(nextCountry);
                  if (
                    city !== 'All Cities' &&
                    !validCities.some(
                      (item) => item.toLowerCase() === city.toLowerCase()
                    )
                  ) {
                    setCity('All Cities');
                  }
                }}
                className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer"
              >
                {COUNTRIES.map((countryName) => (
                  <option key={countryName} value={countryName}>
                    {countryName}
                  </option>
                ))}
                <option value="All Countries">All Countries</option>
              </select>
            </div>

            <div className="px-2 py-1.5">
              <label
                htmlFor="hero-city"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5A6460] mb-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                City
              </label>
              <CitySearchSelect
                id="hero-city"
                value={city}
                onChange={setCity}
                cities={getCitiesForCountry(country)}
                placeholder="All Cities"
                allowAllCities={true}
              />
            </div>

            <div className="px-3 py-1.5">
              <label
                htmlFor="hero-budget"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5A6460] mb-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                Max Monthly Budget
              </label>
              <select
                id="hero-budget"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer tabular-nums"
              >
                <option value={1200}>Up to $1,200 / mo</option>
                <option value={1500}>Up to $1,500 / mo</option>
                <option value={1800}>Up to $1,800 / mo</option>
                <option value={2500}>Up to $2,500 / mo</option>
              </select>
            </div>

            <div className="px-3 py-1.5">
              <label
                htmlFor="hero-movein"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5A6460] mb-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#145C4B]" aria-hidden="true" />
                Move-In Date
              </label>
              <select
                id="hero-movein"
                value={moveInMonth}
                onChange={(e) => setMoveInMonth(e.target.value)}
                className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3 py-2.5 cursor-pointer"
              >
                <option value="any">Flexible move-in</option>
                <option value="2026-12">December 2026</option>
                <option value="2027-01">January 2027</option>
              </select>
            </div>

            <div className="px-2 py-1.5">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Search Flatmates
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 border-t border-[#252B29]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-xl space-y-2">
                <p className="text-sm font-semibold text-[#145C4B]">How It Works</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29] text-balance">
                  Four intentional steps from lifestyle quiz to signed lease
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/how-it-works')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145C4B] hover:text-[#0F493B] transition-colors cursor-pointer self-start md:self-auto"
              >
                Try the calibration preview
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <Reveal key={step.num} delay={idx * 0.06}>
                <div className="h-full p-6 rounded-2xl bg-white border border-[#252B29]/8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="font-display text-lg font-bold text-[#145C4B] tabular-nums">
                      {step.num}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#252B29]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#5A6460] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose VibeNest (Asymmetric Bento Grid) */}
      <section className="py-16 lg:py-24 bg-[#F3EFE4]/70 border-y border-[#252B29]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="max-w-2xl space-y-2 mb-12">
              <p className="text-sm font-semibold text-[#145C4B]">Why Choose VibeNest</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29] text-balance">
                Built around the small daily habits that make or break shared living
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal className="md:col-span-2">
              <div className="h-full p-7 sm:p-8 rounded-3xl bg-[#E6F2EB] border border-[#145C4B]/12 flex flex-col justify-between gap-6">
                <div className="w-11 h-11 rounded-2xl bg-[#145C4B] text-[#FAF8F2] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-2 max-w-xl">
                  <h3 className="font-display text-xl font-bold text-[#252B29]">
                    Habit compatibility over generic bios
                  </h3>
                  <p className="text-sm sm:text-base text-[#252B29]/80 leading-relaxed">
                    Instead of scrolling vague "clean and chill" ads, compare real baselines—dishwashing turnaround, overnight guest comfort, noise thresholds, and shared grocery preferences—before your first message.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="h-full p-7 rounded-3xl bg-[#EFEBF9] border border-[#B9A7E8]/35 flex flex-col justify-between gap-6">
                <div className="w-11 h-11 rounded-2xl bg-[#252B29] text-[#FAF8F2] flex items-center justify-center">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-[#252B29]">
                    Synced work & sleep clocks
                  </h3>
                  <p className="text-sm text-[#252B29]/80 leading-relaxed">
                    Early risers, remote engineers, and shift workers see schedule overlap clearly so nobody wakes up to surprises.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full p-7 rounded-3xl bg-[#FFF0E8] border border-[#FFBFA3]/45 flex flex-col justify-between gap-6">
                <div className="w-11 h-11 rounded-2xl bg-[#145C4B] text-[#FAF8F2] flex items-center justify-center">
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-[#252B29]">
                    Private until you say so
                  </h3>
                  <p className="text-sm text-[#252B29]/80 leading-relaxed">
                    Keep your phone number, workplace, and social handles off public boards. Reveal details only after mutual trust.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14} className="md:col-span-2">
              <div className="h-full p-7 sm:p-8 rounded-3xl bg-white border border-[#252B29]/8 flex flex-col justify-between gap-6">
                <div className="w-11 h-11 rounded-2xl bg-[#E6F2EB] text-[#145C4B] flex items-center justify-center">
                  <MessageCircleHeart className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-2 max-w-lg">
                    <h3 className="font-display text-xl font-bold text-[#252B29]">
                      Guided first conversations without awkwardness
                    </h3>
                    <p className="text-sm sm:text-base text-[#5A6460] leading-relaxed">
                      Every match includes shared house-talk prompts on rent splitting, utility setups, and lease timelines so expectations stay transparent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('/about')}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145C4B] hover:text-[#0F493B] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Read our story
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Flatmates (Demo Content) */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#145C4B]">
                  Demo profiles · Sample lifestyle matches
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29] text-balance">
                  Preview how compatible flatmates appear on VibeNest
                </h2>
              </div>

              {/* Interactive City Filter Tabs */}
              <div
                role="tablist"
                aria-label="Filter featured demo flatmates by city"
                className="flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE4] rounded-xl self-start md:self-auto"
              >
                {featuredCities.map((c) => {
                  const active = featuredCity === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFeaturedCity(c)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-white text-[#145C4B] shadow-xs'
                          : 'text-[#5A6460] hover:text-[#252B29]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {featuredProfiles.map((profile) => (
                <FlatmateCard
                  key={profile.id}
                  profile={profile}
                  onSelect={onSelectProfile}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-10 flex justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('/explore')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F3EFE4] text-[#252B29] border border-[#252B29]/15 text-sm font-semibold transition-colors cursor-pointer"
            >
              Browse all demo profiles
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-[#F3EFE4]/70 border-y border-[#252B29]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="max-w-xl space-y-2 mb-12">
              <p className="text-sm font-semibold text-[#145C4B]">Member Stories</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29] text-balance">
                Calm households built on honest alignment
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.07}>
                <figure className="h-full p-7 rounded-2xl bg-white border border-[#252B29]/8 flex flex-col justify-between gap-6">
                  <blockquote className="text-sm sm:text-base text-[#252B29] leading-relaxed">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="pt-4 border-t border-[#252B29]/8 space-y-1">
                    <p className="text-sm font-bold text-[#252B29]">{item.name}</p>
                    <p className="text-xs text-[#5A6460]">{item.role}</p>
                    <p className="text-xs font-semibold text-[#145C4B] pt-1">
                      {item.outcome}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Spotlight Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl bg-[#145C4B] text-[#FAF8F2] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <p className="text-sm font-semibold text-[#B7D9C5]">
                  Safety & Privacy First
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-balance">
                  You decide who sees your profile, and when you ever meet
                </h2>
                <p className="text-base text-[#FAF8F2]/85 leading-relaxed max-w-xl">
                  Finding someone to share a home with requires trust. VibeNest combines verified member checks, masked messaging, instant blocking, and safe public meetup guides on every match.
                </p>
                <div className="pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/safety')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF8F2] hover:bg-[#B7D9C5] text-[#145C4B] text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Explore Safety Standards
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                {[
                  {
                    title: 'ID & profile verification',
                    desc: 'Confirm identity before initiating housing conversations.',
                  },
                  {
                    title: 'Private contact masking',
                    desc: 'Phone numbers and social accounts never appear publicly.',
                  },
                  {
                    title: 'One-tap block & report',
                    desc: 'Pause any conversation instantly and notify Trust & Safety.',
                  },
                ].map((point) => (
                  <div
                    key={point.title}
                    className="p-4 rounded-2xl bg-white/10 border border-white/12 flex items-start gap-3.5"
                  >
                    <CheckCircle2
                      className="w-5 h-5 text-[#B7D9C5] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#FAF8F2]">{point.title}</h3>
                      <p className="text-xs text-[#FAF8F2]/80 mt-0.5 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center space-y-2 mb-10">
              <p className="text-sm font-semibold text-[#145C4B]">Questions & Answers</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29]">
                Everything you might wonder before starting
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#252B29]/10 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F2]/60 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-[#252B29]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#145C4B] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-[#5A6460] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Closing Conversion Callout */}
          <Reveal delay={0.08}>
            <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#E6F2EB] border border-[#145C4B]/12 text-center space-y-5">
              <ShieldCheck className="w-7 h-7 text-[#145C4B] mx-auto" aria-hidden="true" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29] text-balance">
                Ready to share a space with someone on your wavelength?
              </h2>
              <p className="text-sm sm:text-base text-[#5A6460] max-w-lg mx-auto">
                Build your lifestyle profile in minutes and preview compatible flatmates in your city.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/signup')}
                  className="px-6 py-3.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Find My Flatmate
                </motion.button>
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/12 text-sm font-semibold transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
