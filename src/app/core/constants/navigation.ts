import { BasePaths, UrlPaths } from 'src/app/app-paths'
import INavItem from '../../layout/models/nav-item.interface'

export const mainNavItems: INavItem[] = [
  /*{
    routeTo: BasePaths.home,
    icon: 'home',
    translationKey: 'NAVIGATION.DASHBOARD',
  },*/
  {
    routeTo: BasePaths.dataQuery,
    icon: 'clipboard-list',
    translationKey: 'NAVIGATION.DATAQUERY',
    children: [
      {
        routeTo: UrlPaths.dataQuery.cohortDefinition,
        icon: 'file',
        translationKey: 'NAVIGATION.COHORT_DEFINITION',
      },
      {
        routeTo: UrlPaths.dataQuery.dataSelection,
        icon: 'file',
        translationKey: 'NAVIGATION.DATASELECTION_DEFINITION',
      },
    ],
  },
  {
    routeTo: BasePaths.feasibilityQuery,
    icon: 'file',
    translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR',
    children: [
      {
        routeTo: UrlPaths.feasibilityQuery.search,
        icon: 'file',
        translationKey: 'FEASIBILITY.SEARCH.HEADER',
      },
      {
        routeTo: UrlPaths.feasibilityQuery.bulkSearch,
        icon: 'file',
        translationKey: 'FEASIBILITY.BULK_SEARCH.HEADER',
      },
      {
        routeTo: UrlPaths.feasibilityQuery.editor,
        icon: 'file',
        translationKey: 'FEASIBILITY.EDITOR.HEADER',
      },
    ],
  },
  {
    routeTo: BasePaths.dataSelection,
    icon: 'database',
    translationKey: 'NAVIGATION.DATASELECTION',
    children: [
      {
        routeTo: UrlPaths.dataSelection.search,
        icon: 'file',
        translationKey: 'DATASELECTION.SEARCH.HEADER',
      },
      {
        routeTo: UrlPaths.dataSelection.editor,
        icon: 'file',
        translationKey: 'DATASELECTION.EDITOR.HEADER',
      },
    ],
  },
  {
    routeTo: BasePaths.savedQueries,
    icon: 'folder-open',
    translationKey: 'NAVIGATION.QUERYBUILDER_OVERVIEW',
  },
]
