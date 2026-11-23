import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { EnergyRoutingModule } from './energy-routing.module';
import { EnergyDashboardComponent } from './energy-dashboard/energy-dashboard.component';

@NgModule({
  declarations: [EnergyDashboardComponent],
  imports: [SharedModule, FormsModule, BaseChartDirective, EnergyRoutingModule],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class EnergyModule {}
