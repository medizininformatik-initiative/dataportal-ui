import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service'
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs'
import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Injectable, inject } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
import { ProfileProviderService } from './ProfileProvider.service'
@Injectable({
  providedIn: 'root',
})
export class DataSelectionProviderService {
  private activeDataSelection = inject(ActiveDataSelectionService)
  private profileProviderService = inject(ProfileProviderService)

  private selectionMap: Map<string, DataSelection> = new Map()
  private selectionMapSubject: BehaviorSubject<Map<string, DataSelection>> = new BehaviorSubject(
    new Map()
  )

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public initDataSelection(mainProfile: DataSelectionProfile): Observable<boolean> {
    const dataSelection: DataSelection = new DataSelection([], uuidv4())
    this.setDataSelection(dataSelection.getId(), dataSelection)
    this.activeDataSelection.setActiveDataSelectionID(dataSelection.getId())
    dataSelection.setProfiles([mainProfile])
    this.profileProviderService.setOne(mainProfile)
    return of(true)
  }

  public getDataSelection(id: string): Observable<DataSelection> {
    return this.selectionMapSubject.pipe(map((selections) => selections.get(id)))
  }

  public getActiveDataSelection(): Observable<DataSelection> {
    return this.activeDataSelection
      .getActiveDataSelectionIdObservable()
      .pipe(
        switchMap((id) => this.selectionMapSubject.pipe(map((selections) => selections.get(id))))
      )
  }

  public getActiveProfiles(): Observable<DataSelectionProfile[]> {
    return this.getActiveDataSelection().pipe(map((ds) => ds.getProfiles()))
  }

  public setActiveProfiles(profiles: DataSelectionProfile[]): void {
    const id: string = this.activeDataSelection.getActiveDataSelectionId()
    const dataSelection = this.selectionMap.get(id)
    if (dataSelection) {
      const currentProfiles = [...dataSelection.getProfiles()]
      for (const profile of profiles) {
        this.upsertProfile(currentProfiles, profile)
      }
      this.commitDataSelection(currentProfiles, id)
      this.profileProviderService.setMany(profiles)
    }
  }

  public setActiveProfile(profile: DataSelectionProfile): void {
    const id: string = this.activeDataSelection.getActiveDataSelectionId()
    this.setProfileInDataSelection(id, profile)
  }

  public setDataSelection(
    id: string,
    dataSelection: DataSelection,
    setAsActive: boolean = false
  ): void {
    this.selectionMap.set(id, dataSelection)
    this.selectionMapSubject.next(new Map(this.selectionMap))
    if (setAsActive) {
      this.activeDataSelection.setActiveDataSelectionID(id)
    }
  }

  public removeDataSelection(uid: string): void {
    if (this.selectionMap.has(uid)) {
      this.selectionMap.delete(uid)
      this.selectionMapSubject.next(new Map(this.selectionMap))
    }
  }

  public removeProfileFromDataSelection(dataSelectionId: string, profileId: string): void {
    const dataSelection = this.selectionMap.get(dataSelectionId)

    if (dataSelection) {
      const updatedElements = dataSelection
        .getProfiles()
        .filter((profile: DataSelectionProfile) => profile.getId() !== profileId)
      this.commitDataSelection(updatedElements, dataSelectionId)
      this.profileProviderService.removeOne(profileId)
    }
  }

  /**
   * Upserts the profile into the data selection and the ProfileProviderService, so both stores
   * always hold the same instance. A new array is committed so signal consumers see the change.
   */
  public setProfileInDataSelection(dataSelectionId: string, profile: DataSelectionProfile): void {
    const dataSelection = this.selectionMap.get(dataSelectionId)
    if (dataSelection) {
      const profiles = [...dataSelection.getProfiles()]
      this.upsertProfile(profiles, profile)
      this.commitDataSelection(profiles, dataSelectionId)
      this.profileProviderService.setOne(profile)
    }
  }

  /**
   * Clears "only if referenced" on the given profiles when no profile links them anymore.
   * Call with the ids that just lost a link; the option is hidden then and could not be unset.
   */
  public resetUnlinkedReferences(profileIds: string[]): void {
    const dataSelection = this.selectionMap.get(this.activeDataSelection.getActiveDataSelectionId())
    if (!dataSelection) return
    const profiles = dataSelection.getProfiles()
    const linkedIds = new Set(
      profiles
        .map((profile) => profile.getProfileFields().getLinkedProfileIds())
        .reduce((acc, ids) => acc.concat(ids), [])
    )
    profiles
      .filter(
        (profile) =>
          profileIds.includes(profile.getId()) &&
          !linkedIds.has(profile.getId()) &&
          profile.getReference().getIsReferenceSet()
      )
      .forEach((profile) => {
        const cloned = DataSelectionProfileCloner.deepCopyProfile(profile)
        cloned.getReference().setIsReferenceSet(false)
        this.setActiveProfile(cloned)
      })
  }

  private upsertProfile(profiles: DataSelectionProfile[], profile: DataSelectionProfile): void {
    const index = profiles.findIndex((existing) => existing.getId() === profile.getId())
    if (index !== -1) {
      profiles[index] = profile
    } else {
      profiles.push(this.resolveDuplicateLabel(profiles, profile))
    }
  }

  private commitDataSelection(updatedElements: DataSelectionProfile[], dataSelectionId: string) {
    const updatedDataSelection = new DataSelection(updatedElements, dataSelectionId)
    this.setDataSelection(updatedDataSelection.getId(), updatedDataSelection, true)
  }

  public reorderProfiles(profiles: DataSelectionProfile[]): void {
    const id = this.activeDataSelection.getActiveDataSelectionId()
    const updatedDataSelection = new DataSelection(profiles, id)
    this.setDataSelection(updatedDataSelection.getId(), updatedDataSelection, true)
  }

  public clearDataSelection(): void {
    const dataSelection: DataSelection = new DataSelection([], uuidv4())
    this.setDataSelection(dataSelection.getId(), dataSelection, true)
  }

  private resolveDuplicateLabel(
    profiles: DataSelectionProfile[],
    profile: DataSelectionProfile
  ): DataSelectionProfile {
    const texts = profile.getLabel().getTexts()
    const sameProfiles = profiles.filter(
      (existingProfile) =>
        existingProfile.getId() !== profile.getId() &&
        existingProfile
          .getLabel()
          .getTexts()
          .some((text) => texts.includes(text))
    )
    if (sameProfiles.length > 0) {
      sameProfiles.sort((a, b) => b.getLabelNumber() - a.getLabelNumber())
      const newLabelNumber = sameProfiles[0].getLabelNumber() + 1
      profile.setLabelNumber(newLabelNumber)
    }
    return profile
  }
}
