import { Component, input } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

@Component({
  selector: 'num-placeholder-box',
  templateUrl: './placeholder-box.component.html',
  styleUrls: ['./placeholder-box.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule],
})
export class PlaceholderBoxComponent {
  icon = input<IconProp>('folder-open')
}
