import { AbstractStructuredQueryFilters } from '../../../model/StructuredQuery/Criterion/Abstract/AbstractStructuredQueryFilters'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptAttributeFilter } from 'src/app/model/StructuredQuery/Criterion/AttributeFilters/ConceptFilter/ConceptAttributeFilter'
import { ConceptFilter } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ConceptValueFilter } from 'src/app/model/StructuredQuery/Criterion/ValueFilter/ConceptFilter/ConceptValueFilter'
import { ConsentService } from '../../Consent/Consent.service'
import { Criterion } from '../../../model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { FeasibilityQuery } from '../../../model/FeasibilityQuery/FeasibilityQuery'
import { Injectable, inject } from '@angular/core'
import { ObjectHelper } from 'src/app/service/ObjectHelper'
import { ReferenceFilter as ReferenceFilterSQ } from '../../../model/StructuredQuery/Criterion/AttributeFilters/ReferenceFilter/ReferenceFilter'
import { ReferenceFilter as ReferenceFilterFQ } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service'
import { StructuredQuery } from '../../../model/StructuredQuery/StructuredQuery'
import { StructuredQueryCriterion } from '../../../model/StructuredQuery/Criterion/StructuredQueryCriterion'
import { StructuredQueryQuantityFilterTranslatorService } from './Builder/StructuredQueryQuantityFilterTranslator.service'
import { TerminologyCode } from '../../../model/Terminology/TerminologyCode'
import { TerminologyCodeTranslator } from '../Shared/TerminologyCodeTranslator.service'
import { TimeRestrictionTranslationService } from '../Shared/TimeRestrictionTranslation.service'

@Injectable({
  providedIn: 'root',
})
export class UIQuery2StructuredQueryService {
  private criterionProvider = inject(CriterionProviderService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private timeRestrictionTranslation = inject(TimeRestrictionTranslationService)
  private quantityFilterTranslator = inject(StructuredQueryQuantityFilterTranslatorService)
  private terminologyTranslator = inject(TerminologyCodeTranslator)
  private consentService = inject(ConsentService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public translateToStructuredQuery(feasibilityQuery: FeasibilityQuery): StructuredQuery {
    const inclusionCriteria = feasibilityQuery.getInclusionCriteria()
    const exclusionCriteria = feasibilityQuery.getExclusionCriteria()
    const structuredQuery = new StructuredQuery(
      this.translateInclusionCriteria(inclusionCriteria),
      this.translateExclusionCriteria(exclusionCriteria),
      feasibilityQuery.getDisplay().length > 0 ? feasibilityQuery.getDisplay() : ''
    )

    if (feasibilityQuery.getConsent()) {
      structuredQuery.getInclusionCriteria().push(this.getConsent())
    }
    return structuredQuery
  }

  private translateInclusionCriteria(
    inclusionCriteriaArray: string[][]
  ): StructuredQueryCriterion[][] | [] {
    const inclusionCriteria = ObjectHelper.clone(inclusionCriteriaArray)
    if (inclusionCriteria.length > 0) {
      return this.translateCriterionGroup(inclusionCriteria)
    }
  }

  private translateExclusionCriteria(
    exclusionCriteriaArray: string[][]
  ): StructuredQueryCriterion[][] | undefined {
    const exclusionCriteria = ObjectHelper.clone(exclusionCriteriaArray)
    if (exclusionCriteria.length > 0) {
      return this.translateCriterionGroup(exclusionCriteria)
    } else {
      return undefined
    }
  }

  private translateCriterionGroup(criterionGroup: string[][]): StructuredQueryCriterion[][] {
    const structuredQueryCriterion: StructuredQueryCriterion[][] = []
    criterionGroup.forEach((criterionIdArray) => {
      const innerArray: StructuredQueryCriterion[] = this.translateInnerArray(criterionIdArray)
      if (innerArray.length > 0) {
        structuredQueryCriterion.push(innerArray)
      }
    })
    return structuredQueryCriterion.length > 0 ? structuredQueryCriterion : undefined
  }

  private translateInnerArray(criterionArray: string[]): StructuredQueryCriterion[] {
    const structuredQueryInnerArray: StructuredQueryCriterion[] = []
    criterionArray.forEach((criterionID) => {
      const criterion = this.criterionProvider.getOne(criterionID)
      structuredQueryInnerArray.push(this.assignStructuredQueryCriterionElements(criterion))
    })
    return structuredQueryInnerArray
  }

  /**
   * @todo test terminology translator
   * @param criterion
   * @returns
   */
  private assignStructuredQueryCriterionElements(criterion: Criterion): StructuredQueryCriterion {
    const structuredQueryCriterion = new StructuredQueryCriterion(
      this.terminologyTranslator.translateTermCodes(criterion.getTermCodes()),
      this.translateAttributeFilters(criterion),
      criterion.getContext(),
      this.timeRestrictionTranslation.translateTimeRestrictionToStructuredQuery(
        criterion.getTimeRestriction()
      ),
      this.translateValueFilter(criterion)
    )
    return structuredQueryCriterion
  }

  private translateAttributeFilters(
    criterion: Criterion
  ): AbstractStructuredQueryFilters[] | undefined {
    if (criterion.getAttributeFilters().length > 0) {
      return this.createStructuredQueryAttributeFilters(criterion)
    } else {
      return undefined
    }
  }

  private translateValueFilter(criterion: Criterion): AbstractStructuredQueryFilters | undefined {
    if (criterion.getValueFilters().length > 0) {
      return this.createStructuredQueryValueFilters(criterion)
    } else {
      return undefined
    }
  }

  private createStructuredQueryAttributeFilters(
    criterion: Criterion
  ): AbstractStructuredQueryFilters[] | undefined {
    const translatedFilters: AbstractStructuredQueryFilters[] = []
    criterion.getAttributeFilters().forEach((attributeFilter) => {
      const filter = this.createAttributeFilter(attributeFilter)
      if (filter) {
        translatedFilters.push(filter)
      }
    })
    return translatedFilters.length > 0 ? translatedFilters : undefined
  }

  public createAttributeFilter(attributeFilter: AttributeFilter): AbstractStructuredQueryFilters {
    const attributeCode = attributeFilter.getAttributeCode()
    if (attributeFilter.isConceptSet() && attributeFilter.getConcept()?.hasSelectedConcepts()) {
      return this.createAttributeConceptFilter(attributeCode, attributeFilter.getConcept())
    }
    if (
      attributeFilter.isReferenceSet() &&
      attributeFilter.getReference()?.isSelectedReferenceSet()
    ) {
      return this.createReferences(attributeCode, attributeFilter.getReference())
    }
    if (attributeFilter.isQuantitySet()) {
      return this.quantityFilterTranslator.translateQuantityAttributeFilter(
        attributeCode,
        attributeFilter.getQuantity()
      )
    }
  }

  private createStructuredQueryValueFilters(
    criterion: Criterion
  ): AbstractStructuredQueryFilters | undefined {
    const translatedFilters: AbstractStructuredQueryFilters[] = []
    criterion.getValueFilters().forEach((valueFilter) => {
      if (valueFilter.getConcept()?.getSelectedConcepts().length > 0) {
        translatedFilters.push(this.createConceptValueFilter(valueFilter.getConcept()))
      }
      if (valueFilter.getQuantity()) {
        translatedFilters.push(
          this.quantityFilterTranslator.translateQuantityValueFilter(valueFilter.getQuantity())
        )
      }
    })
    return translatedFilters[0]
  }

  private createAttributeConceptFilter(
    attributeCode: TerminologyCode,
    conceptFilter: ConceptFilter
  ): ConceptAttributeFilter {
    const conceptAttributeFilter = new ConceptAttributeFilter(
      this.createStructuredQueryAttributeCode(attributeCode),
      conceptFilter.getSelectedConcepts().map((concept) => concept.getTerminologyCode())
    )
    return conceptAttributeFilter
  }

  private createConceptValueFilter(valueFilter: ConceptFilter): ConceptValueFilter | undefined {
    return new ConceptValueFilter(
      valueFilter.getSelectedConcepts().map((concept) => concept.getTerminologyCode())
    )
  }

  private createReferences(
    attributeCode: TerminologyCode,
    referenceFilter: ReferenceFilterFQ
  ): ReferenceFilterSQ {
    const referenceCriteria = referenceFilter
      .getSelectedReferenceIds()
      .map((id) => this.referenceCriterionProvider.getOne(id))
    const translatedRefrenceFilter: ReferenceFilterSQ = new ReferenceFilterSQ(
      this.createStructuredQueryAttributeCode(attributeCode),
      this.setEachLinkedCriteria(referenceCriteria)
    )
    return translatedRefrenceFilter
  }

  private setEachLinkedCriteria(linkedCriteria: Criterion[]): StructuredQueryCriterion[] {
    const linkedCriteriaArray = new Array<StructuredQueryCriterion>()
    linkedCriteria.forEach((linkedCriterion) => {
      linkedCriteriaArray.push(this.assignStructuredQueryCriterionElements(linkedCriterion))
    })
    return linkedCriteriaArray
  }

  private getConsent(): StructuredQueryCriterion[] {
    return [this.consentService.getConsentStructuredQueryCriterion()]
  }

  private createStructuredQueryAttributeCode(attributeCode: TerminologyCode): TerminologyCode {
    return new TerminologyCode(
      attributeCode.getCode(),
      attributeCode.getDisplay(),
      attributeCode.getSystem()
    )
  }
}
