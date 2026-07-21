import { BasePaths } from 'src/app/app-paths'
import INavItem from '../../layout/models/nav-item.interface'

export const mainNavItems: INavItem[] = [
  {
    routeTo: BasePaths.home,
    icon: 'home',
    translationKey: 'NAVIGATION.DASHBOARD',
  },
  {
    routeTo: BasePaths.dataQuery,
    icon: 'clipboard-list',
    translationKey: 'NAVIGATION.DATAQUERY',
  },
  {
    routeTo: BasePaths.feasibilityQuery,
    icon: 'file',
    translationKey: 'NAVIGATION.QUERYBUILDER_EDITOR',
  },
  {
    routeTo: BasePaths.dataSelection,
    icon: 'database',
    translationKey: 'NAVIGATION.DATASELECTION',
  },
  {
    routeTo: BasePaths.savedQueries,
    icon: 'folder-open',
    translationKey: 'NAVIGATION.QUERYBUILDER_OVERVIEW',
  },
]
