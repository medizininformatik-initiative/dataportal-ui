import { CreateSelectedReferenceService } from 'src/app/service/CreateSelectedReference.service'
import { filter, map, Observable, Subscription, switchMap, take, tap } from 'rxjs'
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData'
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service'
import { ProfileReferenceModalService } from 'src/app/service/DataSelection/Modal/ProfileReferenceModal.service'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core'
import { PossibleReferencesComponent } from '../possible-references/possible-references.component'
import { PlaceholderBoxComponent } from '../../../../../../../shared/components/placeholder-box/placeholder-box.component'
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-reference-field-tab',
  templateUrl: './reference-field-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reference-field-tab.component.scss'],
  standalone: true,
  imports: [
    PossibleReferencesComponent,
    PlaceholderBoxComponent,
    ButtonComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ReferenceFieldTabComponent implements OnInit, OnDestroy {
  private createSelectedReferenceService = inject(CreateSelectedReferenceService)
  private possibleReferencesService = inject(PossibleReferencesService)
  private profileReferenceModalService = inject(ProfileReferenceModalService)

  @Input()
  referenceField: ReferenceField

  @Input()
  profileId: string

  @Input()
  selectedField: SelectedReferenceField

  @Output()
  selectedProfileAsReference: EventEmitter<SelectedReferenceField> =
    new EventEmitter<SelectedReferenceField>()

  possibleReferences$: Observable<PossibleProfileReferenceData[]>

  referencedProfileUrls: string[] = []

  elementId: string

  openModalWindowSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.referencedProfileUrls = this.referenceField
      .getReferencedProfiles()
      .map((profile) => profile.getUrl())
    this.elementId = this.referenceField.getElementId()
    this.loadPossibleReferences()
  }

  ngOnDestroy(): void {
    this.openModalWindowSubscription?.unsubscribe()
  }

  private loadPossibleReferences(): void {
    this.possibleReferences$ = this.possibleReferencesService.getReferencesMap().pipe(
      filter((innerMap) => innerMap.has(this.profileId)),
      map((innerMap) => innerMap.get(this.profileId).get(this.elementId))
    )
  }

  public openReferenceModal(): void {
    this.openModalWindowSubscription?.unsubscribe()
    this.openModalWindowSubscription = this.profileReferenceModalService
      .openProfileReferenceModal(this.referencedProfileUrls, this.profileId)
      .pipe(
        take(1),
        filter((urls) => urls.length > 0),
        switchMap((urls: string[]) =>
          this.possibleReferencesService.loadAndMapProfiles(urls, this.elementId, this.profileId)
        )
      )
      .subscribe((possibleProfileReferenceData: PossibleProfileReferenceData[]) =>
        this.onReferencesConfirmed(possibleProfileReferenceData)
      )
  }

  private onReferencesConfirmed(selected: PossibleProfileReferenceData[]): void {
    const selectedFields: SelectedReferenceField =
      this.createSelectedReferenceService.mapPossibleReferencesToSelectedReferences(
        selected,
        this.referenceField
      )
    this.selectedProfileAsReference.emit(selectedFields)
  }

  public updateSelectedPossibleReferences(test: PossibleProfileReferenceData): void {
    this.possibleReferencesService
      .getReferencesMap()
      .pipe(
        take(1),
        filter((innerMap) => innerMap.has(this.profileId)),
        map((innerMap) => innerMap.get(this.profileId).get(this.elementId)),
        tap((possibleReferences) => {
          if (possibleReferences) {
            const foundPossibleRefrence = possibleReferences.find((ref) => ref.id === test.id)
            if (foundPossibleRefrence) {
              foundPossibleRefrence.isSelected = !foundPossibleRefrence.isSelected
            } else {
              possibleReferences.push(foundPossibleRefrence)
            }
          }
        })
      )
      .subscribe((possibleReferences) => {
        this.possibleReferencesService.setReferencesMapElement(
          this.profileId,
          this.elementId,
          possibleReferences
        )
        this.onReferencesConfirmed(possibleReferences)
      })
  }
}
