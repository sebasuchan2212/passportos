import { createSeedPassports } from '@/data/seed';
import type { PassportDTO } from '@/types/passport';

const STORAGE_KEY = 'passportos.mvp.passports.v1';

export class PassportStorage {
  static load(): PassportDTO[] {
    if (typeof window === 'undefined') return createSeedPassports();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedPassports();
      this.save(seed);
      return seed;
    }

    try {
      const parsed = JSON.parse(raw) as PassportDTO[];
      return Array.isArray(parsed) ? parsed : createSeedPassports();
    } catch {
      return createSeedPassports();
    }
  }

  static save(passports: PassportDTO[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(passports));
  }

  static reset(): PassportDTO[] {
    const seed = createSeedPassports();
    this.save(seed);
    return seed;
  }
}
