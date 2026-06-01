import { Component, OnInit, inject, input, output } from '@angular/core'
import { ConfirmDeleteService } from '../../service/SavedQueryTile/ConfirmDelete.service'
import { InterfaceSavedQueryTile } from '../../models/SavedQueryTile/InterfaceSavedQueryTile'
import { MatTooltip } from '@angular/material/tooltip'
import { ButtonComponent } from '../button/button.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { DatePipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-saved-query-tile',
  templateUrl: './saved-query-tile.component.html',
  styleUrls: ['./saved-query-tile.component.scss'],
  standalone: true,
  imports: [MatTooltip, ButtonComponent, FontAwesomeModule, DatePipe, TranslateModule],
})
export class SavedQueryTileComponent implements OnInit {
  private confirmDeleteService = inject(ConfirmDeleteService)

  readonly savedQuery = input<InterfaceSavedQueryTile>()

  readonly deleteQuery = output<string>()

  readonly navigate = output<string>()

  readonly loadValidationReport = output<string>()

  crtdlIsValid: boolean

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.isValidAndExists()
  }

  public onNavigate(id: string) {
    this.navigate.emit(id)
  }

  public onLoadValidationReport(id: string) {
    this.loadValidationReport.emit(id)
  }

  public isValidAndExists() {
    this.crtdlIsValid =
      this.savedQuery().ccdl.exists &&
      this.savedQuery().ccdl.isValid &&
      this.savedQuery().dataExtraction.exists &&
      this.savedQuery().dataExtraction.isValid
  }

  public onDelete(id: string) {
    this.confirmDeleteService.confirmDelete().subscribe((result) => {
      if (result) {
        this.deleteQuery.emit(id)
      }
    })
  }
}
