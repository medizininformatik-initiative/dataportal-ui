import { ProfileFieldUpgradeData } from './Field/ProfileFieldUpgradeData';
import { ProfileFilterUpgradeData } from './Filter/ProfileFilterUpgradeData';
import { ProfileUpgradeData } from './Profile/ProfileUpgradeData';

export type UpgradeDetailsType =
  | ProfileUpgradeData
  | ProfileFieldUpgradeData
  | ProfileFilterUpgradeData;
