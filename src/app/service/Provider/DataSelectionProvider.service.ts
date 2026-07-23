import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service'
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs'
import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Injectable, inject } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
@Injectable({
  providedIn: 'root',
})
export class DataSelectionProviderService {
  private activeDataSelection = inject(ActiveDataSelectionService)

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

  /**
   * Convenence method to set multiple profiles in the active data selection.
   * @param profiles
   */
  public setProfilesInActiveDataSelection(profiles: DataSelectionProfile[]): void {
    profiles.map((profile: DataSelectionProfile) => this.setProfileInActiveDataSelection(profile))
  }

  /**
   * Method to set multiple profiles in the active data selection.
   * @param profiles
   */
  public setProfileInActiveDataSelection(profile: DataSelectionProfile): void {
    const id: string = this.activeDataSelection.getActiveDataSelectionId()
    this.setProfileInDataSelection(id, profile)
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

  public setProfileInDataSelection(dataSelectionId: string, profile: DataSelectionProfile): void {
    const dataSelection = this.dataSelectionUIDMap.get(dataSelectionId)
    if (dataSelection) {
      const profiles = dataSelection.getProfiles()
      const index = profiles.findIndex(
        (existingProfile) => existingProfile.getId() === profile.getId()
      )
      if (index !== -1) {
        profiles[index] = profile
      } else {
        profiles.push(profile)
      }
      this.createDataSelectionInstanceAndSetMap(profiles, dataSelectionId)
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
}
