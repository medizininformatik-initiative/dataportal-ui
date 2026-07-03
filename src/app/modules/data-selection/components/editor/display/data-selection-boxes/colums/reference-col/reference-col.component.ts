import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component'
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { InfoTooltipDirective } from 'src/app/shared/directives/info-tooltip.directive'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-reference-col',
  templateUrl: './reference-col.component.html',
  styleUrls: ['./reference-col.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent, InfoTooltipDirective, TranslateModule],
})
export class ReferenceColComponent {
  readonly reference = input.required<ProfileReference>()
  readonly isEditable = input<boolean>(false)
  readonly isReferenceSetChange = output<boolean>()
}
