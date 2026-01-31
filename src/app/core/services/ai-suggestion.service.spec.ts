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
});
