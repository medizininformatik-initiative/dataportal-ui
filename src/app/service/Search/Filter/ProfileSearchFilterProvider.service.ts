import { AbstractArrayEntityProvider } from '../../Provider/Abstract/AbstractArrayEntityProvider'
import { Injectable } from '@angular/core'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterProviderService extends AbstractArrayEntityProvider<ProfileSearchFilter> {
  constructor() {
    super()
  }

  public selectId(entity: ProfileSearchFilter) {
    console.log(entity)
    return entity.getName()
  }
}
