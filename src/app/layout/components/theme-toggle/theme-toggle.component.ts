import { Component, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { NumDataCyDirective } from '../../../shared/directives/num-data-cy.directive'

const STORAGE_KEY = 'theme'

@Component({
  selector: 'num-theme-toggle',
  standalone: true,
  imports: [NumDataCyDirective],
  template: `
    <button
      type="button"
      class="theme-toggle"
      numDataCy="theme-toggle"
      [attr.aria-pressed]="dark"
      [attr.aria-label]="translate.currentLang === 'en' ? 'Dark mode' : 'Dunkelmodus'"
      (click)="toggle()"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  `,
  styles: `
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 0;
      border-radius: var(--border-radius-sm);
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .theme-toggle[aria-pressed='true'] {
      background: var(--color-accent-bg-strong);
    }
    .theme-toggle:focus-visible {
      outline: var(--focus-ring-width) solid var(--num-color--accent-900);
      outline-offset: var(--focus-ring-offset);
    }
  `,
})
export class ThemeToggleComponent {
  translate = inject(TranslateService)

  dark = document.documentElement.dataset['theme'] === 'dark'

  toggle() {
    const root = document.documentElement
    // no transitions during the switch, otherwise every color fades from light to dark
    root.classList.add('theme-switching')
    this.dark = !this.dark
    root.dataset['theme'] = this.dark ? 'dark' : 'light'
    try {
      localStorage.setItem(STORAGE_KEY, root.dataset['theme'])
    } catch {
      // storage blocked: the theme still applies for this page view
    }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove('theme-switching'))
    )
  }
}
