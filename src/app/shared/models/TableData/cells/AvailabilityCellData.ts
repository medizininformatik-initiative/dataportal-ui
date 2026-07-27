import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { TableCellDataTypes } from './TableCellType'

export interface AvailabilityCellData {
  type: TableCellDataTypes.AVAILABILITY
  value: AvailabilityStatusType
}
