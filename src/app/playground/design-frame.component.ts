import { Component, signal } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

const VIEWPORTS = [
  { label: 'Mobile', width: '22.5rem' },
  { label: 'Tablet', width: '48rem' },
  { label: 'Desktop', width: '100%' },
]

// ponytail: this narrows the container only, media queries still follow the browser window.
// Use the browser's responsive mode to test breakpoints, or switch to an iframe if that matters.
@Component({
  selector: 'num-design-frame',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="bar" aria-label="Playground">
      <a routerLink="/playground">All designs</a>
      @for (v of viewports; track v.label) {
      <button type="button" [attr.aria-pressed]="width() === v.width" (click)="width.set(v.width)">
        {{ v.label }}
      </button>
      }
    </nav>
    <div class="stage" [style.max-width]="width()"><router-outlet /></div>
  `,
  styles: `
    .bar {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0.5rem 1.5rem;
    }
    .stage {
      margin: 0 auto;
    }
  `,
})
export class DesignFrameComponent {
  readonly viewports = VIEWPORTS
  readonly width = signal('100%')
}
