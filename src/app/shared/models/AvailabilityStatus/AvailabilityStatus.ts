import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType';

export interface StatusConfig {
  label: string
  percentage: number
  color: string
}

export const STATUS_CONFIG: Record<AvailabilityStatusType, StatusConfig> = {
  unknown: { label: 'Unknown', percentage: 0, color: '#b0b8c4' },
  'very low': { label: 'Very Low', percentage: 15, color: '#d4691e' },
  low: { label: 'Low', percentage: 38, color: '#c8991a' },
  medium: { label: 'Medium', percentage: 55, color: '#9ab721' },
  high: { label: 'High', percentage: 78, color: '#6a9a2a' },
  'very high': { label: 'Very High', percentage: 100, color: '#5a79b0' },
};
