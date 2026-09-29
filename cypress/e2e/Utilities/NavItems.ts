import { BasePaths, PathSegments } from '../../support/e2e'

// .profile-link/.logout-link were removed — confirmed to correspond to no
// element anywhere in the app (grepped the whole src/app for both strings,
// zero matches), and NavItemPaths never had entries for them either.
export const NavItem = {
  cohort: 'Kohortenselektion',
  dataSelection: 'Data Selection',
  dataDefinition: 'Data Definition',
  savedQueries: 'Saved Queries',
} as const

export type NavItemKey = keyof typeof NavItem

export type NavItemValue = (typeof NavItem)[NavItemKey]

// Full sub-path, for asserting the URL after navigating.
export const NavItemPaths = {
  [NavItem.cohort]: `${BasePaths.feasibilityQuery}/${PathSegments.search}`,
  [NavItem.dataSelection]: `${BasePaths.dataSelection}/${PathSegments.search}`,
  [NavItem.dataDefinition]: `${BasePaths.dataQuery}/${PathSegments.cohortDefinition}`,
  [NavItem.savedQueries]: BasePaths.savedQueries,
} as const

export type NavItemPathKey = keyof typeof NavItemPaths

// The side-menu's own navItem.routeTo (src/app/core/constants/navigation.ts)
// — just the base path, no segment — matching what side-menu.component.html's
// numDataCy="'nav-' + navItem.routeTo" actually renders. Kept separate from
// NavItemPaths above, which serves a different purpose (the full
// post-navigation URL to assert against, not the link to click).
export const NavItemBaseRoutes = {
  [NavItem.cohort]: BasePaths.feasibilityQuery,
  [NavItem.dataSelection]: BasePaths.dataSelection,
  [NavItem.dataDefinition]: BasePaths.dataQuery,
  [NavItem.savedQueries]: BasePaths.savedQueries,
} as const
