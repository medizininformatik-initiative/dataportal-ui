import { AvailabilityStatusType } from './AvailabilityStatusType'

export class Availability {
  /**
   * Mapping of availability values to their corresponding status types.
   * Values that do not match any of the predefined thresholds will default to 'unknown'.
   */
  private static readonly MAP: Record<number, AvailabilityStatusType> = {
    0: 'UNKNOWN',
    10: 'VERY_LOW',
    100: 'LOW',
    1000: 'MEDIUM',
    10000: 'HIGH',
    100000: 'VERY_HIGH',
    1000000: 'VERY_HIGH',
  }

  constructor(private readonly value: number) {}

  public getValue(): number {
    return this.value
  }

  /**
   * Gets the availability status based on the value.
   * @default 'unknown' if the value does not match any predefined thresholds.
   * @returns The availability status.
   */
  public getStatus(): AvailabilityStatusType {
    return Availability.MAP[this.value] ?? 'UNKNOWN'
  }
}
