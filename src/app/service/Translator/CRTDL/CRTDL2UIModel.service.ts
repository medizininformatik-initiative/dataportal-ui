import { Injectable, inject } from '@angular/core'
import { combineLatest, map, Observable, of, take, tap } from 'rxjs'
import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData'
import { StructuredQueryData } from 'src/app/model/Interface/StructuredQueryData'
import { UiCRTDL } from 'src/app/model/UiCRTDL'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { v4 as uuidv4 } from 'uuid'
import { DataSelectionFactoryService } from '../../DataSelection/Factory/DataSelection.factory.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { TypeAssertion } from '../../TypeGuard/TypeAssersations'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { DataExtraction2UiDataSelectionService } from '../DataExtraction/DataExtraction2UiDataSelection.service'
import { StructuredQuery2FeasibilityQueryService } from '../StructureQuery/StructuredQuery2FeasibilityQuery.service'

@Injectable({
  providedIn: 'root',
})
export class CRTDL2UIModelService {
  private readonly dataExtraction2UiDataSelectionService = inject(DataExtraction2UiDataSelectionService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly feasibilityQueryService = inject(FeasibilityQueryProviderService)
  private readonly structuredQuery2FeasibilityQueryService = inject(StructuredQuery2FeasibilityQueryService)
  private readonly profileProviderService = inject(ProfileProviderService)
  private readonly dataSelectionFactoryService = inject(DataSelectionFactoryService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public createCRTDLFromJson(crtdl: CRTDLData): Observable<UiCRTDL> {
    const cohortDefinition = crtdl.cohortDefinition
    const dataExtraction = crtdl.dataExtraction
    const translatedCohort = this.assertCohortAndTranslate(cohortDefinition)
    const translatedDataExtraction = this.assertDataExtractionAndTranslate(dataExtraction)
    return this.combineFeasibilityAndDataExtraction(translatedCohort, translatedDataExtraction)
  }

  private assertCohortAndTranslate(cohortDefinition: StructuredQueryData): Observable<FeasibilityQuery> {
    if (cohortDefinition !== undefined) {
      try {
        TypeAssertion.assertStructuredQueryData(cohortDefinition)
        return this.translateStructuredQueryAndSetProvider(cohortDefinition)
      } catch (error) {
        console.error(error)
      }
    }
    return of(new FeasibilityQuery(uuidv4()))
  }

  private translateStructuredQueryAndSetProvider(cohortDefinition: StructuredQueryData): Observable<FeasibilityQuery> {
    this.feasibilityQueryService.clearFeasibilityQuery()
    return this.structuredQuery2FeasibilityQueryService.translate(cohortDefinition).pipe(
      take(1),
      tap((feasibilityQuery: FeasibilityQuery) => {
        this.setFeasibilityQueryProvider(feasibilityQuery)
      })
    )
  }

  private assertDataExtractionAndTranslate(dataExtraction: DataExtractionData): Observable<DataSelection> {
    if (TypeGuard.isDataExtractionData(dataExtraction)) {
      try {
        TypeAssertion.assertDataExtractionData(dataExtraction)
        return this.translateDataExtractionAndSetProvider(dataExtraction)
      } catch (error) {
        console.error(error)
      }
    }
    this.resetDataSelection()
    return this.dataSelectionFactoryService.instantiate()
  }

  private translateDataExtractionAndSetProvider(dataExtraction: DataExtractionData): Observable<DataSelection> {
    this.resetDataSelection()
    return this.dataExtraction2UiDataSelectionService.translate(dataExtraction).pipe(
      take(1),
      map((dataSelection: DataSelection) => {
        this.setDataSelectionProvider(dataSelection)
        return dataSelection
      })
    )
  }

  private combineFeasibilityAndDataExtraction(
    cohortDefinition: Observable<FeasibilityQuery>,
    dataExtraction: Observable<DataSelection>
  ): Observable<UiCRTDL> {
    return combineLatest([cohortDefinition, dataExtraction]).pipe(map(([cohort, data]) => new UiCRTDL(uuidv4(), cohort, data)))
  }

  private setFeasibilityQueryProvider(feasibilityQuery: FeasibilityQuery): void {
    this.feasibilityQueryService.setFeasibilityQueryById(feasibilityQuery, feasibilityQuery.getId(), true)
  }

  private setDataSelectionProvider(dataSelection: DataSelection): void {
    this.dataSelectionProvider.setDataSelection(dataSelection.getId(), dataSelection, true)
  }

  private resetDataSelection(): void {
    this.dataSelectionProvider.clearDataSelection()
    this.profileProviderService.removeAll()
  }
}
