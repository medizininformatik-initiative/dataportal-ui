import { BasePaths, UrlPaths } from 'src/app/app-paths'
import NavItemData from '../../layout/models/nav-item.interface'

export const mainNavItems: NavItemData[] = [
  /*{
    routeTo: BasePaths.home,
    icon: 'home',
    translationKey: 'NAVIGATION.DASHBOARD',
  },*/
  {
    routeTo: BasePaths.dataQuery,
    icon: 'clipboard-list',
    translationKey: 'NAVIGATION.DATAQUERY.TITLE',
    children: [
      {
        routeTo: UrlPaths.dataQuery.cohortDefinition,
        icon: 'file',
        translationKey: 'NAVIGATION.DATAQUERY.COHORT_DEFINITION',
      },
      {
        routeTo: UrlPaths.dataQuery.dataSelection,
        icon: 'file',
        translationKey: 'NAVIGATION.DATAQUERY.DATASELECTION_DEFINITION',
      },
    ],
  },
  {
    routeTo: BasePaths.feasibilityQuery,
    icon: 'file',
    translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR.TITLE',
    children: [
      {
        translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR.SEARCH_GROUP',
        children: [
          {
            routeTo: UrlPaths.feasibilityQuery.search,
            icon: 'file',
            translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR.SEARCH',
          },
          {
            routeTo: UrlPaths.feasibilityQuery.bulkSearch,
            icon: 'file',
            translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR.BULK_SEARCH',
          },
        ],
      },
      {
        routeTo: UrlPaths.feasibilityQuery.editor,
        icon: 'file',
        translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR.EDITOR',
      },
    ],
  },
  {
    routeTo: BasePaths.dataSelection,
    icon: 'database',
    translationKey: 'NAVIGATION.DATASELECTION.TITLE',
    children: [
      {
        routeTo: UrlPaths.dataSelection.search,
        icon: 'file',
        translationKey: 'NAVIGATION.DATASELECTION.SEARCH',
      },
      {
        routeTo: UrlPaths.dataSelection.editor,
        icon: 'file',
        translationKey: 'NAVIGATION.DATASELECTION.EDITOR',
      },
    ],
  },
  {
    routeTo: BasePaths.savedQueries,
    icon: 'folder-open',
    translationKey: 'NAVIGATION.QUERYBUILDER_OVERVIEW',
  },
]
