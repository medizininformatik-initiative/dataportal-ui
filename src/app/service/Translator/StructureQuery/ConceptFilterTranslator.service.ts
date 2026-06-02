import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { HashService } from '../../Hash.service'
import { inject, Injectable } from '@angular/core'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class ConceptFilterTranslatorService {
  private conceptTranslationCache = inject(ConceptTranslationCacheService)
  private hashService = inject(HashService)

  constructor() {}

  /**
   * Translate a concept filter from structured query to UI concept filter.
   * @param {string[]} allowedConceptUri
   * @param {TerminologyCodeData[]} selectedConceptData
   * @returns {ConceptFilter}
   */
  public translate(
    allowedConceptUri: string[],
    selectedConceptData: TerminologyCodeData[]
  ): ConceptFilter {
    const selectedConcepts = this.translateSelectedConcepts(selectedConceptData)
    return new ConceptFilter(uuidv4(), allowedConceptUri, selectedConcepts)
  }

  /**
   * Translate selected concepts from structured query to UI selected concepts.
   * @param {TerminologyCodeData[]} terminologyCodes
   * @returns {Concept[]}
   */
  private translateSelectedConcepts(terminologyCodes: TerminologyCodeData[]): Concept[] {
    return terminologyCodes.map((terminologyCode) => this.translateSingleConcept(terminologyCode))
  }

  /**
   * Translate a single concept from structured query to UI concept.
   * @param {TerminologyCodeData} terminologyCodeData
   * @returns {Concept}
   */
  private translateSingleConcept(terminologyCodeData: TerminologyCodeData): Concept {
    const hash = this.hashService.createConceptHash(terminologyCodeData)
    const conceptData = this.conceptTranslationCache.getOne(hash)
    const display = Display.fromJson(conceptData.display)
    const terminologyCode = TerminologyCode.fromJson(terminologyCodeData)
    return new Concept(display, terminologyCode)
  }
}
