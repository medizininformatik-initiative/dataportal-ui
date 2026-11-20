import { Component, input, output } from '@angular/core'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'

@Component({
  selector: 'num-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
  imports: [NumDataCyDirective],
})
export class CheckboxComponent {
  readonly checked = input(false)
  readonly disabled = input(false)
  readonly tabbable = input(true)
  readonly label = input<string>()
  readonly checkedChange = output<boolean>()
}
