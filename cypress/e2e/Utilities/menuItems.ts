/**
 * Real English display text of `num-menu` items (src/assets/i18n/en.json,
 * `SHARED_COMPONENTS.MENU.*`). Old German values never matched what scenarios pass (real
 * usage: "Apply filter", "Delete", "Duplicate"). "Configure" is EDIT real text, distinct from
 * unrelated "Edit" string of another module menu.
 * */
export const menuItems = {
  addToCohort: 'Add to cohort selection',
  addToProfile: 'Add to profile selection',
  applyFilters: 'Apply filter',
  defineFields: 'Select fields',
  delete: 'Delete',
  duplicate: 'Duplicate',
  configure: 'Configure',
  reference: 'Link criteria',
  search: 'Use as search term',
  showProfile: 'Show profile',
}
export type MenuItemKey = keyof typeof menuItems

export type MenuItemValue = (typeof menuItems)[MenuItemKey]
