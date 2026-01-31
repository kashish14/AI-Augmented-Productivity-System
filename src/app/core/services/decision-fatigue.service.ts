import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { DecisionFatigueSummary } from '../models/decision-fatigue.model';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class DecisionFatigueService {
  private taskSwitchCountToday = 0;
  private decisionCountToday = 0;

  constructor(
    private state: StateService,
    private logging: LoggingService
  ) {
    this.resetIfNewDay();
  }

  private resetIfNewDay(): void {
    const today = new Date().toISOString().slice(0, 10);
    const summaries = this.state.getDecisionSummaries();
    const todaySummary = summaries.find((s) => s.date === today);
    if (todaySummary) {
      this.decisionCountToday = todaySummary.decisionCount;
      this.taskSwitchCountToday = todaySummary.taskSwitchCount;
    }
  }

  recordDecision(
    type: 'task_switch' | 'task_choice' | 'schedule_change' | 'priority_change',
    context?: string
  ): void {
    const today = new Date().toISOString().slice(0, 10);
    this.decisionCountToday++;
    if (type === 'task_switch') {
      this.taskSwitchCountToday++;
    }
    this.persistSummary(today);
    this.logging.debug('Decision recorded', type, context);
  }

  private persistSummary(date: string): void {
    const summaries = this.state.getDecisionSummaries();
    const existing = summaries.find((s) => s.date === date);
    const cognitiveLoadScore = Math.min(
      100,
      this.decisionCountToday * 3 + this.taskSwitchCountToday * 5
    );
    const updated: DecisionFatigueSummary = {
      date,
      decisionCount: this.decisionCountToday,
      taskSwitchCount: this.taskSwitchCountToday,
      cognitiveLoadScore,
      peakLoadHour: new Date().getHours()
    };
    const filtered = summaries.filter((s) => s.date !== date);
    this.state.setDecisionSummaries([...filtered, updated]);
  }

  getTodaySummary(): { decisionCount: number; taskSwitchCount: number; cognitiveLoadScore: number } {
    const today = new Date().toISOString().slice(0, 10);
    const summary = this.state.getDecisionSummaries().find((s) => s.date === today);
    return {
      decisionCount: summary?.decisionCount ?? this.decisionCountToday,
      taskSwitchCount: summary?.taskSwitchCount ?? this.taskSwitchCountToday,
      cognitiveLoadScore: summary?.cognitiveLoadScore ?? 0
    };
  }

  recordTaskSwitch(): void {
    this.recordDecision('task_switch', 'task_switch');
  }
}
