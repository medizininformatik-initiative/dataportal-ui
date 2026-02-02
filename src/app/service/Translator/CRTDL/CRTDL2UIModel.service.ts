import { combineLatest, map, Observable, of, take, tap } from 'rxjs';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { DataExtraction2UiDataSelectionService } from '../DataExtraction/DataExtraction2UiDataSelection.service';
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData';
import { DataSelection } from 'src/app/model/DataSelection/DataSelection';
import { DataSelectionFactoryService } from '../../DataSelection/DataSelection.factory.service';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery';
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';
import { ProfileProviderService } from 'src/app/modules/data-selection/services/ProfileProvider.service';
import { StructuredQuery2FeasibilityQueryService } from '../StructureQuery/StructuredQuery2FeasibilityQuery.service';
import { StructuredQueryData } from 'src/app/model/Interface/StructuredQueryData';
import { TypeAssertion } from '../../TypeGuard/TypeAssersations';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { UiCRTDL } from 'src/app/model/UiCRTDL';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CRTDL2UIModelService {
  constructor(
    private dataExtraction2UiDataSelectionService: DataExtraction2UiDataSelectionService,
    private dataSelectionProvider: DataSelectionProviderService,
    private feasibilityQueryService: FeasibilityQueryProviderService,
    private structuredQuery2FeasibilityQueryService: StructuredQuery2FeasibilityQueryService,
    private profileProviderService: ProfileProviderService,
    private dataSelectionFactoryService: DataSelectionFactoryService
  ) {}

  public createCRTDLFromJson(crtdl: CRTDLData): Observable<UiCRTDL> {
    const cohortDefinition = crtdl.cohortDefinition;
    const dataExtraction = crtdl.dataExtraction;
    const translatedCohort = this.assertCohortAndTranslate(cohortDefinition);
    const translatedDataExtraction = this.assertDataExtractionAndTranslate(dataExtraction);
    return this.combineFeasibilityAndDataExtraction(translatedCohort, translatedDataExtraction);
  }

  private assertCohortAndTranslate(
    cohortDefinition: StructuredQueryData
  ): Observable<FeasibilityQuery> {
    if (cohortDefinition !== undefined) {
      try {
        TypeAssertion.assertStructuredQueryData(cohortDefinition);
        return this.translateStructuredQueryAndSetProvider(cohortDefinition);
      } catch (error) {
        console.error(error);
      }
    }
    return of(new FeasibilityQuery(uuidv4()));
  }

  private translateStructuredQueryAndSetProvider(
    cohortDefinition: StructuredQueryData
  ): Observable<FeasibilityQuery> {
    this.feasibilityQueryService.clearFeasibilityQuery();
    return this.structuredQuery2FeasibilityQueryService.translate(cohortDefinition).pipe(
      take(1),
      tap((feasibilityQuery) => {
        this.setFeasibilityQueryProvider(feasibilityQuery);
      })
    );
  }

  private assertDataExtractionAndTranslate(
    dataExtraction: DataExtractionData
  ): Observable<DataSelection> {
    if (TypeGuard.isDataExtractionData(dataExtraction)) {
      try {
        TypeAssertion.assertDataExtractionData(dataExtraction);
        return this.translateDataExtractionAndSetProvider(dataExtraction);
      } catch (error) {
        console.error(error);
      }
    }
    this.resetDataSelection();
    return this.dataSelectionFactoryService.instantiate();
  }

  private translateDataExtractionAndSetProvider(
    dataExtraction: DataExtractionData
  ): Observable<DataSelection> {
    this.resetDataSelection();
    return this.dataExtraction2UiDataSelectionService.translate(dataExtraction).pipe(
      take(1),
      map((dataSelection) => {
        this.setDataSelectionProvider(dataSelection);
        return dataSelection;
      })
    );
  }

  private combineFeasibilityAndDataExtraction(
    cohortDefinition: Observable<FeasibilityQuery>,
    dataExtraction: Observable<DataSelection>
  ): Observable<UiCRTDL> {
    return combineLatest([cohortDefinition, dataExtraction]).pipe(
      map(([cohort, data]) => new UiCRTDL(uuidv4(), cohort, data))
    );
  }

  private setFeasibilityQueryProvider(feasibilityQuery: FeasibilityQuery): void {
    this.feasibilityQueryService.setFeasibilityQueryByID(
      feasibilityQuery,
      feasibilityQuery.getId(),
      true
    );
  }

  private setDataSelectionProvider(dataSelection: DataSelection): void {
    this.dataSelectionProvider.setDataSelectionByUID(dataSelection.getId(), dataSelection, true);
  }

  private resetDataSelection(): void {
    this.dataSelectionProvider.clearDataSelection();
    this.profileProviderService.resetProfileMap();
  }
}
