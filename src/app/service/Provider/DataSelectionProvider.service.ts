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

  private dataSelectionUIDMap: Map<string, DataSelection> = new Map()
  private dataSelectionUIDMapSubject: BehaviorSubject<Map<string, DataSelection>> =
    new BehaviorSubject(new Map())

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public initializeDataSelectionInstance(mainProfile: DataSelectionProfile): Observable<boolean> {
    const dataSelection: DataSelection = new DataSelection([], uuidv4())
    this.setDataSelectionByUID(dataSelection.getId(), dataSelection)
    this.activeDataSelection.setActiveDataSelectionID(dataSelection.getId())
    dataSelection.setProfiles([mainProfile])
    this.profileProviderService.setOne(mainProfile)
    return of(true)
  }

  public getDataSelectionByUID(id: string): Observable<DataSelection> {
    return this.dataSelectionUIDMapSubject.pipe(
      map((dataSelectionUIDMap) => dataSelectionUIDMap.get(id))
    )
  }

  public getActiveDataSelection(): Observable<DataSelection> {
    return this.activeDataSelection
      .getActiveDataSelectionIdObservable()
      .pipe(
        switchMap((id) =>
          this.dataSelectionUIDMapSubject.pipe(
            map((dataSelectionUIDMap) => dataSelectionUIDMap.get(id))
          )
        )
      )
  }

  public getProfilesFromActiveDataSelection(): Observable<DataSelectionProfile[]> {
    return this.activeDataSelection
      .getActiveDataSelectionIdObservable()
      .pipe(
        switchMap((id) =>
          this.dataSelectionUIDMapSubject.pipe(
            map((dataSelectionUIDMap) => dataSelectionUIDMap.get(id).getProfiles())
          )
        )
      )
  }

  public setProfilesInActiveDataSelection(profiles: DataSelectionProfile[]): void {
    const id: string = this.activeDataSelection.getActiveDataSelectionId()
    const dataSelection = this.dataSelectionUIDMap.get(id)
    if (dataSelection) {
      const currentProfiles = dataSelection.getProfiles()
      for (const profile of profiles) {
        const index = currentProfiles.findIndex((existing) => existing.getId() === profile.getId())
        if (index !== -1) {
          currentProfiles[index] = profile
        } else {
          currentProfiles.push(this.testForSameLabel(currentProfiles, profile))
        }
      }
      this.createDataSelectionInstanceAndSetMap(currentProfiles, id)
    }
  }

  /**
   * Method to set multiple profiles in the active data selection.
   * @param profile
   * @param profileProvider
   */
  public setProfileInActiveDataSelection(
    profile: DataSelectionProfile,
    profileProvider?: 'ADD' | 'SET'
  ): void {
    const id: string = this.activeDataSelection.getActiveDataSelectionId()
    this.setProfileInDataSelection(id, profile, profileProvider)
  }

  public setDataSelectionByUID(
    id: string,
    dataSelection: DataSelection,
    setAsActive: boolean = false
  ): void {
    this.dataSelectionUIDMap.set(id, dataSelection)
    this.dataSelectionUIDMapSubject.next(new Map(this.dataSelectionUIDMap))
    if (setAsActive) {
      this.activeDataSelection.setActiveDataSelectionID(id)
    }
  }

  public removeDataSelectionByUID(uid: string): void {
    if (this.dataSelectionUIDMap.has(uid)) {
      this.dataSelectionUIDMap.delete(uid)
      this.dataSelectionUIDMapSubject.next(new Map(this.dataSelectionUIDMap))
    }
  }

  public removeProfileFromDataSelection(dataSelectionId: string, profileId: string): void {
    const dataSelection = this.dataSelectionUIDMap.get(dataSelectionId)

    if (dataSelection) {
      const updatedElements = dataSelection
        .getProfiles()
        .filter((profile: DataSelectionProfile) => profile.getId() !== profileId)
      this.createDataSelectionInstanceAndSetMap(updatedElements, dataSelectionId)
    }
  }

  public setProfileInDataSelection(
    dataSelectionId: string,
    profile: DataSelectionProfile,
    profileProvider?: 'ADD' | 'SET'
  ): void {
    const dataSelection = this.dataSelectionUIDMap.get(dataSelectionId)
    if (dataSelection) {
      const profiles = dataSelection.getProfiles()
      const index = profiles.findIndex(
        (existingProfile) => existingProfile.getId() === profile.getId()
      )
      if (index !== -1) {
        profiles[index] = profile
      } else {
        profiles.push(this.testForSameLabel(profiles, profile))
      }
      this.createDataSelectionInstanceAndSetMap(profiles, dataSelectionId)

      if (profileProvider === 'ADD') {
        this.profileProviderService.addOne(profile)
      }
      if (profileProvider === 'SET') {
        this.profileProviderService.setOne(profile)
      }
    }
  }

  private createDataSelectionInstanceAndSetMap(
    updatedElements: DataSelectionProfile[],
    dataSelectionId: string
  ) {
    const updatedDataSelection = new DataSelection(updatedElements, dataSelectionId)
    this.setDataSelectionByUID(updatedDataSelection.getId(), updatedDataSelection, true)
  }

  public resetDataSelectionMap(): void {
    this.dataSelectionUIDMapSubject.next(new Map())
  }

  public clearDataSelection(): void {
    const dataSelection: DataSelection = new DataSelection([], uuidv4())
    this.setDataSelectionByUID(dataSelection.getId(), dataSelection, true)
    this.activeDataSelection.setActiveDataSelectionID(dataSelection.getId())
  }

  private testForSameLabel(
    profiles: DataSelectionProfile[],
    profile: DataSelectionProfile
  ): DataSelectionProfile {
    const sameProfiles = profiles.filter(
      (existingProfile) =>
        existingProfile.getLabel().getOriginal() === profile.getLabel().getOriginal()
    )

    if (sameProfiles.length > 0) {
      sameProfiles.sort(function (a, b) {
        return b.getLabelNumber() - a.getLabelNumber()
      })
      const newLabelNumber = sameProfiles[0].getLabelNumber() + 1
      profile.setLabelNumber(newLabelNumber)
    }
    return profile
  }
}
