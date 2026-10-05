import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numBulkSearch } from '../component-objects/NumBulkSearch'

defineStep('I enter the bulk search codes {string}', (codes: string) => {
  numBulkSearch.enterCodes(codes)
})
defineStep('I select the bulk search terminology {string}', (system: string) => {
  numBulkSearch.selectTerminology(system)
})
defineStep('I select the bulk search context {string}', (context: string) => {
  numBulkSearch.selectContext(context)
})
defineStep('I run the bulk search', () => {
  numBulkSearch.search()
})
defineStep('the bulk search button should be enabled', () => {
  numBulkSearch.shouldHaveSearchButtonEnabled()
})
defineStep('the bulk search button should be disabled', () => {
  numBulkSearch.shouldHaveSearchButtonDisabled()
})
defineStep('the bulk search should have found {int} codes', (count: number) => {
  numBulkSearch.shouldShowFoundCount(count)
})
defineStep('the bulk search should not have found {int} codes', (count: number) => {
  numBulkSearch.shouldShowNotFoundCount(count)
})
defineStep('the bulk search result should list the code {string}', (code: string) => {
  numBulkSearch.shouldListCode(code)
})
