export interface TableHeaderData {
  headers: {
    label: string
    addAllCheckbox: boolean
    /** Label stays for screen readers only (icon columns). */
    visuallyHidden?: boolean
  }[]
}
