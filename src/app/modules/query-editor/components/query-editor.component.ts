import { ActivatedRoute } from '@angular/router'
import { combineLatest, map, Observable, of, Subscription, switchMap, take, tap } from 'rxjs'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { data } from 'cypress/types/jquery'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { PathSegments } from 'src/app/app-paths'
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { EditorContentComponent } from './editor-content/editor-content.component'
import { EditActionBarComponent } from './action-bar/edit-action-bar.component'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'num-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss'],
  standalone: true,
  imports: [EditorContentComponent, EditActionBarComponent, AsyncPipe],
})
export class QueryEditorComponent implements OnInit, OnDestroy {
  criterion$: Observable<Criterion>

  dataSelectionProfile$: Observable<DataSelectionProfile>

  referenceCriterion$: Observable<ReferenceCriterion>

  id: string
  type: string

  routeSubscription: Subscription

  constructor(
    private criterionProviderService: CriterionProviderService,
    private navigationHelperService: NavigationHelperService,
    private activatedRoute: ActivatedRoute,
    private profileProviderService: ProfileProviderService,
    private possibleReferencesService: PossibleReferencesService,
    private referenceCriterionProviderService: ReferenceCriterionProviderService
  ) {}

  ngOnInit(): void {
    const url = this.activatedRoute.snapshot.url

    this.id = url[1]?.path
    this.type = url[0]?.path

    if (this.id && this.type) {
      this.getElementFromProvider()

      if (this.isProfile()) {
        this.possibleReferencesService.initialize(this.id).pipe(take(1)).subscribe()
      }
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe()
  }

  private getElementFromProvider(): void {
    if (this.isCriterion()) {
      this.getCriterionFromProvider(this.id)
    } else if (this.isProfile()) {
      this.getDataSelectionProfileFromProvider(this.id)
    } else if (this.isReferenceCriterion()) {
      this.getReferenceCriterionFromProvider(this.id)
    }
  }

  private getDataSelectionProfileFromProvider(id: string): void {
    this.dataSelectionProfile$ = this.profileProviderService
      .getAll()
      .pipe(map((profiles) => profiles.find((profile) => profile.getId() === id)))
  }

  private getCriterionFromProvider(id: string): void {
    this.criterion$ = this.criterionProviderService
      .getAll()
      .pipe(map((criteria) => criteria.find((criterion) => criterion.getId() === id)))
  }

  private getReferenceCriterionFromProvider(id: string): void {
    this.referenceCriterion$ = this.referenceCriterionProviderService
      .getAll()
      .pipe(map((criteria) => criteria.find((criterion) => criterion.getId() === id)))
  }

  public onCancel(): void {
    if (this.isProfile()) {
      this.navigationHelperService.navigateToDataSelectionEditor()
    } else if (this.isCriterion()) {
      this.navigationHelperService.navigateToFeasibilityQueryEditor()
    } else if (this.isReferenceCriterion()) {
      this.navigationHelperService.navigateToFeasibilityQueryEditor()
    }
  }

  private isProfile(): boolean {
    return this.type === PathSegments.feature
  }

  private isCriterion(): boolean {
    return this.type === PathSegments.criterion
  }

  private isReferenceCriterion(): boolean {
    return this.type === PathSegments.reference
  }
}
