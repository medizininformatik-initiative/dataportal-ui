import { AvailabilityCellData } from './Data/AvailabilityCellData'
import { CheckboxCellData } from './Data/CheckboxCellData'
import { CheckboxTextCellData } from './Data/CheckboxTextCellData'
import { DisplayCellData } from './Data/DisplayCellData'
import { IconCellData } from './Data/IconCellData'
import { TextCellData } from './Data/TextCellData'

export type TableCellUnion =
  | CheckboxCellData
  | CheckboxTextCellData
  | TextCellData
  | DisplayCellData
  | AvailabilityCellData
  | IconCellData
