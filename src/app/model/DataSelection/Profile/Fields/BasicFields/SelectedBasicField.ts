import { AbstractSelectedField } from '../AbstractSelectedField'
import { SelectedField } from '../SelectedField'
import { BasicField } from './BasicField'

export class SelectedBasicField extends AbstractSelectedField {
  private readonly selectedField: SelectedField<BasicField>

  constructor(field: BasicField, mustHave: boolean) {
    super(mustHave)
    this.selectedField = new SelectedField(field, mustHave)
  }

  public setSelectedField(field: BasicField): void {
    this.selectedField.setField(field)
  }

  public getSelectedField(): BasicField {
    return this.selectedField.getField()
  }

  public getDisplay() {
    return this.selectedField.getField().getDisplay()
  }

  public getDescription() {
    return this.selectedField.getField().getDescription()
  }

  public getElementId() {
    return this.selectedField.getField().getElementId()
  }

  public getIsRequired(): boolean {
    return this.selectedField.getField().getIsRequired()
  }
}
