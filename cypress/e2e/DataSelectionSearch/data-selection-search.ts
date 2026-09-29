import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numMenu } from '../../support/component-objects/NumMenu'
import { Search } from '../../support/step_definitions/search.cy'

export class DataSelectionSearch {
  public getTreeNodeByName(name: string, root: string) {
    cy.get(`[data-cy="${root}"]`)
      .should('be.visible')
      .within(() => {
        cy.get('.tree-node').click()
      })
    cy.get(`[data-cy="${name}"]`).contains(name).should('be.visible').click()
  }

  public getDataSelectionBoxByName(name: string) {
    cy.get(`[data-cy="${name}"]`).contains(name).should('be.visible')
  }

  public openMenuOnDataSelectionBox(name: string) {
    cy.get(`[data-cy="${name}"]`).within(() => {
      numMenu.open()
    })
  }

  public selectCheckboxByLabel(label: string) {
    cy.get(`[data-cy="${label}"]`).contains(label).should('be.visible').click()
  }

  // Was 3 near-identical methods (getFilterChip/getFieldChip/getReferenceChip)
  // differing only by container class — one parametrized method instead.
  public getChip(containerClass: string, chipName: string) {
    cy.get(containerClass).within(() => {
      cy.get(`[data-cy="${chipName}"]`).contains(chipName).should('be.visible')
    })
  }

  public selecteTabByName(tabName: string) {
    cy.get('.mdc-tab__text-label').contains(tabName).should('be.visible').click()
  }

  public searchForConcept(conceptName: string) {
    const searchInstance = new Search()
    cy.get('num-profile-filter').within(() => {
      searchInstance.typeInInputField(conceptName)
    })
  }

  public placeHolderBeVisible() {
    cy.get('.placeholder-box').should('be.visible')
  }

  public openReferenceModal() {
    cy.get('num-button').contains(' Add new reference ').should('be.visible').click()
  }

  public getReferenceModal() {
    cy.get('num-modal-window').should('be.visible')
  }

  public addReference(name: string) {
    cy.get('num-modal-window').within(() => {
      cy.get(`[data-cy="${name}"]`)
        .should('be.visible')
        .within(() => {
            cy.get('.mat-mdc-checkbox-touch-target').click({ force: true })
        })
    })
  }

  saveReference() {
    cy.get('num-modal-window').within(() => {
      cy.get('num-button').first().should('be.visible').click()
    })
  }
}

const dataSelectionSearch = new DataSelectionSearch()

defineStep('I select the feature {string} from the root category {string}', (feature: string, root: string) => {
  dataSelectionSearch.getTreeNodeByName(feature, root);
});

defineStep('I should see a data selection box labeled {string}', (name: string) => {
  dataSelectionSearch.getDataSelectionBoxByName(name);
});

defineStep('I click the edit button on the data selection box {string}', (name: string) => {
  dataSelectionSearch.openMenuOnDataSelectionBox(name);
});

defineStep('I select the checkbox labeled {string}', (label: string) => {
  dataSelectionSearch.selectCheckboxByLabel(label);
});

defineStep('a chip labeled {string} should appear in the "Selected Fields" section', (chipName: string) => {
  dataSelectionSearch.getChip('.selected-fields-container', chipName);
});

defineStep('I click the {string} tab', (tabName: string) => {
  dataSelectionSearch.selecteTabByName(tabName);
});

defineStep('I enter {string} into the filter search field', (conceptName: string) => {
  dataSelectionSearch.searchForConcept(conceptName);
});

defineStep('a chip labeled {string} should appear in the "Selected Filters" section', (chipName: string) => {
  dataSelectionSearch.getChip('.filter-container', chipName);
});

defineStep('I should see the placeholder', () => {
  dataSelectionSearch.placeHolderBeVisible();
});

defineStep('I click to add a new reference', () => {
  dataSelectionSearch.openReferenceModal();
});

defineStep('the reference modal should be displayed', () => {
  dataSelectionSearch.getReferenceModal();
});

defineStep('I add a reference named {string}', (name: string) => {
  dataSelectionSearch.addReference(name);
});
defineStep('I add the reference', () => {
  dataSelectionSearch.saveReference();
})
defineStep('a chip labeled {string} should appear in the "Selected Reference" section', (chipName: string) => {
  dataSelectionSearch.getChip('.reference-container', chipName);
});
