import { Injectable } from '@angular/core'
import { CodeMessageData } from 'src/app/core/model/CodeMessageData'
import { AnnotationsData } from 'src/app/core/model/Upgrade/AnnotationsData'
import { FieldUpgradeData } from 'src/app/core/model/Upgrade/Field/FieldUpgradeData'
import { ProfileFieldUpgradeData } from 'src/app/core/model/Upgrade/Field/ProfileFieldUpgradeData'
import { ProfileFilterUpgradeData } from 'src/app/core/model/Upgrade/Filter/ProfileFilterUpgradeData'
import { ProfileRemovedData } from 'src/app/core/model/Upgrade/Profile/ProfileRemovedData'
import { ProfileUpgradeData } from 'src/app/core/model/Upgrade/Profile/ProfileUpgradeData'
import { ProfileFieldRemoved } from 'src/app/model/Upgrade/ProfileFieldRemoved'
import { ProfileFieldChange } from 'src/app/model/Upgrade/ProfileFieldUpgrade'
import { ProfileFilterChange } from 'src/app/model/Upgrade/ProfileFilterChange'
import { ProfileRemoved } from 'src/app/model/Upgrade/ProfileRemoved'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { TypeGuard } from '../TypeGuard/TypeGuard'

@Injectable({
  providedIn: 'root',
})
export class ProfileUpgradeMapperService {
  constructor() {}

  /**
   * Maps the given annotation data to an Upgrade instance. The mapping is based on the type of details present in the annotation data.
   * @param {AnnotationsData} annotationData
   * @returns {ProfileUpgrade}
   */
  public mapToUpgrade(annotationData: AnnotationsData): ProfileUpgrade {
    const upgradeInstance = this.createUpgradeInstance(annotationData.value, annotationData.path)
    if (TypeGuard.isProfileUpgradeData(annotationData.details)) {
      this.applyProfileUpgrade(upgradeInstance, annotationData.details)
    } else if (TypeGuard.isProfileFieldUpgradeData(annotationData.details)) {
      this.applyProfileFieldUpgrade(upgradeInstance, annotationData.details)
    } else if (TypeGuard.isProfileFilterUpgradeData(annotationData.details)) {
      this.applyProfileFilterUpgrade(upgradeInstance, annotationData.details)
    }
    return upgradeInstance
  }

  /**
   * Applies a profile upgrade to the given upgrade instance.
   * Currently, it only handles profile removals
   * @param {ProfileUpgrade} upgradeInstance
   * @param {ProfileUpgradeData} details
   */
  private applyProfileUpgrade(upgradeInstance: ProfileUpgrade, details: ProfileUpgradeData): void {
    const replaced: ProfileRemovedData = details?.replaced
    if (TypeGuard.isProfileRemovedData(replaced)) {
      upgradeInstance.setProfileRemoved(new ProfileRemoved(replaced.name))
    }
  }

  /**
   * Returns a ProfileFieldUpgrade or ProfileFieldRemoved instance based on the presence of replacedWith or replaced in the details.
   * @param {ProfileUpgrade} upgradeInstance
   * @param {ProfileFieldUpgradeData} details
   */
  private applyProfileFieldUpgrade(upgradeInstance: ProfileUpgrade, details: ProfileFieldUpgradeData): void {
    const replacedWith: FieldUpgradeData = details?.replacedWith
    const replaced: FieldUpgradeData = details.replaced
    if (replacedWith) {
      upgradeInstance.setProfileFieldChange(ProfileFieldChange.fromJson(details))
    } else if (replaced) {
      upgradeInstance.setProfileFieldRemoved(ProfileFieldRemoved.fromJson(details))
    }
  }

  private applyProfileFilterUpgrade(upgradeInstance: ProfileUpgrade, details: ProfileFilterUpgradeData): void {
    upgradeInstance.setProfileFilterChange(new ProfileFilterChange())
  }

  /**
   * Creates an instance of Upgrade.
   * @param {CodeMessageData} value
   * @param {string} path
   * @returns {ProfileUpgrade}
   */
  private createUpgradeInstance(value: CodeMessageData, path: string): ProfileUpgrade {
    return new ProfileUpgrade(value.code, value.message, path)
  }
}
