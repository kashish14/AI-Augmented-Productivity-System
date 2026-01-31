import { Component, OnInit } from '@angular/core';
import { Task, CreateTaskDto, EnergyLevel, CognitiveDemand } from '../../../core/models/task.model';
import { StateService } from '../../../core/services/state.service';
import { EventBusService } from '../../../core/services/event-bus.service';
import { DecisionFatigueService } from '../../../core/services/decision-fatigue.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  showForm = false;
  energyLevels: { value: EnergyLevel; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  cognitiveLevels: { value: CognitiveDemand; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  newTask: CreateTaskDto = {
    title: '',
    energyLevel: 'medium',
    cognitiveDemand: 'medium',
    priority: 3,
    effort: 3
  };

  constructor(
    private state: StateService,
    private eventBus: EventBusService,
    private decisionFatigue: DecisionFatigueService
  ) {}

  ngOnInit(): void {
    this.state.tasks$.subscribe((t) => (this.tasks = t));
  }

  get pendingTasks(): Task[] {
    return this.tasks.filter((t) => !t.completedAt);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter((t) => t.completedAt);
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.newTask = {
      title: '',
      energyLevel: 'medium',
      cognitiveDemand: 'medium',
      priority: 3,
      effort: 3
    };
  }

  createTask(): void {
    if (!this.newTask.title?.trim()) return;
    const now = new Date().toISOString();
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const task: Task = {
      id,
      ...this.newTask,
      createdAt: now,
      updatedAt: now
    };
    const list = [...this.state.getTasks(), task];
    this.state.setTasks(list);
    this.decisionFatigue.recordDecision('task_choice', 'create_task');
    this.eventBus.dispatch({ type: 'task_created', payload: task });
    this.closeForm();
  }

  completeTask(task: Task): void {
    const now = new Date().toISOString();
    const list = this.state.getTasks().map((t) =>
      t.id === task.id ? { ...t, completedAt: now, updatedAt: now } : t
    );
    this.state.setTasks(list);
    this.decisionFatigue.recordDecision('task_choice', 'complete');
    this.eventBus.dispatch({ type: 'task_completed', payload: { ...task, completedAt: now } });
  }

  deleteTask(task: Task): void {
    const list = this.state.getTasks().filter((t) => t.id !== task.id);
    this.state.setTasks(list);
  }
}
