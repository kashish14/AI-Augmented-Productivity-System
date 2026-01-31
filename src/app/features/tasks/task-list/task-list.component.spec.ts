import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskListComponent } from './task-list.component';
import { StateService } from '../../../core/services/state.service';
import { EventBusService } from '../../../core/services/event-bus.service';
import { DecisionFatigueService } from '../../../core/services/decision-fatigue.service';
import { ConfigService } from '../../../core/services/config.service';
import { StorageService } from '../../../core/services/storage.service';
import { LoggingService } from '../../../core/services/logging.service';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        StateService,
        EventBusService,
        DecisionFatigueService,
        ConfigService,
        StorageService,
        LoggingService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have energy and cognitive level options', () => {
    expect(component.energyLevels.length).toBe(3);
    expect(component.cognitiveLevels.length).toBe(3);
  });

  it('should open and close form', () => {
    expect(component.showForm).toBe(false);
    component.openForm();
    expect(component.showForm).toBe(true);
    component.closeForm();
    expect(component.showForm).toBe(false);
  });
});
