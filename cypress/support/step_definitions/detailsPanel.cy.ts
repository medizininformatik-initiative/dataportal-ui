import { defineStep } from '../defineStep'
import { numDetailsPanel } from '../component-objects/NumDetailsPanel'
import { numTable } from '../component-objects/NumTable'

defineStep('I click on the row containing {string}', (text: string) => {
  numTable.getRowByText(text).find('td').contains(text).click()
})
defineStep('the details panel should be open', () => numDetailsPanel.shouldBeOpen())
defineStep('the details panel should be closed', () => numDetailsPanel.shouldBeClosed())
defineStep('I close the details panel', () => numDetailsPanel.close())
defineStep('I open the details panel tab {string}', (label: string) =>
  numDetailsPanel.openTab(label)
)
defineStep('the details panel should offer the tab {string}', (label: string) =>
  numDetailsPanel.shouldOfferTab(label)
)
defineStep('the details panel should show the title {string}', (title: string) =>
  numDetailsPanel.shouldShowTitle(title)
)
defineStep('I click on the related criterium {string} in the details panel', (name: string) => {
  numDetailsPanel.relative(name).click()
})
defineStep('I open the menu of the related criterium {string}', (name: string) => {
  numDetailsPanel.relative(name).find('[data-cy="openMenu"]').click()
})
