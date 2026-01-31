import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks.module').then((m) => m.TasksModule)
  },
  {
    path: 'energy',
    loadChildren: () =>
      import('./features/energy/energy.module').then((m) => m.EnergyModule)
  },
  {
    path: 'scheduling',
    loadChildren: () =>
      import('./features/scheduling/scheduling.module').then((m) => m.SchedulingModule)
  },
  {
    path: 'reflection',
    loadChildren: () =>
      import('./features/reflection/reflection.module').then((m) => m.ReflectionModule)
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
