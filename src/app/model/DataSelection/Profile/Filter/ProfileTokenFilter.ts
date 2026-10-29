import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { AbstractProfileFilter } from './AbstractProfileFilter'

export class ProfileTokenFilter extends AbstractProfileFilter {
  private readonly id: string
  public selectedTokens: Concept[] = []
  public valueSetUrls: string[]
  protected uiType: DataSelectionUIType = DataSelectionUIType.CODE

  constructor(id: string, name: string, type: string, valueSetUrls: string[], selectedTokens: Concept[]) {
    super(type, name)
    this.selectedTokens = selectedTokens
    this.valueSetUrls = valueSetUrls
  }

  public getValueSetUrls(): string[] {
    return this.valueSetUrls
  }

  public setValueSetUrls(valueSetUrls: string[]): void {
    this.valueSetUrls = valueSetUrls
  }

  public getSelectedTokens(): Concept[] {
    return this.selectedTokens
  }

  public setSelectedTokens(selectedTokens: Concept[]) {
    this.selectedTokens = selectedTokens
  }

  public setSelectedToken(selectedToken: Concept): Concept[] {
    if (this.selectedTokens.length > 0) {
      const index = this.selectedTokens.findIndex(
        (preSelectedToken) => preSelectedToken.getTerminologyCode().getCode() === selectedToken.getTerminologyCode().getCode()
      )
      if (index !== -1) {
        this.selectedTokens[index] = selectedToken
      } else {
        this.selectedTokens.push(selectedToken)
      }
    } else {
      this.selectedTokens.push(selectedToken)
    }
    return this.selectedTokens
  }

  public getId(): string {
    return this.id
  }
}
