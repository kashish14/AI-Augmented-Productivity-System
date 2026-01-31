import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { EnergyCheckIn } from '../models/energy.model';
import { DecisionFatigueSummary } from '../models/decision-fatigue.model';
import { AiSuggestion } from '../models/ai-suggestion.model';
import { Reflection } from '../models/reflection.model';
import { StorageService } from './storage.service';
import { LoggingService } from './logging.service';

const STORAGE_KEYS = {
  tasks: 'tasks',
  energy: 'energy_checkins',
  decisions: 'decision_summaries',
  suggestions: 'ai_suggestions',
  reflections: 'reflections'
} as const;

@Injectable({ providedIn: 'root' })
export class StateService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private energySubject = new BehaviorSubject<EnergyCheckIn[]>([]);
  private decisionSummariesSubject = new BehaviorSubject<DecisionFatigueSummary[]>([]);
  private suggestionsSubject = new BehaviorSubject<AiSuggestion[]>([]);
  private reflectionsSubject = new BehaviorSubject<Reflection[]>([]);

  readonly tasks$ = this.tasksSubject.asObservable();
  readonly energyCheckIns$ = this.energySubject.asObservable();
  readonly decisionSummaries$ = this.decisionSummariesSubject.asObservable();
  readonly suggestions$ = this.suggestionsSubject.asObservable();
  readonly reflections$ = this.reflectionsSubject.asObservable();

  constructor(
    private storage: StorageService,
    private logging: LoggingService
  ) {
    this.tasksSubject.next(this.loadTasks());
    this.energySubject.next(this.loadEnergy());
    this.decisionSummariesSubject.next(this.loadDecisionSummaries());
    this.suggestionsSubject.next(this.loadSuggestions());
    this.reflectionsSubject.next(this.loadReflections());
  }

  private loadTasks(): Task[] {
    return this.storage.get<Task[]>(STORAGE_KEYS.tasks) ?? [];
  }

  private loadEnergy(): EnergyCheckIn[] {
    return this.storage.get<EnergyCheckIn[]>(STORAGE_KEYS.energy) ?? [];
  }

  private loadDecisionSummaries(): DecisionFatigueSummary[] {
    return this.storage.get<DecisionFatigueSummary[]>(STORAGE_KEYS.decisions) ?? [];
  }

  private loadSuggestions(): AiSuggestion[] {
    return this.storage.get<AiSuggestion[]>(STORAGE_KEYS.suggestions) ?? [];
  }

  private loadReflections(): Reflection[] {
    return this.storage.get<Reflection[]>(STORAGE_KEYS.reflections) ?? [];
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  setTasks(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
    this.storage.set(STORAGE_KEYS.tasks, tasks);
    this.logging.debug('StateService: tasks updated', tasks.length);
  }

  getEnergyCheckIns(): EnergyCheckIn[] {
    return this.energySubject.value;
  }

  setEnergyCheckIns(checkIns: EnergyCheckIn[]): void {
    this.energySubject.next(checkIns);
    this.storage.set(STORAGE_KEYS.energy, checkIns);
  }

  getDecisionSummaries(): DecisionFatigueSummary[] {
    return this.decisionSummariesSubject.value;
  }

  setDecisionSummaries(summaries: DecisionFatigueSummary[]): void {
    this.decisionSummariesSubject.next(summaries);
    this.storage.set(STORAGE_KEYS.decisions, summaries);
  }

  getSuggestions(): AiSuggestion[] {
    return this.suggestionsSubject.value;
  }

  setSuggestions(suggestions: AiSuggestion[]): void {
    this.suggestionsSubject.next(suggestions);
    this.storage.set(STORAGE_KEYS.suggestions, suggestions);
  }

  getReflections(): Reflection[] {
    return this.reflectionsSubject.value;
  }

  setReflections(reflections: Reflection[]): void {
    this.reflectionsSubject.next(reflections);
    this.storage.set(STORAGE_KEYS.reflections, reflections);
  }
}
