import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: LogLevel[] = ['debug', 'info', 'warn', 'error'];

@Injectable({ providedIn: 'root' })
export class LoggingService {
  constructor(private config: ConfigService) {}

  private shouldLog(level: LogLevel): boolean {
    const configured = this.config.get('logLevel') as LogLevel;
    return LEVEL_ORDER.indexOf(level) >= LEVEL_ORDER.indexOf(configured);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[IntentOS] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`[IntentOS] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[IntentOS] ${message}`, ...args);
    }
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`[IntentOS] ${message}`, error, ...args);
    }
  }
}
