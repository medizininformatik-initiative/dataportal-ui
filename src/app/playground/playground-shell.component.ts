import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

// The component menu lives in the app's side menu (core/constants/navigation.ts).
@Component({
  selector: 'num-playground-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
})
export class PlaygroundShellComponent {}
