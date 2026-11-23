import { toDateKey } from '../utils/date';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { StateService } from './state.service';
import { Task } from '../models/task.model';
import { EnergyCheckIn } from '../models/energy.model';
import { DecisionFatigueSummary } from '../models/decision-fatigue.model';
import { ConfigService } from './config.service';

export interface DailyAlignment {
  date: string;
  energyAverage: number;
  tasksCompleted: number;
  tasksTotal: number;
  fatigueScore: number;
  alignmentScore: number; // 0–100
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(
    private state: StateService,
    private config: ConfigService
  ) {}

  getDailyAlignment(days: number = 7): Observable<DailyAlignment[]> {
    return of(null).pipe(
      delay(this.config.get('mockAiDelayMs')),
      map(() => this.computeDailyAlignment(days))
    );
  }

  private computeDailyAlignment(days: number): DailyAlignment[] {
    const result: DailyAlignment[] = [];
    const now = new Date();
    const tasks = this.state.getTasks();
    const energy = this.state.getEnergyCheckIns();
    const fatigue = this.state.getDecisionSummaries();

    for (let d = 0; d < days; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      const dateStr = toDateKey(date);

      const dayEnergy = energy.filter((e) => e.date === dateStr);
      const energyAverage =
        dayEnergy.length > 0
          ? dayEnergy.reduce((acc, e) => {
              const n = e.level === 'low' ? 1 : e.level === 'medium' ? 2 : 3;
              return acc + n;
            }, 0) / dayEnergy.length
          : 2;

      const dayTasks = tasks.filter((t) => {
        const created = !!t.createdAt && toDateKey(t.createdAt) === dateStr;
        const completed = !!t.completedAt && toDateKey(t.completedAt) === dateStr;
        return created || completed;
      });
      const tasksCompleted = dayTasks.filter((t) => t.completedAt).length;
      const tasksTotal = dayTasks.length || 1;

      const dayFatigue = fatigue.find((f) => f.date === dateStr);
      const fatigueScore = dayFatigue?.cognitiveLoadScore ?? 0;

      const alignmentScore = Math.round(
        100 *
          (tasksTotal > 0
            ? (tasksCompleted / tasksTotal) * (1 - fatigueScore / 200)
            : 0.5)
      );
      result.push({
        date: dateStr,
        energyAverage,
        tasksCompleted,
        tasksTotal,
        fatigueScore,
        alignmentScore: Math.max(0, Math.min(100, alignmentScore))
      });
    }
    return result.reverse();
  }

  getEnergyTrend(days: number = 14): Observable<{ date: string; average: number | null }[]> {
    return of(this.state.getEnergyCheckIns()).pipe(
      delay(50),
      map((checkIns) => {
        const byDate = new Map<string, number[]>();
        const now = new Date();
        for (let d = 0; d < days; d++) {
          const date = new Date(now);
          date.setDate(date.getDate() - d);
          byDate.set(toDateKey(date), []);
        }
        checkIns.forEach((c) => {
          const n = c.level === 'low' ? 1 : c.level === 'medium' ? 2 : 3;
          const arr = byDate.get(c.date);
          if (arr) arr.push(n);
        });
        return Array.from(byDate.entries())
          .map(([date, values]) => ({
            date,
            average: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
          }))
          .sort((a, b) => a.date.localeCompare(b.date));
      })
    );
  }
}
