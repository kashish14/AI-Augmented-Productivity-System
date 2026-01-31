import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { EnergyCheckIn, EnergyLevel } from '../../../core/models/energy.model';
import { StateService } from '../../../core/services/state.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { EventBusService } from '../../../core/services/event-bus.service';

@Component({
  selector: 'app-energy-dashboard',
  templateUrl: './energy-dashboard.component.html',
  styleUrls: ['./energy-dashboard.component.scss']
})
export class EnergyDashboardComponent implements OnInit {
  checkIns: EnergyCheckIn[] = [];
  energyChartData: ChartConfiguration<'line'>['data'] = { datasets: [], labels: [] };
  energyChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 3, ticks: { stepSize: 1, callback: (v) => ['', 'Low', 'Med', 'High'][v as number] } },
      x: {}
    }
  };

  newCheckIn: { level: EnergyLevel; timeOfDay: string; note?: string } = {
    level: 'medium',
    timeOfDay: this.getCurrentTimeOfDay(),
    note: ''
  };

  timeOfDayOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'midday', label: 'Midday' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' }
  ];

  energyLevels: { value: EnergyLevel; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  constructor(
    private state: StateService,
    private analytics: AnalyticsService,
    private eventBus: EventBusService
  ) {}

  private getCurrentTimeOfDay(): string {
    const h = new Date().getHours();
    if (h < 10) return 'morning';
    if (h < 14) return 'midday';
    if (h < 18) return 'afternoon';
    return 'evening';
  }

  ngOnInit(): void {
    this.state.energyCheckIns$.subscribe((c) => (this.checkIns = c));
    this.analytics.getEnergyTrend(14).subscribe((trend) => {
      this.energyChartData = {
        labels: trend.map((t) => t.date.slice(5)),
        datasets: [
          {
            label: 'Energy',
            data: trend.map((t) => t.average),
            borderColor: 'rgb(15, 118, 110)',
            backgroundColor: 'rgba(15, 118, 110, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      };
    });
  }

  get todayCheckIns(): EnergyCheckIn[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.checkIns.filter((c) => c.date === today);
  }

  submitCheckIn(): void {
    const now = new Date().toISOString();
    const date = now.slice(0, 10);
    const id = `energy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const checkIn: EnergyCheckIn = {
      id,
      date,
      timeOfDay: this.newCheckIn.timeOfDay,
      level: this.newCheckIn.level,
      note: this.newCheckIn.note || undefined,
      createdAt: now
    };
    const list = [...this.state.getEnergyCheckIns(), checkIn];
    this.state.setEnergyCheckIns(list);
    this.eventBus.dispatch({ type: 'energy_checkin', payload: checkIn });
    this.newCheckIn = { level: 'medium', timeOfDay: this.getCurrentTimeOfDay(), note: '' };
    this.refreshChart();
  }

  private refreshChart(): void {
    this.analytics.getEnergyTrend(14).subscribe((trend) => {
      this.energyChartData = {
        labels: trend.map((t) => t.date.slice(5)),
        datasets: [
          {
            label: 'Energy',
            data: trend.map((t) => t.average),
            borderColor: 'rgb(15, 118, 110)',
            backgroundColor: 'rgba(15, 118, 110, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      };
    });
  }
}
