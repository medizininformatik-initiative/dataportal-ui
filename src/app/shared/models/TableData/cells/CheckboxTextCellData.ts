import { Display } from 'src/app/model/DataSelection/Profile/Display';

export interface CheckboxTextCellData {
  type: 'checkboxText'
  value: string | Display
  isSelected: boolean
  isDisabled: boolean
}
