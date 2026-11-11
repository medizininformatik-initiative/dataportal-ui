import { CreateSelectedReferenceService } from 'src/app/service/CreateSelectedReference.service'
import { filter, map, Observable, Subscription, take, tap } from 'rxjs'
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData'
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service'
import { ProfileReferenceAdapter } from 'src/app/shared/models/TreeNode/Adapter/ProfileReferenceAdapter'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core'
import { PossibleReferencesComponent } from '../possible-references/possible-references.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { SectionNameComponent } from '../../../../../../../shared/components/section-name/section-name.component'
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
    FontAwesomeModule,
    SectionNameComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ReferenceFieldTabComponent implements OnInit, OnDestroy {
  private createSelectedReferenceService = inject(CreateSelectedReferenceService)
  private possibleReferencesService = inject(PossibleReferencesService)

  readonly referenceField = input<ReferenceField>(undefined)

  readonly profileId = input<string>(undefined)

  readonly selectedField = input<SelectedReferenceField>(undefined)

  readonly selectedProfileAsReference = output<SelectedReferenceField>()

  possibleReferences$: Observable<PossibleProfileReferenceData[]>

  referencedProfileTypes: { url: string; name: string }[] = []

  elementId: string

  addReferenceSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.referencedProfileTypes = this.referenceField()
      .getReferencedProfiles()
      .map((profile) => profile.getUrl())
      .map((url) => ({ url, name: ProfileReferenceAdapter.normalizeRefrenceUrl(url) }))
    this.elementId = this.referenceField().getElementId()
    this.loadPossibleReferences()
  }

  ngOnDestroy(): void {
    this.addReferenceSubscription?.unsubscribe()
  }

  private loadPossibleReferences(): void {
    this.possibleReferences$ = this.possibleReferencesService.getReferencesMap().pipe(
      filter((innerMap) => innerMap.has(this.profileId())),
      map((innerMap) => innerMap.get(this.profileId()).get(this.elementId))
    )
  }

  /**
   * Loads the profile of the type, adds it to the data selection as a new feature and links it.
   * @param url - The profile URL of the feature type to add
   */
  public addReference(url: string): void {
    this.addReferenceSubscription?.unsubscribe()
    this.addReferenceSubscription = this.possibleReferencesService
      .loadAndMapProfiles([url], this.elementId, this.profileId())
      .pipe(take(1))
      .subscribe((possibleProfileReferenceData: PossibleProfileReferenceData[]) =>
        this.onReferencesConfirmed(possibleProfileReferenceData)
      )
  }

  public countLinked(possibleReferences: PossibleProfileReferenceData[]): number {
    return possibleReferences.filter((reference) => reference.isSelected).length
  }

  private onReferencesConfirmed(selected: PossibleProfileReferenceData[]): void {
    const selectedFields: SelectedReferenceField =
      this.createSelectedReferenceService.mapPossibleReferencesToSelectedReferences(
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
        filter((innerMap) => innerMap.has(this.profileId())),
        map((innerMap) => innerMap.get(this.profileId()).get(this.elementId)),
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
          this.profileId(),
          this.elementId,
          possibleReferences
        )
        this.onReferencesConfirmed(possibleReferences)
      })
  }
}
