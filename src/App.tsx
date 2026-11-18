/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { auth, db } from './firebase';
import { AppRoute, FlatmateProfile, SearchFilters, UserProfile } from './types';
import { DEFAULT_COUNTRY } from './data/locations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageTransition } from './components/MotionPrimitives';
import { ProfileModal } from './components/ProfileModal';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SafetyPage } from './pages/SafetyPage';
import { AuthPage } from './pages/AuthPage';
import { LifestyleProfilePage } from './pages/LifestyleProfilePage';
import { DashboardPage } from './pages/DashboardPage';

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/explore',
  '/how-it-works',
  '/about',
  '/safety',
  '/login',
  '/signup',
  '/lifestyle-profile',
  '/dashboard',
];

function parseRoute(pathname: string): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return VALID_ROUTES.includes(normalized as AppRoute)
    ? (normalized as AppRoute)
    : '/';
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.pathname)
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<FlatmateProfile | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    country: DEFAULT_COUNTRY,
    city: 'All Cities',
    maxBudget: 0,
    moveInMonth: 'any',
    sleepSchedule: 'Any',
    foodPreference: 'Any',
    smokingPreference: 'Any',
  });

  const navigate = useCallback((nextRoute: AppRoute) => {
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setUserProfile(null);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);
      setCurrentUser(firebaseUser);

      try {
        const snapshot = await get(ref(db, `profiles/${firebaseUser.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val() as UserProfile;
          setUserProfile(data);
        } else {
          setUserProfile({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName ?? '',
            email: firebaseUser.email ?? '',
            createdAt: Date.now(),
            profileCompleted: false,
          });
        }
      } catch {
        setUserProfile({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName ?? '',
          email: firebaseUser.email ?? '',
          createdAt: Date.now(),
          profileCompleted: false,
        });
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const isProfileCompleted = Boolean(userProfile?.profileCompleted);

  // Enforce mandatory onboarding & auth route guards
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      if (route === '/dashboard' || route === '/lifestyle-profile') {
        navigate('/login');
      }
      return;
    }

    if (!isProfileCompleted) {
      if (
        route === '/dashboard' ||
        route === '/explore' ||
        route === '/login' ||
        route === '/signup'
      ) {
        navigate('/lifestyle-profile');
      }
      return;
    }

    if (route === '/login' || route === '/signup') {
      navigate('/dashboard');
    }
  }, [authLoading, currentUser, isProfileCompleted, route, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut(auth);
    setUserProfile(null);
    navigate('/');
  }, [navigate]);

  const handleSearchSubmit = useCallback(
    (nextFilters: SearchFilters) => {
      setFilters(nextFilters);
      if (currentUser && !isProfileCompleted) {
        navigate('/lifestyle-profile');
        return;
      }
      navigate('/explore');
    },
    [currentUser, isProfileCompleted, navigate]
  );

  const isProtectedRoute = route === '/dashboard' || route === '/lifestyle-profile';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#252B29]">
        <Navbar
          currentRoute={route}
          isAuthenticated={Boolean(currentUser)}
          isProfileCompleted={isProfileCompleted}
          onSignOut={handleSignOut}
          onNavigate={navigate}
        />

        <main className="flex-1">
          {authLoading && isProtectedRoute ? (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-[#5A6460]">
              Loading your VibeNest profile...
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <PageTransition routeKey={route}>
                {route === '/' && (
                  <LandingPage
                    onNavigate={navigate}
                    onSearchSubmit={handleSearchSubmit}
                    onSelectProfile={setSelectedProfile}
                  />
                )}
                {route === '/explore' && (!currentUser || isProfileCompleted) && (
                  <ExplorePage
                    currentUser={currentUser}
                    userProfile={userProfile}
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSelectProfile={setSelectedProfile}
                    onNavigate={navigate}
                  />
                )}
                {route === '/how-it-works' && (
                  <HowItWorksPage
                    onNavigate={navigate}
                    onSelectProfile={setSelectedProfile}
                  />
                )}
                {route === '/about' && <AboutPage onNavigate={navigate} />}
                {route === '/safety' && <SafetyPage onNavigate={navigate} />}
                {route === '/login' && (
                  <AuthPage
                    initialMode="login"
                    currentUser={currentUser}
                    userProfile={userProfile}
                    authLoading={authLoading}
                    onProfileCreated={setUserProfile}
                    onSignOut={handleSignOut}
                    onNavigate={navigate}
                  />
                )}
                {route === '/signup' && (
                  <AuthPage
                    initialMode="signup"
                    currentUser={currentUser}
                    userProfile={userProfile}
                    authLoading={authLoading}
                    onProfileCreated={setUserProfile}
                    onSignOut={handleSignOut}
                    onNavigate={navigate}
                  />
                )}
                {route === '/lifestyle-profile' && currentUser && (
                  <LifestyleProfilePage
                    currentUser={currentUser}
                    userProfile={userProfile}
                    onProfileSaved={setUserProfile}
                    onNavigate={navigate}
                  />
                )}
                {route === '/dashboard' &&
                  currentUser &&
                  isProfileCompleted &&
                  userProfile && (
                    <DashboardPage
                      currentUser={currentUser}
                      userProfile={userProfile}
                      onSignOut={handleSignOut}
                      onNavigate={navigate}
                    />
                  )}
              </PageTransition>
            </AnimatePresence>
          )}
        </main>

        <Footer onNavigate={navigate} />

        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onRequestAuth={() => {
            setSelectedProfile(null);
            navigate('/signup');
          }}
        />
      </div>
    </MotionConfig>
  );
}
