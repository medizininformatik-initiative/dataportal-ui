import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { Directive, HostListener, inject, input, OnInit } from '@angular/core'
import { FeasibilityQuery } from '../../../model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/Validation/FeasibilityQueryValidationService.service'
import { StageProviderService } from '../../../service/Provider/StageProvider.service'

@Directive({
  selector: '[numAppDropGroup]',
  standalone: true,
})
export class DropGroupDirective implements OnInit {
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)
  private feasibilityQueryProviderService = inject(FeasibilityQueryProviderService)
  private stageProviderService = inject(StageProviderService) // ← untouched, stage is outside the facade

  readonly groupType = input<string>(undefined)

  criteria: string[][] = []
  feasibilityQuery: FeasibilityQuery

  ngOnInit() {
    this.feasibilityQueryProviderService
      .getActiveFeasibilityQuery()
      .subscribe((feasibilityQuery) => {
        this.feasibilityQuery = feasibilityQuery
      })
  }

  @HostListener('cdkDropListDropped', ['$event'])
  onDrop(event: CdkDragDrop<any[]>) {
    const droppedCriterion: string = event.item.data

    if (event.container.id !== event.previousContainer.id) {
      switch (event.container.id) {
        case 'Exclusion':
          this.addToExclusion(droppedCriterion, event.currentIndex)
          break
        case 'Inclusion':
          this.addToInclusion(droppedCriterion, event.currentIndex)
          break
        case 'Stage':
          this.stageProviderService.addOne(droppedCriterion)
          break
      }
      switch (event.previousContainer.id) {
        case 'Exclusion':
          this.deleteFromExclusion(droppedCriterion)
          break
        case 'Inclusion':
          this.deleteFromInclusion(droppedCriterion)
          break
        case 'Stage':
          this.stageProviderService.removeOne(droppedCriterion)
          break
      }
    } else {
      switch (event.container.id) {
        case 'Exclusion':
          this.moveCriterionInExclusion(droppedCriterion, event.previousIndex, event.currentIndex)
          break
        case 'Inclusion':
          this.moveCriterionInInclusion(droppedCriterion, event.previousIndex, event.currentIndex)
          break
      }
    }
  }

  // ─── Inclusion / Exclusion mutations → all go through facade ────────────────

  private addToInclusion(droppedCriterion: string, currentIndex: number): void {
    this.criteria = this.feasibilityQuery.getInclusionCriteria()
    this.addCriterionToInnerArray(this.criteria, droppedCriterion, currentIndex)
    this.feasibilityQueryProviderService.setInclusionCriteria(this.criteria)
  }

  private addToExclusion(droppedCriterion: string, currentIndex: number): void {
    this.criteria = this.feasibilityQuery.getExclusionCriteria()
    this.addCriterionToInnerArray(this.criteria, droppedCriterion, currentIndex)
    this.feasibilityQueryProviderService.setExclusionCriteria(this.criteria)
  }

  private deleteFromInclusion(droppedCriterion: string): void {
    const criteria = this.deleteCriterion(
      this.feasibilityQuery.getInclusionCriteria(),
      droppedCriterion
    )
    this.feasibilityQueryProviderService.setInclusionCriteria(criteria)
  }

  private deleteFromExclusion(droppedCriterion: string): void {
    const criteria = this.deleteCriterion(
      this.feasibilityQuery.getExclusionCriteria(),
      droppedCriterion
    )
    this.feasibilityQueryProviderService.setExclusionCriteria(criteria)
  }

  private moveCriterionInInclusion(
    criterionID: string,
    previousIndex: number,
    currentIndex: number
  ): void {
    this.criteria = this.feasibilityQuery.getInclusionCriteria()
    this.moveCriterion(criterionID, previousIndex, currentIndex)
    this.feasibilityQueryProviderService.setInclusionCriteria(this.criteria)
  }

  private moveCriterionInExclusion(
    criterionID: string,
    previousIndex: number,
    currentIndex: number
  ): void {
    this.criteria = this.feasibilityQuery.getExclusionCriteria()
    this.moveCriterion(criterionID, previousIndex, currentIndex)
    this.feasibilityQueryProviderService.setExclusionCriteria(this.criteria)
  }

  // ─── Pure logic — untouched ──────────────────────────────────────────────────

  private deleteCriterion(inexclusion: string[][], criterionID: string): string[][] {
    inexclusion.every((idArray) => {
      const index = idArray.indexOf(criterionID)
      if (index > -1) {
        idArray.splice(index, 1)
        return false
      }
      return true
    })
    return inexclusion.filter((item) => item.length > 0)
  }

  private moveCriterion(criterionID: string, previousIndex: number, currentIndex: number): void {
    const positionPrev = this.getPosition(this.criteria, previousIndex)
    const positionCurr = this.getPosition(this.criteria, currentIndex)
    let position = positionCurr
    if (previousIndex < currentIndex) {
      position =
        positionPrev[0] < positionCurr[0]
          ? [positionCurr[0] + 1, positionCurr[1]]
          : [positionCurr[0], positionCurr[1] + 1]
      this.addCriterionToPosition(this.criteria, criterionID, position)
      this.criteria = this.deleteCriterion(this.criteria, criterionID)
    } else {
      const addToInnerArray = positionPrev[1] > 0 || positionCurr[1] > 0
      this.criteria = this.deleteCriterion(this.criteria, criterionID)
      this.addCriterionToPosition(this.criteria, criterionID, positionCurr, addToInnerArray)
    }
  }

  private addCriterionToPosition(
    criteria: string[][],
    criterionID: string,
    position: [number, number],
    addToInnerArray?: boolean
  ): void {
    if (position[0] >= criteria.length) {
      this.criteria.push([criterionID])
    } else if (criteria[position[0]]?.length > 1 || addToInnerArray) {
      this.criteria[position[0]].splice(position[1], 0, criterionID)
    } else {
      this.criteria.splice(position[0], 0, [criterionID])
    }
  }

  private addCriterionToInnerArray(
    criteria: string[][],
    criterionID: string,
    currentIndex: number
  ): void {
    const position = this.getPosition(criteria, currentIndex)
    if (currentIndex >= criteria.length) {
      this.criteria.push([criterionID])
    } else if (criteria[position[0]]?.length > 1) {
      this.criteria[0].splice(position[1], 0, criterionID)
    } else {
      this.criteria.splice(position[0], 0, [criterionID])
    }
  }

  private getPosition(criteria: string[][], currentIndex: number): [number, number] {
    let position: [number, number] = [0, 0]
    let count = 0
    criteria.forEach((outer, outerIndex) => {
      outer.forEach((_, innerIndex) => {
        if (count === currentIndex) position = [outerIndex, innerIndex]
        count++
      })
    })
    return position
  }
}
