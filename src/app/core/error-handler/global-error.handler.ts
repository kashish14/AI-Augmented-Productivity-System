import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logging: LoggingService) {}

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    this.logging.error('Unhandled error', { message, stack });
    // In production, could send to error reporting service
    console.error('[IntentOS] Unhandled error:', error);
  }
}
