import { Component, Input, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class InfoTileComponent implements OnInit {
  @Input() value = ''
  @Input() label: string
  @Input() color: 'default' | 'red' = 'default'

  constructor() {}

  ngOnInit(): void {}
}
