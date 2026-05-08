export const BasePaths = {
  feasibilityQuery: 'feasibility-query',
  dataSelection: 'data-selection',
  dataQuery: 'data-query',
  savedQueries: 'saved-queries',
  queryEditor: 'query-editor',
  home: 'dashboard',
};

export const PathSegments = {
  bulkSearch: 'bulk-search',
  cohortDefinition: 'cohort-definition',
  criterion: 'criterion',
  dataSelection: 'data-selection',
  editor: 'overview',
  feature: 'feature',
  loadQuery: 'load-query',
  reference: 'reference',
  result: 'result',
  search: 'search',
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
    reference: `${BasePaths.queryEditor}/${PathSegments.reference}`,
  },
};
