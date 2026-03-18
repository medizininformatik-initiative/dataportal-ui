import { AbstractCodeMessage } from '../Utilities/AbstractCodeMessage';
import { ProfileFieldChange } from './ProfileFieldUpgrade';
import { ProfileFieldRemoved } from './ProfileFieldRemoved';
import { ProfileFilterChange } from './ProfileFilterChange';
import { ProfileRemoved } from './ProfileRemoved';

export class ProfileUpgrade extends AbstractCodeMessage {
  private profileRemoved: ProfileRemoved;
  private profileFieldChange?: ProfileFieldChange;
  private profileFieldRemoved?: ProfileFieldRemoved;
  private profileFilterChange?: ProfileFilterChange;

  constructor(
    code: string,
    message: string,
    location: string,
    profileRemoved?: ProfileRemoved,
    profileFieldChange?: ProfileFieldChange,
    profileFieldRemoved?: ProfileFieldRemoved,
    profileFilterChange?: ProfileFilterChange
  ) {
    super(code, message, location);
    this.profileRemoved = profileRemoved;
    this.profileFieldChange = profileFieldChange;
    this.profileFieldRemoved = profileFieldRemoved;
    this.profileFilterChange = profileFilterChange;
  }

  public getProfileRemoved(): ProfileRemoved {
    return this.profileRemoved;
  }

  public getProfileFieldChange(): ProfileFieldChange | undefined {
    return this.profileFieldChange;
  }

  public getProfileFieldRemoved(): ProfileFieldRemoved | undefined {
    return this.profileFieldRemoved;
  }

  public getProfileFilterChange(): ProfileFilterChange | undefined {
    return this.profileFilterChange;
  }

  public setProfileRemoved(profileRemoved: ProfileRemoved): void {
    this.profileRemoved = profileRemoved;
  }

  public setProfileFieldChange(profileFieldChange: ProfileFieldChange): void {
    this.profileFieldChange = profileFieldChange;
  }

  public setProfileFieldRemoved(profileFieldRemoved: ProfileFieldRemoved): void {
    this.profileFieldRemoved = profileFieldRemoved;
  }

  public setProfileFilterChange(profileFilterChange: ProfileFilterChange): void {
    this.profileFilterChange = profileFilterChange;
  }
}
