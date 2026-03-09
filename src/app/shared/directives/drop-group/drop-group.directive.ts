import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FeasibilityQueryProviderService } from '../../../service/Provider/FeasibilityQueryProvider.service';
import { FeasibilityQuery } from '../../../model/FeasibilityQuery/FeasibilityQuery';
import { StageProviderService } from '../../../service/Provider/StageProvider.service';

@Directive({
  selector: '[numAppDropGroup]',
})
export class DropGroupDirective implements OnInit {
  @Input() groupType: string;

  criteria: string[][] = [];
  feasibilityQuery: FeasibilityQuery;
  constructor(
    private queryProviderService: FeasibilityQueryProviderService,
    private stageProviderService: StageProviderService,
    private elementRef: ElementRef
  ) {}

  @HostListener('cdkDropListDropped', ['$event'])
  onDrop(event: CdkDragDrop<any[]>) {
    const groupType = this.groupType || this.elementRef.nativeElement.getAttribute('groupType');
    const droppedCriterion: string = event.item.data;
    if (event.container.id !== event.previousContainer.id) {
      switch (event.container.id) {
        case 'Exclusion':
          this.addToExclusion(droppedCriterion, event.currentIndex);
          break;
        case 'Inclusion':
          this.addToInclusion(droppedCriterion, event.currentIndex);
          break;
        case 'Stage':
          this.stageProviderService.addOne(droppedCriterion);
          break;
        default:
          break;
      }
      switch (event.previousContainer.id) {
        case 'Exclusion':
          this.deleteFromExclusion(droppedCriterion);
          break;
        case 'Inclusion':
          this.deleteFromInclusion(droppedCriterion);
          break;
        case 'Stage':
          this.stageProviderService.removeOne(droppedCriterion);
          break;
        default:
          break;
      }
    } else {
      switch (event.container.id) {
        case 'Exclusion':
          this.moveCriterionInExclusion(droppedCriterion, event.previousIndex, event.currentIndex);
          break;
        case 'Inclusion':
          this.moveCriterionInInclusion(droppedCriterion, event.previousIndex, event.currentIndex);
          break;
        default:
          break;
      }
    }
  }

  ngOnInit() {
    this.queryProviderService.getActiveFeasibilityQuery().subscribe((feasibilityQuery) => {
      this.feasibilityQuery = feasibilityQuery;
    });
  }
  private addToInclusion(droppedCriterion: string, currentIndex: number): void {
    this.criteria = this.feasibilityQuery.getInclusionCriteria();
    this.addCriterionToInnerArray(this.criteria, droppedCriterion, currentIndex);
    this.queryProviderService.setInclusionCriteria(this.criteria);
  }
  private addToExclusion(droppedCriterion: string, currentIndex: number): void {
    this.criteria = this.feasibilityQuery.getExclusionCriteria();
    this.addCriterionToInnerArray(this.criteria, droppedCriterion, currentIndex);
    this.queryProviderService.setExclusionCriteria(this.criteria);
  }

  private deleteFromInclusion(droppedCriterion: string): void {
    const criteria = this.deleteCriterion(
      this.feasibilityQuery.getInclusionCriteria(),
      droppedCriterion
    );
    this.queryProviderService.setInclusionCriteria(criteria);
  }
  private deleteFromExclusion(droppedCriterion: string): void {
    const criteria = this.deleteCriterion(
      this.feasibilityQuery.getExclusionCriteria(),
      droppedCriterion
    );
    this.queryProviderService.setExclusionCriteria(criteria);
  }

  private deleteCriterion(inexclusion: string[][], criterionID: string): string[][] {
    inexclusion.every((idArray) => {
      const index = idArray.indexOf(criterionID);
      if (index > -1) {
        idArray.splice(index, 1);
        return false;
      }
      return true;
    });
    inexclusion = inexclusion.filter((item) => item.length > 0);
    return inexclusion;
  }
  private moveCriterionInInclusion(
    criterionID: string,
    previousIndex: number,
    currentIndex: number
  ): void {
    this.criteria = this.feasibilityQuery.getInclusionCriteria();
    this.moveCriterion(criterionID, previousIndex, currentIndex);
    this.queryProviderService.setInclusionCriteria(this.criteria);
  }
  private moveCriterionInExclusion(
    criterionID: string,
    previousIndex: number,
    currentIndex: number
  ): void {
    this.criteria = this.feasibilityQuery.getExclusionCriteria();
    this.moveCriterion(criterionID, previousIndex, currentIndex);
    this.queryProviderService.setExclusionCriteria(this.criteria);
  }

  private moveCriterion(criterionID: string, previousIndex: number, currentIndex: number): void {
    const positionPrev = this.getPosition(this.criteria, previousIndex);
    const positionCurr = this.getPosition(this.criteria, currentIndex);
    let position = positionCurr;
    if (previousIndex < currentIndex) {
      if (positionPrev[0] < positionCurr[0]) {
        position = [positionCurr[0] + 1, positionCurr[1]];
      } else {
        position = [positionCurr[0], positionCurr[1] + 1];
      }
      this.addCriterionToPosition(this.criteria, criterionID, position);
      this.criteria = this.deleteCriterion(this.criteria, criterionID);
    } else {
      const addToInnerArray = positionPrev[1] > 0 || positionCurr[1] > 0;
      this.criteria = this.deleteCriterion(this.criteria, criterionID);
      this.addCriterionToPosition(this.criteria, criterionID, positionCurr, addToInnerArray);
    }
  }
  private addCriterionToPosition(
    criteria: string[][],
    criterionID: string,
    position: [number, number],
    addToInnerArray?: boolean
  ): void {
    if (position[0] >= criteria.length) {
      this.criteria.push([criterionID]);
    } else {
      if (criteria[position[0]]?.length > 1 || addToInnerArray) {
        this.criteria[position[0]].splice(position[1], 0, criterionID);
      } else {
        this.criteria.splice(position[0], 0, [criterionID]);
      }
    }
  }

  private addCriterionToInnerArray(
    criteria: string[][],
    criterionID: string,
    currentIndex: number
  ): void {
    const position = this.getPosition(criteria, currentIndex);
    if (currentIndex >= criteria.length) {
      this.criteria.push([criterionID]);
    } else {
      if (criteria[position[0]]?.length > 1) {
        this.criteria[0].splice(position[1], 0, criterionID);
      } else {
        this.criteria.splice(position[0], 0, [criterionID]);
      }
    }
  }

  private getPosition(criteria: string[][], currentIndex: number): [number, number] {
    let position: [number, number] = [0, 0];
    let count = 0;
    criteria.forEach((outer, outerIndex) => {
      outer.forEach((inner, innerIndex) => {
        if (count === currentIndex) {
          position = [outerIndex, innerIndex];
        }
        count++;
      });
    });
    return position;
  }
}
