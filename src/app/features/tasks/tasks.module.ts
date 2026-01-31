import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskListComponent } from './task-list/task-list.component';

@NgModule({
  declarations: [TaskListComponent],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, TasksRoutingModule]
})
export class TasksModule {}
