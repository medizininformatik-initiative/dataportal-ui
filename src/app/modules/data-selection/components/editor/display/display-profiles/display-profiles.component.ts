import { Component, Input, OnInit } from '@angular/core'
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
  @Input()
  isEditable: boolean

  dataSelectionProfileArray$: Observable<Array<DataSelectionProfile>>

  constructor(
    private profileProvider: ProfileProviderService,
    private dataSelectionProvider: DataSelectionProviderService
  ) {}

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
