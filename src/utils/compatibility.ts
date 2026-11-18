import { UserProfile } from '../types';

export interface CompatibilityBreakdown {
  food: number;
  sleep: number;
  cleanliness: number;
  budget: number;
  smoking: number;
  drinking: number;
  hobbies: number;
}

export interface MatchResult {
  profile: PublicMatchProfile;
  score: number;
  isHighMatch: boolean;
  sharedHobbies: string[];
  breakdown: CompatibilityBreakdown;
}

/**
 * Sanitized flatmate profile view excluding sensitive fields (email, createdAt, etc.).
 */
export interface PublicMatchProfile {
  uid: string;
  name: string;
  age?: number;
  country?: string;
  city?: string;
  occupation?: string;
  monthlyRentBudget?: number;
  foodPreference?: string;
  sleepSchedule?: string;
  cleanlinessPreference?: string;
  smokingPreference?: string;
  drinkingPreference?: string;
  hobbies?: string[];
}

export function toPublicMatchProfile(
  uidKey: string,
  raw: Partial<UserProfile>
): PublicMatchProfile {
  return {
    uid: raw.uid || uidKey,
    name: raw.name?.trim() || 'VibeNest Member',
    age: typeof raw.age === 'number' ? raw.age : undefined,
    country: raw.country?.trim() || undefined,
    city: raw.city?.trim() || undefined,
    occupation: raw.occupation?.trim() || undefined,
    monthlyRentBudget:
      typeof raw.monthlyRentBudget === 'number' ? raw.monthlyRentBudget : undefined,
    foodPreference: raw.foodPreference?.trim() || undefined,
    sleepSchedule: raw.sleepSchedule?.trim() || undefined,
    cleanlinessPreference: raw.cleanlinessPreference?.trim() || undefined,
    smokingPreference: raw.smokingPreference?.trim() || undefined,
    drinkingPreference: raw.drinkingPreference?.trim() || undefined,
    hobbies: Array.isArray(raw.hobbies)
      ? raw.hobbies.filter((h): h is string => typeof h === 'string' && h.trim().length > 0)
      : [],
  };
}

function normalizeSleepTier(value?: string): 'early' | 'balanced' | 'night' | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes('early')) return 'early';
  if (v.includes('balanced')) return 'balanced';
  if (v.includes('night')) return 'night';
  return null;
}

function scoreFood(a?: string, b?: string): number {
  if (!a || !b) return 7;
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x === y) return 15;
  if (x === 'no preference' || y === 'no preference') return 12;

  const plantBased = new Set(['vegan', 'vegetarian']);
  if (plantBased.has(x) && plantBased.has(y)) return 10;

  if (
    (x === 'vegetarian' && y === 'eggetarian') ||
    (x === 'eggetarian' && y === 'vegetarian')
  ) {
    return 10;
  }

  if (
    (x === 'eggetarian' && y === 'non-vegetarian') ||
    (x === 'non-vegetarian' && y === 'eggetarian')
  ) {
    return 6;
  }

  return 3;
}

function scoreSleep(a?: string, b?: string): number {
  const tierA = normalizeSleepTier(a);
  const tierB = normalizeSleepTier(b);
  if (!tierA || !tierB) return 7;
  if (tierA === tierB) return 15;
  if (tierA === 'balanced' || tierB === 'balanced') return 10;
  return 2;
}

function scoreCleanliness(a?: string, b?: string): number {
  if (!a || !b) return 7;
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x === y) return 15;
  if (x === 'relaxed neat' || y === 'relaxed neat') return 10;
  return 4;
}

function scoreBudget(budgetA?: number, budgetB?: number): number {
  if (
    typeof budgetA !== 'number' ||
    typeof budgetB !== 'number' ||
    budgetA <= 0 ||
    budgetB <= 0
  ) {
    return 10;
  }
  const maxVal = Math.max(budgetA, budgetB);
  const diffRatio = Math.abs(budgetA - budgetB) / maxVal;

  if (diffRatio <= 0.1) return 20;
  if (diffRatio <= 0.2) return 16;
  if (diffRatio <= 0.3) return 12;
  if (diffRatio <= 0.45) return 7;
  return 2;
}

function scoreSmoking(a?: string, b?: string): number {
  if (!a || !b) return 5;
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x === y) return 10;
  if (
    (x === 'outside only' && y === 'smoker-friendly') ||
    (x === 'smoker-friendly' && y === 'outside only')
  ) {
    return 7;
  }
  if (
    (x === 'non-smoker' && y === 'outside only') ||
    (x === 'outside only' && y === 'non-smoker')
  ) {
    return 5;
  }
  return 1;
}

function scoreDrinking(a?: string, b?: string): number {
  if (!a || !b) return 5;
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x === y) return 10;

  if (
    (x === 'socially' && y === 'occasionally') ||
    (x === 'occasionally' && y === 'socially')
  ) {
    return 9;
  }

  if (
    (x === 'never' && (y === 'occasionally' || y === 'socially')) ||
    (y === 'never' && (x === 'occasionally' || x === 'socially'))
  ) {
    return 6;
  }

  if (
    (x === 'regularly' && (y === 'occasionally' || y === 'socially')) ||
    (y === 'regularly' && (x === 'occasionally' || x === 'socially'))
  ) {
    return 6;
  }

  return 2;
}

function scoreHobbies(
  hobbiesA?: string[],
  hobbiesB?: string[]
): { points: number; shared: string[] } {
  const listA = Array.isArray(hobbiesA) ? hobbiesA : [];
  const listB = Array.isArray(hobbiesB) ? hobbiesB : [];
  if (listA.length === 0 || listB.length === 0) {
    return { points: 6, shared: [] };
  }

  const mapB = new Map<string, string>();
  for (const item of listB) {
    mapB.set(item.trim().toLowerCase(), item.trim());
  }

  const shared: string[] = [];
  const seen = new Set<string>();
  for (const item of listA) {
    const key = item.trim().toLowerCase();
    if (mapB.has(key) && !seen.has(key)) {
      seen.add(key);
      shared.push(item.trim());
    }
  }

  if (shared.length === 0) {
    return { points: 3, shared: [] };
  }

  const denominator = Math.min(4, Math.max(1, Math.min(listA.length, listB.length)));
  const points = Math.min(15, Math.round(5 + (shared.length / denominator) * 10));
  return { points, shared };
}

/**
 * Calculates compatibility score out of 100 using exact category weights:
 * Food (15%), Sleep (15%), Cleanliness (15%), Budget (20%),
 * Smoking (10%), Drinking (10%), Hobbies (15%).
 */
export function calculateCompatibility(
  currentUserProfile: UserProfile,
  candidate: PublicMatchProfile
): MatchResult {
  const food = scoreFood(currentUserProfile.foodPreference, candidate.foodPreference);
  const sleep = scoreSleep(currentUserProfile.sleepSchedule, candidate.sleepSchedule);
  const cleanliness = scoreCleanliness(
    currentUserProfile.cleanlinessPreference,
    candidate.cleanlinessPreference
  );
  const budget = scoreBudget(
    currentUserProfile.monthlyRentBudget,
    candidate.monthlyRentBudget
  );
  const smoking = scoreSmoking(
    currentUserProfile.smokingPreference,
    candidate.smokingPreference
  );
  const drinking = scoreDrinking(
    currentUserProfile.drinkingPreference,
    candidate.drinkingPreference
  );
  const { points: hobbies, shared: sharedHobbies } = scoreHobbies(
    currentUserProfile.hobbies,
    candidate.hobbies
  );

  const rawTotal = food + sleep + cleanliness + budget + smoking + drinking + hobbies;
  const score = Math.min(100, Math.max(0, Math.round(rawTotal)));

  return {
    profile: candidate,
    score,
    isHighMatch: score >= 80,
    sharedHobbies,
    breakdown: {
      food,
      sleep,
      cleanliness,
      budget,
      smoking,
      drinking,
      hobbies,
    },
  };
}

export function sortMatchesDescending(matches: MatchResult[]): MatchResult[] {
  return [...matches].sort((a, b) => b.score - a.score);
}
