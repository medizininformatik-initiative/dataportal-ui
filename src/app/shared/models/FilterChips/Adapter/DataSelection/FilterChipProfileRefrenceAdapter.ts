import { FilterChipBuilder } from '../../FilterChipBuilder';
import { ProfileReferenceChipData, ProfileReferenceGroup } from '../../ProfileReferenceChipData';

export class FilterChipProfileRefrenceAdapter {
  /**
   *
   * @param profileReferenceGroup
   * @returns
   */
  public static adaptToProfileReferenceChipData(
    profileReferenceGroup: ProfileReferenceGroup
  ): ProfileReferenceChipData {
    console.log(profileReferenceGroup);
    const builder = new FilterChipBuilder(profileReferenceGroup.elementId);
    profileReferenceGroup.profiles.forEach((profileDisplay) => {
      console.log(`Adding profile display to chip: ${profileDisplay}`);
      builder.addData('4', profileDisplay, false);
    });
    return builder.buildFilterChip() as ProfileReferenceChipData;
  }
}
