// Real English display text for num-menu items (src/assets/i18n/en.json,
// SHARED_COMPONENTS.MENU.*) — the previous German values here never matched
// what any scenario actually passes (confirmed real usage: "Apply filter",
// "Delete", "Duplicate"; "Configure" is EDIT's real text, distinct from a
// different, unrelated "Edit" string a separate module's own menu uses).
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
