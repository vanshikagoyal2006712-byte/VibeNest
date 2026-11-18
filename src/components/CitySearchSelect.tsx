import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, MapPin, Search, X } from 'lucide-react';

interface CitySearchSelectProps {
  id: string;
  value: string;
  onChange: (city: string) => void;
  cities: string[];
  placeholder?: string;
  allowAllCities?: boolean;
  allowCustom?: boolean;
  ariaLabel?: string;
  inputClassName?: string;
}

export const CitySearchSelect: React.FC<CitySearchSelectProps> = ({
  id,
  value,
  onChange,
  cities,
  placeholder = 'Search or select city',
  allowAllCities = false,
  allowCustom = false,
  ariaLabel,
  inputClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery('');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCities = useMemo(() => {
    const unique = Array.from(
      new Set(cities.filter((item) => item && item !== 'All Cities'))
    );
    if (!normalizedQuery) return unique;
    return unique.filter((item) =>
      item.toLowerCase().includes(normalizedQuery)
    );
  }, [cities, normalizedQuery]);

  const showCustomOption =
    allowCustom &&
    query.trim().length >= 2 &&
    !filteredCities.some(
      (item) => item.toLowerCase() === query.trim().toLowerCase()
    );

  const handleSelect = (selectedCity: string) => {
    onChange(selectedCity);
    setIsOpen(false);
    setQuery('');
  };

  const displayLabel = value || placeholder;

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 text-left text-sm font-medium bg-[#FAF8F2] border border-[#252B29]/12 rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors hover:border-[#145C4B]/40 ${
          value ? 'text-[#252B29]' : 'text-[#5A6460]'
        } ${inputClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#5A6460] shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#252B29]/12 shadow-[0_18px_40px_-14px_rgba(37,43,41,0.22)] overflow-hidden min-w-[220px]">
          <div className="p-2 border-b border-[#252B29]/8 bg-[#FAF8F2]/60">
            <div className="relative flex items-center">
              <Search
                className="w-3.5 h-3.5 text-[#5A6460] absolute left-2.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredCities.length > 0) {
                      handleSelect(filteredCities[0]);
                    } else if (showCustomOption) {
                      handleSelect(query.trim());
                    }
                  }
                }}
                placeholder="Type to search city..."
                className="w-full text-xs sm:text-sm text-[#252B29] bg-white border border-[#252B29]/12 rounded-lg pl-8 pr-7 py-1.5 focus:outline-none focus:border-[#145C4B]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear city search"
                  className="absolute right-2 text-[#5A6460] hover:text-[#252B29] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <ul
            role="listbox"
            aria-labelledby={id}
            className="max-h-56 overflow-y-auto p-1.5 space-y-0.5"
          >
            {allowAllCities &&
              (!normalizedQuery || 'all cities'.includes(normalizedQuery)) && (
                <li role="option" aria-selected={value === 'All Cities'}>
                  <button
                    type="button"
                    onClick={() => handleSelect('All Cities')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      value === 'All Cities'
                        ? 'bg-[#E6F2EB] text-[#145C4B] font-semibold'
                        : 'text-[#252B29] hover:bg-[#FAF8F2]'
                    }`}
                  >
                    All Cities
                  </button>
                </li>
              )}

            {filteredCities.map((cityItem) => {
              const selected =
                value.trim().toLowerCase() === cityItem.trim().toLowerCase();
              return (
                <li key={cityItem} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(cityItem)}
                    className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#E6F2EB] text-[#145C4B] font-semibold'
                        : 'text-[#252B29] hover:bg-[#FAF8F2]'
                    }`}
                  >
                    <MapPin
                      className={`w-3.5 h-3.5 shrink-0 ${
                        selected ? 'text-[#145C4B]' : 'text-[#5A6460]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{cityItem}</span>
                  </button>
                </li>
              );
            })}

            {showCustomOption && (
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect(query.trim())}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#145C4B] bg-[#E6F2EB]/60 hover:bg-[#E6F2EB] transition-colors cursor-pointer"
                >
                  Use &ldquo;{query.trim()}&rdquo;
                </button>
              </li>
            )}

            {filteredCities.length === 0 && !showCustomOption && (
              <li className="px-3 py-3 text-xs text-[#5A6460] text-center">
                No matching city found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
