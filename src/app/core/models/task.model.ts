export type EnergyLevel = 'low' | 'medium' | 'high';
export type CognitiveDemand = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  energyLevel: EnergyLevel;
  cognitiveDemand: CognitiveDemand;
  priority: number;  // 1–5, 5 highest
  effort: number;    // 1–5, 5 most effort
  dueDate?: string;  // ISO date
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  energyLevel: EnergyLevel;
  cognitiveDemand: CognitiveDemand;
  priority: number;
  effort: number;
  dueDate?: string;
  tags?: string[];
}
