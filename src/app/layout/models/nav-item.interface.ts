export default interface NavItemData {
  routeTo?: string // omitted = non-link group label
  icon?: string
  svgIcon?: string
  translationKey: string
  tabNav?: NavItemData[]
  id?: string
  fragment?: string // in-page anchor on routeTo
  onAdd?: () => void // shows an "add" row at the end of the children
  onEdit?: () => void // shows an edit button next to the item
  onDelete?: () => void // shows a delete button next to the item
  expandOnActive?: boolean // children are only shown while routeTo is the active route
  children?: NavItemData[]
}
