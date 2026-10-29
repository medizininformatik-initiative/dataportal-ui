import { AbstractTimeRestriction } from './AbstractTimeRestriction'

export class BeforeFilter extends AbstractTimeRestriction {
  constructor(beforeDate: string) {
    super(undefined, beforeDate)
  }
}
