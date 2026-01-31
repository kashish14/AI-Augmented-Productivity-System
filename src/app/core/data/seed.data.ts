import { Task } from '../models/task.model';
import { EnergyCheckIn } from '../models/energy.model';
import { DecisionFatigueSummary } from '../models/decision-fatigue.model';
import { Reflection } from '../models/reflection.model';
import { AiSuggestion } from '../models/ai-suggestion.model';

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function iso(daysAgo: number, hour = 9): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function getSeedTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'task_seed_1',
      title: 'Review weekly goals',
      description: 'Align priorities with energy levels',
      energyLevel: 'high',
      cognitiveDemand: 'high',
      priority: 5,
      effort: 3,
      createdAt: iso(2, 9),
      updatedAt: iso(2, 9),
      completedAt: iso(2, 10)
    },
    {
      id: 'task_seed_2',
      title: 'Deep work: design doc',
      energyLevel: 'high',
      cognitiveDemand: 'high',
      priority: 5,
      effort: 5,
      dueDate: dateStr(0),
      createdAt: iso(1, 8),
      updatedAt: now
    },
    {
      id: 'task_seed_3',
      title: 'Clear inbox and quick replies',
      energyLevel: 'low',
      cognitiveDemand: 'low',
      priority: 3,
      effort: 2,
      createdAt: iso(1, 14),
      updatedAt: now
    },
    {
      id: 'task_seed_4',
      title: 'Team sync meeting prep',
      energyLevel: 'medium',
      cognitiveDemand: 'medium',
      priority: 4,
      effort: 2,
      createdAt: iso(0, 8),
      updatedAt: now
    },
    {
      id: 'task_seed_5',
      title: 'Update project roadmap',
      energyLevel: 'medium',
      cognitiveDemand: 'high',
      priority: 4,
      effort: 4,
      createdAt: iso(3, 10),
      updatedAt: iso(3, 11),
      completedAt: iso(3, 12)
    },
    {
      id: 'task_seed_6',
      title: 'Read and summarize article',
      energyLevel: 'low',
      cognitiveDemand: 'medium',
      priority: 2,
      effort: 2,
      createdAt: iso(0, 7),
      updatedAt: now
    }
  ];
}

export function getSeedEnergyCheckIns(): EnergyCheckIn[] {
  const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const checkIns: EnergyCheckIn[] = [];
  for (let d = 6; d >= 0; d--) {
    const date = dateStr(d);
    const morning = d <= 2 ? 2 : 1;
    const afternoon = d === 0 ? 2 : 1;
    checkIns.push({
      id: `energy_seed_${d}_m`,
      date,
      timeOfDay: 'morning',
      level: levels[morning],
      note: d === 0 ? 'Good sleep' : undefined,
      createdAt: iso(d, 8)
    });
    checkIns.push({
      id: `energy_seed_${d}_a`,
      date,
      timeOfDay: 'afternoon',
      level: levels[afternoon],
      createdAt: iso(d, 14)
    });
  }
  return checkIns;
}

export function getSeedDecisionSummaries(): DecisionFatigueSummary[] {
  const summaries: DecisionFatigueSummary[] = [];
  for (let d = 6; d >= 0; d--) {
    const decisionCount = 8 + d * 2 + (d === 0 ? 5 : 0);
    const taskSwitchCount = 3 + d + (d === 0 ? 4 : 0);
    const cognitiveLoadScore = Math.min(100, decisionCount * 2 + taskSwitchCount * 4);
    summaries.push({
      date: dateStr(d),
      decisionCount,
      taskSwitchCount,
      cognitiveLoadScore,
      peakLoadHour: 14
    });
  }
  return summaries;
}

export function getSeedReflections(): Reflection[] {
  return [
    {
      id: 'ref_seed_1',
      date: dateStr(1),
      promptId: 'energy_1',
      response: 'Felt most energized right after morning coffee, before 10 AM. Used that block for the hardest task.',
      createdAt: iso(1, 20)
    },
    {
      id: 'ref_seed_2',
      date: dateStr(1),
      promptId: 'patterns_1',
      response: 'Want to batch admin tasks tomorrow instead of scattering them. One 30-min block after lunch.',
      createdAt: iso(1, 20)
    },
    {
      id: 'ref_seed_3',
      date: dateStr(2),
      promptId: 'gratitude_1',
      response: 'Shipped the design review on time. Team feedback was constructive.',
      createdAt: iso(2, 19)
    },
    {
      id: 'ref_seed_4',
      date: dateStr(0),
      promptId: 'focus_1',
      response: 'Focus was best in the morning. Afternoon was fragmented by meetings.',
      createdAt: iso(0, 18)
    }
  ];
}

export function getSeedSuggestions(): AiSuggestion[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'sug_seed_1',
      type: 'task_timing',
      title: 'Schedule deep work now',
      description: 'Mornings are typically best for focused, high-priority work.',
      reasoning: [
        "It's morning — many people have peak focus before midday.",
        'Use this slot for your highest-priority, high-effort task.'
      ],
      createdAt: now
    },
    {
      id: 'sug_seed_2',
      type: 'energy_match',
      title: 'Good window for hard tasks',
      description: 'Your energy is high. Tackle your most cognitively demanding task now.',
      reasoning: [
        'Energy level is high.',
        'High-energy windows are ideal for high-cognitive-demand work.'
      ],
      createdAt: now
    }
  ];
}
