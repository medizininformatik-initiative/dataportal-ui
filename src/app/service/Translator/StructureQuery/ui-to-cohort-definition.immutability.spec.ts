import { beforeEach, describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom } from 'rxjs'
import { buildQuery, criterion, included } from './ui-to-cohort-definition.fixtures'
import { UIQuery2CohortDefinitionService } from './UIQuery2CohortDefinition.service'

/** Own file: a failing run mutates the shared fixture constants, which must not leak into other specs. */
describe('UIQuery2CohortDefinitionService does not share memory with the UI', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('leaves the UI query and later translations alone when the output is changed', async () => {
    const query = buildQuery(included(criterion()))
    const translate = () =>
      firstValueFrom(
        TestBed.inject(UIQuery2CohortDefinitionService).translateActiveQueryToCohortDefinition()
      )
    const uiBefore = JSON.stringify(query)
    const first = JSON.stringify(await translate())

    const [criterionOut] = (await translate()).inclusionCriteria[0]
    criterionOut.context.code = 'changed'
    criterionOut.termCodes[0].code = 'changed'

    expect(JSON.stringify(query)).toBe(uiBefore)
    expect(JSON.stringify(await translate())).toBe(first)
  })
})
