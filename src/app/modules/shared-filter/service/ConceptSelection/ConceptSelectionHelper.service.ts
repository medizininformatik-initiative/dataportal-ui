import { Injectable } from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { CriteriaSearchFilterValue } from 'src/app/model/Search/Filter/CriteriaSearchFilterValue'
import { CloneConcept } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Concept/CloneConcept'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'

@Injectable()
export class ConceptSelectionHelperService {
  /**
   * Removes the concept from the selection if selected, otherwise adds it.
   * @param {Concept} concept
   * @param {Concept[]} selectedConcepts
   * @returns {Concept[]}
   */
  public toggleConceptSelection(concept: Concept, selectedConcepts: Concept[]): Concept[] {
    const isSelected = this.isConceptSelected(concept, selectedConcepts)

    if (isSelected) {
      return this.removeConceptFromSelection(concept, selectedConcepts)
    } else {
      return this.addConceptToSelection(concept, selectedConcepts)
    }
  }

  /**
   * Checks whether the concept is in the selection.
   * @param {Concept} concept
   * @param {Concept[]} selectedConcepts
   * @returns {boolean}
   */
  public isConceptSelected(concept: Concept, selectedConcepts: Concept[]): boolean {
    return selectedConcepts.some((existing: Concept) => this.isSameConcept(existing, concept))
  }

  /**
   * Checks whether two concepts have the same code and system.
   * @param {Concept} concept1
   * @param {Concept} concept2
   * @returns {boolean}
   */
  public isSameConcept(concept1: Concept, concept2: Concept): boolean {
    return (
      concept1.getTerminologyCode().getCode() === concept2.getTerminologyCode().getCode() &&
      concept1.getTerminologyCode().getSystem() === concept2.getTerminologyCode().getSystem()
    )
  }

  /**
   * Creates deep copies of the concepts.
   * @param {Concept[]} concepts
   * @returns {Concept[]}
   */
  public cloneConcepts(concepts: Concept[]): Concept[] {
    return CloneConcept.deepCopyConcepts(concepts)
  }

  /**
   * Builds a terminology search filter for the given value set urls.
   * @param {string[]} valueSetUrls
   * @returns {SearchFilterData}
   */
  public createTerminologyFilter(valueSetUrls: string[]): SearchFilterData {
    const filterValues = this.createFilterValues(valueSetUrls)
    const criteriaFilter = new CriteriaSearchFilter(ElasticSearchFilterTypes.TERMINOLOGY, filterValues)
    return CriteriaSearchFilterAdapter.convertToFilterValues(criteriaFilter)
  }

  /**
   * Returns the selection extended by the concepts that are not yet in it.
   * @param {Concept[]} concepts
   * @param {Concept[]} selectedConcepts
   * @returns {Concept[]}
   */
  public addConceptsToSelection(concepts: Concept[], selectedConcepts: Concept[]): Concept[] {
    const newConceptsArray = [...selectedConcepts]
    concepts.forEach((concept: Concept) => {
      if (!this.isConceptSelected(concept, selectedConcepts)) {
        newConceptsArray.push(concept)
      }
    })
    return newConceptsArray
  }

  /**
   * Returns the selection extended by one concept.
   * @param {Concept} concept
   * @param {Concept[]} selectedConcepts
   * @returns {Concept[]}
   */
  public addConceptToSelection(concept: Concept, selectedConcepts: Concept[]): Concept[] {
    return [...selectedConcepts, concept]
  }

  /**
   * Returns the selection without the given concept.
   * @param {Concept} concept
   * @param {Concept[]} selectedConcepts
   * @returns {Concept[]}
   */
  private removeConceptFromSelection(concept: Concept, selectedConcepts: Concept[]): Concept[] {
    return selectedConcepts.filter((existing: Concept) => !this.isSameConcept(existing, concept))
  }

  /**
   * Creates one filter value per value set url.
   * @param {string[]} valueSetUrls
   * @returns {CriteriaSearchFilterValue[]}
   */
  private createFilterValues(valueSetUrls: string[]): CriteriaSearchFilterValue[] {
    return valueSetUrls.map((url: string, index: number) => new CriteriaSearchFilterValue(index, url))
  }
}
