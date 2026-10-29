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
  public readonly checked = input(false)
  public readonly disabled = input(false)
  public readonly checkedChange = output<boolean>()

  public toggle(event: MouseEvent): void {
    event.stopPropagation()
    if (!this.disabled()) {
      this.checkedChange.emit(!this.checked())
    }
  }
}
