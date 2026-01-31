import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeedService } from './core/services/seed.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private static readonly SHORTCUTS: Record<string, string> = {
    d: '/dashboard',
    t: '/tasks',
    e: '/energy',
    s: '/scheduling',
    r: '/reflection'
  };

  constructor(
    private router: Router,
    private seed: SeedService
  ) {}

  ngOnInit(): void {
    this.seed.seedIfEmpty();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key?.toLowerCase();
    if (!key || !AppComponent.SHORTCUTS[key]) return;
    const target = event.target as HTMLElement;
    if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return;
    event.preventDefault();
    this.router.navigateByUrl(AppComponent.SHORTCUTS[key]);
  }
}
