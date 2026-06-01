import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField'
import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core'
import { FieldsTreeAdapter } from 'src/app/shared/models/TreeNode/Adapter/FieldTreeAdapter'
import { map, Subscription, take } from 'rxjs'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { SelectedBasicFieldCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/SelectedFieldCloner'
import { SelectedProfileFieldsService } from 'src/app/service/DataSelection/Selection/SelectedProfileFields.service'
import { TreeNode } from 'src/app/shared/models/TreeNode/TreeNodeInterface'
import { MatTabGroup, MatTab } from '@angular/material/tabs'
import { InformationSectionComponent } from '../../../../shared/components/information-section/information-section.component'
import { TreeComponent } from '../../../../shared/components/tree/tree.component'
import { SectionNameComponent } from '../../../../shared/components/section-name/section-name.component'
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-edit-fields',
  templateUrl: './edit-fields.component.html',
  styleUrls: ['./edit-fields.component.scss'],
  providers: [SelectedProfileFieldsService],
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    InformationSectionComponent,
    TreeComponent,
    SectionNameComponent,
    CheckboxComponent,
    MatTooltip,
    FontAwesomeModule,
    TranslateModule,
    DisplayTranslationPipe,
  ],
})
export class EditFieldsComponent implements OnInit, OnDestroy {
  private selectedDataSelectionProfileFieldsService = inject(SelectedProfileFieldsService)

  readonly fieldTree = input<BasicField[]>()

  readonly selectedBasicFields = input<SelectedBasicField[]>()

  readonly updatedSelectedBasicFields = output<SelectedBasicField[]>()

  tree: TreeNode[] = []
  deepCopyFieldsSubscription: Subscription
  private localFieldTree: BasicField[] = []
  private localSelectedBasicFields: SelectedBasicField[] = []

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  ngOnInit() {
    this.localFieldTree = [...this.fieldTree()]
    this.localSelectedBasicFields = [...this.selectedBasicFields()]
    this.traversAndUpddateTree()
    this.buildTreeFromProfileFields()
  }

  ngOnDestroy(): void {
    this.deepCopyFieldsSubscription?.unsubscribe()
  }

  private buildTreeFromProfileFields(): void {
    this.selectedDataSelectionProfileFieldsService.setDeepCopyFields(this.localFieldTree)
    this.deepCopyFieldsSubscription?.unsubscribe()
    this.deepCopyFieldsSubscription = this.selectedDataSelectionProfileFieldsService
      .getDeepCopyBasicFields()
      .pipe(
        take(1),
        map((profileFields: BasicField[]) => {
          this.setSelectedChildrenFields()
          this.tree = FieldsTreeAdapter.fromTree(profileFields)
        })
      )
      .subscribe()
  }

  public setSelectedChildrenFields() {
    this.localSelectedBasicFields.forEach((field) => {
      this.selectedDataSelectionProfileFieldsService.addToSelection(field)
    })
  }

  public traversAndUpddateTree() {
    this.selectedDataSelectionProfileFieldsService.updateSelectionStatus(
      this.localFieldTree,
      this.localSelectedBasicFields
    )
  }

  public setSelectedFieldElement(element) {
    const node: BasicField = element.originalEntry as BasicField
    const index = this.getIndexInSelectedFields(node.getElementId())
    if (index !== -1) {
      node.setIsSelected(false)
      this.spliceAndEmit(index)
    } else {
      node.setIsSelected(true)
      this.addNodeToSelectedFields(node)
    }
    this.traversAndUpddateTree()
  }

  private getIndexInSelectedFields(elementId: string): number {
    return this.localSelectedBasicFields.findIndex(
      (selectedField) => selectedField.getSelectedField().getElementId() === elementId
    )
  }

  public setFieldAsRequired(selectedField: SelectedBasicField) {
    selectedField.setMustHave(!selectedField.getMustHave())
    this.emitUpdatedSelectedFields()
  }

  public removeSelectedField(node: SelectedBasicField): void {
    const index = this.getIndexInSelectedFields(node.getElementId())
    if (index !== -1) {
      this.spliceAndEmit(index)
      this.localFieldTree = this.selectedDataSelectionProfileFieldsService.updateNodeInDeepCopy(
        this.localFieldTree,
        node.getSelectedField(),
        false
      )
      this.tree = FieldsTreeAdapter.fromTree(this.localFieldTree)
    }
  }

  private spliceAndEmit(index: number): void {
    this.localSelectedBasicFields.splice(index, 1)
    this.emitUpdatedSelectedFields()
  }

  private addNodeToSelectedFields(node: BasicField): void {
    const selectedField = new SelectedBasicField(node, false)
    this.localSelectedBasicFields.push(selectedField)
    this.selectedDataSelectionProfileFieldsService.addToSelection(selectedField)
    this.emitUpdatedSelectedFields()
  }

  private emitUpdatedSelectedFields(): void {
    const clonedSelectedFields = SelectedBasicFieldCloner.deepCopySelectedBasicFields(
      this.localSelectedBasicFields
    )
    this.updatedSelectedBasicFields.emit(clonedSelectedFields)
    this.traversAndUpddateTree()
  }
}
