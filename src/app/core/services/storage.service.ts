import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private config: ConfigService) {}

  private key(k: string): string {
    return `${this.config.get('storageKeyPrefix')}${k}`;
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.key(key));
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.key(key), JSON.stringify(value));
    } catch (e) {
      console.warn('StorageService.set failed', key, e);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.key(key));
  }

  clear(): void {
    const prefix = this.config.get('storageKeyPrefix');
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }
}
