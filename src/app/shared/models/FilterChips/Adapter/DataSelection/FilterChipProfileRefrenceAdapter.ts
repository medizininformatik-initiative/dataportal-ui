import { FilterChipBuilder } from '../../FilterChipBuilder';
import { ProfileReferenceChipData, ProfileReferenceGroup } from '../../ProfileReferenceChipData';

export class FilterChipProfileRefrenceAdapter {
  /**
   *@todo check what '4' is? Placeholder/dummy?
   * @param profileReferenceGroup
   * @returns
   */
  public static adaptToProfileReferenceChipData(
    profileReferenceGroup: ProfileReferenceGroup
  ): ProfileReferenceChipData {
    const builder = new FilterChipBuilder(profileReferenceGroup.elementId);
    profileReferenceGroup.profiles.forEach((profileDisplay) => {
      builder.addData('4', profileDisplay, false);
    });
    return builder.buildFilterChip() as ProfileReferenceChipData;
  }
}
