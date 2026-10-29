import { Injectable, inject } from '@angular/core'
import { map, Observable, switchMap, tap } from 'rxjs'
import { ConceptData } from 'src/app/model/Interface/ConceptData'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { StructuredQueryCriterionData } from 'src/app/model/Interface/StructuredQueryCriterionData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { CodeableConceptApiService } from '../../Backend/Api/CodeableConceptApi.service'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'
import { ConsentService } from '../../Consent/Consent.service'
import { CriteriaProfileProviderService } from '../../Provider/CriteriaProfileProvider.service'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service'
import { CriterionTranslatorService } from './CriterionTranslator.service'
import { CollectCRTDLHashesService } from './HashCollector/CollectCRTDLHashes.service'
@Injectable({
  providedIn: 'root',
})
export class StructuredQuery2UIQueryTranslatorService {
  private readonly terminologyApiService = inject(TerminologyApiService)
  private readonly codeableConceptApiService = inject(CodeableConceptApiService)
  private readonly conceptTranslationCache = inject(ConceptTranslationCacheService)
  private readonly consentService = inject(ConsentService)
  private readonly collectCRTDLHashesService = inject(CollectCRTDLHashesService)
  private readonly criteriaProfileProviderService = inject(CriteriaProfileProviderService)
  private readonly criterionTranslatorService = inject(CriterionTranslatorService)
  private readonly criterionProviderService = inject(CriterionProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public translate(inexclusion: StructuredQueryCriterionData[][]): Observable<string[][]> {
    const hashes = this.collectCRTDLHashesService.collectCriterionData(inexclusion)
    const criteriaHahes = hashes.criteriaHashes
    const conceptHahes = hashes.conceptHashes
    return this.terminologyApiService.getCriteriaProfileData(criteriaHahes).pipe(
      tap((criteriaProfileData: CriteriaProfileData[]) =>
        this.criteriaProfileProviderService.setCachedCriteriaProfiles(criteriaProfileData)
      ),
      switchMap(() => this.codeableConceptApiService.getCodeableConceptsByIds(conceptHahes)),
      tap((conceptsData: ConceptData[]) => this.conceptTranslationCache.addMany(conceptsData)),
      map(() => this.translateInExclusion(inexclusion))
    )
  }

  public translateInExclusion(inexclusion: StructuredQueryCriterionData[][]): string[][] {
    const translatedCriteria: string[][] = []
    inexclusion.forEach((criterionArray: StructuredQueryCriterionData[]) => {
      translatedCriteria.push(
        criterionArray
          .map((structuredQueryCriterion: StructuredQueryCriterionData) => {
            const termCode = TerminologyCode.fromJson(structuredQueryCriterion.termCodes[0])
            if (!this.isConsent(termCode)) {
              const criterion = this.criterionTranslatorService.translate(structuredQueryCriterion)
              this.criterionProviderService.setOne(criterion)
              return criterion.getId()
            } else {
              this.setConsent(termCode)
            }
          })
          .filter((id: string | undefined): id is string => id !== undefined)
      )
    })
    return translatedCriteria.filter((array: string[]) => array.length > 0)
  }

  private setConsent(terminologyCode: TerminologyCode): void {
    const flags = this.consentService.getBooleanFlags(terminologyCode.getCode())
    this.consentService.setProvisionCode(flags.distributedAnalysis, flags.euGdpr, flags.insuranceData, flags.contact)
    this.consentService.setConsent(true)
  }

  private isConsent(termCode: TerminologyCode): boolean {
    return this.consentService.getBooleanFlags(termCode.getCode()) !== null
  }
}
