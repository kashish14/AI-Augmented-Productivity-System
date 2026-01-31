import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ReflectionRoutingModule } from './reflection-routing.module';
import { ReflectionViewComponent } from './reflection-view/reflection-view.component';

@NgModule({
  declarations: [ReflectionViewComponent],
  imports: [SharedModule, FormsModule, ReflectionRoutingModule]
})
export class ReflectionModule {}
