import { Component } from '@angular/core';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  shortcut: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', shortcut: 'd' },
    { path: '/tasks', label: 'Tasks', icon: 'task', shortcut: 't' },
    { path: '/energy', label: 'Energy', icon: 'energy', shortcut: 'e' },
    { path: '/scheduling', label: 'Scheduling', icon: 'schedule', shortcut: 's' },
    { path: '/reflection', label: 'Reflection', icon: 'reflect', shortcut: 'r' }
  ];
}
