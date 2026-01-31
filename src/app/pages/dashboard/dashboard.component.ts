import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { AiSuggestion } from '../../core/models/ai-suggestion.model';
import { AiSuggestionService } from '../../core/services/ai-suggestion.service';
import { AnalyticsService, DailyAlignment } from '../../core/services/analytics.service';
import { StateService } from '../../core/services/state.service';
import { DecisionFatigueService } from '../../core/services/decision-fatigue.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  alignment$: Observable<DailyAlignment[]>;
  suggestions$: Observable<AiSuggestion[]>;
  pendingCount = 0;
  energyToday: string | null = null;
  fatigueScore = 0;
  fatigueInsights: string[] = [];

  alignmentChartData: ChartConfiguration<'bar'>['data'] = { datasets: [], labels: [] };
  alignmentChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { min: 0, max: 100 },
      x: {}
    }
  };

  constructor(
    private analytics: AnalyticsService,
    private ai: AiSuggestionService,
    private state: StateService,
    private fatigue: DecisionFatigueService
  ) {
    this.alignment$ = this.analytics.getDailyAlignment(7);
    this.suggestions$ = this.ai.getActiveSuggestions();
  }

  ngOnInit(): void {
    const tasks = this.state.getTasks();
    this.pendingCount = tasks.filter((t) => !t.completedAt).length;

    const today = new Date().toISOString().slice(0, 10);
    const energy = this.state.getEnergyCheckIns().filter((e) => e.date === today);
    if (energy.length) {
      const avg =
        energy.reduce((a, e) => {
          const n = e.level === 'low' ? 1 : e.level === 'medium' ? 2 : 3;
          return a + n;
        }, 0) / energy.length;
      this.energyToday = avg < 1.5 ? 'low' : avg < 2.5 ? 'medium' : 'high';
    }

    const fatigueSummary = this.state.getDecisionSummaries().find((f) => f.date === today);
    this.fatigueScore = fatigueSummary?.cognitiveLoadScore ?? 0;
    this.fatigueInsights = this.computeFatigueInsights(fatigueSummary);

    this.alignment$.subscribe((data) => {
      this.alignmentChartData = {
        labels: data.map((d) => d.date.slice(5)),
        datasets: [
          {
            label: 'Alignment',
            data: data.map((d) => d.alignmentScore),
            backgroundColor: 'rgba(15, 118, 110, 0.4)',
            borderColor: 'rgb(15, 118, 110)',
            borderWidth: 1
          }
        ]
      };
    });

    this.refreshSuggestions();
  }

  refreshSuggestions(): void {
    const hour = new Date().getHours();
    const timeOfDay =
      hour < 10 ? 'morning' : hour < 14 ? 'midday' : hour < 18 ? 'afternoon' : 'evening';
    const tasks = this.state.getTasks();
    const pending = tasks.filter((t) => !t.completedAt).length;
    const summaries = this.state.getDecisionSummaries();
    const today = new Date().toISOString().slice(0, 10);
    const todaySummary = summaries.find((s) => s.date === today);
    this.ai
      .getSuggestions({
        currentEnergy: (this.energyToday as 'low' | 'medium' | 'high') ?? 'medium',
        timeOfDay,
        decisionCountToday: todaySummary?.decisionCount ?? 0,
        tasksPending: pending,
        recentTaskSwitches: todaySummary?.taskSwitchCount ?? 0
      })
      .subscribe();
  }

  dismissSuggestion(id: string): void {
    this.ai.dismissSuggestion(id);
  }

  private computeFatigueInsights(
    summary: { decisionCount?: number; taskSwitchCount?: number; cognitiveLoadScore?: number; peakLoadHour?: number } | undefined
  ): string[] {
    const insights: string[] = [];
    if (!summary) return insights;
    if (summary.decisionCount && summary.decisionCount > 20) {
      insights.push('You make better decisions earlier in the day. Consider batching choices tomorrow morning.');
    }
    if (summary.cognitiveLoadScore && summary.cognitiveLoadScore > 60) {
      insights.push('High cognitive load today. High-load tasks after 6 PM tend to increase fatigue.');
    }
    if (summary.taskSwitchCount && summary.taskSwitchCount > 8) {
      insights.push('Frequent task switching increases decision fatigue. Try time-blocking similar work.');
    }
    return insights;
  }
}
