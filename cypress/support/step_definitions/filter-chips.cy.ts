import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numFilterChips } from '../component-objects/NumFilterChips'

defineStep(
  'I see the criterium {string} with filter chip block {string}',
  (criterium: string, blockName: string) => {
    numFilterChips.getFilterChipBlock(criterium, blockName)
  }
)

defineStep(
  'I see the criterium {string} with filter chip {string} in the block {string}',
  (criterium: string, chipName: string, blockName: string) => {
    numFilterChips.getFilterChipByName(criterium, chipName, blockName)
  }
)
