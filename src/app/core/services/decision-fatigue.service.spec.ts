import { TestBed } from '@angular/core/testing';
import { DecisionFatigueService } from './decision-fatigue.service';
import { StateService } from './state.service';
import { LoggingService } from './logging.service';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';

describe('DecisionFatigueService', () => {
  let service: DecisionFatigueService;
  let state: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DecisionFatigueService,
        StateService,
        LoggingService,
        ConfigService,
        StorageService
      ]
    });
    service = TestBed.inject(DecisionFatigueService);
    state = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should record a decision and update summary', () => {
    service.recordDecision('task_choice', 'create');
    const summary = service.getTodaySummary();
    expect(summary.decisionCount).toBeGreaterThanOrEqual(1);
  });

  it('should increase task switch count on task_switch', () => {
    service.recordDecision('task_switch');
    const summary = service.getTodaySummary();
    expect(summary.taskSwitchCount).toBeGreaterThanOrEqual(1);
  });

  it('should compute cognitive load score', () => {
    service.recordDecision('task_choice');
    service.recordDecision('task_choice');
    const summary = service.getTodaySummary();
    expect(summary.cognitiveLoadScore).toBeGreaterThanOrEqual(0);
    expect(summary.cognitiveLoadScore).toBeLessThanOrEqual(100);
  });
});
