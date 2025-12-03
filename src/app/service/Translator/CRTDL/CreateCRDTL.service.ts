import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL';
import { DataSelection2DataExtraction } from './DataSelection2DataExtraction.service';
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of } from 'rxjs';
import { UIQuery2StructuredQueryService } from '../StructureQuery/UIQuery2StructuredQuery.service';
import { StructuredQuery } from 'src/app/model/StructuredQuery/StructuredQuery';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { DataExtraction } from 'src/app/model/CRTDL/DataExtraction/DataExtraction';
import { ActiveDataSelectionService } from '../../Provider/ActiveDataSelection.service';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';

@Injectable({
  providedIn: 'root',
})
export class CreateCRDTLService {
  constructor(
    private dataExtractionTranslator: DataSelection2DataExtraction,
    private feasibilityQueryProvider: FeasibilityQueryProviderService,
    private uiQueryTranslator: UIQuery2StructuredQueryService,
    private dataSelectionProvider: DataSelectionProviderService,
    private activeDataSelectionService: ActiveDataSelectionService,
    private snackBarService: SnackbarService
  ) {}

  public createCRDTLForSave(getFeasibility: boolean, getDataSelection: boolean): Observable<CRTDL> {
    const structuredQuery$ = this.getStructuredQuery();
    const dataExtraction$ = this.getDataExtraction();

    if (getFeasibility && getDataSelection) {
      return combineLatest([structuredQuery$, dataExtraction$]).pipe(
        map(([structuredQuery, dataExtraction]) => this.buildCRDTL(structuredQuery, dataExtraction))
      );
    }
    if (getDataSelection) {
      return dataExtraction$.pipe(map((dataExtraction) => this.buildCRDTL(null, dataExtraction)));
    }
    if (getFeasibility) {
      return structuredQuery$.pipe(map((structuredQuery) => this.buildCRDTL(structuredQuery, null)));
    }
    return of(this.buildCRDTL(null, null));
  }

  public createCRDTL(): Observable<CRTDL> {
    return combineLatest([this.getStructuredQuery(), this.getDataExtraction()]).pipe(
      map(([structuredQuery, dataExtraction]) => {
        if (structuredQuery.getInclusionCriteria()?.length > 0) {
          return this.buildCRDTL(structuredQuery, dataExtraction);
        } else {
          this.snackBarService.displayErrorMessageWithNoCode(
            'Keine Kohorte definiert, download nicht möglich'
          );
        }
      })
    );
  }

  public buildCRDTL(structuredQuery: StructuredQuery, dataExtraction: DataExtraction): CRTDL {
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
