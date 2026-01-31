export interface AiSuggestion {
  id: string;
  type: 'task_timing' | 'break' | 'batch_tasks' | 'defer' | 'energy_match';
  title: string;
  description: string;
  reasoning: string[];  // Explainable: why this suggestion
  payload?: Record<string, unknown>;
  createdAt: string;
  dismissedAt?: string;
}

export interface SuggestionContext {
  currentEnergy: 'low' | 'medium' | 'high';
  timeOfDay: string;
  decisionCountToday: number;
  tasksPending: number;
  recentTaskSwitches: number;
}
