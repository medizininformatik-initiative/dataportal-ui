import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconCellData } from 'src/app/shared/models/TableData/cells/IconCellData'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-icon-cell',
  templateUrl: './icon-cell.component.html',
  styleUrls: ['./icon-cell.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, MatTooltip, TranslateModule],
})
export class IconCellComponent implements OnInit {
  @Input()
  iconData: IconCellData

  @Input()
  color = 'black'

  @Output()
  iconClicked = new EventEmitter<void>()

  public onIconClick(): void {
    this.iconClicked.emit()
  }

  ngOnInit(): void {}
}
