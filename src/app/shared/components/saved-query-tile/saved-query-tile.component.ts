import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDeleteService } from '../../service/SavedQueryTile/ConfirmDelete.service';
import { InterfaceSavedQueryTile } from '../../models/SavedQueryTile/InterfaceSavedQueryTile';

@Component({
  selector: 'num-saved-query-tile',
  templateUrl: './saved-query-tile.component.html',
  styleUrls: ['./saved-query-tile.component.scss'],
})
export class SavedQueryTileComponent implements OnInit {
  @Input()
  savedQuery: InterfaceSavedQueryTile;

  @Output()
  deleteQuery = new EventEmitter<string>();

  @Output()
  navigate = new EventEmitter<string>();

  @Output()
  loadValidationReport = new EventEmitter<string>();

  crtdlIsValid: boolean;

  constructor(private confirmDeleteService: ConfirmDeleteService) {}

  ngOnInit() {
    this.isValidAndExists();
  }

  public onNavigate(id: string) {
    this.navigate.emit(id);
  }

  public onLoadValidationReport(id: string) {
    this.loadValidationReport.emit(id);
  }

  public isValidAndExists() {
    this.crtdlIsValid =
      this.savedQuery.ccdl.exists &&
      this.savedQuery.ccdl.isValid &&
      this.savedQuery.dataExtraction.exists &&
      this.savedQuery.dataExtraction.isValid;
  }

  public onDelete(id: string) {
    this.confirmDeleteService.confirmDelete().subscribe((result) => {
      if (result) {
        this.deleteQuery.emit(id);
      }
    });
  }
}
