import { TableCellKind } from '../../models/TableData/Cells/TableCellKind'
import { TableCellUnion } from '../../models/TableData/Cells/TableCellUnion'

// Icon/checkbox columns get a small fixed share; the rest split the remainder
// by weight so long free-text columns (name/label) get more room than short,
// bounded-content columns (status bars, codes).
const FIXED_WIDTH_PERCENT: Partial<Record<TableCellKind, number>> = {
  [TableCellKind.ICON]: 2,
  [TableCellKind.CHECKBOX]: 2,
  [TableCellKind.AVAILABILITY]: 12,
}

const FLEXIBLE_COLUMN_WEIGHT: Partial<Record<TableCellKind, number>> = {
  [TableCellKind.CHECKBOXTEXT]: 3,
  [TableCellKind.DISPLAY]: 3,
  [TableCellKind.TEXT]: 1,
}

/**
 * Computes the column width (in %) for the cell at `index`, given the full
 * set of cells in the row that defines the table's column layout. Header and
 * body must call this with same-shaped cell arrays to stay column-aligned.
 * @param {Array<Pick<TableCellUnion, 'type'>> | undefined} cells
 * @param {number} index
 * @returns {number | undefined}
 */
export function getColumnWidthPercent(cells: Array<Pick<TableCellUnion, 'type'>> | undefined, index: number): number | undefined {
  const cellType = cells?.[index]?.type
  if (!cells || cellType === undefined) {
    return undefined
  }

  const fixedWidth = FIXED_WIDTH_PERCENT[cellType]
  if (fixedWidth !== undefined) {
    return fixedWidth
  }

  const totalFixedWidth = cells.reduce((sum, cell) => sum + (FIXED_WIDTH_PERCENT[cell.type] ?? 0), 0)
  const totalFlexibleWeight = cells.reduce((sum, cell) => sum + (FLEXIBLE_COLUMN_WEIGHT[cell.type] ?? 0), 0)
  const weight = FLEXIBLE_COLUMN_WEIGHT[cellType] ?? 0

  return ((100 - totalFixedWidth) * weight) / totalFlexibleWeight
}
