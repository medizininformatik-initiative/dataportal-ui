export default interface NavItemData {
  routeTo: string
  icon?: string
  svgIcon?: string
  translationKey: string
  tabNav?: NavItemData[]
  id?: string
  children?: NavItemData[]
}
