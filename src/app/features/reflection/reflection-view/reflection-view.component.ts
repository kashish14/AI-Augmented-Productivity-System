import { Component, OnInit } from '@angular/core';
import { Reflection, ReflectionPrompt } from '../../../core/models/reflection.model';
import { StateService } from '../../../core/services/state.service';
import { EventBusService } from '../../../core/services/event-bus.service';

const PROMPTS: ReflectionPrompt[] = [
  { id: 'energy_1', text: 'When did you feel most energized today?', category: 'energy' },
  { id: 'focus_1', text: 'What helped you focus? What broke it?', category: 'focus' },
  { id: 'decisions_1', text: 'What was the hardest decision you made today?', category: 'decisions' },
  { id: 'patterns_1', text: 'What pattern do you want to change tomorrow?', category: 'patterns' },
  { id: 'gratitude_1', text: 'One thing that went well today.', category: 'gratitude' }
];

@Component({
  selector: 'app-reflection-view',
  templateUrl: './reflection-view.component.html',
  styleUrls: ['./reflection-view.component.scss']
})
export class ReflectionViewComponent implements OnInit {
  reflections: Reflection[] = [];
  prompts = PROMPTS;
  selectedPrompt: ReflectionPrompt = PROMPTS[0];
  response = '';
  weeklyReflections: Reflection[] = [];

  constructor(
    private state: StateService,
    private eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.state.reflections$.subscribe((r) => (this.reflections = r));
    this.computeWeekly();
  }

  private computeWeekly(): void {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.weeklyReflections = this.reflections.filter((r) => new Date(r.date) >= weekAgo);
  }

  get todayReflections(): Reflection[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.reflections.filter((r) => r.date === today);
  }

  submitReflection(): void {
    if (!this.response.trim()) return;
    const now = new Date().toISOString();
    const date = now.slice(0, 10);
    const id = `ref_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const reflection: Reflection = {
      id,
      date,
      promptId: this.selectedPrompt.id,
      response: this.response.trim(),
      createdAt: now
    };
    const list = [...this.state.getReflections(), reflection];
    this.state.setReflections(list);
    this.eventBus.dispatch({ type: 'reflection_saved', payload: reflection });
    this.response = '';
    this.computeWeekly();
  }

  selectPrompt(p: ReflectionPrompt): void {
    this.selectedPrompt = p;
  }
}
