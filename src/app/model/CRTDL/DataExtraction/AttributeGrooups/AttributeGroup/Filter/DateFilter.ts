import { AbstractAttributeGroupFilter } from '../AbstractAttributeGroupFilter'

export class DateFilter extends AbstractAttributeGroupFilter {
  public start?: string
  public end?: string

  constructor(name: string, type: string, start?: string, end?: string) {
    super(type, name)
    this.start = start
    this.end = end
  }
}
