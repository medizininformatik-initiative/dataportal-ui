import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { ButtonComponent } from 'src/app/shared/components/shared-components.module'
import { Component, computed, inject, signal } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { TimeRestrictionNotSet } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/TimeRestrictionNotSet'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { ProfileProviderService } from '../../../../../../service/Provider/ProfileProvider.service'
import { DataSelectionUIType } from '../../../../../../model/Utilities/DataSelectionUIType'
import { ProfileTimeRestrictionFilter } from '../../../../../../model/DataSelection/Profile/Filter/ProfileDateFilter'
import { BetweenFilterComponent } from '../../../../../feasibility-query/components/editor/criterion-modal/time-restriction/between-filter/between-filter.component'
import { TimerestrictionTypeSelectorComponent } from '../../../../../feasibility-query/components/editor/criterion-modal/time-restriction/timerestriction-type-selector/timerestriction-type-selector.component'
import { BeforeFilterComponent } from '../../../../../feasibility-query/components/editor/criterion-modal/time-restriction/before-filter/before-filter.component'
import { DataSelectionProviderService } from '../../../../../../service/Provider/DataSelectionProvider.service'
import { DataSelectionProfileCloner } from '../../../../../../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'

@Component({
  selector: 'num-apply-time-restriction',
  templateUrl: './apply-time-restriction.component.html',
  styleUrls: ['./apply-time-restriction.component.scss'],
  standalone: true,
  imports: [
    BeforeFilterComponent,
    BetweenFilterComponent,
    ButtonComponent,
    FontAwesomeModule,
    TimerestrictionTypeSelectorComponent,
    TranslateModule,
    BetweenFilterComponent,
    TimerestrictionTypeSelectorComponent,
    BeforeFilterComponent,
  ],
})
export class ApplyTimeRestrictionComponent {
  private readonly profileProviderService = inject(ProfileProviderService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly snackbarMessageService = inject(SnackbarMessageService)

  protected readonly TimeRestrictionType = TimeRestrictionType

  private readonly allProfile = toSignal(this.profileProviderService.getAll(), {
    initialValue: [],
  })

  readonly allProfileFiltered = computed(() =>
    this.allProfile().filter((profile) =>
      profile
        .getFilters()
        .some((filter) => filter.getUiType() === DataSelectionUIType.TIMERESTRICTION)
    )
  )
  readonly profileCount = computed(() => this.allProfileFiltered().length)
  readonly isExpanded = signal(false)
  readonly selectedType = signal<TimeRestrictionType>(TimeRestrictionType.BETWEEN)
  readonly betweenFilter = signal<BetweenFilter>(new BetweenFilter('', ''))
  readonly singleDateRestriction = signal<AbstractTimeRestriction | null>(null)

  readonly isApplyEnabled = computed(() => {
    if (this.profileCount() === 0) return false
    const type = this.selectedType()
    if (type === TimeRestrictionType.NONE) return true
    if (type === TimeRestrictionType.BETWEEN) {
      const f = this.betweenFilter()
      return !!(f.getAfterDate() && f.getBeforeDate())
    }
    return !!this.singleDateRestriction()
  })

  public toggle(): void {
    this.isExpanded.set(!this.isExpanded())
    if (!this.isExpanded()) this.reset()
  }

  public onTypeChange(type: TimeRestrictionType): void {
    this.selectedType.set(type)
    this.singleDateRestriction.set(null)
    if (type === TimeRestrictionType.BETWEEN) {
      this.betweenFilter.set(new BetweenFilter('', ''))
    }
  }

  public onBetweenFilterChanged(filter: BetweenFilter): void {
    this.betweenFilter.set(filter)
  }

  public onSingleDateRestrictionChanged(restriction: AbstractTimeRestriction): void {
    this.singleDateRestriction.set(restriction)
  }

  public apply(): void {
    const restriction = this.buildRestriction()
    if (!restriction) return
    this.allProfileFiltered().forEach((profile) => {
      const timeRestrictionFilter = profile
        .getFilters()
        .filter((filter) => filter.getUiType() === DataSelectionUIType.TIMERESTRICTION)
      if (timeRestrictionFilter.length > 0) {
        const profileDateFilter = new ProfileTimeRestrictionFilter(
          timeRestrictionFilter[0].getName(),
          timeRestrictionFilter[0].getType(),
          restriction
        )
        profile.setFilter(profileDateFilter)
        const clonedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
        this.dataSelectionProvider.setActiveProfile(clonedProfile, 'SET')
      }
    })
    this.snackbarMessageService.displayTimeRestrictionAppliedToAll()
    this.isExpanded.set(false)
    this.reset()
  }

  public cancel(): void {
    this.reset()
    this.isExpanded.set(false)
  }

  private buildRestriction(): AbstractTimeRestriction | null {
    if (this.selectedType() === TimeRestrictionType.NONE) return new TimeRestrictionNotSet()
    if (this.selectedType() === TimeRestrictionType.BETWEEN) return this.betweenFilter()
    return this.singleDateRestriction()
  }

  private reset(): void {
    this.selectedType.set(TimeRestrictionType.BETWEEN)
    this.betweenFilter.set(new BetweenFilter('', ''))
    this.singleDateRestriction.set(null)
  }
}
