export default interface INavItem {
  routeTo: string
  icon?: string
  svgIcon?: string
  translationKey: string
  tabNav?: INavItem[]
  id?: string
}
