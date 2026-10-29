import { ReferencedProfile } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferencedProfile'
import { CloneDisplayData } from '../../DisplayData/CloneDisplayData'

export class ReferencedProfileCloner {
  public static deepCopyReferencedProfiles(referencedProfiles: ReferencedProfile[]): ReferencedProfile[] {
    if (!referencedProfiles || referencedProfiles.length === 0) {
      return []
    }
    return referencedProfiles.map((profile: ReferencedProfile) => ReferencedProfileCloner.deepCopyReferencedProfile(profile))
  }

  public static deepCopyReferencedProfile(referencedProfile: ReferencedProfile): ReferencedProfile {
    return new ReferencedProfile(
      referencedProfile.getUrl(),
      CloneDisplayData.deepCopyDisplayData(referencedProfile.getDisplay()),
      CloneDisplayData.deepCopyDisplayData(referencedProfile.getFields())
    )
  }
}
