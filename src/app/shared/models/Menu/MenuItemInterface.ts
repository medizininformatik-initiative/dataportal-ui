export interface MenuItemInterface {
  disabled: boolean
  icon: string
  label: string
  type?: 'primary' | 'default'
  action: (id: string, args?: Record<string, unknown>) => void
}
