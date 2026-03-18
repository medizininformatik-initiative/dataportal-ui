import { ProfileFieldUpgradeData } from 'src/app/core/model/Upgrade/Field/ProfileFieldUpgradeData';

export class ProfileFieldRemoved {
  private readonly replaced: string;

  constructor(replaced: string) {
    this.replaced = replaced;
  }

  public getReplaced(): string {
    return this.replaced;
  }

  public static fromJson(data: ProfileFieldUpgradeData): ProfileFieldRemoved {
    return new ProfileFieldRemoved(data.replaced.attributeRef);
  }
}
