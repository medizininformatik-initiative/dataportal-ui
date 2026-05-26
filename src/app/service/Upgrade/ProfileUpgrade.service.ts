// crtdl-upgrade-pipeline.service.ts

import { Injectable, inject } from '@angular/core'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { UpgradeApiService } from '../Backend/Api/UpgradeApi.service'
import { ProfileUpgradeMapperService } from './ProfileUpgradeMapper.service'
import { ErrorLogProviderService } from '../Validation/ErrorLogProvider.service'
import { catchError, filter, map, Observable, of, tap, throwError } from 'rxjs'
import { AnnotationsData } from 'src/app/core/model/Upgrade/AnnotationsData'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { UpgradeData } from 'src/app/core/model/Upgrade/UpgradeData'
import { DataportalErrorData } from 'src/app/core/model/DataportalErrorData'
import { CRTDLValidationService } from '../Validation/CRTDLValidation.service'

// Handles: remote upgrade call + mapping + error log
@Injectable({ providedIn: 'root' })
export class ProfileUpgradeService {
  private upgradeApiService = inject(UpgradeApiService)
  private upgradeMapper = inject(ProfileUpgradeMapperService)
  private errorLogProvider = inject(ErrorLogProviderService)
  private cRTDLValidationService = inject(CRTDLValidationService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public upgrade(crtdl: CRTDLData): Observable<UpgradeData | boolean> {
    return this.upgradeApiService.upgradeCRTDL(crtdl).pipe(
      filter((response) => !!response.body),
      tap((response) => {
        const profileUpgrades = this.mapUpgrades(response.body.annotations)
        this.errorLogProvider.setUpgradeData(response.body)
        this.errorLogProvider.setProfileUpgrade(profileUpgrades)
      }),
      map((response) => response.body),
      catchError((error: DataportalErrorData) =>
        this.cRTDLValidationService.handleValidationError(error)
      )
    )
  }

  private mapUpgrades(upgradeData: AnnotationsData[]): ProfileUpgrade[] {
    return upgradeData.map((annotation) => this.upgradeMapper.mapToUpgrade(annotation))
  }
}
