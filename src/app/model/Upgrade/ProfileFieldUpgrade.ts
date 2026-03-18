import { FieldUpgradeData } from 'src/app/core/model/Upgrade/Field/FieldUpgradeData';
import { ProfileFieldUpgradeData } from 'src/app/core/model/Upgrade/Field/ProfileFieldUpgradeData';

export class ProfileFieldChange {
  private readonly replaced: string;
  private readonly replacedWith: string;

  constructor(replaced: string, replacedWith: string) {
    this.replaced = replaced;
    this.replacedWith = replacedWith;
  }

  public getReplaced(): string {
    return this.replaced;
  }

  public getReplacedWith(): string {
    return this.replacedWith;
  }

  public static fromJson(data: ProfileFieldUpgradeData): ProfileFieldChange {
    const replacedWith: FieldUpgradeData = data?.replacedWith;
    const replaced: FieldUpgradeData = data.replaced;
    return new ProfileFieldChange(replaced.attributeRef, replacedWith.attributeRef);
  }
}
