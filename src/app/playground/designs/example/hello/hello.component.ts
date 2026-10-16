import { Component } from '@angular/core'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'

@Component({
  selector: 'num-design-example-hello',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <main class="page">
      <h1>Hello</h1>
      <p>A first design, built only from shared components.</p>
      <num-button type="green">Continue</num-button>
    </main>
  `,
  styles: `
    .page {
      padding: 1.5rem;
    }
  `,
})
export class HelloComponent {}
