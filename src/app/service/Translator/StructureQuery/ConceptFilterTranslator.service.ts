import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service'
import { HashService } from '../../Hash.service'
import { Injectable, inject } from '@angular/core'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { v4 as uuidv4 } from 'uuid'
import { Display } from 'src/app/model/DataSelection/Profile/Display'

@Injectable({
  providedIn: 'root',
})
export class ConceptFilterTranslatorService {
  private conceptTranslationCache = inject(ConceptTranslationCacheService)
  private hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Translate a concept filter from structured query to UI concept filter.
   * @param allowedConceptUri
   * @param selectedConceptData
   * @returns
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
   * @param terminologyCodes
   * @returns
   */
  private translateSelectedConcepts(terminologyCodes: TerminologyCodeData[]): Concept[] {
    return terminologyCodes.map((terminologyCode) => this.translateSingleConcept(terminologyCode))
  }

  /**
   * Translate a single concept from structured query to UI concept.
   * @param terminologyCodeData
   * @returns
   */
  private translateSingleConcept(terminologyCodeData: TerminologyCodeData): Concept {
    const hash = this.hashService.createConceptHash(terminologyCodeData)
    const conceptData = this.conceptTranslationCache.getOne(hash)
    const display = Display.fromJson(conceptData.display)
    const terminologyCode = TerminologyCode.fromJson(terminologyCodeData)
    return new Concept(display, terminologyCode)
  }
}
