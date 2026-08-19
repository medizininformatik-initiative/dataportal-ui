import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { TableCellKind } from '../TableCellKind'

export interface AvailabilityCellData {
  type: TableCellKind.AVAILABILITY
  value: AvailabilityStatusType
}
