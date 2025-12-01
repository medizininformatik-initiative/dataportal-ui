import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { TerminologyCodeService } from '../TerminologyService/TerminologyCode.service';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';

@Injectable({
  providedIn: 'root',
})
export class SelectedConceptFilterProviderService {
  /**
   * @Todo muss ne Map vom BehaviourSubject werden, um mehrere Ergebnisslisten zu pflegen
   */
  private selectedConceptsSubject: BehaviorSubject<Array<Concept>> = new BehaviorSubject<
    Array<Concept>
  >([]);
  selectedConcepts$: Observable<Array<Concept>> = this.selectedConceptsSubject.asObservable();

  constructor(private terminologyCodeService: TerminologyCodeService) {}

  public initializeSelectedConcepts(concept: Concept[]): void {
    this.selectedConceptsSubject.next(concept);
  }

  public isConceptSelected(terminologyCode: TerminologyCode): boolean {
    return this.selectedConceptsSubject
      .getValue()
      .some((tc) => tc.getTerminologyCode().getCode() === terminologyCode.getCode());
  }

  public addConcept(concept: Concept): void {
    const currentArray = this.selectedConceptsSubject.getValue();
    if (
      !currentArray.some(
        (tc) => tc.getTerminologyCode().getCode() === concept.getTerminologyCode().getCode()
      )
    ) {
      currentArray.push(concept);
      this.selectedConceptsSubject.next(currentArray);
      this.terminologyCodeService.addTerminologyCode(concept.getTerminologyCode());
    } else {
      this.removeConcept(concept);
    }
  }

  public addConcepts(concepts: Concept[]): void {
    const currentArray = this.selectedConceptsSubject.getValue();
    const newConcepts = concepts.filter(
      (concept) =>
        !currentArray.some(
          (tc) => tc.getTerminologyCode().getCode() === concept.getTerminologyCode().getCode()
        )
    );

    if (newConcepts.length > 0) {
      const updatedArray = [...currentArray, ...newConcepts];
      this.selectedConceptsSubject.next(updatedArray);
    }
  }

  public removeConcept(concept: Concept): void {
    const currentArray = this.selectedConceptsSubject.getValue();
    const updatedArray = currentArray.filter(
      (tc) => tc.getTerminologyCode().getCode() !== concept.getTerminologyCode().getCode()
    );

    if (updatedArray.length !== currentArray.length) {
      this.selectedConceptsSubject.next(updatedArray);
      this.terminologyCodeService.removeTerminologyCode(concept.getTerminologyCode().getCode());
    }
  }

  public getSelectedConcepts(): Observable<Array<Concept>> {
    return this.selectedConcepts$;
  }

  public getSelectedConceptsValue(): Array<Concept> {
    return this.selectedConceptsSubject.getValue();
  }

  public getTerminologyCodeDetails(code: string): TerminologyCode | undefined {
    return this.terminologyCodeService.getTerminologyCode(code);
  }

  public findConcept(concept: Concept): Concept | undefined {
    return this.selectedConceptsSubject
      .getValue()
      .find((tc) => tc.getTerminologyCode().getCode() === concept.getTerminologyCode().getCode());
  }

  public clearSelectedConceptFilter() {
    this.selectedConceptsSubject.next([]);
  }
}
