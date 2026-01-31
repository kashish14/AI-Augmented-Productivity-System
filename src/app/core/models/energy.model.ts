export type EnergyLevel = 'low' | 'medium' | 'high';

export interface EnergyCheckIn {
  id: string;
  date: string;       // ISO date
  timeOfDay: string; // morning | midday | afternoon | evening
  level: EnergyLevel;
  note?: string;
  createdAt: string;
}

export interface EnergyTrend {
  date: string;
  averageLevel: number; // 1 low, 2 medium, 3 high
  checkInCount: number;
}
