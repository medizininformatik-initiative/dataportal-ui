import { defineStep } from '../defineStep'
import { numFilterChips } from '../component-objects/NumFilterChips'

/**
 * Steps for filter chips of criteria boxes.
 * */
export class FilterChips {
  /**
   * Assert criterium shows filter chip block.
   * */
  public shouldShowBlock(criterium: string, blockName: string) {
    numFilterChips.getFilterChipBlock(criterium, blockName)
  }

  /**
   * Assert criterium shows chip inside block.
   * */
  public shouldShowChip(criterium: string, chipName: string, blockName: string) {
    numFilterChips.getFilterChipByName(criterium, chipName, blockName)
  }
}

export const filterChips = new FilterChips()

defineStep(
  'I see the criterium {string} with filter chip block {string}',
  (criterium: string, blockName: string) => filterChips.shouldShowBlock(criterium, blockName)
)
defineStep(
  'I see the criterium {string} with filter chip {string} in the block {string}',
  (criterium: string, chipName: string, blockName: string) =>
    filterChips.shouldShowChip(criterium, chipName, blockName)
)
