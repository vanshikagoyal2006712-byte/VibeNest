import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ref, update } from 'firebase/database';
import type { User } from 'firebase/auth';
import { db } from '../firebase';
import { AppRoute, UserProfile } from '../types';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCitiesForCountry,
} from '../data/locations';
import { CitySearchSelect } from '../components/CitySearchSelect';
import { FloatingAccent } from '../components/MotionPrimitives';

interface LifestyleProfilePageProps {
  currentUser: User;
  userProfile: UserProfile | null;
  onProfileSaved: (updated: UserProfile) => void;
  onNavigate: (route: AppRoute) => void;
}

const FOOD_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Eggetarian',
  'Non-Vegetarian',
  'No Preference',
];

const SLEEP_OPTIONS = ['Early Bird (Before 11 PM)', 'Balanced (11 PM - 12:30 AM)', 'Night Owl (After 12:30 AM)'];

const CLEANLINESS_OPTIONS = ['Very Tidy', 'Relaxed Neat', 'Flexible'];

const SMOKING_OPTIONS = ['Non-Smoker', 'Outside Only', 'Smoker-Friendly'];

const DRINKING_OPTIONS = ['Never', 'Socially', 'Occasionally', 'Regularly'];

const HOBBY_OPTIONS = [
  'Cooking & Baking',
  'Fitness & Running',
  'Reading',
  'Indoor Plants',
  'Coffee & Cafes',
  'Movies & Music',
  'Travel',
  'Art & Design',
  'Board Games',
  'Cycling',
  'Yoga & Wellness',
  'Photography',
];

export const LifestyleProfilePage: React.FC<LifestyleProfilePageProps> = ({
  currentUser,
  userProfile,
  onProfileSaved,
  onNavigate,
}) => {
  const [age, setAge] = useState(userProfile?.age ? String(userProfile.age) : '');
  const [country, setCountry] = useState(userProfile?.country || DEFAULT_COUNTRY);
  const [city, setCity] = useState(userProfile?.city ?? '');
  const [occupation, setOccupation] = useState(userProfile?.occupation ?? '');
  const [monthlyRentBudget, setMonthlyRentBudget] = useState(
    userProfile?.monthlyRentBudget ? String(userProfile.monthlyRentBudget) : ''
  );
  const [foodPreference, setFoodPreference] = useState(
    userProfile?.foodPreference ?? ''
  );
  const [sleepSchedule, setSleepSchedule] = useState(
    userProfile?.sleepSchedule ?? ''
  );
  const [cleanlinessPreference, setCleanlinessPreference] = useState(
    userProfile?.cleanlinessPreference ?? ''
  );
  const [smokingPreference, setSmokingPreference] = useState(
    userProfile?.smokingPreference ?? ''
  );
  const [drinkingPreference, setDrinkingPreference] = useState(
    userProfile?.drinkingPreference ?? ''
  );
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    userProfile?.hobbies ?? []
  );
  const [customHobby, setCustomHobby] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userProfile) return;
    if (userProfile.age && !age) setAge(String(userProfile.age));
    if (userProfile.country) setCountry(userProfile.country);
    if (userProfile.city && !city) setCity(userProfile.city);
    if (userProfile.occupation && !occupation) setOccupation(userProfile.occupation);
    if (userProfile.monthlyRentBudget && !monthlyRentBudget) {
      setMonthlyRentBudget(String(userProfile.monthlyRentBudget));
    }
    if (userProfile.foodPreference && !foodPreference) {
      setFoodPreference(userProfile.foodPreference);
    }
    if (userProfile.sleepSchedule && !sleepSchedule) {
      setSleepSchedule(userProfile.sleepSchedule);
    }
    if (userProfile.cleanlinessPreference && !cleanlinessPreference) {
      setCleanlinessPreference(userProfile.cleanlinessPreference);
    }
    if (userProfile.smokingPreference && !smokingPreference) {
      setSmokingPreference(userProfile.smokingPreference);
    }
    if (userProfile.drinkingPreference && !drinkingPreference) {
      setDrinkingPreference(userProfile.drinkingPreference);
    }
    if (userProfile.hobbies && userProfile.hobbies.length > 0 && selectedHobbies.length === 0) {
      setSelectedHobbies(userProfile.hobbies);
    }
  }, [userProfile]);

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((item) => item !== hobby) : [...prev, hobby]
    );
    if (errors.hobbies) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.hobbies;
        return next;
      });
    }
  };

  const handleAddCustomHobby = () => {
    const trimmed = customHobby.trim();
    if (!trimmed) return;
    if (!selectedHobbies.includes(trimmed)) {
      setSelectedHobbies((prev) => [...prev, trimmed]);
    }
    setCustomHobby('');
    if (errors.hobbies) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.hobbies;
        return next;
      });
    }
  };

  const completedCount = [
    Number(age) >= 18 && Number(age) <= 99,
    country.trim().length >= 2 && city.trim().length >= 2,
    occupation.trim().length >= 2,
    Number(monthlyRentBudget) > 0,
    Boolean(foodPreference),
    Boolean(sleepSchedule),
    Boolean(cleanlinessPreference),
    Boolean(smokingPreference),
    Boolean(drinkingPreference),
    selectedHobbies.length > 0,
  ].filter(Boolean).length;

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const parsedAge = Number(age);
    const parsedBudget = Number(monthlyRentBudget);

    if (!age.trim() || Number.isNaN(parsedAge) || parsedAge < 18 || parsedAge > 99) {
      nextErrors.age = 'Please enter a valid age between 18 and 99.';
    }
    if (!country.trim()) {
      nextErrors.country = 'Please select your country.';
    }
    if (city.trim().length < 2) {
      nextErrors.city = 'Please search and select your city.';
    }
    if (occupation.trim().length < 2) {
      nextErrors.occupation = 'Please enter your occupation or field of study.';
    }
    if (!monthlyRentBudget.trim() || Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      nextErrors.monthlyRentBudget = 'Please enter a valid monthly rent budget.';
    }
    if (!foodPreference) {
      nextErrors.foodPreference = 'Please select your food preference.';
    }
    if (!sleepSchedule) {
      nextErrors.sleepSchedule = 'Please select your sleep schedule.';
    }
    if (!cleanlinessPreference) {
      nextErrors.cleanlinessPreference = 'Please select your cleanliness preference.';
    }
    if (!smokingPreference) {
      nextErrors.smokingPreference = 'Please select your smoking preference.';
    }
    if (!drinkingPreference) {
      nextErrors.drinkingPreference = 'Please select your drinking preference.';
    }
    if (selectedHobbies.length === 0) {
      nextErrors.hobbies = 'Please select or add at least one hobby or interest.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      setSubmitError('Please complete all required lifestyle fields before continuing.');
      return;
    }

    setIsSaving(true);
    try {
      const lifestyleFields = {
        age: Number(age),
        country: country.trim() || DEFAULT_COUNTRY,
        city: city.trim(),
        occupation: occupation.trim(),
        monthlyRentBudget: Number(monthlyRentBudget),
        foodPreference,
        sleepSchedule,
        cleanlinessPreference,
        smokingPreference,
        drinkingPreference,
        hobbies: selectedHobbies,
        profileCompleted: true,
        updatedAt: Date.now(),
      };

      await update(ref(db, `profiles/${currentUser.uid}`), lifestyleFields);

      const mergedProfile: UserProfile = {
        uid: userProfile?.uid || currentUser.uid,
        name: userProfile?.name || currentUser.displayName || '',
        email: userProfile?.email || currentUser.email || '',
        createdAt: userProfile?.createdAt || Date.now(),
        ...lifestyleFields,
      };

      onProfileSaved(mergedProfile);
      onNavigate('/dashboard');
    } catch (err) {
      const msg =
        err instanceof Error && err.message.includes('PERMISSION_DENIED')
          ? 'Could not save your lifestyle profile because database permissions denied the update.'
          : 'Could not save your lifestyle profile right now. Please check your connection and try again.';
      setSubmitError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName =
    userProfile?.name || currentUser.displayName || currentUser.email || 'there';

  return (
    <div className="relative overflow-hidden py-10 lg:py-16 px-4 sm:px-6">
      <FloatingAccent
        duration={9}
        distance={10}
        className="absolute top-12 right-[10%] w-64 h-64 rounded-full bg-[#B7D9C5]/35 blur-3xl -z-10"
      />
      <FloatingAccent
        duration={11}
        distance={12}
        className="absolute bottom-20 left-[8%] w-64 h-64 rounded-full bg-[#B9A7E8]/25 blur-3xl -z-10"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Progress */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#252B29]/10 shadow-[0_14px_40px_-20px_rgba(37,43,41,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-sm font-semibold text-[#145C4B] inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {userProfile?.profileCompleted
                ? 'Update Lifestyle Profile'
                : 'Required Onboarding'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B29] text-balance">
              {userProfile?.profileCompleted
                ? `Refine your living preferences, ${displayName}`
                : `Tell us how you live, ${displayName}`}
            </h1>
            <p className="text-sm text-[#5A6460] leading-relaxed">
              Complete your lifestyle profile to unlock your VibeNest dashboard. Your email and account details stay private.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-[#FAF8F2] border border-[#252B29]/8 min-w-[190px] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#252B29]">
              <span>Completion</span>
              <span className="tabular-nums text-[#145C4B]">{completedCount} / 10</span>
            </div>
            <div className="h-2 rounded-full bg-[#E6F2EB] overflow-hidden">
              <div
                className="h-full bg-[#145C4B] rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Multi-Section Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Section 01: Basics & Budget */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#252B29]/10 shadow-[0_12px_32px_-20px_rgba(37,43,41,0.1)] space-y-6">
            <div className="space-y-1">
              <span className="font-display text-sm font-bold text-[#145C4B] tabular-nums">
                01.
              </span>
              <h2 className="font-display text-xl font-bold text-[#252B29]">
                Basics & Housing Budget
              </h2>
              <p className="text-sm text-[#5A6460]">
                Core details used to align location, lifestyle stage, and monthly rent range.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="lp-age"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Age *
                </label>
                <input
                  id="lp-age"
                  type="number"
                  min={18}
                  max={99}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="26"
                  className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5 tabular-nums"
                />
                {errors.age && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lp-country"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Country *
                </label>
                <select
                  id="lp-country"
                  value={country}
                  onChange={(e) => {
                    const nextCountry = e.target.value;
                    setCountry(nextCountry);
                    const validCities = getCitiesForCountry(
                      nextCountry === 'Other' ? undefined : nextCountry
                    );
                    if (
                      city &&
                      nextCountry !== 'Other' &&
                      !validCities.some(
                        (item) => item.toLowerCase() === city.trim().toLowerCase()
                      )
                    ) {
                      setCity('');
                    }
                  }}
                  className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5 cursor-pointer"
                >
                  {COUNTRIES.map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {errors.country && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1">
                    {errors.country}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lp-city"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  City *
                </label>
                <CitySearchSelect
                  id="lp-city"
                  value={city}
                  onChange={(selectedCity) => {
                    setCity(selectedCity);
                    if (errors.city) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.city;
                        return next;
                      });
                    }
                  }}
                  cities={getCitiesForCountry(
                    country === 'Other' ? undefined : country,
                    userProfile?.city ? [userProfile.city] : []
                  )}
                  placeholder="Search or select city (e.g. Delhi, Bengaluru, Noida)"
                  allowCustom={true}
                />
                {errors.city && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lp-occupation"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Occupation *
                </label>
                <input
                  id="lp-occupation"
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Product Designer, Graduate Student"
                  className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5"
                />
                {errors.occupation && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1">
                    {errors.occupation}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lp-budget"
                  className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                >
                  Monthly Rent Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#5A6460]">
                    $
                  </span>
                  <input
                    id="lp-budget"
                    type="number"
                    min={100}
                    step={50}
                    value={monthlyRentBudget}
                    onChange={(e) => setMonthlyRentBudget(e.target.value)}
                    placeholder="1400"
                    className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl pl-8 pr-3.5 py-2.5 tabular-nums"
                  />
                </div>
                {errors.monthlyRentBudget && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1">
                    {errors.monthlyRentBudget}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 02: Daily Living Habits */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#252B29]/10 shadow-[0_12px_32px_-20px_rgba(37,43,41,0.1)] space-y-6">
            <div className="space-y-1">
              <span className="font-display text-sm font-bold text-[#145C4B] tabular-nums">
                02.
              </span>
              <h2 className="font-display text-xl font-bold text-[#252B29]">
                Daily Living Habits
              </h2>
              <p className="text-sm text-[#5A6460]">
                Honest everyday baselines help prevent household friction.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#5A6460] mb-2">
                  Food Preference *
                </p>
                <div className="flex flex-wrap gap-2">
                  {FOOD_OPTIONS.map((option) => {
                    const selected = foodPreference === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFoodPreference(option)}
                        aria-pressed={selected}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#145C4B] text-[#FAF8F2]'
                            : 'bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/10 hover:bg-[#E6F2EB]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.foodPreference && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1.5">
                    {errors.foodPreference}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#5A6460] mb-2">
                  Sleep Schedule *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SLEEP_OPTIONS.map((option) => {
                    const selected = sleepSchedule === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSleepSchedule(option)}
                        aria-pressed={selected}
                        className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#145C4B] text-[#FAF8F2]'
                            : 'bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/10 hover:bg-[#E6F2EB]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.sleepSchedule && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1.5">
                    {errors.sleepSchedule}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#5A6460] mb-2">
                  Cleanliness Preference *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CLEANLINESS_OPTIONS.map((option) => {
                    const selected = cleanlinessPreference === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setCleanlinessPreference(option)}
                        aria-pressed={selected}
                        className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#145C4B] text-[#FAF8F2]'
                            : 'bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/10 hover:bg-[#E6F2EB]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.cleanlinessPreference && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1.5">
                    {errors.cleanlinessPreference}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 03: Lifestyle & Interests */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#252B29]/10 shadow-[0_12px_32px_-20px_rgba(37,43,41,0.1)] space-y-6">
            <div className="space-y-1">
              <span className="font-display text-sm font-bold text-[#145C4B] tabular-nums">
                03.
              </span>
              <h2 className="font-display text-xl font-bold text-[#252B29]">
                Lifestyle & Interests
              </h2>
              <p className="text-sm text-[#5A6460]">
                Set boundaries and share what you enjoy doing in your free time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-[#5A6460] mb-2">
                  Smoking Preference *
                </p>
                <div className="flex flex-wrap gap-2">
                  {SMOKING_OPTIONS.map((option) => {
                    const selected = smokingPreference === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSmokingPreference(option)}
                        aria-pressed={selected}
                        className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#145C4B] text-[#FAF8F2]'
                            : 'bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/10 hover:bg-[#E6F2EB]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.smokingPreference && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1.5">
                    {errors.smokingPreference}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#5A6460] mb-2">
                  Drinking Preference *
                </p>
                <div className="flex flex-wrap gap-2">
                  {DRINKING_OPTIONS.map((option) => {
                    const selected = drinkingPreference === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDrinkingPreference(option)}
                        aria-pressed={selected}
                        className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#145C4B] text-[#FAF8F2]'
                            : 'bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/10 hover:bg-[#E6F2EB]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.drinkingPreference && (
                  <p className="text-xs font-medium text-[#9F2D20] mt-1.5">
                    {errors.drinkingPreference}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#252B29]/8">
              <p className="text-xs font-semibold text-[#5A6460]">
                Hobbies & Interests * (select at least one)
              </p>
              <div className="flex flex-wrap gap-2">
                {HOBBY_OPTIONS.map((hobby) => {
                  const selected = selectedHobbies.includes(hobby);
                  return (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#E6F2EB] text-[#145C4B] border border-[#145C4B]/30'
                          : 'bg-[#FAF8F2] text-[#252B29] border border-[#252B29]/10 hover:bg-[#F3EFE4]'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                      {hobby}
                    </button>
                  );
                })}
                {selectedHobbies
                  .filter((h) => !HOBBY_OPTIONS.includes(h))
                  .map((custom) => (
                    <button
                      key={custom}
                      type="button"
                      onClick={() => toggleHobby(custom)}
                      aria-pressed={true}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#E6F2EB] text-[#145C4B] border border-[#145C4B]/30 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      {custom}
                    </button>
                  ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1 max-w-md">
                <input
                  type="text"
                  value={customHobby}
                  onChange={(e) => setCustomHobby(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomHobby();
                    }
                  }}
                  placeholder="Add another hobby (e.g. Pottery)"
                  className="flex-1 text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2"
                />
                <button
                  type="button"
                  onClick={handleAddCustomHobby}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F2] hover:bg-[#E6F2EB] border border-[#252B29]/12 text-xs font-semibold text-[#145C4B] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Interest
                </button>
              </div>

              {errors.hobbies && (
                <p className="text-xs font-medium text-[#9F2D20]">{errors.hobbies}</p>
              )}
            </div>
          </section>

          {submitError && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-[#FFF0E8] border border-[#FFBFA3] text-sm font-medium text-[#9F2D20]"
            >
              {submitError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {userProfile?.profileCompleted ? (
              <button
                type="button"
                onClick={() => onNavigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F3EFE4] border border-[#252B29]/12 text-sm font-semibold text-[#252B29] transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            ) : (
              <p className="text-xs text-[#5A6460]">
                Completing this step unlocks your VibeNest member dashboard.
              </p>
            )}

            <motion.button
              type="submit"
              disabled={isSaving}
              whileHover={{ scale: isSaving ? 1 : 1.01 }}
              whileTap={{ scale: isSaving ? 1 : 0.99 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              {isSaving
                ? 'Saving Lifestyle Profile...'
                : userProfile?.profileCompleted
                ? 'Save Profile Updates'
                : 'Complete Lifestyle Profile'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
