import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { concatMap, filter, map, Observable, of, switchMap, take, tap } from 'rxjs'
import { UpgradeData } from '../core/model/Upgrade/UpgradeData'
import { ErrorLogModalComponent } from '../layout/components/error-log/error-log-modal.component'
import { CRTDLData } from '../model/Interface/CRTDLData'
import { UiCRTDL } from '../model/UiCRTDL'
import { CRTDL2UIModelService } from './Translator/CRTDL/CRTDL2UIModel.service'
import { TypeGuard } from './TypeGuard/TypeGuard'
import { ProfileUpgradeService } from './Upgrade/ProfileUpgrade.service'
import { CRTDLValidationService } from './Validation/External/CRTDLValidation.service'

@Injectable({ providedIn: 'root' })
export class CrtdlProcessingPipelineService {
  private readonly validationService = inject(CRTDLValidationService)
  private readonly profileUpgradeService = inject(ProfileUpgradeService)
  private readonly translatorService = inject(CRTDL2UIModelService)
  private readonly matDialog = inject(MatDialog)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * 1. Validates the CRTDL. If valid, proceeds to translation. If not valid, proceeds to upgrade.
   * 2. If upgrade is needed, attempts to upgrade the CRTDL and revalidates. If still not valid after upgrade, the process will fail.
   * 3. If valid (either initially or after upgrade), translates the CRTDL to UiCRTDL for use in the application.
   * @Todo needs to be discussed what to do if the cohort part fails as we that that from there on we can not upgrade anymore
   *  and also do not want to show the error log modal twice. Maybe we can pass some information to the modal to show different information or actions based on where the error came from.
   * @Todo discuss response of faled upgrade endpoint --> currently validation response
   * @param {CRTDLData} crtdl
   * @returns {Observable<UiCRTDL>}
   */
  public process(crtdl: CRTDLData): Observable<UiCRTDL> {
    return this.validationService.validate(crtdl, false).pipe(
      concatMap((isValid: boolean) => (isValid ? of(crtdl) : this.upgradeAndRevalidate(crtdl))),
      filter((result: boolean | CRTDLData) => result !== false), // Filter out failed upgrade/validation attempts
      concatMap((validCrtdl: true | CRTDLData) => this.translatorService.createCRTDLFromJson(validCrtdl as CRTDLData)),
      take(1)
    )
  }

  /**
   * Attempts to upgrade the CRTDL and revalidate it.
   * @param {CRTDLData} crtdl
   * @returns {Observable<CRTDLData | boolean>}
   */
  private upgradeAndRevalidate(crtdl: CRTDLData): Observable<CRTDLData | boolean> {
    return this.profileUpgradeService.upgrade(crtdl).pipe(
      filter((upgradeResult: boolean | UpgradeData) => upgradeResult !== false),
      switchMap((upgraded: true | UpgradeData) => {
        if (TypeGuard.isUpgradeData(upgraded)) {
          return this.validationService.validate(upgraded.crtdl).pipe(
            filter((isValid: boolean) => isValid),
            map(() => upgraded.crtdl)
          )
        } else {
          return of(false)
        }
      }),
      tap(() => this.openValidationReportModal())
    )
  }

  private openValidationReportModal(): void {
    this.matDialog.open(ErrorLogModalComponent)
  }
}
