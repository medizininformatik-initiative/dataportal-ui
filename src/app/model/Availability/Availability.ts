import { AvailabilityStatusType } from './AvailabilityStatusType';

export class Availability {
  /**
   * Mapping of availability values to their corresponding status types.
   * Values that do not match any of the predefined thresholds will default to 'unknown'.
   */
  private static readonly MAP: Record<number, AvailabilityStatusType> = {
    0: 'unknown',
    10: 'very low',
    100: 'low',
    1000: 'medium',
    10000: 'high',
    100000: 'very high',
    1000000: 'very high',
  };

  constructor(private readonly value: number) {}

  public getValue(): number {
    return this.value;
  }

  /**
   * Gets the availability status based on the value.
   * @default 'unknown' if the value does not match any predefined thresholds.
   * @returns The availability status.
   */
  public getStatus(): AvailabilityStatusType {
    return Availability.MAP[this.value] ?? 'unknown';
  }
}
