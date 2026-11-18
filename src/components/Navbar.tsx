import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AppRoute } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentRoute: AppRoute;
  isAuthenticated: boolean;
  isProfileCompleted: boolean;
  onSignOut: () => Promise<void>;
  onNavigate: (route: AppRoute) => void;
}

const PUBLIC_NAV_LINKS: { label: string; route: AppRoute }[] = [
  { label: 'Explore', route: '/explore' },
  { label: 'How It Works', route: '/how-it-works' },
  { label: 'About', route: '/about' },
  { label: 'Safety', route: '/safety' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  isAuthenticated,
  isProfileCompleted,
  onSignOut,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { label: string; route: AppRoute }[] = isAuthenticated
    ? isProfileCompleted
      ? [{ label: 'Dashboard', route: '/dashboard' }, ...PUBLIC_NAV_LINKS]
      : [
          { label: 'Onboarding', route: '/lifestyle-profile' },
          ...PUBLIC_NAV_LINKS.filter((item) => item.route !== '/explore'),
        ]
    : PUBLIC_NAV_LINKS;

  useEffect(() => {
    setMobileOpen(false);
  }, [currentRoute]);

  const handleLinkClick = (route: AppRoute) => {
    setMobileOpen(false);
    onNavigate(route);
  };

  const handleSignOutClick = async () => {
    setMobileOpen(false);
    await onSignOut();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#252B29]/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('/')}
          aria-label="VibeNest Home"
          className="cursor-pointer rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-[#145C4B]"
        >
          <Logo />
        </button>

        {/* Zone 2: 4-5 concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#145C4B]'
                    : 'text-[#252B29]/75 hover:text-[#252B29]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#145C4B] rounded-full"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action + Mobile trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={handleSignOutClick}
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#145C4B] bg-[#E6F2EB] hover:bg-[#B7D9C5]/70 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign Out
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleLinkClick('/login')}
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#FAF8F2] bg-[#145C4B] hover:bg-[#0F493B] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </motion.button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#252B29] hover:bg-[#252B29]/5 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#FAF8F2] border-t border-[#252B29]/8"
          >
            <nav aria-label="Mobile navigation" className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleLinkClick(item.route)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#E6F2EB] text-[#145C4B]'
                        : 'text-[#252B29] hover:bg-[#252B29]/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-3 mt-2 border-t border-[#252B29]/8 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleLinkClick(
                          isProfileCompleted ? '/dashboard' : '/lifestyle-profile'
                        )
                      }
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#145C4B] border border-[#145C4B]/25 hover:bg-[#E6F2EB]/60 transition-colors cursor-pointer"
                    >
                      {isProfileCompleted ? 'Dashboard' : 'Complete Lifestyle Profile'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOutClick}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#FAF8F2] bg-[#145C4B] hover:bg-[#0F493B] transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/login')}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#145C4B] border border-[#145C4B]/25 hover:bg-[#E6F2EB]/60 transition-colors cursor-pointer"
                    >
                      Log In
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/signup')}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#FAF8F2] bg-[#145C4B] hover:bg-[#0F493B] transition-colors cursor-pointer"
                    >
                      Find My Flatmate
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
