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

  /**
   * Translates the cohort definition and data extraction of a CRTDL to the UI model.
   * @param {CRTDLData} crtdl
   * @returns {Observable<UiCRTDL>}
   */
  public createCRTDLFromJson(crtdl: CRTDLData): Observable<UiCRTDL> {
    const cohortDefinition = crtdl.cohortDefinition
    const dataExtraction = crtdl.dataExtraction
    const translatedCohort = this.assertCohortAndTranslate(cohortDefinition)
    const translatedDataExtraction = this.assertDataExtractionAndTranslate(dataExtraction)
    return this.combineFeasibilityAndDataExtraction(translatedCohort, translatedDataExtraction)
  }

  /**
   * Validates the cohort definition and translates it to a feasibility query.
   * @param {StructuredQueryData} cohortDefinition
   * @returns {Observable<FeasibilityQuery>}
   */
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

  /**
   * Translates the structured query and stores the feasibility query in the provider.
   * @param {StructuredQueryData} cohortDefinition
   * @returns {Observable<FeasibilityQuery>}
   */
  private translateStructuredQueryAndSetProvider(cohortDefinition: StructuredQueryData): Observable<FeasibilityQuery> {
    this.feasibilityQueryService.clearFeasibilityQuery()
    return this.structuredQuery2FeasibilityQueryService.translate(cohortDefinition).pipe(
      take(1),
      tap((feasibilityQuery: FeasibilityQuery) => {
        this.setFeasibilityQueryProvider(feasibilityQuery)
      })
    )
  }

  /**
   * Validates the data extraction and translates it to a data selection.
   * @param {DataExtractionData} dataExtraction
   * @returns {Observable<DataSelection>}
   */
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

  /**
   * Translates the data extraction and stores the data selection in the provider.
   * @param {DataExtractionData} dataExtraction
   * @returns {Observable<DataSelection>}
   */
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

  /**
   * Combines the feasibility query and the data selection to one UI CRTDL.
   * @param {Observable<FeasibilityQuery>} cohortDefinition
   * @param {Observable<DataSelection>} dataExtraction
   * @returns {Observable<UiCRTDL>}
   */
  private combineFeasibilityAndDataExtraction(
    cohortDefinition: Observable<FeasibilityQuery>,
    dataExtraction: Observable<DataSelection>
  ): Observable<UiCRTDL> {
    return combineLatest([cohortDefinition, dataExtraction]).pipe(map(([cohort, data]) => new UiCRTDL(uuidv4(), cohort, data)))
  }

  /**
   * Stores the feasibility query in the provider as the active one.
   * @param {FeasibilityQuery} feasibilityQuery
   */
  private setFeasibilityQueryProvider(feasibilityQuery: FeasibilityQuery): void {
    this.feasibilityQueryService.setFeasibilityQueryById(feasibilityQuery, feasibilityQuery.getId(), true)
  }

  /**
   * Stores the data selection in the provider as the active one.
   * @param {DataSelection} dataSelection
   */
  private setDataSelectionProvider(dataSelection: DataSelection): void {
    this.dataSelectionProvider.setDataSelection(dataSelection.getId(), dataSelection, true)
  }

  /**
   * Clears the data selection and the stored profiles.
   */
  private resetDataSelection(): void {
    this.dataSelectionProvider.clearDataSelection()
    this.profileProviderService.removeAll()
  }
}
