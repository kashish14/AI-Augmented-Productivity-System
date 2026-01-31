import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SchedulingRoutingModule } from './scheduling-routing.module';
import { SchedulingViewComponent } from './scheduling-view/scheduling-view.component';

@NgModule({
  declarations: [SchedulingViewComponent],
  imports: [SharedModule, SchedulingRoutingModule]
})
export class SchedulingModule {}
