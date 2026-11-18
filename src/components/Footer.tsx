import React from 'react';
import { AppRoute } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FAF8F2] border-t border-[#252B29]/10 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="cursor-pointer rounded-lg"
            >
              <Logo />
            </button>
            <p className="text-base font-medium text-[#252B29]">
              Find your people. Share your space.
            </p>
            <p className="text-sm text-[#5A6460] max-w-sm leading-relaxed">
              Thoughtful flatmate matching grounded in daily routines, shared home values, and transparent safety tools.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#252B29]">Platform</h3>
            <ul className="space-y-2.5 text-sm text-[#5A6460]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/explore')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  Explore Demo Matches
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  About VibeNest
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/safety')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  Safety & Trust
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#252B29]">Account</h3>
            <ul className="space-y-2.5 text-sm text-[#5A6460]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/signup')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  Create Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  Member Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/safety')}
                  className="hover:text-[#145C4B] transition-colors cursor-pointer"
                >
                  Report a Concern
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#252B29]/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5A6460]">
          <p>© {new Date().getFullYear()} VibeNest. All rights reserved.</p>
          <p>Sample member cards are demo content for previewing lifestyle matching.</p>
        </div>
      </div>
    </footer>
  );
};
