// cypress/support/utils/pageUrlMapper.ts
import { BasePaths, UrlPaths } from '../../support/e2e'
import { Page } from './pages'

export function getUrlPathByPage(page: Page): string {
  switch (page) {
    case Page.FeasibilityEditor:
      return UrlPaths.feasibilityQuery.editor
    case Page.FeasibilitySearch:
      return UrlPaths.feasibilityQuery.search
    case Page.FeasibilityBulkSearch:
      return UrlPaths.feasibilityQuery.bulkSearch
    case Page.FeasibilityResult:
      return UrlPaths.feasibilityQuery.result
    case Page.DataSelectionEditor:
      return UrlPaths.dataSelection.editor
    case Page.DataSelectionSearch:
      return UrlPaths.dataSelection.search
    case Page.DataQueryCohortDefinition:
      return UrlPaths.dataQuery.cohortDefinition
    case Page.DataQueryDataSelection:
      return UrlPaths.dataQuery.dataSelection
    case Page.QueryEditorCriteria:
      return UrlPaths.queryEditor.criteria
    case Page.QueryEditorProfile:
      return UrlPaths.queryEditor.feature
    case Page.SavedQueries:
      return BasePaths.savedQueries
    default:
      throw new Error(`No URL path mapped for page: "${page}"`)
  }
}
