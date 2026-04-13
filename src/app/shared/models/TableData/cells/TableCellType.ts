import { AvailabilityCellData } from './AvailabilityCellData';
import { CheckboxCellData } from './CheckboxCellData';
import { DisplayCellData } from './DisplayCellData';
import { IconCellData } from './IconCellData';
import { TextCellData } from './TextCellData';

export type TableCellType =
  | CheckboxCellData
  | TextCellData
  | DisplayCellData
  | AvailabilityCellData
  | IconCellData;
