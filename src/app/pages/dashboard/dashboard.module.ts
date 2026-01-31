import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, DashboardRoutingModule, NgChartsModule]
})
export class DashboardModule {}
