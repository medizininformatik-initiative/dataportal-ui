import { inject, Injectable, Signal, signal } from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

@Injectable({
  providedIn: 'root',
})
export class SelectedConceptFilterProviderService {
  private readonly selectedConceptsSignal = signal<Concept[]>([])

  constructor() {}

  /**
   * Returns the selected concepts as a read-only signal.
   * @returns {Signal<Concept[]>}
   */
  public getSelectedConcepts(): Signal<Concept[]> {
    return this.selectedConceptsSignal.asReadonly()
  }

  /**
   * Returns the current value of the selected concepts.
   * @returns {Concept[]}
   */
  public getSelectedConceptsValue(): Concept[] {
    return this.selectedConceptsSignal()
  }

  /**
   * Replaces the selected concepts with the given ones.
   * @param {Concept[]} concepts
   */
  public initializeSelectedConcepts(concepts: Concept[]): void {
    this.selectedConceptsSignal.set(concepts)
  }

  /**
   * Checks whether a concept with the given terminology code is selected.
   * @param {TerminologyCode} terminologyCode
   * @returns {boolean}
   */
  public isConceptSelected(terminologyCode: TerminologyCode): boolean {
    return this.selectedConceptsSignal().some(
      (tc: Concept) =>
        tc.getTerminologyCode().getCode() === terminologyCode.getCode() &&
        tc.getTerminologyCode().getSystem() === terminologyCode.getSystem()
    )
  }

  /**
   * Adds a concept to the selection if it is not already selected.
   * @param {Concept} concept
   */
  public addConcept(concept: Concept): void {
    const current = this.selectedConceptsSignal()
    console.log(current)
    if (!current.some((tc: Concept) => this.isSameConcept(tc, concept))) {
      this.selectedConceptsSignal.set([...current, concept])
    } else {
      this.removeConcept(concept)
    }
  }

  /**
   * Adds the concepts that are not yet selected.
   * @param {Concept[]} concepts
   */
  public addConcepts(concepts: Concept[]): void {
    const current = this.selectedConceptsSignal()
    const newConcepts = concepts.filter((concept: Concept) => !current.some((tc: Concept) => this.isSameConcept(tc, concept)))
    if (newConcepts.length > 0) {
      this.selectedConceptsSignal.set([...current, ...newConcepts])
    }
  }

  /**
   * Removes a concept from the selection.
   * @param {Concept} concept
   */
  public removeConcept(concept: Concept): void {
    const updated = this.selectedConceptsSignal().filter((tc: Concept) => !this.isSameConcept(tc, concept))
    if (updated.length !== this.selectedConceptsSignal().length) {
      this.selectedConceptsSignal.set(updated)
    }
  }

  /**
   * Finds the selected concept that matches the given one.
   * @param {Concept} concept
   * @returns {Concept | undefined}
   */
  public findConcept(concept: Concept): Concept | undefined {
    return this.selectedConceptsSignal().find((tc: Concept) => this.isSameConcept(tc, concept))
  }

  /**
   * Clears the selection.
   */
  public clearSelectedConceptFilter(): void {
    this.selectedConceptsSignal.set([])
  }

  /**
   * Checks whether two concepts have the same code and system.
   * @param {Concept} a
   * @param {Concept} b
   * @returns {boolean}
   */
  public isSameConcept(a: Concept, b: Concept): boolean {
    return (
      a.getTerminologyCode().getCode() === b.getTerminologyCode().getCode() &&
      a.getTerminologyCode().getSystem() === b.getTerminologyCode().getSystem()
    )
  }
}
