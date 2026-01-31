import { Component, OnInit } from '@angular/core';
import { AiSuggestion } from '../../../core/models/ai-suggestion.model';
import { Task } from '../../../core/models/task.model';
import { AiSuggestionService } from '../../../core/services/ai-suggestion.service';
import { StateService } from '../../../core/services/state.service';
import { DecisionFatigueService } from '../../../core/services/decision-fatigue.service';

@Component({
  selector: 'app-scheduling-view',
  templateUrl: './scheduling-view.component.html',
  styleUrls: ['./scheduling-view.component.scss']
})
export class SchedulingViewComponent implements OnInit {
  suggestions: AiSuggestion[] = [];
  pendingTasks: Task[] = [];
  loading = true;
  energyToday: 'low' | 'medium' | 'high' = 'medium';
  timeOfDay = 'midday';
  decisionCount = 0;
  taskSwitchCount = 0;

  constructor(
    private ai: AiSuggestionService,
    private state: StateService,
    private fatigue: DecisionFatigueService
  ) {}

  ngOnInit(): void {
    this.pendingTasks = this.state.getTasks().filter((t) => !t.completedAt);
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
    const h = new Date().getHours();
    this.timeOfDay = h < 10 ? 'morning' : h < 14 ? 'midday' : h < 18 ? 'afternoon' : 'evening';
    const summary = this.fatigue.getTodaySummary();
    this.decisionCount = summary.decisionCount;
    this.taskSwitchCount = summary.taskSwitchCount;

    this.ai
      .getSuggestions({
        currentEnergy: this.energyToday,
        timeOfDay: this.timeOfDay,
        decisionCountToday: this.decisionCount,
        tasksPending: this.pendingTasks.length,
        recentTaskSwitches: this.taskSwitchCount
      })
      .subscribe((s) => {
        this.suggestions = s;
        this.loading = false;
      });
  }

  dismiss(id: string): void {
    this.ai.dismissSuggestion(id);
  }

  refresh(): void {
    this.loading = true;
    this.ngOnInit();
  }
}
