import { concatMap, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { CRTDL2UIModelService } from './Translator/CRTDL/CRTDL2UIModel.service';
import { CRTDLData } from '../model/Interface/CRTDLData';
import { CRTDLValidationService } from './Validation/CRTDLValidation.service';
import { ErrorLogModalComponent } from '../layout/components/error-log/error-log-modal.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileUpgradeService } from './Upgrade/ProfileUpgrade.service';
import { TypeGuard } from './TypeGuard/TypeGuard';
import { UiCRTDL } from '../model/UiCRTDL';

@Injectable({ providedIn: 'root' })
export class CrtdlProcessingPipelineService {
  constructor(
    private validationService: CRTDLValidationService,
    private profileUpgradeService: ProfileUpgradeService,
    private translatorService: CRTDL2UIModelService,
    private matDialog: MatDialog
  ) {}

  /**
   * 1. Validates the CRTDL. If valid, proceeds to translation. If not valid, proceeds to upgrade.
   * 2. If upgrade is needed, attempts to upgrade the CRTDL and revalidates. If still not valid after upgrade, the process will fail.
   * 3. If valid (either initially or after upgrade), translates the CRTDL to UiCRTDL for use in the application.
   * @Todo needs to be discussed what to do if the cohort part fails as we that that from there on we can not upgrade anymore
   *  and also do not want to show the error log modal twice. Maybe we can pass some information to the modal to show different information or actions based on where the error came from.
   * @Todo discuss response of faled upgrade endpoint --> currently validation response
   * @param crtdl
   * @returns
   */
  public process(crtdl: CRTDLData): Observable<UiCRTDL> {
    return this.validationService.validate(crtdl, false).pipe(
      concatMap((isValid) => (isValid ? of(crtdl) : this.upgradeAndRevalidate(crtdl))),
      filter((result) => result !== false), // Filter out failed upgrade/validation attempts
      concatMap((validCrtdl) =>
        this.translatorService.createCRTDLFromJson(validCrtdl as CRTDLData)
      ),
      take(1)
    );
  }

  /**
   * Attempts to upgrade the CRTDL and revalidate it.
   * @param crtdl
   * @returns
   */
  private upgradeAndRevalidate(crtdl: CRTDLData): Observable<CRTDLData | boolean> {
    return this.profileUpgradeService.upgrade(crtdl).pipe(
      filter((upgradeResult) => upgradeResult !== false),
      switchMap((upgraded) => {
        if (TypeGuard.isUpgradeData(upgraded)) {
          return this.validationService.validate(upgraded.crtdl).pipe(
            filter((isValid) => isValid),
            map(() => upgraded.crtdl)
          );
        } else {
          return of(false);
        }
      }),
      tap(() => this.openValidationReportModal())
    );
  }

  private openValidationReportModal(): void {
    this.matDialog.open(ErrorLogModalComponent);
  }
}
