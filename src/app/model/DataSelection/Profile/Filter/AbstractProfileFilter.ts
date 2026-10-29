import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'

/**
 * We assume that the name of the filter is unique and therefore is used by us as an id to identifie a filter
 */
export abstract class AbstractProfileFilter {
  private readonly type: string
  private name: string
  protected abstract readonly uiType: DataSelectionUIType

  constructor(type: string, name: string) {
    this.type = type
    this.name = name
  }

  public getName(): string {
    return this.name
  }

  public setName(name: string): void {
    this.name = name
  }

  public getUiType(): DataSelectionUIType {
    return this.uiType
  }

  public getType(): string {
    return this.type
  }
}
