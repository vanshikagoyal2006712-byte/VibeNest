export const DEFAULT_COUNTRY = 'India';

export interface CountryCitiesGroup {
  country: string;
  cities: string[];
}

export const COUNTRY_CITY_GROUPS: CountryCitiesGroup[] = [
  {
    country: 'India',
    cities: [
      'Delhi',
      'Meerut',
      'Noida',
      'Gurugram',
      'Bengaluru',
      'Mumbai',
      'Pune',
      'Hyderabad',
      'Chennai',
      'Kolkata',
      'Jaipur',
      'Lucknow',
      'Chandigarh',
      'Ahmedabad',
      'Kochi',
      'Indore',
    ],
  },
  {
    country: 'United Kingdom',
    cities: ['London', 'Manchester', 'Edinburgh', 'Bristol', 'Birmingham'],
  },
  {
    country: 'United States',
    cities: ['New York', 'Austin', 'San Francisco', 'Chicago', 'Seattle', 'Boston'],
  },
  {
    country: 'Canada',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
  },
  {
    country: 'Singapore',
    cities: ['Singapore'],
  },
  {
    country: 'United Arab Emirates',
    cities: ['Dubai', 'Abu Dhabi'],
  },
  {
    country: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane'],
  },
];

export const COUNTRIES: string[] = COUNTRY_CITY_GROUPS.map((group) => group.country);

export const ALL_PRESET_CITIES: string[] = Array.from(
  new Set(COUNTRY_CITY_GROUPS.flatMap((group) => group.cities))
);

export function getCitiesForCountry(
  country?: string,
  extraCities: string[] = []
): string[] {
  const base =
    !country || country === 'All Countries'
      ? ALL_PRESET_CITIES
      : COUNTRY_CITY_GROUPS.find(
          (group) => group.country.toLowerCase() === country.trim().toLowerCase()
        )?.cities ?? ALL_PRESET_CITIES;

  const merged = new Set<string>(base);
  for (const city of extraCities) {
    const trimmed = city.trim();
    if (trimmed && trimmed !== 'All Cities') {
      merged.add(trimmed);
    }
  }
  return Array.from(merged);
}

export function inferCountryForCity(city?: string): string | undefined {
  if (!city) return undefined;
  const normalized = city.trim().toLowerCase();
  for (const group of COUNTRY_CITY_GROUPS) {
    if (group.cities.some((item) => item.toLowerCase() === normalized)) {
      return group.country;
    }
  }
  return undefined;
}
