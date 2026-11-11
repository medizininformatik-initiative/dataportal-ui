import { TableCellKind } from '../../models/TableData/Cells/TableCellKind'
import { TableCellUnion } from '../../models/TableData/Cells/TableCellUnion'

// Icon/checkbox/availability columns get a fixed pixel width (a percentage shrank the icon column to
// 11px next to the details panel). The first other column is the name and gets 40% of the table;
// the other columns get no width and split what is left equally. Chrome ignores calc(% - px) widths
// in a fixed-layout table, so the share cannot subtract the fixed columns exactly.
const FIXED_WIDTH_PX: Partial<Record<TableCellKind, number>> = {
  [TableCellKind.ICON]: 40,
  [TableCellKind.CHECKBOX]: 40,
  [TableCellKind.AVAILABILITY]: 152, // the 130px status bar + 8px cell padding + room before the next column
}

/**
 * Computes the CSS width for the cell at `index`, given the full set of cells in the row that
 * defines the table's column layout. Header and body must call this with same-shaped cell arrays
 * to stay column-aligned.
 */
export function getColumnWidth(
  cells: Array<Pick<TableCellUnion, 'type'>> | undefined,
  index: number
): string | undefined {
  const cellType = cells?.[index]?.type
  if (!cells || cellType === undefined) {
    return undefined
  }

  const fixedWidth = FIXED_WIDTH_PX[cellType]
  if (fixedWidth !== undefined) {
    return `${fixedWidth}px`
  }

  const flexibleIndexes = cells
    .map((cell, i) => (FIXED_WIDTH_PX[cell.type] === undefined ? i : -1))
    .filter((i) => i >= 0)
  if (index !== flexibleIndexes[0]) {
    return undefined
  }
  return '40%'
}
