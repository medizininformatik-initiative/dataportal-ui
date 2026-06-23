import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'

export interface StatusConfig {
  label: string
  percentage: number
  color: string
}
const translationPath = 'SHARED_COMPONENTS.TABLE.AVAILABILITY_STATUS'
export const STATUS_CONFIG: Record<AvailabilityStatusType, StatusConfig> = {
  UNKNOWN: { label: translationPath + '.UNKNOWN', percentage: 0, color: '#b0b8c4' },
  VERY_LOW: { label: translationPath + '.VERY_LOW', percentage: 15, color: '#d4691e' },
  LOW: { label: translationPath + '.LOW', percentage: 38, color: '#c8991a' },
  MEDIUM: { label: translationPath + '.MEDIUM', percentage: 55, color: '#9ab721' },
  HIGH: { label: translationPath + '.HIGH', percentage: 78, color: '#6a9a2a' },
  VERY_HIGH: { label: translationPath + '.VERY_HIGH', percentage: 100, color: '#5a79b0' },
}
