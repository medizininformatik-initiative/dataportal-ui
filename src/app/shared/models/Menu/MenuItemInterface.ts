export interface MenuItemInterface {
  disabled: boolean
  icon: string
  label: string
  type?: 'primary' | 'default'
  action: (id: string) => void
}
