import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType';

export interface AvailabilityCellData {
  type: 'availability'
  value: AvailabilityStatusType
}
