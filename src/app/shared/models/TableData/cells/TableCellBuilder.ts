import { AvailabilityCellData } from './AvailabilityCellData'
import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { CheckboxTextCellData } from './CheckboxTextCellData'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayCellData } from './DisplayCellData'
import { TableCellType } from './TableCellType'
import { TextCellData } from './TextCellData'
import { IconCellData } from './IconCellData'
import { CheckboxCellOptionsData } from './CheckboxCellOptionData'
import { CheckboxCellData } from './CheckboxCellData'

/**
 * Factory class for constructing typed table cells.
 *
 * Usage:
 *   TableCellBuilder.text('some value')
 *   TableCellBuilder.checkbox(entry.getDisplay(), { isDisabled: true, icon: 'sitemap' })
 *   TableCellBuilder.availability(entry.getAvailability())
 *   TableCellBuilder.display(entry.getDisplay(), { icon: 'sitemap' })
 */
export class TableCellBuilder {
  public static withIcon(icon: string): IconCellData {
    return { type: 'icon', icon }
  }
  /**
   * Text cell builder
   * @param value
   * @returns
   */
  public static withText(value: string | Display): TextCellData {
    return { type: 'text', value }
  }

  /** Availability status bar cell
   * @param value
   * @returns
   *
   */
  public static withAvailability(value: AvailabilityStatusType): AvailabilityCellData {
    return { type: 'availability', value }
  }

  /** Checkbox cell with optional icon
   * @param value
   * @param options
   * @returns
   */
  public static withCheckboxText(
    value: string | Display,
    options: CheckboxCellOptionsData = {}
  ): CheckboxTextCellData {
    return {
      type: 'checkboxText',
      value,
      isSelected: options.isSelected ?? false,
      isDisabled: options.isDisabled ?? false,
    }
  }
  public static withCheckbox(options: CheckboxCellOptionsData = {}): CheckboxCellData {
    return {
      type: 'checkbox',
      isSelected: options.isSelected ?? false,
      isDisabled: options.isDisabled ?? false,
    }
  }
  /**
   * Display-object cell with optional icon
   * @param value
   * @param options
   * @returns
   */
  public static withDisplay(value: Display, options: { icon?: string } = {}): DisplayCellData {
    return { type: 'display', value, icon: options.icon }
  }

  /**
   * Builder for constructing a table row's array of cells. Accepts any number of cell objects and returns them as an array.
   * @param cells
   * @returns
   */
  public static row(...cells: Array<TableCellType>): Array<TableCellType> {
    return cells
  }
}
