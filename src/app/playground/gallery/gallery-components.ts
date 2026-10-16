import tabs from './gallery-tabs.json'

export interface GalleryEntry {
  name: string
  page: string // /playground/gallery/<page> lists the component with all its variants
  variants?: [label: string, anchor: string][]
}

// Mirrors the <h2 id> sections in gallery.component.ts.
// ponytail: hand-kept list.
const base: GalleryEntry[] = [
  {
    name: 'num-button',
    page: 'num-button',
    variants: [
      ...['blue', 'green', 'red', 'cancel', 'disabled'].map((v): [string, string] => [
        v,
        `num-button-${v}`,
      ]),
      ['green button shades', 'green-button-shades'],
      ['green button techniques', 'green-button-techniques'],
    ],
  },
  { name: 'num-checkbox', page: 'num-checkbox' },
  { name: 'num-switch', page: 'num-switch' },
  {
    name: 'num-criteria-box',
    page: 'num-criteria-box',
    variants: [
      ['colour variants', 'criteria-box-variants'],
      ['layout proposals', 'criteria-box-layouts'],
    ],
  },
  {
    name: 'num-data-selection-boxes',
    page: 'num-data-selection-boxes',
    variants: [['design proposals', 'data-selection-box-proposals']],
  },
  {
    name: 'num-action-bar',
    page: 'num-action-bar',
    variants: [['variants', 'action-bar-variants']],
  },
  { name: 'num-availability-status-bar', page: 'num-availability-status-bar' },
  { name: 'num-info-tile', page: 'num-info-tile' },
  { name: 'num-info-tooltip-card', page: 'num-info-tooltip-card' },
  {
    name: 'num-filter-chips',
    page: 'num-filter-chips',
    variants: [['border variants', 'filter-chip-borders']],
  },
  { name: 'num-header', page: 'num-header' },
  { name: 'num-section-name', page: 'num-header' },
  { name: 'num-information-section', page: 'num-header' },
  { name: 'num-linked-badge', page: 'num-linked-badge' },
  { name: 'num-placeholder-box', page: 'num-linked-badge' },
  { name: 'num-missing-filter', page: 'num-linked-badge' },
  { name: 'num-logic-switch', page: 'num-logic-switch' },
  { name: 'num-search-mode-toggle', page: 'num-logic-switch' },
  { name: 'num-searchbar', page: 'num-searchbar' },
  { name: 'num-search-filter', page: 'num-search-filter' },
  { name: 'num-selected-items-list', page: 'num-selected-items-list' },
  { name: 'num-date-picker', page: 'num-date-picker' },
  { name: 'num-value-select', page: 'num-date-picker' },
  { name: 'num-spinner', page: 'num-date-picker' },
]

// tabs added from the side menu (scripts/playground-tabs.cjs writes them here and into gallery.component.ts)
const added = tabs as unknown as Record<string, [label: string, anchor: string][]>
export const addedTabIds = new Set(
  ([] as string[]).concat(...Object.values(added).map((v) => v.map(([, id]) => id)))
)

export const galleryComponents: GalleryEntry[] = base.map((c, i) => {
  const extra = base.findIndex((b) => b.page === c.page) === i ? added[c.page] : undefined
  return extra ? { ...c, variants: [...(c.variants ?? []), ...extra] } : c
})
