import { CdkDropList } from '@angular/cdk/drag-drop'
import { Component, computed, ElementRef, inject, input } from '@angular/core'
import { CriteriaBoxComponent } from '../../../../../shared/components/criteria-box/criteria-box.component'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'
import { StageProviderService } from '../../../../../service/Provider/StageProvider.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-stage',
  templateUrl: './criteria-stage.component.html',
  styleUrls: ['./criteria-stage.component.scss'],
  standalone: true,
  imports: [CdkDropList, DropGroupDirective, CriteriaBoxComponent, TranslateModule],
})
export class CriteriaStageComponent {
  readonly elementRef = inject(ElementRef)
  private readonly criterionProviderService = inject(CriterionProviderService)
  private readonly stageProviderService = inject(StageProviderService)

  readonly isEditable = input<boolean | undefined>(undefined)

  private readonly stageUIDs = toSignal(this.stageProviderService.getAll(), { initialValue: [] })
  private readonly allCriteria = toSignal(this.criterionProviderService.getAll(), {
    initialValue: [],
  })

  readonly criteriaArray = computed(() => {
    this.allCriteria()
    return this.stageUIDs().map((uid) => this.criterionProviderService.getOne(uid))
  })
}
