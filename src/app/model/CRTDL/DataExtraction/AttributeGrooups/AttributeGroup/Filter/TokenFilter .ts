import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { AbstractAttributeGroupFilter } from '../AbstractAttributeGroupFilter'

export class TokenFilter extends AbstractAttributeGroupFilter {
  public codes: TerminologyCode[]

  constructor(name: string, type: string, codes?: TerminologyCode[]) {
    super(type, name)
    this.codes = codes
  }
}
