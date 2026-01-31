import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AppConfig {
  appName: string;
  storageKeyPrefix: string;
  mockAiDelayMs: number;
  logLevel: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig = {
    appName: environment.appName,
    storageKeyPrefix: environment.storageKeyPrefix,
    mockAiDelayMs: environment.mockAiDelayMs,
    logLevel: environment.logLevel
  };

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  isProduction(): boolean {
    return (environment as { production?: boolean }).production ?? false;
  }
}
