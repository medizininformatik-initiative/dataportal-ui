import { Component, OnInit, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class InfoTileComponent implements OnInit {
  readonly value = input('')
  readonly label = input<string>(undefined)
  readonly color = input<'default' | 'red'>('default')

  constructor() {}

  ngOnInit(): void {}
}
