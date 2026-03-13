import { Injectable } from '@angular/core';
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMainProfileProviderService {
  private patientProfileSubject = new BehaviorSubject<DataSelectionProfile | null>(null);

  constructor() {}

  public setPatientProfile(profile: DataSelectionProfile): void {
    this.patientProfileSubject.next(profile);
  }

  public getPatientProfile$(): Observable<DataSelectionProfile | null> {
    return this.patientProfileSubject.asObservable();
  }

  public getPatientProfileValue(): DataSelectionProfile {
    return this.patientProfileSubject.getValue();
  }
}
