import { Component, computed, effect, inject, OnInit } from '@angular/core'
import { DataDefinitionValidationService } from 'src/app/service/Validation/DataDefinitionValidation.service'
import { ModalWindowComponent } from '../shared-components.module'

@Component({
  selector: 'num-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss'],
  imports: [ModalWindowComponent],
})
export class ValidationModalComponent implements OnInit {
  private readonly dataDefinitionValidationService = inject(DataDefinitionValidationService)

  readonly validationStatus = computed(() =>
    this.dataDefinitionValidationService.getDataDefinitionValidationStatus()
  )
  constructor() {
    effect(() => {
      const validationStatus =
        this.dataDefinitionValidationService.getDataDefinitionValidationStatus()
      console.log('Validation status:', validationStatus)
    })
  }

  ngOnInit() {
    console.log('ValidationModalComponent initialized')
  }
}
