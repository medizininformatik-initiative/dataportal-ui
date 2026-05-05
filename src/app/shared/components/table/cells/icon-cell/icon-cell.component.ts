import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconCellData } from 'src/app/shared/models/TableData/cells/IconCellData';

@Component({
  selector: 'num-icon-cell',
  templateUrl: './icon-cell.component.html',
  styleUrls: ['./icon-cell.component.scss'],
})
export class IconCellComponent implements OnInit {
  @Input()
  iconData: IconCellData;

  @Input()
  color = 'black';

  @Output()
  iconClicked = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClicked.emit();
  }

  ngOnInit(): void {}
}
