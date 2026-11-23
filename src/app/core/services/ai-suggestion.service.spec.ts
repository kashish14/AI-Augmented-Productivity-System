import { TestBed } from '@angular/core/testing';
import { AiSuggestionService } from './ai-suggestion.service';
import { StateService } from './state.service';
import { ConfigService } from './config.service';
import { EventBusService } from './event-bus.service';
import { LoggingService } from './logging.service';
import { StorageService } from './storage.service';

describe('AiSuggestionService', () => {
  let service: AiSuggestionService;
  let state: StateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AiSuggestionService,
        StateService,
        ConfigService,
        StorageService,
        EventBusService,
        LoggingService
      ]
    });
    service = TestBed.inject(AiSuggestionService);
    state = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return suggestions observable', (done) => {
    service
      .getSuggestions({
        currentEnergy: 'high',
        timeOfDay: 'morning',
        decisionCountToday: 0,
        tasksPending: 3,
        recentTaskSwitches: 0
      })
      .subscribe((suggestions) => {
        expect(Array.isArray(suggestions)).toBe(true);
        done();
      });
  });

  it('should include explainable reasoning when suggestions exist', (done) => {
    service
      .getSuggestions({
        currentEnergy: 'high',
        timeOfDay: 'morning',
        decisionCountToday: 0,
        tasksPending: 5,
        recentTaskSwitches: 0
      })
      .subscribe((suggestions) => {
        for (const s of suggestions) {
          expect(s.reasoning).toBeDefined();
          expect(Array.isArray(s.reasoning)).toBe(true);
        }
        done();
      });
  });

  it('should not accumulate duplicates across runs and should respect dismissals', (done) => {
    const ctx = {
      currentEnergy: 'high' as const,
      timeOfDay: 'morning',
      decisionCountToday: 0,
      tasksPending: 3,
      recentTaskSwitches: 0
    };
    service.getSuggestions(ctx).subscribe((first) => {
      expect(first.length).toBeGreaterThan(0);
      service.dismissSuggestion(first[0].id);
      service.getSuggestions(ctx).subscribe((second) => {
        const types = second.map((s) => s.type);
        expect(new Set(types).size).toBe(types.length);
        expect(types).not.toContain(first[0].type);
        expect(second.length).toBe(first.length - 1);
        done();
      });
    });
  });
});
