export interface DecisionRecord {
  id: string;
  date: string;
  timestamp: string;
  type: 'task_switch' | 'task_choice' | 'schedule_change' | 'priority_change';
  context?: string;
}

export interface DecisionFatigueSummary {
  date: string;
  decisionCount: number;
  taskSwitchCount: number;
  cognitiveLoadScore: number; // 0–100
  peakLoadHour?: number;      // 0–23
}
