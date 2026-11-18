import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig: FirebaseOptions = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyBBTCwKhNTk9R48kls-UEYYkjDgCuUDvPU',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vibenest-bd9ea.firebaseapp.com',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://vibenest-bd9ea-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vibenest-bd9ea',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'vibenest-bd9ea.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '776461355982',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:776461355982:web:7421053667fda1f6dbf99f',
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-4K6NJGYT9P',
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app);

let analyticsInstance: Analytics | null = null;

/**
 * Lazily initializes Firebase Analytics only in supported browser environments.
 */
export async function initAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (typeof window === 'undefined' || !firebaseConfig.measurementId) {
    return null;
  }
  const supported = await isSupported();
  if (!supported) return null;
  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}
