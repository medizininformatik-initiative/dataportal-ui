import { AsyncPipe } from '@angular/common'
import { CdkDropList } from '@angular/cdk/drag-drop'
import { CriteriaBoxComponent } from '../../../../../shared/components/criteria-box/criteria-box.component'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/Internal/FeasibilityQueryValidationService.service'
import { map, Observable, of, Subscription } from 'rxjs'
import { StageProviderService } from '../../../../../service/Provider/StageProvider.service'
import { TranslateModule } from '@ngx-translate/core'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
} from '@angular/core'

@Component({
  selector: 'num-criteria-stage',
  templateUrl: './criteria-stage.component.html',
  styleUrls: ['./criteria-stage.component.scss'],
  standalone: true,
  imports: [CdkDropList, DropGroupDirective, CriteriaBoxComponent, AsyncPipe, TranslateModule],
})
export class CriteriaStageComponent implements AfterViewInit, OnDestroy {
  elementRef = inject(ElementRef)
  private feasibility = inject(FeasibilityQueryProviderService)
  private criterionProviderService = inject(CriterionProviderService)
  private stageProviderService = inject(StageProviderService)
  private changeDetectorRef = inject(ChangeDetectorRef)
  private test = inject(FeasibilityQueryValidationService)

  readonly isEditable = input<boolean>(undefined)
  public $criterionUIDMap: Observable<Array<Criterion>>

  public $stageUIDMap: Observable<Array<string>>

  public $criteriaArray: Observable<Criterion[]> = of([])

  private subscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    console.log(this.test.validationState().isValid)
  }

  ngAfterViewInit() {
    this.getCriterionArray()
    this.subscribeToCriterionUIDMap()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  public getCriterionArray() {
    this.$criteriaArray = of([])
    this.$stageUIDMap = this.stageProviderService.getAll()
    this.$criterionUIDMap = this.criterionProviderService.getAll()

    this.$criteriaArray = this.$stageUIDMap.pipe(
      map((uids: string[]) =>
        uids.map((uid) => {
          const criterion = this.criterionProviderService.getOne(uid)
          return criterion
        })
      )
    )
  }

  public subscribeToCriterionUIDMap(): void {
    this.subscription = this.$criterionUIDMap.subscribe(() => {
      this.changeDetectorRef.detectChanges()
      this.getCriterionArray()
    })
  }
}
