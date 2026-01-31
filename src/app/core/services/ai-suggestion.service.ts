import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AiSuggestion, SuggestionContext } from '../models/ai-suggestion.model';
import { StateService } from './state.service';
import { ConfigService } from './config.service';
import { EventBusService } from './event-bus.service';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class AiSuggestionService {
  constructor(
    private state: StateService,
    private config: ConfigService,
    private eventBus: EventBusService,
    private logging: LoggingService
  ) {}

  getSuggestions(context: Partial<SuggestionContext>): Observable<AiSuggestion[]> {
    return of(context).pipe(
      delay(this.config.get('mockAiDelayMs')),
      map((ctx) => this.generateSuggestions(ctx))
    );
  }

  private generateSuggestions(ctx: Partial<SuggestionContext>): AiSuggestion[] {
    const suggestions: AiSuggestion[] = [];
    const now = new Date().toISOString();
    const id = () => `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const energy = ctx.currentEnergy ?? 'medium';
    const decisionCount = ctx.decisionCountToday ?? 0;
    const timeOfDay = ctx.timeOfDay ?? 'midday';
    const pending = ctx.tasksPending ?? 0;
    const switches = ctx.recentTaskSwitches ?? 0;

    // Explainable rule: high decision count → suggest batching
    if (decisionCount > 15 && pending > 2) {
      suggestions.push({
        id: id(),
        type: 'batch_tasks',
        title: 'Batch similar tasks',
        description: 'Group low-cognitive tasks and do them in one block to reduce decision fatigue.',
        reasoning: [
          `You've made ${decisionCount} decisions today.`,
          'Batching reduces context-switching and preserves mental energy.'
        ],
        createdAt: now
      });
    }

    // Explainable rule: evening + high cognitive tasks → defer
    if (timeOfDay === 'evening' && energy === 'low') {
      suggestions.push({
        id: id(),
        type: 'defer',
        title: 'Defer high-focus work',
        description: 'Schedule demanding tasks for tomorrow morning when energy is typically higher.',
        reasoning: [
          "Current energy is low and it's evening.",
          'Research shows decision quality drops later in the day.'
        ],
        createdAt: now
      });
    }

    // Explainable rule: many task switches → suggest break
    if (switches > 5) {
      suggestions.push({
        id: id(),
        type: 'break',
        title: 'Consider a short break',
        description: 'Frequent task switching increases cognitive load. A 5–10 minute break can reset focus.',
        reasoning: [
          `You've switched tasks ${switches} times recently.`,
          'Brief breaks reduce accumulated decision fatigue.'
        ],
        createdAt: now
      });
    }

    // Energy–task matching
    if (energy === 'high' && pending > 0) {
      suggestions.push({
        id: id(),
        type: 'energy_match',
        title: 'Good window for hard tasks',
        description: 'Your energy is high. Tackle your most cognitively demanding task now.',
        reasoning: [
          'Energy level is high.',
          'High-energy windows are ideal for high-cognitive-demand work.'
        ],
        createdAt: now
      });
    }

    // Task timing: morning = deep work
    if (timeOfDay === 'morning' && pending > 0) {
      suggestions.push({
        id: id(),
        type: 'task_timing',
        title: 'Schedule deep work now',
        description: 'Mornings are typically best for focused, high-priority work.',
        reasoning: [
          "It's morning — many people have peak focus before midday.",
          'Use this slot for your highest-priority, high-effort task.'
        ],
        createdAt: now
      });
    }

    const existing = this.state.getSuggestions().filter((s) => !s.dismissedAt);
    const newOnes = suggestions.slice(0, 3);
    const merged = [...existing];
    newOnes.forEach((s) => {
      if (!merged.some((e) => e.id === s.id)) merged.push(s);
    });
    this.state.setSuggestions(merged);
    this.logging.debug('AI suggestions generated', merged.length);
    return merged.filter((s) => !s.dismissedAt);
  }

  dismissSuggestion(id: string): void {
    const list = this.state.getSuggestions().map((s) =>
      s.id === id ? { ...s, dismissedAt: new Date().toISOString() } : s
    );
    this.state.setSuggestions(list);
    this.eventBus.dispatch({ type: 'suggestion_dismissed', payload: { id } });
  }

  getActiveSuggestions(): Observable<AiSuggestion[]> {
    return this.state.suggestions$.pipe(
      map((list) => list.filter((s) => !s.dismissedAt))
    );
  }
}
