// crtdl-upgrade-pipeline.service.ts

import { Injectable, inject } from '@angular/core'
import { catchError, filter, map, Observable, of, tap, throwError } from 'rxjs'
import { DataportalErrorData } from 'src/app/core/model/DataportalErrorData'
import { AnnotationsData } from 'src/app/core/model/Upgrade/AnnotationsData'
import { UpgradeData } from 'src/app/core/model/Upgrade/UpgradeData'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { UpgradeApiService } from '../Backend/Api/UpgradeApi.service'
import { CRTDLValidationService } from '../Validation/External/CRTDLValidation.service'
import { ErrorLogProviderService } from '../Validation/External/ErrorLogProvider.service'
import { ProfileUpgradeMapperService } from './ProfileUpgradeMapper.service'

// Handles: remote upgrade call + mapping + error log
@Injectable({ providedIn: 'root' })
export class ProfileUpgradeService {
  private readonly upgradeApiService = inject(UpgradeApiService)
  private readonly upgradeMapper = inject(ProfileUpgradeMapperService)
  private readonly errorLogProvider = inject(ErrorLogProviderService)
  private readonly cRTDLValidationService = inject(CRTDLValidationService)

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
      catchError((error: DataportalErrorData) => this.cRTDLValidationService.handleValidationError(error))
    )
  }

  private mapUpgrades(upgradeData: AnnotationsData[]): ProfileUpgrade[] {
    return upgradeData.map((annotation) => this.upgradeMapper.mapToUpgrade(annotation))
  }
}
