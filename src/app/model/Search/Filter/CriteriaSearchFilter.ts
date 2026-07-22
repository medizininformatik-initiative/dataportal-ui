import { AbstractSearchFilter } from './AbstractSearchFilter'
import { CriteriaSearchFilterValue } from './CriteriaSearchFilterValue'
import { ElasticSearchFilterTypes } from '../../Utilities/ElasticSearchFilterTypes'

export class CriteriaSearchFilter extends AbstractSearchFilter<CriteriaSearchFilterValue> {
  protected declare name: ElasticSearchFilterTypes

  constructor(name: ElasticSearchFilterTypes, values: CriteriaSearchFilterValue[]) {
    super(name, values)
  }

  public override getName(): ElasticSearchFilterTypes {
    return this.name
  }

  public setName(name: ElasticSearchFilterTypes): void {
    this.name = name
  }

  public setValues(values: CriteriaSearchFilterValue[]): void {
    this.values = values
  }
}
