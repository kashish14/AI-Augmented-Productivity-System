import { Component } from '@angular/core';

interface NavItem {
  path: string;
  label: string;
  /** SVG path data (24x24 viewBox) */
  icon: string;
  shortcut: string;
}

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z', shortcut: 'd' },
    { path: '/tasks', label: 'Tasks', icon: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9', shortcut: 't' },
    { path: '/energy', label: 'Energy', icon: 'M13 2L4 14h7l-1 8 9-12h-7z', shortcut: 'e' },
    { path: '/scheduling', label: 'Scheduling', icon: 'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', shortcut: 's' },
    { path: '/reflection', label: 'Reflection', icon: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', shortcut: 'r' }
  ];
}
