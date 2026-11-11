import { AfterViewInit, Component, ElementRef, effect, signal, viewChild } from '@angular/core'
import { AttributeFiltersBuilder } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFiltersBuilder'
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { ActionBarComponent } from 'src/app/shared/components/action-bar/action-bar.component'
import { AvailabilityStatusBarComponent } from 'src/app/shared/components/availability-status-bar/availability-status-bar.component'
import { DatePickerComponent } from 'src/app/shared/components/date-picker/date-picker.component'
import { FilterChipsComponent } from 'src/app/shared/components/filter-chips/filter-chips.component'
import { HeaderComponent } from 'src/app/shared/components/header/header.component'
import { InfoTileComponent } from 'src/app/shared/components/info-tile/info-tile.component'
import { InfoTooltipComponent } from 'src/app/shared/components/info-tooltip/info-tooltip.component'
import { InformationSectionComponent } from 'src/app/shared/components/information-section/information-section.component'
import { LinkedBadgeComponent } from 'src/app/shared/components/linked-badge/linked-badge.component'
import { LogicSwitchComponent } from 'src/app/shared/components/logic-switch/logic-switch.component'
import { MissingFilterComponent } from 'src/app/shared/components/missing-filter/missing-filter.component'
import { PlaceholderBoxComponent } from 'src/app/shared/components/placeholder-box/placeholder-box.component'
import { SearchbarComponent } from 'src/app/shared/components/search/searchbar.component'
import { SearchFilterComponent } from 'src/app/shared/components/search-filter/search-filter.component'
import { SearchModeToggleComponent } from 'src/app/shared/components/search-mode-toggle/search-mode-toggle.component'
import { SectionNameComponent } from 'src/app/shared/components/section-name/section-name.component'
import { SelectedItemsListComponent } from 'src/app/shared/components/selected-items-list/selected-items-list.component'
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component'
import { ValueSelectComponent } from 'src/app/shared/components/value-select/value-select.component'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'
import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { CriteriaBoxComponent } from 'src/app/shared/components/criteria-box/criteria-box.component'
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder'
import { DataSelectionBoxesComponent } from 'src/app/modules/data-selection/components/editor/display/data-selection-boxes/data-selection-boxes.component'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { Translation } from 'src/app/model/DataSelection/Profile/Translation'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'
import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component'
import { SwitchComponent } from 'src/app/shared/components/switch/switch.component'

const PSEUDO = /:(hover|focus-visible|focus-within|focus|active)\b/g
const STATES = {
  hover: ['pg-hover'],
  focus: ['pg-focus', 'pg-focus-visible', 'pg-focus-within'],
  active: ['pg-active'],
} as const
type State = keyof typeof STATES

// Copies every :hover/:focus/:active rule into a .pg-* twin so the states can be forced by class.
// ponytail: top-level rules only (not inside @media), and :not(:hover) is mirrored wrongly.
function mirrorPseudoRules(): void {
  const css: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const r of Array.from(sheet.cssRules)) {
        if (!(r instanceof CSSStyleRule)) continue
        const sel = r.selectorText.replace(PSEUDO, '.pg-$1')
        if (sel !== r.selectorText) css.push(`${sel}{${r.style.cssText}}`)
      }
    } catch {
      // cross-origin sheet: cssRules is not readable
    }
  }
  const el = document.createElement('style')
  el.textContent = css.join('\n')
  document.head.append(el)
}

// Dev-only sandbox. Add components to `imports` and markup below.
@Component({
  selector: 'num-playground',
  standalone: true,
  imports: [
    ActionBarComponent,
    AvailabilityStatusBarComponent,
    DatePickerComponent,
    FilterChipsComponent,
    HeaderComponent,
    InfoTileComponent,
    InfoTooltipComponent,
    InformationSectionComponent,
    LinkedBadgeComponent,
    LogicSwitchComponent,
    MissingFilterComponent,
    PlaceholderBoxComponent,
    SearchbarComponent,
    SearchFilterComponent,
    SearchModeToggleComponent,
    SectionNameComponent,
    SelectedItemsListComponent,
    SpinnerComponent,
    ValueSelectComponent,
    CriteriaBoxComponent,
    DataSelectionBoxesComponent,
    ButtonComponent,
    CheckboxComponent,
    SwitchComponent,
  ],
  template: `
    <h1>Playground</h1>
    <div class="row">
      @for (st of states; track st) {
      <label>
        <input type="checkbox" (change)="toggle(st)" />
        force {{ st }}
      </label>
      }
    </div>
    <div #stage>
      <h2>num-button</h2>
      <div class="row">
        @for (t of buttonTypes; track t) {
        <num-button [type]="t">{{ t }}</num-button>
        }
        <num-button [isDisabled]="true">disabled</num-button>
      </div>

      <h2>num-checkbox</h2>
      <div class="row">
        <num-checkbox label="unchecked" />
        <num-checkbox [checked]="true" label="checked" />
        <num-checkbox [disabled]="true" label="disabled" />
      </div>

      <h2>num-switch</h2>
      <div class="row"><num-switch /></div>

      <h2>num-criteria-box</h2>
      <div class="row">
        <num-criteria-box [criterion]="criterion" [isEditable]="true" />
        <num-criteria-box [criterion]="criterionWithFilters" [isEditable]="true" />
      </div>

      <h2>num-data-selection-boxes</h2>
      <div class="row"><num-data-selection-boxes [profile]="profile" [isEditable]="true" /></div>

      <h2>num-action-bar</h2>
      <div class="row"><num-action-bar /></div>

      <h2>num-availability-status-bar</h2>
      <div class="row">
        @for (a of availability; track a) {
        <num-availability-status-bar [status]="a" />
        }
      </div>

      <h2>num-info-tile</h2>
      <div class="row">
        <num-info-tile value="1.234" label="Patients" />
        <num-info-tile value="0" label="Errors" color="red" />
      </div>

      <h2>num-info-tooltip-card</h2>
      <div class="row">
        <num-info-tooltip-card title="Title" text="Some <b>explanatory</b> text." />
      </div>

      <h2>num-filter-chips</h2>
      <div class="row"><num-filter-chips [filterChips]="chips" [showAll]="true" /></div>

      <h2>num-header / num-section-name / num-information-section</h2>
      <div class="row"><num-header [showToggle]="true">Header title</num-header></div>
      <div class="row"><num-section-name>Section name</num-section-name></div>
      <div class="row">
        <num-information-section>
          <span slot="title">Information title</span>
          Information content
        </num-information-section>
      </div>

      <h2>num-linked-badge / num-placeholder-box / num-missing-filter</h2>
      <div class="row">
        <num-linked-badge />
        <num-placeholder-box>Placeholder content</num-placeholder-box>
        <num-missing-filter><span message>Required filter missing</span></num-missing-filter>
      </div>

      <h2>num-logic-switch / num-search-mode-toggle</h2>
      <div class="row">
        <num-logic-switch />
        <num-search-mode-toggle />
      </div>

      <h2>num-searchbar</h2>
      <div class="row"><num-searchbar /></div>

      <h2>num-search-filter</h2>
      <div class="row"><num-search-filter [(filter)]="searchFilter" /></div>

      <h2>num-selected-items-list</h2>
      <div class="row"><num-selected-items-list [items]="selectedItems" /></div>

      <h2>num-date-picker / num-value-select / num-spinner</h2>
      <div class="row">
        <num-date-picker />
        <num-value-select label="Value" [value]="5" />
        <num-spinner [countdown]="10" />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; padding: 24px; }
    .row { display: flex; gap: 40px; align-items: center; margin-bottom: 48px; }
  `,
})
export class PlaygroundComponent implements AfterViewInit {
  readonly buttonTypes = ['blue', 'green', 'red', 'cancel'] as const
  // placeholder data
  readonly criterion = new CriterionBuilder({
    isReference: false,
    context: new TerminologyCode('Diagnose', 'Diagnose', 'num.abide.context'),
    criterionHash: 'hash-1',
    display: this.display('Hauptdiagnose', 'Main diagnosis'),
    isRequiredFilterSet: true,
    id: 'criterion-1',
    termCodes: [
      new TerminologyCode(
        'I10',
        'Essential hypertension',
        'http://fhir.de/CodeSystem/bfarm/icd-10-gm'
      ),
    ],
  }).buildCriterion()

  // several filters: concept + quantity attribute filters, value filter, time restriction, 2 term codes
  readonly criterionWithFilters = (() => {
    const unit = new QuantityUnit('mm[Hg]', 'mmHg')
    const concept = (code: string, de: string) =>
      new Concept(this.display(de, de), new TerminologyCode(code, de, 'http://snomed.info/sct'))
    const conceptFilter = new AttributeFiltersBuilder(
      this.display('Schweregrad', 'Severity'),
      false,
      FilterTypes.CONCEPT
    )
    const quantity = new AttributeFiltersBuilder(
      this.display('Blutdruck', 'Blood pressure'),
      true,
      FilterTypes.QUANTITY_RANGE
    )
    return new CriterionBuilder({
      isReference: false,
      context: new TerminologyCode('Diagnose', 'Diagnose', 'num.abide.context'),
      criterionHash: 'hash-2',
      display: this.display('Hypertonie mit vielen Filtern', 'Hypertension with many filters'),
      isRequiredFilterSet: true,
      id: 'criterion-2',
      termCodes: [
        new TerminologyCode(
          'I10',
          'Essential hypertension',
          'http://fhir.de/CodeSystem/bfarm/icd-10-gm'
        ),
        new TerminologyCode(
          'I11',
          'Hypertensive heart disease',
          'http://fhir.de/CodeSystem/bfarm/icd-10-gm'
        ),
      ],
    })
      .withAttributeFilters([
        conceptFilter
          .withAttributeCode(new TerminologyCode('severity', 'Severity', 'http://snomed.info/sct'))
          .withConceptFilter(
            conceptFilter.buildConceptFilter(
              'sev',
              [],
              [concept('255604002', 'Leicht'), concept('24484000', 'Schwer')]
            )
          )
          .buildAttributeFilter(),
      ])
      .withValueFilters([
        quantity
          .withQuantityFilter(new QuantityRangeFilter(unit, [unit], 0, 90, 140))
          .buildValueFilter(),
      ])
      .withTimeRestriction(new BetweenFilter('2020-01-01', '2024-12-31'))
      .buildCriterion()
  })()

  readonly profile = new DataSelectionProfile(
    'profile-1',
    'https://example.org/StructureDefinition/Condition',
    this.display('Diagnose', 'Condition'),
    new ProfileFields('fields-1'),
    [],
    new ProfileReference(false, false),
    this.display('Diagnose', 'Condition'),
    1
  )

  readonly availability: AvailabilityStatusType[] = [
    'UNKNOWN',
    'VERY_LOW',
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH',
  ]
  readonly chips: FilterChipData[] = [
    {
      type: 'Severity',
      data: [
        { id: '1', text: 'Leicht', expanded: false },
        { id: '2', text: 'Schwer', expanded: false },
      ],
    },
    { type: 'Zeitraum', data: [{ id: '3', text: '2020 - 2024', expanded: false }] },
  ]
  searchFilter: SearchFilterData = {
    filterType: ElasticSearchFilterTypes.CONTEXT,
    selectedValues: [],
    data: [
      { count: 12, display: 'Diagnose' },
      { count: 7, display: 'Prozedur' },
    ],
  }
  readonly selectedItems = [
    { display: this.display('Hauptdiagnose', 'Main diagnosis'), code: 'I10' },
    { display: this.display('Nebendiagnose', 'Secondary diagnosis'), code: 'I11' },
  ]

  readonly states = Object.keys(STATES) as State[]
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage')
  private readonly forced = signal<State[]>([])

  constructor() {
    effect(() => {
      const root = this.stage().nativeElement
      const on = this.forced()
      for (const st of this.states) {
        for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
          el.classList.toggle(STATES[st][0], on.includes(st))
          STATES[st].slice(1).forEach((c) => el.classList.toggle(c, on.includes(st)))
        }
      }
    })
  }

  private display(de: string, en: string): Display {
    return new Display([new Translation('de-DE', de), new Translation('en-US', en)], de)
  }

  ngAfterViewInit(): void {
    mirrorPseudoRules()
  }

  toggle(st: State): void {
    this.forced.update((f) => (f.includes(st) ? f.filter((x) => x !== st) : [...f, st]))
  }
}
