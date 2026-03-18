import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FieldsTreeAdapter } from 'src/app/shared/models/TreeNode/Adapter/FieldTreeAdapter';
import { map, Subscription, take } from 'rxjs';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedBasicFieldCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/SelectedFieldCloner';
import { SelectedProfileFieldsService } from 'src/app/service/DataSelection/Selection/SelectedProfileFields.service';
import { TreeNode } from 'src/app/shared/models/TreeNode/TreeNodeInterface';

@Component({
  selector: 'num-edit-fields',
  templateUrl: './edit-fields.component.html',
  styleUrls: ['./edit-fields.component.scss'],
  providers: [SelectedProfileFieldsService],
})
export class EditFieldsComponent implements OnInit, OnDestroy {
  @Input()
  fieldTree: BasicField[];

  @Input()
  selectedBasicFields: SelectedBasicField[];

  @Output()
  updatedSelectedBasicFields: EventEmitter<SelectedBasicField[]> = new EventEmitter<
    SelectedBasicField[]
  >();

  tree: TreeNode[] = [];
  deepCopyFieldsSubscription: Subscription;
  constructor(private selectedDataSelectionProfileFieldsService: SelectedProfileFieldsService) {}

  ngOnInit() {
    this.traversAndUpddateTree();
    this.buildTreeFromProfileFields();
  }

  ngOnDestroy(): void {
    this.deepCopyFieldsSubscription?.unsubscribe();
  }

  private buildTreeFromProfileFields(): void {
    this.selectedDataSelectionProfileFieldsService.setDeepCopyFields(this.fieldTree);
    this.deepCopyFieldsSubscription?.unsubscribe();
    this.deepCopyFieldsSubscription = this.selectedDataSelectionProfileFieldsService
      .getDeepCopyBasicFields()
      .pipe(
        take(1),
        map((profileFields: BasicField[]) => {
          this.setSelectedChildrenFields();
          this.tree = FieldsTreeAdapter.fromTree(profileFields);
        })
      )
      .subscribe();
  }

  public setSelectedChildrenFields() {
    this.selectedBasicFields.forEach((field) => {
      this.selectedDataSelectionProfileFieldsService.addToSelection(field);
    });
  }

  public traversAndUpddateTree() {
    this.selectedDataSelectionProfileFieldsService.updateSelectionStatus(
      this.fieldTree,
      this.selectedBasicFields
    );
  }

  public setSelectedFieldElement(element) {
    const node: BasicField = element.originalEntry as BasicField;
    const index = this.getIndexInSelectedFields(node.getElementId());
    if (index !== -1) {
      node.setIsSelected(false);
      this.spliceAndEmit(index);
    } else {
      node.setIsSelected(true);
      this.addNodeToSelectedFields(node);
    }
    this.traversAndUpddateTree();
  }

  private getIndexInSelectedFields(elementId: string): number {
    return this.selectedBasicFields.findIndex(
      (selectedField) => selectedField.getSelectedField().getElementId() === elementId
    );
  }

  public setFieldAsRequired(selectedField: SelectedBasicField) {
    selectedField.setMustHave(!selectedField.getMustHave());
    this.emitUpdatedSelectedFields();
  }

  public removeSelectedField(node: SelectedBasicField): void {
    const index = this.getIndexInSelectedFields(node.getElementId());
    if (index !== -1) {
      this.spliceAndEmit(index);
      this.fieldTree = this.selectedDataSelectionProfileFieldsService.updateNodeInDeepCopy(
        this.fieldTree,
        node.getSelectedField(),
        false
      );
      this.tree = FieldsTreeAdapter.fromTree(this.fieldTree);
    }
  }

  private spliceAndEmit(index: number): void {
    this.selectedBasicFields.splice(index, 1);
    this.emitUpdatedSelectedFields();
  }

  private addNodeToSelectedFields(node: BasicField): void {
    const selectedField = new SelectedBasicField(node, false);
    this.selectedBasicFields.push(selectedField);
    this.selectedDataSelectionProfileFieldsService.addToSelection(selectedField);
    this.emitUpdatedSelectedFields();
  }

  private emitUpdatedSelectedFields(): void {
    const clonedSelectedFields = SelectedBasicFieldCloner.deepCopySelectedBasicFields(
      this.selectedBasicFields
    );
    this.updatedSelectedBasicFields.emit(clonedSelectedFields);
    this.traversAndUpddateTree();
  }
}
