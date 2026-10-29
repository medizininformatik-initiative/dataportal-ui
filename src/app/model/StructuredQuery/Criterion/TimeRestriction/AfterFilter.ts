import { AbstractTimeRestriction } from './AbstractTimeRestriction'

export class AfterFilter extends AbstractTimeRestriction {
  constructor(afterDate: string) {
    super(afterDate)
  }
}
