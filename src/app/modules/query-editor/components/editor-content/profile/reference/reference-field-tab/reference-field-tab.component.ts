import { CreateSelectedReferenceService } from 'src/app/service/CreateSelectedReference.service';
import { filter, map, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData';
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service';
import { ProfileReferenceModalService } from 'src/app/service/DataSelection/Modal/ProfileReferenceModal.service';
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField';
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'num-reference-field-tab',
  templateUrl: './reference-field-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reference-field-tab.component.scss'],
})
export class ReferenceFieldTabComponent implements OnInit, OnDestroy {
  @Input()
  referenceField: ReferenceField;

  @Input()
  profileId: string;

  @Input()
  selectedField: SelectedReferenceField;

  @Output()
  selectedProfileAsReference: EventEmitter<SelectedReferenceField> =
    new EventEmitter<SelectedReferenceField>();

  possibleReferences$: Observable<PossibleProfileReferenceData[]>;

  referencedProfileUrls: string[] = [];

  elementId: string;

  openModalWindowSubscription: Subscription;

  constructor(
    private createSelectedReferenceService: CreateSelectedReferenceService,
    private possibleReferencesService: PossibleReferencesService,
    private profileReferenceModalService: ProfileReferenceModalService
  ) {}

  ngOnInit(): void {
    this.referencedProfileUrls = this.referenceField
      .getReferencedProfiles()
      .map((profile) => profile.getUrl());
    this.elementId = this.referenceField.getElementId();
    this.loadPossibleReferences();
  }

  ngOnDestroy(): void {
    this.openModalWindowSubscription?.unsubscribe();
  }

  private loadPossibleReferences(): void {
    this.possibleReferences$ = this.possibleReferencesService.getPossibleReferencesMap().pipe(
      filter((innerMap) => innerMap.has(this.profileId)),
      map((innerMap) => innerMap.get(this.profileId).get(this.elementId))
    );
  }

  public openReferenceModal(): void {
    this.openModalWindowSubscription?.unsubscribe();
    this.openModalWindowSubscription = this.profileReferenceModalService
      .openProfileReferenceModal(this.referencedProfileUrls, this.profileId)
      .pipe(
        take(1),
        filter((urls) => urls.length > 0),
        switchMap((urls: string[]) =>
          this.possibleReferencesService.fetchProfilesAndMapToPossibleReferences(
            urls,
            this.elementId,
            this.profileId
          )
        )
      )
      .subscribe((possibleProfileReferenceData: PossibleProfileReferenceData[]) =>
        this.onReferencesConfirmed(possibleProfileReferenceData)
      );
  }

  private onReferencesConfirmed(selected: PossibleProfileReferenceData[]): void {
    const selectedFields: SelectedReferenceField =
      this.createSelectedReferenceService.mapPossibleReferencesToSelectedReferences(
        selected,
        this.referenceField
      );
    this.selectedProfileAsReference.emit(selectedFields);
  }

  public updateSelectedPossibleReferences(test: PossibleProfileReferenceData): void {
    this.possibleReferencesService
      .getPossibleReferencesMap()
      .pipe(
        take(1),
        filter((innerMap) => innerMap.has(this.profileId)),
        map((innerMap) => innerMap.get(this.profileId).get(this.elementId)),
        tap((possibleReferences) => {
          if (possibleReferences) {
            const foundPossibleRefrence = possibleReferences.find((ref) => ref.id === test.id);
            if (foundPossibleRefrence) {
              foundPossibleRefrence.isSelected = !foundPossibleRefrence.isSelected;
            } else {
              possibleReferences.push(foundPossibleRefrence);
            }
          }
        })
      )
      .subscribe((possibleReferences) => {
        this.possibleReferencesService.setPossibleReferencesMapElement(
          this.profileId,
          this.elementId,
          possibleReferences
        );
        this.onReferencesConfirmed(possibleReferences);
      });
  }
}
