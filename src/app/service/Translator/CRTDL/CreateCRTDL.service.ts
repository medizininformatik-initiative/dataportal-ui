import { ActiveDataSelectionService } from '../../Provider/ActiveDataSelection.service';
import { combineLatest, map, Observable, of } from 'rxjs';
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL';
import { DataExtraction } from 'src/app/model/CRTDL/DataExtraction/DataExtraction';
import { DataSelection2DataExtraction } from './DataSelection2DataExtraction.service';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';
import { StructuredQuery } from 'src/app/model/StructuredQuery/StructuredQuery';
import { UIQuery2StructuredQueryService } from '../StructureQuery/UIQuery2StructuredQuery.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCRTDLService {
  constructor(
    private dataExtractionTranslator: DataSelection2DataExtraction,
    private feasibilityQueryProvider: FeasibilityQueryProviderService,
    private uiQueryTranslator: UIQuery2StructuredQueryService,
    private dataSelectionProvider: DataSelectionProviderService,
    private activeDataSelectionService: ActiveDataSelectionService
  ) {}

  public createCRTDLForSave(getFeasibility: boolean, getDataSelection: boolean): Observable<CRTDL> {
    const structuredQuery$ = this.getStructuredQuery();
    const dataExtraction$ = this.getDataExtraction();

    if (getFeasibility && getDataSelection) {
      return combineLatest([structuredQuery$, dataExtraction$]).pipe(
        map(([structuredQuery, dataExtraction]) => this.buildCRTDL(structuredQuery, dataExtraction))
      );
    }
    if (getDataSelection) {
      return dataExtraction$.pipe(map((dataExtraction) => this.buildCRTDL(null, dataExtraction)));
    }
    if (getFeasibility) {
      return structuredQuery$.pipe(map((structuredQuery) => this.buildCRTDL(structuredQuery, null)));
    }
    return of(this.buildCRTDL(null, null));
  }

  public createCRTDL(): Observable<CRTDL> {
    return combineLatest([this.getStructuredQuery(), this.getDataExtraction()]).pipe(
      map(([structuredQuery, dataExtraction]) => {
        if (structuredQuery.getInclusionCriteria()?.length > 0) {
          return this.buildCRTDL(structuredQuery, dataExtraction);
        }
      })
    );
  }

  public buildCRTDL(structuredQuery: StructuredQuery, dataExtraction: DataExtraction): CRTDL {
    return new CRTDL(structuredQuery, dataExtraction);
  }

  private getStructuredQuery(): Observable<StructuredQuery> {
    return this.feasibilityQueryProvider
      .getActiveFeasibilityQuery()
      .pipe(
        map((feasibilityQuery) =>
          this.uiQueryTranslator.translateToStructuredQuery(feasibilityQuery)
        )
      );
  }

  private getDataExtraction(): Observable<DataExtraction> {
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId();
    return this.dataSelectionProvider
      .getDataSelectionByUID(dataSelectionId)
      .pipe(
        map((dataSelection) =>
          this.dataExtractionTranslator.translateToDataExtraction(dataSelection)
        )
      );
  }
}
