export type AppRoute =
  | '/'
  | '/explore'
  | '/how-it-works'
  | '/about'
  | '/safety'
  | '/login'
  | '/signup'
  | '/lifestyle-profile'
  | '/dashboard';

export type SleepSchedule = 'Early Bird' | 'Balanced' | 'Night Owl';
export type CleanlinessLevel = 'Very Tidy' | 'Relaxed Neat' | 'Flexible';
export type SocialStyle = 'Quiet Sanctuary' | 'Warm & Occasional' | 'Social Host';

export interface FlatmateProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  city: string;
  neighborhood: string;
  budgetMax: number;
  moveInDate: string;
  moveInMonth: string;
  avatar: string;
  bio: string;
  matchScore: number;
  verifiedId: boolean;
  sleepSchedule: SleepSchedule;
  cleanliness: CleanlinessLevel;
  socialStyle: SocialStyle;
  workSetup: string;
  highlights: string[];
  accentTone: 'sage' | 'lavender' | 'peach';
  isDemo: true;
}

export interface SearchFilters {
  country?: string;
  city: string;
  maxBudget: number;
  moveInMonth: string;
  sleepSchedule: string;
  foodPreference?: string;
  smokingPreference?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  city: string;
  quote: string;
  outcome: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
  profileCompleted?: boolean;
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
  updatedAt?: number;
}

