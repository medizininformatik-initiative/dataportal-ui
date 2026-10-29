import { DataSelectionProfile } from './Profile/DataSelectionProfile'

/**
 * @todo
 *   private profiles: DataSelectionProfile[] = [];
 *    sollte nicht die profiles als Array speichern sondern nur deren urls
 *    private profileUrls: string[] = []
 *
 */
export class DataSelection {
  private readonly id: string

  private profiles: DataSelectionProfile[] = []

  constructor(profiles: DataSelectionProfile[], id: string) {
    this.profiles = profiles
    this.id = id
  }

  public getProfiles(): DataSelectionProfile[] {
    return this.profiles
  }

  public setProfiles(profiles: DataSelectionProfile[]): void {
    this.profiles = profiles
  }

  public getId(): string {
    return this.id
  }
}
