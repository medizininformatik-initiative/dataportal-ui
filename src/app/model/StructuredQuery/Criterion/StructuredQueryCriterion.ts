import { TerminologyCode } from '../../Terminology/TerminologyCode'
import { AbstractStructuredQueryFilters } from './Abstract/AbstractStructuredQueryFilters'
import { AbstractTimeRestriction } from './TimeRestriction/AbstractTimeRestriction'

export class StructuredQueryCriterion {
  private attributeFilters?: Array<AbstractStructuredQueryFilters> = []
  private context?: TerminologyCode
  private termCodes: Array<TerminologyCode> = []
  private timeRestriction?: AbstractTimeRestriction
  private valueFilter?: AbstractStructuredQueryFilters

  constructor(
    termCodes: Array<TerminologyCode> = [],
    attributeFilters?: Array<AbstractStructuredQueryFilters>,
    context?: TerminologyCode,
    timeRestriction?: AbstractTimeRestriction,
    valueFilter?: AbstractStructuredQueryFilters
  ) {
    this.termCodes = termCodes
    this.attributeFilters = attributeFilters
    this.context = context
    this.timeRestriction = timeRestriction
    this.valueFilter = valueFilter
  }

  public getTermCodes(): Array<TerminologyCode> {
    return this.termCodes
  }

  public setTermCodes(termCodes: Array<TerminologyCode>): void {
    this.termCodes = termCodes
  }

  public getAttributeFilters(): Array<AbstractStructuredQueryFilters> | undefined {
    return this.attributeFilters
  }

  public setAttributeFilters(attributeFilters?: Array<AbstractStructuredQueryFilters>): void {
    this.attributeFilters = attributeFilters
  }

  public getContext(): TerminologyCode | undefined {
    return this.context
  }

  public setContext(context?: TerminologyCode): void {
    this.context = context
  }

  public getTimeRestriction(): AbstractTimeRestriction | undefined {
    return this.timeRestriction
  }

  public setTimeRestriction(timeRestriction?: AbstractTimeRestriction): void {
    this.timeRestriction = timeRestriction
  }

  public getValueFilter(): AbstractStructuredQueryFilters | undefined {
    return this.valueFilter
  }

  public setValueFilter(valueFilter?: AbstractStructuredQueryFilters): void {
    this.valueFilter = valueFilter
  }
}
