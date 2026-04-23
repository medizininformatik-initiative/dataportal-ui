import { AvailabilityCellData } from './AvailabilityCellData';
import { CheckboxCellData } from './CheckboxCellData';
import { CheckboxTextCellData } from './CheckboxTextCellData';
import { DisplayCellData } from './DisplayCellData';
import { IconCellData } from './IconCellData';
import { TextCellData } from './TextCellData';

export type TableCellType =
  | CheckboxCellData
  | CheckboxTextCellData
  | TextCellData
  | DisplayCellData
  | AvailabilityCellData
  | IconCellData;
