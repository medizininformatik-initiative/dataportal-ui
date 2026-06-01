import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
} from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { map, Observable, of, Subscription } from 'rxjs'
import { StageProviderService } from '../../../../../service/Provider/StageProvider.service'
import { CdkDropList } from '@angular/cdk/drag-drop'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'
import { CriteriaBoxComponent } from '../../../../../shared/components/criteria-box/criteria-box.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-stage',
  templateUrl: './criteria-stage.component.html',
  styleUrls: ['./criteria-stage.component.scss'],
  standalone: true,
  imports: [CdkDropList, DropGroupDirective, CriteriaBoxComponent, AsyncPipe, TranslateModule],
})
export class CriteriaStageComponent implements AfterViewInit, OnDestroy {
  elementRef = inject(ElementRef)
  private criterionProviderService = inject(CriterionProviderService)
  private stageProviderService = inject(StageProviderService)
  private changeDetectorRef = inject(ChangeDetectorRef)

  readonly isEditable = input<boolean>(undefined)
  public $criterionUIDMap: Observable<Array<Criterion>>

  public $stageUIDMap: Observable<Array<string>>

  public $criteriaArray: Observable<Criterion[]> = of([])

  private subscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

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
