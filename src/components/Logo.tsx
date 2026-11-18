import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="10" fill="#145C4B" />
        <path
          d="M9 17.5C9 13.3579 12.134 10 16 10C19.866 10 23 13.3579 23 17.5V22H9V17.5Z"
          stroke="#FAF8F2"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16.5" r="2.5" fill="#B7D9C5" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-[#252B29]">
        VibeNest
      </span>
    </span>
  );
};
