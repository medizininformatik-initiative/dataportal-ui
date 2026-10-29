import { CdkDropList } from '@angular/cdk/drag-drop'
import { Component, computed, ElementRef, inject, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { StageProviderService } from '../../../../../service/Provider/StageProvider.service'
import { CriteriaBoxComponent } from '../../../../../shared/components/criteria-box/criteria-box.component'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'

@Component({
  selector: 'num-criteria-stage',
  templateUrl: './criteria-stage.component.html',
  styleUrls: ['./criteria-stage.component.scss'],
  standalone: true,
  imports: [CdkDropList, DropGroupDirective, CriteriaBoxComponent, TranslateModule],
})
export class CriteriaStageComponent {
  public readonly elementRef = inject(ElementRef)
  private readonly criterionProviderService = inject(CriterionProviderService)
  private readonly stageProviderService = inject(StageProviderService)

  public readonly isEditable = input<boolean | undefined>(undefined)

  private readonly stageUIDs = toSignal(this.stageProviderService.getAll(), { initialValue: [] })
  private readonly allCriteria = toSignal(this.criterionProviderService.getAll(), {
    initialValue: [],
  })

  public readonly criteriaArray = computed(() => {
    this.allCriteria()
    return this.stageUIDs().map((uid: string) => this.criterionProviderService.getOne(uid))
  })
}
