import { Display } from 'src/app/model/DataSelection/Profile/Display';

export interface CheckboxCellData {
  type: 'checkbox'
  value: string | Display
  isSelected: boolean
  isDisabled: boolean
  icon?: string
}

export interface CheckboxCellOptionsData {
  isSelected?: boolean
  isDisabled?: boolean
  icon?: string
}
