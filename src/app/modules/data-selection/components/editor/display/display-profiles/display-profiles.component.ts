import { Component, OnInit, inject, input } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { map, Observable, tap } from 'rxjs'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { DataSelectionBoxesComponent } from '../data-selection-boxes/data-selection-boxes.component'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'num-display-profiles',
  templateUrl: './display-profiles.component.html',
  styleUrls: ['./display-profiles.component.scss'],
  standalone: true,
  imports: [DataSelectionBoxesComponent, AsyncPipe],
})
export class DisplayProfilesComponent implements OnInit {
  private profileProvider = inject(ProfileProviderService)
  private dataSelectionProvider = inject(DataSelectionProviderService)

  readonly isEditable = input<boolean>(undefined)

  dataSelectionProfileArray$: Observable<Array<DataSelectionProfile>>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.getDataSelectionProfiles()
  }

  /**
   * @todo add rerender of ui component
   */
  private getDataSelectionProfiles() {
    this.dataSelectionProfileArray$ = this.dataSelectionProvider
      .getActiveDataSelection()
      .pipe(
        map((dataSelection) =>
          dataSelection.getProfiles().map((profile) => this.profileProvider.getOne(profile.getId()))
        )
      )
  }
}
