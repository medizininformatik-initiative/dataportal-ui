import { BasePaths, PathSegments } from '../../support/e2e'

/**
 * `.profile-link` / `.logout-link` removed: no element in whole `src/app` matches either
 * string (grepped, zero hits). `NavItemPaths` never had entries for them.
 * */
export const NavItem = {
  cohort: 'Kohortenselektion',
  dataSelection: 'Data Selection',
  dataDefinition: 'Data Definition',
  savedQueries: 'Saved Queries',
} as const

export type NavItemKey = keyof typeof NavItem

export type NavItemValue = (typeof NavItem)[NavItemKey]

/**
 * Full sub-path, for asserting URL after navigation.
 * */
export const NavItemPaths = {
  [NavItem.cohort]: `${BasePaths.feasibilityQuery}/${PathSegments.search}`,
  [NavItem.dataSelection]: `${BasePaths.dataSelection}/${PathSegments.search}`,
  [NavItem.dataDefinition]: `${BasePaths.dataQuery}/${PathSegments.cohortDefinition}`,
  [NavItem.savedQueries]: BasePaths.savedQueries,
} as const

export type NavItemPathKey = keyof typeof NavItemPaths

/**
 * Side-menu `navItem.routeTo` (src/app/core/constants/navigation.ts): base path only, no
 * segment. Matches `numDataCy="'nav-' + navItem.routeTo"` rendered by
 * side-menu.component.html. Separate from `NavItemPaths` above: that is full post-navigation
 * URL to assert, not link to click.
 * */
export const NavItemBaseRoutes = {
  [NavItem.cohort]: BasePaths.feasibilityQuery,
  [NavItem.dataSelection]: BasePaths.dataSelection,
  [NavItem.dataDefinition]: BasePaths.dataQuery,
  [NavItem.savedQueries]: BasePaths.savedQueries,
} as const
