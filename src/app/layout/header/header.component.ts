import { Component } from '@angular/core';
import { toDateKey } from '../../core/utils/date';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly now = new Date();
  readonly isoDate = toDateKey(this.now);
  readonly today = this.now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  readonly greeting = this.now.getHours() < 12 ? 'Good morning' : this.now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
}
