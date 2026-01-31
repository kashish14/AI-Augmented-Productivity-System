import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type IntentOSEvent =
  | { type: 'task_created'; payload: unknown }
  | { type: 'task_completed'; payload: unknown }
  | { type: 'energy_checkin'; payload: unknown }
  | { type: 'decision_recorded'; payload: unknown }
  | { type: 'reflection_saved'; payload: unknown }
  | { type: 'suggestion_dismissed'; payload: unknown };

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly bus = new Subject<IntentOSEvent>();

  dispatch(event: IntentOSEvent): void {
    this.bus.next(event);
  }

  on<K extends IntentOSEvent['type']>(
    type: K
  ): Observable<Extract<IntentOSEvent, { type: K }>> {
    return new Observable((subscriber) => {
      const sub = this.bus.subscribe((e) => {
        if (e.type === type) {
          subscriber.next(e as Extract<IntentOSEvent, { type: K }>);
        }
      });
      return () => sub.unsubscribe();
    });
  }

  onAll(): Observable<IntentOSEvent> {
    return this.bus.asObservable();
  }
}
