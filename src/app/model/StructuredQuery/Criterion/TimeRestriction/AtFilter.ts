import { AbstractTimeRestriction } from './AbstractTimeRestriction'

export class AtFilter extends AbstractTimeRestriction {
  constructor(afterDate: string, beforeDate: string) {
    super(afterDate, beforeDate)
  }
}
