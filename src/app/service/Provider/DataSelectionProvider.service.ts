import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service'
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs'
import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
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
      const currentProfiles = dataSelection.getProfiles()
      for (const profile of profiles) {
        this.upsertProfile(currentProfiles, profile)
      }
      this.commitDataSelection(currentProfiles, id)
    }
  }

  public setActiveProfile(profile: DataSelectionProfile, profileProvider?: 'ADD' | 'SET'): void {
    const id: string = this.activeDataSelection.getActiveDataSelectionId()
    this.setProfileInDataSelection(id, profile, profileProvider)
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
    }
  }

  public setProfileInDataSelection(
    dataSelectionId: string,
    profile: DataSelectionProfile,
    profileProvider?: 'ADD' | 'SET'
  ): void {
    const dataSelection = this.selectionMap.get(dataSelectionId)
    if (dataSelection) {
      const profiles = dataSelection.getProfiles()
      this.upsertProfile(profiles, profile)
      this.commitDataSelection(profiles, dataSelectionId)

      if (profileProvider === 'ADD') {
        this.profileProviderService.addOne(profile)
      }
      if (profileProvider === 'SET') {
        this.profileProviderService.setOne(profile)
      }
    }
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

  public resetSelectionMap(): void {
    this.selectionMapSubject.next(new Map())
  }

  public clearDataSelection(): void {
    const dataSelection: DataSelection = new DataSelection([], uuidv4())
    this.setDataSelection(dataSelection.getId(), dataSelection, true)
  }

  private resolveDuplicateLabel(
    profiles: DataSelectionProfile[],
    profile: DataSelectionProfile
  ): DataSelectionProfile {
    const sameProfiles = profiles.filter(
      (existingProfile) =>
        existingProfile.getLabel().getOriginal() === profile.getLabel().getOriginal()
    )

    if (sameProfiles.length > 0) {
      sameProfiles.sort((a, b) => b.getLabelNumber() - a.getLabelNumber())
      const newLabelNumber = sameProfiles[0].getLabelNumber() + 1
      profile.setLabelNumber(newLabelNumber)
    }
    return profile
  }
}
