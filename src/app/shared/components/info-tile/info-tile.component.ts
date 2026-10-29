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
  public readonly value = input('')
  public readonly label = input<string>(undefined)
  public readonly color = input<'default' | 'red'>('default')

  constructor() {}

  public ngOnInit(): void {}
}
