import { getColumnWidth } from './table-column-width.util'
import { TableCellKind } from '../../models/TableData/Cells/TableCellKind'

describe('getColumnWidth', () => {
  const row = [
    TableCellKind.ICON,
    TableCellKind.CHECKBOXTEXT,
    TableCellKind.AVAILABILITY,
    TableCellKind.TEXT,
    TableCellKind.TEXT,
    TableCellKind.TEXT,
  ].map((type) => ({ type }))

  it('gives fixed columns pixels, the name a double share, the rest no width', () => {
    expect(row.map((_, i) => getColumnWidth(row, i))).toEqual([
      '40px',
      '40%',
      '128px',
      undefined,
      undefined,
      undefined,
    ])
  })
})
