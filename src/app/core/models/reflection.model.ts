export interface Reflection {
  id: string;
  date: string;  // ISO date
  promptId: string;
  response: string;
  insights?: string[];
  createdAt: string;
}

export interface ReflectionPrompt {
  id: string;
  text: string;
  category: 'energy' | 'focus' | 'decisions' | 'patterns' | 'gratitude';
}
