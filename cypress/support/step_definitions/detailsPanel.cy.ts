import { defineStep } from '../defineStep'
import { numDetailsPanel } from '../component-objects/NumDetailsPanel'
import { numTable } from '../component-objects/NumTable'

export class DetailsPanel {
  public clickRow(text: string) {
    numTable.getRowByText(text).find('td').contains(text).click()
  }

  public shouldBeOpen() {
    numDetailsPanel.shouldBeOpen()
  }

  public shouldBeClosed() {
    numDetailsPanel.shouldBeClosed()
  }

  public close() {
    numDetailsPanel.close()
  }

  public openTab(label: string) {
    numDetailsPanel.openTab(label)
  }

  public shouldOfferTab(label: string) {
    numDetailsPanel.shouldOfferTab(label)
  }

  public shouldShowTitle(title: string) {
    numDetailsPanel.shouldShowTitle(title)
  }

  public clickRelated(name: string) {
    numDetailsPanel.relative(name).click()
  }

  public openMenuOfRelated(name: string) {
    numDetailsPanel.relative(name).find('[data-cy="openMenu"]').click()
  }
}

export const detailsPanel = new DetailsPanel()

defineStep('I click on the row containing {string}', (text: string) => detailsPanel.clickRow(text))
defineStep('the details panel should be open', () => detailsPanel.shouldBeOpen())
defineStep('the details panel should be closed', () => detailsPanel.shouldBeClosed())
defineStep('I close the details panel', () => detailsPanel.close())
defineStep('I open the details panel tab {string}', (label: string) => detailsPanel.openTab(label))
defineStep('the details panel should offer the tab {string}', (label: string) =>
  detailsPanel.shouldOfferTab(label)
)
defineStep('the details panel should show the title {string}', (title: string) =>
  detailsPanel.shouldShowTitle(title)
)
defineStep('I click on the related criterium {string} in the details panel', (name: string) =>
  detailsPanel.clickRelated(name)
)
defineStep('I open the menu of the related criterium {string}', (name: string) =>
  detailsPanel.openMenuOfRelated(name)
)
