export const BasePaths = {
  feasibilityQuery: 'feasibility-query',
  dataSelection: 'data-selection',
  dataQuery: 'data-query',
  savedQueries: 'saved-queries',
  options: 'options',
  queryEditor: 'query-editor',
  home: 'dashboard',
};

export const PathSegments = {
  search: 'search',
  editor: 'editor',
  result: 'result',
  loadQuery: 'load-query',
  cohortDefinition: 'cohort-definition',
  dataSelection: 'data-selection',
  criterion: 'criterion',
  bulkSearch: 'bulk-search',
  feature: 'feature',
};

export const UrlPaths = {
  feasibilityQuery: {
    result: `${BasePaths.feasibilityQuery}/${PathSegments.result}`,
    editor: `${BasePaths.feasibilityQuery}/${PathSegments.editor}`,
    search: `${BasePaths.feasibilityQuery}/${PathSegments.search}`,
    bulkSearch: `${BasePaths.feasibilityQuery}/${PathSegments.bulkSearch}`,
  },
  dataSelection: {
    editor: `${BasePaths.dataSelection}/${PathSegments.editor}`,
    search: `${BasePaths.dataSelection}/${PathSegments.search}`,
  },
  dataQuery: {
    cohortDefinition: `${BasePaths.dataQuery}/${PathSegments.cohortDefinition}`,
    dataSelection: `${BasePaths.dataQuery}/${PathSegments.dataSelection}`,
  },
  queryEditor: {
    criteria: `${BasePaths.queryEditor}/${PathSegments.criterion}`,
    feature: `${BasePaths.queryEditor}/${PathSegments.feature}`,
  },
};
