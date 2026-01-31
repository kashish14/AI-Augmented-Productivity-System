import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulingViewComponent } from './scheduling-view/scheduling-view.component';

const routes: Routes = [{ path: '', component: SchedulingViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingRoutingModule {}
