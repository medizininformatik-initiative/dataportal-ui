import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { filter, map, Observable, Subscription, switchMap, take, tap } from 'rxjs'
import { ReferencedProfile } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferencedProfile'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData'
import { CreateSelectedReferenceService } from 'src/app/service/CreateSelectedReference.service'
import { ProfileReferenceModalService } from 'src/app/service/DataSelection/Modal/ProfileReferenceModal.service'
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service'
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component'
import { PlaceholderBoxComponent } from '../../../../../../../shared/components/placeholder-box/placeholder-box.component'
import { PossibleReferencesComponent } from '../possible-references/possible-references.component'

@Component({
  selector: 'num-reference-field-tab',
  templateUrl: './reference-field-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reference-field-tab.component.scss'],
  standalone: true,
  imports: [PossibleReferencesComponent, PlaceholderBoxComponent, ButtonComponent, AsyncPipe, TranslateModule],
})
export class ReferenceFieldTabComponent implements OnInit, OnDestroy {
  private readonly createSelectedReferenceService = inject(CreateSelectedReferenceService)
  private readonly possibleReferencesService = inject(PossibleReferencesService)
  private readonly profileReferenceModalService = inject(ProfileReferenceModalService)

  public readonly referenceField = input<ReferenceField>(undefined)

  public readonly profileId = input<string>(undefined)

  public readonly selectedField = input<SelectedReferenceField>(undefined)

  public readonly selectedProfileAsReference = output<SelectedReferenceField>()

  public possibleReferences$: Observable<PossibleProfileReferenceData[]>

  public referencedProfileUrls: string[] = []

  public elementId: string

  public openModalWindowSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit(): void {
    this.referencedProfileUrls = this.referenceField()
      .getReferencedProfiles()
      .map((profile: ReferencedProfile) => profile.getUrl())
    this.elementId = this.referenceField().getElementId()
    this.loadPossibleReferences()
  }

  public ngOnDestroy(): void {
    this.openModalWindowSubscription?.unsubscribe()
  }

  private loadPossibleReferences(): void {
    this.possibleReferences$ = this.possibleReferencesService.getReferencesMap().pipe(
      filter((innerMap: Map<string, Map<string, PossibleProfileReferenceData[]>>) => innerMap.has(this.profileId())),
      map((innerMap: Map<string, Map<string, PossibleProfileReferenceData[]>>) => innerMap.get(this.profileId()).get(this.elementId))
    )
  }

  public openReferenceModal(): void {
    this.openModalWindowSubscription?.unsubscribe()
    this.openModalWindowSubscription = this.profileReferenceModalService
      .openProfileReferenceModal(this.referencedProfileUrls, this.profileId())
      .pipe(
        take(1),
        filter((urls: string[]) => urls.length > 0),
        switchMap((urls: string[]) => this.possibleReferencesService.loadAndMapProfiles(urls, this.elementId, this.profileId()))
      )
      .subscribe((possibleProfileReferenceData: PossibleProfileReferenceData[]) => this.onReferencesConfirmed(possibleProfileReferenceData))
  }

  private onReferencesConfirmed(selected: PossibleProfileReferenceData[]): void {
    const selectedFields: SelectedReferenceField = this.createSelectedReferenceService.mapPossibleReferencesToSelectedReferences(
      selected,
      this.referenceField()
    )
    this.selectedProfileAsReference.emit(selectedFields)
  }

  public updateSelectedPossibleReferences(test: PossibleProfileReferenceData): void {
    this.possibleReferencesService
      .getReferencesMap()
      .pipe(
        take(1),
        filter((innerMap: Map<string, Map<string, PossibleProfileReferenceData[]>>) => innerMap.has(this.profileId())),
        map((innerMap: Map<string, Map<string, PossibleProfileReferenceData[]>>) => innerMap.get(this.profileId()).get(this.elementId)),
        tap((possibleReferences: PossibleProfileReferenceData[]) => {
          if (possibleReferences) {
            const foundPossibleRefrence = possibleReferences.find((ref: PossibleProfileReferenceData) => ref.id === test.id)
            if (foundPossibleRefrence) {
              foundPossibleRefrence.isSelected = !foundPossibleRefrence.isSelected
            } else {
              possibleReferences.push(foundPossibleRefrence)
            }
          }
        })
      )
      .subscribe((possibleReferences: PossibleProfileReferenceData[]) => {
        this.possibleReferencesService.setReferencesMapElement(this.profileId(), this.elementId, possibleReferences)
        this.onReferencesConfirmed(possibleReferences)
      })
  }
}
