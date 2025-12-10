import { CodeableConceptApiService } from '../../Backend/Api/CodeableConceptApi.service';
import { CollectCRTDLHashesService } from './HashCollector/CollectCRTDLHashes.service';
import { ConceptData } from 'src/app/model/Interface/ConceptData';
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service';
import { ConsentService } from '../../Consent/Consent.service';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriteriaProfileProviderService } from '../../Provider/CriteriaProfileProvider.service';
import { CriterionProviderService } from '../../Provider/CriterionProvider.service';
import { CriterionTranslatorService } from './CriterionTranslator.service';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { StructuredQueryCriterionData } from 'src/app/model/Interface/StructuredQueryCriterionData';
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
@Injectable({
  providedIn: 'root',
})
export class StructuredQuery2UIQueryTranslatorService {
  constructor(
    private terminologyApiService: TerminologyApiService,
    private codeableConceptApiService: CodeableConceptApiService,
    private conceptTranslationCache: ConceptTranslationCacheService,
    private consentService: ConsentService,
    private collectCRTDLHashesService: CollectCRTDLHashesService,
    private criteriaProfileProviderService: CriteriaProfileProviderService,
    private criterionTranslatorService: CriterionTranslatorService,
    private criterionProviderService: CriterionProviderService
  ) {}

  public translate(inexclusion: StructuredQueryCriterionData[][]): Observable<string[][]> {
    const hashes = this.collectCRTDLHashesService.collectCriterionData(inexclusion);
    const criteriaHahes = hashes.criteriaHashes;
    const conceptHahes = hashes.conceptHashes;
    return this.terminologyApiService.getCriteriaProfileData(criteriaHahes).pipe(
      tap((criteriaProfileData: CriteriaProfileData[]) =>
        this.criteriaProfileProviderService.setCachedCriteriaProfiles(criteriaProfileData)
      ),
      switchMap(() => this.codeableConceptApiService.getCodeableConceptsByIds(conceptHahes)),
      tap((conceptsData: ConceptData[]) =>
        this.conceptTranslationCache.setConceptsByHash(conceptsData)
      ),
      map(() => this.translateInExclusion(inexclusion))
    );
  }

  public translateInExclusion(inexclusion: StructuredQueryCriterionData[][]): string[][] {
    const translatedCriteria: string[][] = [];
    inexclusion.forEach((criterionArray: StructuredQueryCriterionData[]) => {
      translatedCriteria.push(
        criterionArray
          .map((structuredQueryCriterion: StructuredQueryCriterionData) => {
            const termCode = TerminologyCode.fromJson(structuredQueryCriterion.termCodes[0]);
            if (!this.isConsent(termCode)) {
              const criterion = this.criterionTranslatorService.translate(structuredQueryCriterion);
              this.criterionProviderService.setCriterionByUID(criterion, criterion.getId());
              return criterion.getId();
            } else {
              this.setConsent(termCode);
            }
          })
          .filter((id: string | undefined): id is string => id !== undefined)
      );
    });
    return translatedCriteria.filter((array) => array.length > 0);
  }

  private setConsent(terminologyCode: TerminologyCode): void {
    const flags = this.consentService.getBooleanFlags(terminologyCode.getCode());
    this.consentService.setProvisionCode(
      flags.distributedAnalysis,
      flags.euGdpr,
      flags.insuranceData,
      flags.contact
    );
    this.consentService.setConsent(true);
  }

  private isConsent(termCode: TerminologyCode): boolean {
    return this.consentService.getBooleanFlags(termCode.getCode()) !== null;
  }
}
