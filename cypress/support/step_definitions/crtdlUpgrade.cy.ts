import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'

type Filter = { name: string; start?: string }
type Download = { dataExtraction: { attributeGroups: { name: string; filter?: Filter[] }[] } }

/**
 * Upload of outdated CRTDL: backend upgrade endpoint rewrites it, upgrade log opens.
 * */
export class CrtdlUpgrade {
  /**
   * Select fixture through upload input. No post-condition: upgraded CRTDL has no fixed criterium
   * to wait for, scenario asserts upgrade log dialog next.
   * */
  public uploadOutdated(fixture: string) {
    cy.get(dataCy('upload-crtdl')).selectFile(`cypress/fixtures/${fixture}.json`, { force: true })
  }

  /**
   * Filters of group `group` in downloaded file.
   * */
  private filtersOf(file: string, group: string) {
    return cy
      .readFile<Download>(`cypress/downloads/${file}.json`)
      .then((d) => d.dataExtraction.attributeGroups.find((g) => g.name === group)?.filter ?? [])
  }

  /**
   * Assert group has filter `name` with `start`.
   * */
  public shouldHaveFilter(file: string, group: string, name: string, start: string) {
    this.filtersOf(file, group).then((filters) => {
      expect(filters.find((f) => f.name === name)?.start).to.equal(start)
    })
  }

  /**
   * Assert group has no filter `name`.
   * */
  public shouldNotHaveFilter(file: string, group: string, name: string) {
    this.filtersOf(file, group).then((filters) => {
      expect(filters.map((f) => f.name)).not.to.include(name)
    })
  }
}

export const crtdlUpgrade = new CrtdlUpgrade()

defineStep('I upload the outdated data definition {string}', (fixture: string) =>
  crtdlUpgrade.uploadOutdated(fixture)
)
defineStep(
  'the filter {string} starting {string} is in group {string} of the downloaded file {string}',
  (name: string, start: string, group: string, file: string) =>
    crtdlUpgrade.shouldHaveFilter(file, group, name, start)
)
defineStep(
  'the filter {string} is not in group {string} of the downloaded file {string}',
  (name: string, group: string, file: string) => crtdlUpgrade.shouldNotHaveFilter(file, group, name)
)
