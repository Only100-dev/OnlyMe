import { Assessment } from '../types/assessment';

const CACHE_PREFIX = 'mra_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class Cache {
  static set<T>(key: string, data: T): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  }

  static get<T>(key: string): T | null {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item) as CacheItem<T>;
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      this.remove(key);
      return null;
    }

    return data;
  }

  static remove(key: string): void {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  }

  static clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}

// Assessment cache helpers
export const AssessmentCache = {
  getAll: () => Cache.get<Assessment[]>('assessments'),
  setAll: (assessments: Assessment[]) => Cache.set('assessments', assessments),
  getById: (id: string) => Cache.get<Assessment>(`assessment_${id}`),
  setById: (id: string, assessment: Assessment) => Cache.set(`assessment_${id}`, assessment),
  removeById: (id: string) => Cache.remove(`assessment_${id}`),
  clearAll: () => Cache.clear(),
};