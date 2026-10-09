import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { inject, Injectable, Signal, signal } from '@angular/core'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

@Injectable({
  providedIn: 'root',
})
export class SelectedConceptFilterProviderService {
  private readonly selectedConceptsSignal = signal<Concept[]>([])

  constructor() {}

  public getSelectedConcepts(): Signal<Concept[]> {
    return this.selectedConceptsSignal.asReadonly()
  }

  public getSelectedConceptsValue(): Concept[] {
    return this.selectedConceptsSignal()
  }

  public initializeSelectedConcepts(concepts: Concept[]): void {
    this.selectedConceptsSignal.set(concepts)
  }

  public isConceptSelected(terminologyCode: TerminologyCode): boolean {
    return this.selectedConceptsSignal().some(
      (tc) =>
        tc.getTerminologyCode().getCode() === terminologyCode.getCode() &&
        tc.getTerminologyCode().getSystem() === terminologyCode.getSystem()
    )
  }

  public addConcept(concept: Concept): void {
    const current = this.selectedConceptsSignal()
    console.log(current)
    if (!current.some((tc) => this.isSameConcept(tc, concept))) {
      this.selectedConceptsSignal.set([...current, concept])
    } else {
      this.removeConcept(concept)
    }
  }

  public addConcepts(concepts: Concept[]): void {
    const current = this.selectedConceptsSignal()
    const newConcepts = concepts.filter(
      (concept) => !current.some((tc) => this.isSameConcept(tc, concept))
    )
    if (newConcepts.length > 0) {
      this.selectedConceptsSignal.set([...current, ...newConcepts])
    }
  }

  public removeConcept(concept: Concept): void {
    const updated = this.selectedConceptsSignal().filter((tc) => !this.isSameConcept(tc, concept))
    if (updated.length !== this.selectedConceptsSignal().length) {
      this.selectedConceptsSignal.set(updated)
    }
  }

  public findConcept(concept: Concept): Concept | undefined {
    return this.selectedConceptsSignal().find((tc) => this.isSameConcept(tc, concept))
  }

  public clearSelectedConceptFilter(): void {
    this.selectedConceptsSignal.set([])
  }

  public isSameConcept(a: Concept, b: Concept): boolean {
    return (
      a.getTerminologyCode().getCode() === b.getTerminologyCode().getCode() &&
      a.getTerminologyCode().getSystem() === b.getTerminologyCode().getSystem()
    )
  }
}
