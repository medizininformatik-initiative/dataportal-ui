import { DataSelection } from '../../model/DataSelection/DataSelection';
import { DataSelection2DataExtraction } from '../Translator/CRTDL/DataSelection2DataExtraction.service';
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service';
import { Injectable } from '@angular/core';
import { TypeGuard } from '../TypeGuard/TypeGuard';
import { CRTDLData } from '../../model/Interface/CRTDLData';

@Injectable({
  providedIn: 'root',
})
export class CheckAndUpgradeCCDLService {
  constructor(
    private dataSelection2DataExtraction: DataSelection2DataExtraction,
    private dataSelectionMainProfileProviderService: DataSelectionMainProfileProviderService
  ) {}

  public checkAndUpgradeCCDLAsSavedData(data: any) {
    console.log('Checking and upgrading CCDL data:', TypeGuard.isStructuredQueryData(data));
    if (TypeGuard.isStructuredQueryData(data)) {
      const dataExtraction = this.buildDataExtraction();
      return {
        content: {
          display: '',
          version: 'http://json-schema.org/to-be-done/schema#',
          cohortDefinition: data,
          dataExtraction,
        },
      };
    } else {
      return data;
    }
  }

  public checkAndUpgradeCCDL(data: any): CRTDLData {
    if (TypeGuard.isStructuredQueryData(data)) {
      const dataExtraction = this.buildDataExtraction();
      return {
        display: '',
        version: 'http://json-schema.org/to-be-done/schema#',
        cohortDefinition: data,
        dataExtraction,
      };
    } else {
      return data;
    }
  }

  private buildDataExtraction() {
    const patientProfile = this.dataSelectionMainProfileProviderService.getPatientProfileValue();
    const dse = new DataSelection([patientProfile], 'unknown');
    return JSON.parse(
      JSON.stringify(this.dataSelection2DataExtraction.translateToDataExtraction(dse))
    );
  }
}
