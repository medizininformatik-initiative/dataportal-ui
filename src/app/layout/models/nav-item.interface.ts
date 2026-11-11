export default interface NavItemData {
  routeTo?: string // omitted = non-link group label
  icon?: string
  svgIcon?: string
  translationKey: string
  tabNav?: NavItemData[]
  id?: string
  children?: NavItemData[]
}
