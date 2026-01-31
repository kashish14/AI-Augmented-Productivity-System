import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReflectionViewComponent } from './reflection-view/reflection-view.component';

const routes: Routes = [{ path: '', component: ReflectionViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReflectionRoutingModule {}
