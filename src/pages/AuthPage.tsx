import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight, LogOut } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { AppRoute, UserProfile } from '../types';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCitiesForCountry,
} from '../data/locations';
import { CitySearchSelect } from '../components/CitySearchSelect';
import { FloatingAccent } from '../components/MotionPrimitives';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  currentUser: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  onProfileCreated: (profile: UserProfile) => void;
  onSignOut: () => Promise<void>;
  onNavigate: (route: AppRoute) => void;
}

function getFriendlyAuthError(err: unknown, mode: 'login' | 'signup'): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code)
      : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Please choose a stronger password (at least 6 characters).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please double-check and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error while connecting to VibeNest. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled yet in Firebase Authentication.';
    case 'PERMISSION_DENIED':
      return mode === 'signup'
        ? 'Your account was created, but saving your profile to the database was denied by database rules.'
        : 'Permission denied while accessing your profile.';
    default:
      if (err instanceof Error && err.message.includes('PERMISSION_DENIED')) {
        return 'Your account was created, but saving your profile to Realtime Database was denied by security rules.';
      }
      return mode === 'signup'
        ? 'Could not create your account right now. Please try again.'
        : 'Could not sign you in right now. Please try again.';
  }
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode,
  currentUser,
  userProfile,
  authLoading,
  onProfileCreated,
  onSignOut,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [city, setCity] = useState('Delhi');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setInfoMessage(null);
  }, [initialMode]);

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setError(null);
    setInfoMessage(null);
    onNavigate(next === 'login' ? '/login' : '/signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (mode === 'signup' && trimmedName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (mode === 'signup' && !agreeTerms) {
      setError('Please agree to the community safety guidelines to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );
        await updateProfile(credential.user, { displayName: trimmedName });

        const profileData: UserProfile = {
          uid: credential.user.uid,
          name: trimmedName,
          email: credential.user.email ?? trimmedEmail,
          country: country.trim() || DEFAULT_COUNTRY,
          city: city.trim() || undefined,
          createdAt: Date.now(),
          profileCompleted: false,
        };

        await set(ref(db, `profiles/${credential.user.uid}`), profileData);
        onProfileCreated(profileData);
        setPassword('');
        onNavigate('/lifestyle-profile');
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
        setPassword('');
      }
    } catch (err) {
      setError(getFriendlyAuthError(err, mode));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutClick = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await onSignOut();
    } catch {
      setError('Could not sign out right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeName =
    userProfile?.name || currentUser?.displayName || currentUser?.email || 'Member';

  return (
    <div className="relative overflow-hidden py-12 lg:py-20 px-4 sm:px-6">
      <FloatingAccent
        duration={9}
        distance={10}
        className="absolute top-10 right-[15%] w-60 h-60 rounded-full bg-[#B7D9C5]/35 blur-3xl -z-10"
      />
      <FloatingAccent
        duration={11}
        distance={12}
        className="absolute bottom-10 left-[12%] w-60 h-60 rounded-full bg-[#B9A7E8]/25 blur-3xl -z-10"
      />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Editorial Context */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-sm font-semibold text-[#145C4B]">
            Find your people. Share your space.
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#252B29] leading-tight text-balance">
            {currentUser
              ? `Welcome to VibeNest, ${activeName}`
              : mode === 'signup'
              ? 'Start your lifestyle match profile'
              : 'Welcome back to your VibeNest'}
          </h1>
          <p className="text-sm sm:text-base text-[#5A6460] leading-relaxed">
            {currentUser
              ? 'Your VibeNest account session is active. Explore demo flatmates or manage your session below.'
              : mode === 'signup'
              ? 'Create your account to calibrate daily routines, browse verified flatmates, and keep your contact details private until you decide to connect.'
              : 'Sign in to review your lifestyle matches, continue conversations, and update your move-in timeline.'}
          </p>

          <div className="p-5 rounded-2xl bg-[#E6F2EB] border border-[#145C4B]/12 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#145C4B]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Privacy & Safety Guarantee</span>
            </div>
            <p className="text-xs text-[#252B29]/80 leading-relaxed">
              Your email and phone number are never shown on public match cards. Authentication is secured with Firebase Auth and your profile is saved privately.
            </p>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#252B29]/10 shadow-[0_20px_50px_-24px_rgba(37,43,41,0.16)] space-y-6">
            {!currentUser && (
              <div
                role="tablist"
                aria-label="Authentication mode"
                className="grid grid-cols-2 p-1 bg-[#FAF8F2] rounded-xl border border-[#252B29]/8"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => switchMode('login')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#145C4B] shadow-xs'
                      : 'text-[#5A6460] hover:text-[#252B29]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signup'}
                  onClick={() => switchMode('signup')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-[#145C4B] shadow-xs'
                      : 'text-[#5A6460] hover:text-[#252B29]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {authLoading ? (
              <div className="p-6 rounded-2xl bg-[#FAF8F2] text-sm text-[#5A6460]">
                Checking your session...
              </div>
            ) : currentUser ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="p-6 rounded-2xl bg-[#E6F2EB] text-[#145C4B] space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-bold text-base">Signed in as {activeName}</p>
                    <p className="text-sm text-[#145C4B]/90 leading-relaxed">
                      {currentUser.email} · Session active
                    </p>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-[#9F2D20]">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('/explore')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#145C4B] text-[#FAF8F2] text-xs font-semibold cursor-pointer"
                  >
                    Explore Demo Flatmates
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleLogoutClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#145C4B] text-xs font-semibold cursor-pointer disabled:opacity-60"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    {isSubmitting ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {mode === 'signup' && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="auth-name"
                        className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="auth-name"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="auth-country"
                          className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                        >
                          Country
                        </label>
                        <select
                          id="auth-country"
                          value={country}
                          onChange={(e) => {
                            const nextCountry = e.target.value;
                            setCountry(nextCountry);
                            const nextCities = getCitiesForCountry(nextCountry);
                            if (nextCities.length > 0) {
                              setCity(nextCities[0]);
                            }
                          }}
                          className="w-full text-sm font-medium text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5 cursor-pointer"
                        >
                          {COUNTRIES.map((countryName) => (
                            <option key={countryName} value={countryName}>
                              {countryName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="auth-city"
                          className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                        >
                          Target City
                        </label>
                        <CitySearchSelect
                          id="auth-city"
                          value={city}
                          onChange={setCity}
                          cities={getCitiesForCountry(country)}
                          placeholder="Search or select city"
                          allowCustom={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-semibold text-[#5A6460] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-semibold text-[#5A6460]"
                    >
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() =>
                          setInfoMessage(
                            'Please sign in with your registered email and password, or switch to Create Account.'
                          )
                        }
                        className="text-xs font-semibold text-[#145C4B] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full text-sm text-[#252B29] bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#5A6460] hover:text-[#252B29] cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <label className="flex items-start gap-2.5 text-xs text-[#5A6460] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 accent-[#145C4B] rounded cursor-pointer"
                    />
                    <span>
                      I agree to follow VibeNest’s{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('/safety')}
                        className="text-[#145C4B] font-semibold underline cursor-pointer"
                      >
                        Safety & Community Guidelines
                      </button>
                      .
                    </span>
                  </label>
                )}

                {error && (
                  <p role="alert" className="text-xs font-medium text-[#9F2D20]">
                    {error}
                  </p>
                )}

                {infoMessage && (
                  <p role="status" className="text-xs font-medium text-[#145C4B]">
                    {infoMessage}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#145C4B] hover:bg-[#0F493B] text-[#FAF8F2] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? mode === 'signup'
                      ? 'Creating Account...'
                      : 'Signing In...'
                    : mode === 'signup'
                    ? 'Create VibeNest Account'
                    : 'Sign In to VibeNest'}
                </motion.button>

                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-[#252B29]/10" />
                  <span className="px-3 text-xs text-[#5A6460]">or continue with</span>
                  <div className="flex-grow border-t border-[#252B29]/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setInfoMessage(
                        'Email/Password authentication is active above. Social providers are not enabled yet.'
                      )
                    }
                    className="py-2.5 px-4 rounded-xl bg-[#FAF8F2] hover:bg-[#F3EFE4] border border-[#252B29]/12 text-xs font-semibold text-[#252B29] transition-colors cursor-pointer"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInfoMessage(
                        'Email/Password authentication is active above. Social providers are not enabled yet.'
                      )
                    }
                    className="py-2.5 px-4 rounded-xl bg-[#FAF8F2] hover:bg-[#F3EFE4] border border-[#252B29]/12 text-xs font-semibold text-[#252B29] transition-colors cursor-pointer"
                  >
                    Apple
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
