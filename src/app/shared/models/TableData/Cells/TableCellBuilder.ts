import { AvailabilityCellData } from './Data/AvailabilityCellData'
import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { CheckboxCellData } from './Data/CheckboxCellData'
import { CheckboxCellOptionsData } from './Data/CheckboxCellOptionData'
import { CheckboxTextCellData } from './Data/CheckboxTextCellData'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayCellData } from './Data/DisplayCellData'
import { IconCellData } from './Data/IconCellData'
import { TableCellContext } from './TableCellContext'
import { TableCellKind } from './TableCellKind'
import { TableCellUnion } from './TableCellUnion'
import { TextCellData } from './Data/TextCellData'

export class TableCellBuilder {
  /**
   * Factory class for constructing typed table cells.
   * @param {string} icon
   * @param {TableCellContext} context
   */
  public static withIcon(icon: string, context: TableCellContext): IconCellData {
    return { context: context, type: TableCellKind.ICON, icon }
  }
  /**
   * Text cell builder
   * @param value
   * @returns {TextCellData}
   */
  public static withText(value: string | Display): TextCellData {
    return { type: TableCellKind.TEXT, value }
  }

  /** Availability status bar cell
   * @param value
   * @returns {AvailabilityCellData}
   *
   */
  public static withAvailability(value: AvailabilityStatusType): AvailabilityCellData {
    return { type: TableCellKind.AVAILABILITY, value }
  }

  /** Checkbox cell with optional icon
   * @param value
   * @param options
   * @param context
   * @returns {CheckboxTextCellData}
   */
  public static withCheckboxText(
    value: string | Display,
    options: CheckboxCellOptionsData = {},
    context: TableCellContext
  ): CheckboxTextCellData {
    return {
      type: TableCellKind.CHECKBOXTEXT,
      value,
      isSelected: options.isSelected ?? false,
      isDisabled: options.isDisabled ?? false,
      context: context,
    }
  }

  /**
   *
   * @param {CheckboxCellOptionsData} options
   * @param {TableCellContext} context
   * @returns {CheckboxCellData}
   */
  public static withCheckbox(
    options: CheckboxCellOptionsData = {},
    context: TableCellContext
  ): CheckboxCellData {
    return {
      type: TableCellKind.CHECKBOX,
      isSelected: options.isSelected ?? false,
      isDisabled: options.isDisabled ?? false,
      context: context,
    }
  }
  /**
   * Display-object cell with optional icon
   * @param value
   * @param options
   * @returns {DisplayCellData}
   */
  public static withDisplay(value: Display, options: { icon?: string } = {}): DisplayCellData {
    return { type: TableCellKind.DISPLAY, value, icon: options.icon }
  }

  /**
   * Builder for constructing a table row's array of cells. Accepts any number of cell objects and returns them as an array.
   * @param cells
   * @returns {Array<TableCellUnion>}
   */
  public static row(...cells: Array<TableCellUnion>): Array<TableCellUnion> {
    return cells
  }
}
