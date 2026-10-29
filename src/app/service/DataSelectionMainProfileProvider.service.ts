import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMainProfileProviderService {
  private readonly patientProfileSubject = new BehaviorSubject<DataSelectionProfile | null>(null)

  constructor() {}

  public setPatientProfile(profile: DataSelectionProfile): void {
    this.patientProfileSubject.next(profile)
  }

  public getPatientProfile$(): Observable<DataSelectionProfile | null> {
    return this.patientProfileSubject.asObservable()
  }

  public getPatientProfileValue(): DataSelectionProfile {
    return this.patientProfileSubject.getValue()
  }
}
