import { CloneConcept } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Concept/CloneConcept';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter';
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter';
import { CriteriaSearchFilterValue } from 'src/app/model/Search/Filter/CriteriaSearchFilterValue';
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes';
import { Injectable } from '@angular/core';
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter';

@Injectable()
export class ConceptSelectionHelperService {
  toggleConceptSelection(concept: Concept, selectedConcepts: Concept[]): Concept[] {
    const isSelected = this.isConceptSelected(concept, selectedConcepts);

    if (isSelected) {
      return this.removeConceptFromSelection(concept, selectedConcepts);
    } else {
      return this.addConceptToSelection(concept, selectedConcepts);
    }
  }

  isConceptSelected(concept: Concept, selectedConcepts: Concept[]): boolean {
    return selectedConcepts.some((existing) => this.isSameConcept(existing, concept));
  }

  isSameConcept(concept1: Concept, concept2: Concept): boolean {
    return concept1.getTerminologyCode().getCode() === concept2.getTerminologyCode().getCode();
  }

  cloneConcepts(concepts: Concept[]): Concept[] {
    return CloneConcept.deepCopyConcepts(concepts);
  }

  createTerminologyFilter(valueSetUrls: string[]): SearchFilter {
    const filterValues = this.createFilterValues(valueSetUrls);
    const criteriaFilter = new CriteriaSearchFilter(
      ElasticSearchFilterTypes.TERMINOLOGY,
      filterValues
    );
    return CriteriaSearchFilterAdapter.convertToFilterValues(criteriaFilter);
  }

  public addConceptsToSelection(concepts: Concept[], selectedConcepts: Concept[]): Concept[] {
    const newConceptsArray = [...selectedConcepts];
    concepts.forEach((concept) => {
      if (!this.isConceptSelected(concept, selectedConcepts)) {
        newConceptsArray.push(concept);
      }
    });
    return newConceptsArray;
  }

  public addConceptToSelection(concept: Concept, selectedConcepts: Concept[]): Concept[] {
    return [...selectedConcepts, concept];
  }

  private removeConceptFromSelection(concept: Concept, selectedConcepts: Concept[]): Concept[] {
    return selectedConcepts.filter((existing) => !this.isSameConcept(existing, concept));
  }

  private createFilterValues(valueSetUrls: string[]): CriteriaSearchFilterValue[] {
    return valueSetUrls.map((url, index) => new CriteriaSearchFilterValue(index, url));
  }
}
