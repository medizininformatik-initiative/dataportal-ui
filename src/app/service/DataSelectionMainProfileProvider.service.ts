import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMainProfileProviderService {
  private readonly patientProfileSubject = new BehaviorSubject<DataSelectionProfile | null>(null)

  constructor() {}

  /**
   * Sets the patient profile.
   * @param {DataSelectionProfile} profile
   */
  public setPatientProfile(profile: DataSelectionProfile): void {
    this.patientProfileSubject.next(profile)
  }

  /**
   * Returns the patient profile as an observable.
   * @returns {Observable<DataSelectionProfile | null>}
   */
  public getPatientProfile$(): Observable<DataSelectionProfile | null> {
    return this.patientProfileSubject.asObservable()
  }

  /**
   * Returns the current patient profile.
   * @returns {DataSelectionProfile}
   */
  public getPatientProfileValue(): DataSelectionProfile {
    return this.patientProfileSubject.getValue()
  }
}
