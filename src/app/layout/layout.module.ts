import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './shell/shell.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [ShellComponent, HeaderComponent, SidebarComponent],
  imports: [SharedModule, RouterModule],
  exports: [ShellComponent]
})
export class LayoutModule {}
