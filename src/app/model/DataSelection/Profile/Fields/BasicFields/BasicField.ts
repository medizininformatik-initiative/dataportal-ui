import { Display } from '../../Display';
import { AbstractField } from '../AbstractField';

export class BasicField extends AbstractField {
  private children: BasicField[] = [];
  private isSelected: boolean;

  constructor(
    elementId: string,
    display: Display,
    description: Display,
    children: BasicField[],
    recommended: boolean,
    isSelected: boolean,
    isRequired: boolean,
    deprecated: boolean,
    type: string
  ) {
    super(elementId, display, description, isRequired, recommended, deprecated, type);
    this.children = children;
    this.isSelected = isSelected;
  }

  public getChildren(): BasicField[] {
    return this.children;
  }

  public setChildren(abstractField: BasicField[]): void {
    this.children = abstractField;
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }

  public setIsSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
  }
}
