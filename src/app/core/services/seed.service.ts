import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { LoggingService } from './logging.service';
import {
  getSeedTasks,
  getSeedEnergyCheckIns,
  getSeedDecisionSummaries,
  getSeedReflections,
  getSeedSuggestions
} from '../data/seed.data';

@Injectable({ providedIn: 'root' })
export class SeedService {
  constructor(
    private state: StateService,
    private logging: LoggingService
  ) {}

  seedIfEmpty(): void {
    const tasks = this.state.getTasks();
    if (tasks.length > 0) {
      this.logging.debug('SeedService: data already present, skipping seed');
      return;
    }
    this.logging.info('SeedService: seeding dummy data');
    this.state.setTasks(getSeedTasks());
    this.state.setEnergyCheckIns(getSeedEnergyCheckIns());
    this.state.setDecisionSummaries(getSeedDecisionSummaries());
    this.state.setReflections(getSeedReflections());
    this.state.setSuggestions(getSeedSuggestions());
  }
}
