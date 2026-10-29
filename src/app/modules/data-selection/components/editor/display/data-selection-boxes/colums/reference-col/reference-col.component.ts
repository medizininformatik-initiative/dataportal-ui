import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component'
import { InfoTooltipDirective } from 'src/app/shared/directives/info-tooltip.directive'

@Component({
  selector: 'num-reference-col',
  templateUrl: './reference-col.component.html',
  styleUrls: ['./reference-col.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent, InfoTooltipDirective, TranslateModule],
})
export class ReferenceColComponent {
  public readonly reference = input.required<ProfileReference>()
  public readonly isEditable = input<boolean>(false)
  public readonly isReferenceSetChange = output<boolean>()
}
