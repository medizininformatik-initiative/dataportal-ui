import { DatePipe } from '@angular/common'
import { Component, OnInit, inject, input, output } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'
import { InterfaceSavedQueryTile } from '../../models/SavedQueryTile/InterfaceSavedQueryTile'
import { ConfirmDeleteService } from '../../service/SavedQueryTile/ConfirmDelete.service'
import { ButtonComponent } from '../button/button.component'

@Component({
  selector: 'num-saved-query-tile',
  templateUrl: './saved-query-tile.component.html',
  styleUrls: ['./saved-query-tile.component.scss'],
  standalone: true,
  imports: [MatTooltip, ButtonComponent, FontAwesomeModule, DatePipe, TranslateModule, NumDataCyDirective],
})
export class SavedQueryTileComponent implements OnInit {
  private readonly confirmDeleteService = inject(ConfirmDeleteService)

  public readonly savedQuery = input<InterfaceSavedQueryTile>()

  public readonly deleteQuery = output<string>()

  public readonly navigate = output<string>()

  public readonly loadValidationReport = output<string>()

  public crtdlIsValid: boolean

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit() {
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
    this.confirmDeleteService.confirmDelete().subscribe((result: boolean) => {
      if (result) {
        this.deleteQuery.emit(id)
      }
    })
  }
}
