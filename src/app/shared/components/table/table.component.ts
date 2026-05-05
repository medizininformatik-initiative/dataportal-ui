import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TableBodyComponent } from './table-body/table-body.component';
import { TableData } from 'src/app/shared/models/TableData/TableData';
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData';
import { TableRowData } from '../../models/TableData/TableRowData';

@Component({
  selector: 'num-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() tableData: TableData;

  @Output() selectedRow = new EventEmitter<TableRowData>();
  @Output() rowClicked = new EventEmitter<TableRowData>();
  @Output() iconClicked = new EventEmitter<TableRowData>();

  public unselectCheckbox(ids: string[]): void {
    ids.forEach((id) => {
      const foundRow = this.tableData?.body?.rows?.find((row) => row.id === id);
      if (foundRow) {
        const checkboxCell = foundRow.cells.find(
          (c): c is CheckboxTextCellData => c.type === 'checkboxText'
        );
        if (checkboxCell) {
          checkboxCell.isSelected = false;
        }
      }
    });
  }
}
