import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { galleryComponents } from './gallery-components'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'
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
import { TableComponent } from 'src/app/shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableCellKind } from 'src/app/shared/models/TableData/Cells/TableCellKind'

const PSEUDO = /:(hover|focus-visible|focus-within|focus|active)\b/g
const PSEUDO_ANY = /::?[\w-]+(\([^)]*\))?/g
const esc = (t: string): string => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const tok = (cls: string, t: string): string => `<span class="t-${cls}">${t}</span>`
// Line-based CSS highlighter for the formatted rules from loadCss(); input must already be escaped.
const hlLine = (l: string): string => {
  const decl = l.match(/^(\s+)([\w-]+)(:\s*)(.*?)(;?)$/)
  if (decl) {
    const val = decl[4]
      .replace(/(&quot;|"|')[^"']*\1/g, (m) => tok('str', m))
      .replace(/var\(--[\w-]+\)?/g, (m) => tok('var', m))
      .replace(/#[0-9a-fA-F]{3,8}\b|(rgba?|hsla?)\([^)]*\)/g, (m) => tok('col', m))
      .replace(/(?<![\w#>-])-?\d*\.?\d+(px|rem|em|%|s|ms|deg|vh|vw)?\b/g, (m) => tok('num', m))
    return `${decl[1]}${tok('prop', decl[2])}${decl[3]}${val}${decl[5]}`
  }
  if (l.endsWith('{')) {
    return l
      .replace(/\[[^\]]*\]/g, (m) => tok('attr', m))
      .replace(/(?<![\w-])([.#][\w-]+)/g, (m) => tok('sel', m))
      .replace(/(::?[\w-]+)/g, (m) => tok('pseudo', m))
  }
  return l
}
const highlight = (css: string): string => esc(css).split('\n').map(hlLine).join('\n') + '\n'
const prettify = (cssText: string): string =>
  cssText.replace(/ \{ /, ' {\n  ').replace(/; (?=[\w-]+:)/g, ';\n  ').replace(/ \}$/, '\n}')
interface UsagePage {
  url: string | null // null: opened as a dialog from non-component code, see via
  via: string[] // component chain from the button's component up to the page, or the opening file
}
interface Usage {
  pages: UsagePage[]
  file: string
  line: number
  area: string
  component: string | null
  label: string
}
interface UsageSet {
  tag: string
  count: number | null // null while loading
  failed: boolean
  groups: UsageGroup[]
}
interface UsageGroup {
  file: string
  component: string | null
  pages: UsagePage[]
  uses: { line: number; label: string }[]
}
// one card per file, with its pages merged (they are the same for every use in that file)
function groupUsages(list: Usage[]): UsageGroup[] {
  const groups = new Map<string, UsageGroup>()
  for (const u of list) {
    const g = groups.get(u.file) ?? { file: u.file, component: u.component, pages: [], uses: [] }
    g.uses.push({ line: u.line, label: u.label })
    for (const pg of u.pages)
      if (!g.pages.some((x) => x.url === pg.url && x.via[x.via.length - 1] === pg.via[pg.via.length - 1]))
        g.pages.push(pg)
    groups.set(u.file, g)
  }
  return [...groups.values()]
}
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

const lum = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const blendOnWhite = (hex: string, a: number): string =>
  '#' +
  [1, 3, 5]
    .map((i) =>
      Math.round(255 - a * (255 - parseInt(hex.slice(i, i + 2), 16)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')
const blend = (hex: string, a: number, bg: string): string =>
  '#' +
  [1, 3, 5]
    .map((i) =>
      Math.round(parseInt(bg.slice(i, i + 2), 16) * (1 - a) + parseInt(hex.slice(i, i + 2), 16) * a)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')
const mixBlack = (hex: string, a: number): string =>
  '#' +
  [1, 3, 5]
    .map((i) =>
      Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - a))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')
// text: AA 4.5, AAA 7; 3:1 only passes for large text / UI parts (icons, borders)
const rate = (r: number): string => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'UI only' : 'FAIL')
const fmt = (r: number): string => `${r.toFixed(2)}:1 ${rate(r)}`
const contrast = (a: string, b: string): number => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Dev-only sandbox. Add components to `imports` and markup below.
@Component({
  selector: 'num-gallery',
  standalone: true,
  imports: [
    FontAwesomeModule,
    MatExpansionModule,
    MatTabsModule,
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
    TableComponent,
  ],
  host: { '[class.css-collapsed]': '!cssOpen()' },
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
    <div #stage (click)="onStageClick($any($event.target))">
      @for (set of usageSets(); track set.tag) {
      <mat-expansion-panel class="usages">
        <mat-expansion-panel-header>
          <mat-panel-title>
            @if (set.failed) { {{ set.tag }}: usage info unavailable, restart ng serve } @else if
            (set.count === null) { {{ set.tag }}: used in … } @else { {{ set.tag }}: used in
            {{ set.count }} places }
          </mat-panel-title>
        </mat-expansion-panel-header>
    <div class="usage-groups">
      @for (g of set.groups; track g.file) {
      <section class="usage-group">
        <div class="usage-head">
          <strong>{{ g.component ?? g.file }}</strong>
          <span class="usage-count">{{ g.uses.length }}×</span>
        </div>
        <div class="usage-file">{{ g.file }}</div>
        <ul class="usage-uses">
          @for (u of g.uses; track u.line) {
          <li>
            <code>line {{ u.line }}</code>
            <span>{{ u.label || '–' }}</span>
          </li>
          }
        </ul>
        <div class="usage-pages">
          <span class="usage-key">Page</span>
          @for (pg of g.pages.slice(0, 4); track pg.via.join()) {
          <span class="chip" [class.chip-dialog]="!pg.url" [title]="pg.via.join(' ← ')">
            {{ pg.url ?? 'dialog · ' + shortFile(pg.via[pg.via.length - 1]) }}
          </span>
          } @empty {
          <span class="usage-none">no page found</span>
          } @if (g.pages.length > 4) {
          <span class="chip chip-more">+{{ g.pages.length - 4 }} more</span>
          }
        </div>
      </section>
      }
    </div>
      </mat-expansion-panel>
      }
      @if (shows('num-button')) {
      <section class="pinned">
        <div class="pinned-head">
          <button
            type="button"
            class="pinned-toggle"
            aria-label="Current component"
            [attr.aria-expanded]="pinnedOpen()"
            (click)="pinnedOpen.set(!pinnedOpen())"
          >
            <fa-icon [icon]="pinnedOpen() ? 'chevron-up' : 'chevron-down'" />
          </button>
          <h2 id="num-button">num-button</h2>
        </div>
        @if (pinnedOpen()) {
        <div class="pinned-body">
          <div class="row">
            @for (t of buttonTypes; track t) { @if (showsButton('num-button-' + t)) {
            <num-button [type]="t">{{ t }}</num-button>
            } } @if (showsButton('num-button-disabled')) {
            <num-button [isDisabled]="true">disabled</num-button>
            }
          </div>
        </div>
        }
      </section>
      @if (showsGreenTabs()) {
      <mat-tab-group
        [selectedIndex]="tabIndex(['green-button-shades', 'green-button-techniques', 'num-button-test'])"
        animationDuration="0ms"
      >
        <mat-tab label="Green button shades">
          <h2 id="green-button-shades">
            green button shades (white text/icon; ratios: label on button / button on bar)
          </h2>
          <div class="shades">
            @for (g of greenShades; track g.bg) {
            <div class="shade" [style.--bg]="g.bg" [style.--hover]="g.hover">
              <code>
                {{ g.bg }} · label {{ g.label }} · vs bar {{ g.onBar }} · hover label
                {{ g.hoverLabel }}
              </code>
              <div class="row">
                <button type="button" class="num-button green vbtn">Text</button>
                <button type="button" class="num-button green vbtn v-hover">Text hover</button>
                <button type="button" class="num-button green disabled" disabled>
                  Text disabled
                </button>
                <button type="button" class="num-button green icon vbtn">
                  <fa-icon size="lg" icon="save" />
                </button>
                <button type="button" class="num-button green icon vbtn v-hover">
                  <fa-icon size="lg" icon="save" />
                </button>
                <button type="button" class="num-button green icon disabled" disabled>
                  <fa-icon size="lg" icon="save" />
                </button>
                <button type="button" class="num-button green outline vbtn">Outline</button>
              </div>
            </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="Green button techniques">
          <h2 id="green-button-techniques">green button techniques (dark text, ring, bold/size)</h2>
          <div class="techs">
            @for (t of techniques; track t.name) {
            <div
              class="tech"
              [style.--bg]="t.bg"
              [style.--fg]="t.fg"
              [style.--hover]="t.hover"
              [style.--ring]="t.ring"
              [style.--rw]="t.ringWidth"
              [style.--fw]="t.weight"
              [style.--fs]="t.size"
            >
              <code>
                {{ t.name }} · text {{ t.text }} · ring vs bar {{ t.ringBar }} · fill vs bar
                {{ t.fillBar }}
              </code>
              <div class="row">
                <button type="button" class="num-button green tbtn">Text</button>
                <button type="button" class="num-button green tbtn v-hover">Text hover</button>
                <button type="button" class="num-button green icon tbtn">
                  <fa-icon size="lg" icon="save" />
                </button>
                <button type="button" class="num-button green icon tbtn v-hover">
                  <fa-icon size="lg" icon="save" />
                </button>
              </div>
            </div>
            }
          </div>
        </mat-tab>
          <mat-tab label="test">
            <h2 id="num-button-test">test</h2>
            <p>New design. Ask Claude Code to build it here.</p>
          </mat-tab>
      </mat-tab-group>
      }
      }
      @if (shows('num-checkbox')) {
        @if (!variant()) {
      <h2 id="num-checkbox">num-checkbox</h2>
      <div class="row">
        <num-checkbox label="unchecked" />
        <num-checkbox [checked]="true" label="checked" />
        <num-checkbox [disabled]="true" label="disabled" />
      </div>

      }
      }
      @if (shows('num-switch')) {
        @if (!variant()) {
      <h2 id="num-switch">num-switch</h2>
      <div class="row"><num-switch /></div>

      }
      }
      @if (shows('num-criteria-box')) {
      <section class="pinned">
        <div class="pinned-head">
          <button
            type="button"
            class="pinned-toggle"
            aria-label="Current component"
            [attr.aria-expanded]="pinnedOpen()"
            (click)="pinnedOpen.set(!pinnedOpen())"
          >
            <fa-icon [icon]="pinnedOpen() ? 'chevron-up' : 'chevron-down'" />
          </button>
          <h2 id="num-criteria-box">num-criteria-box</h2>
        </div>
        @if (pinnedOpen()) {
        <div class="pinned-body">
          <div class="row">
            <num-criteria-box [criterion]="criterion" [isEditable]="true" />
            <num-criteria-box [criterion]="criterionWithFilters" [isEditable]="true" />
          </div>
        </div>
        }
      </section>
      <mat-tab-group
        [selectedIndex]="tabIndex(['criteria-box-variants', 'criteria-box-layouts', 'criteria-box-twenty', 'criteria-box-compact', 'criteria-box-compact-20', 'criteria-box-divider', 'criteria-box-footer-divider', 'criteria-box-proposal', 'criteria-box-refined', 'criteria-box-impeccable'])"
        animationDuration="0ms"
      >
        <mat-tab label="Colour variants">
          <h2 id="criteria-box-variants">
            criteria box variants (page bg white; ratios: edge vs white, WCAG 1.4.11 wants 3:1)
          </h2>
          <div class="cvars">
            @for (v of criteriaVariants; track v.name) {
            <div
              class="cvar"
              [style.--bg]="v.fill"
              [style.--b]="v.border"
              [style.--bw]="v.bw"
              [style.--sh]="v.shadow"
            >
              <code>{{ v.name }} · edge {{ v.ratio }}</code>
              <num-criteria-box [criterion]="criterion" [isEditable]="true" />
            </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="Layout proposals">
          <h2 id="criteria-box-layouts">
            criteria box layout proposals (static mocks; goal: edit action discoverable without
            hunting for the cog)
          </h2>
          <div class="mocks">
            <div class="mock">
              <code>1 labelled edit button + grip (primary action has a word)</code>
              <div class="mk-card">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-btn">
                    <fa-icon icon="pencil-alt" />
                    Bearbeiten
                  </button>
                  <button type="button" class="mk-ico" aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>2 footer action bar (all actions as labelled buttons, no menu)</code>
              <div class="mk-card mk-col">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-bar">
                  <button type="button" class="mk-link">
                    <fa-icon icon="pencil-alt" />
                    Bearbeiten
                  </button>
                  <button type="button" class="mk-link">
                    <fa-icon icon="clone" />
                    Duplizieren
                  </button>
                  <button type="button" class="mk-link mk-danger">
                    <fa-icon icon="trash" />
                    Löschen
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>3 left grip rail + all icon actions visible (pencil, copy, delete)</code>
              <div class="mk-card mk-rail">
                <div class="mk-grip" aria-label="Verschieben"><fa-icon icon="bars" /></div>
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-ico mk-fill" aria-label="Bearbeiten">
                    <fa-icon icon="pencil-alt" />
                  </button>
                  <button type="button" class="mk-ico" aria-label="Duplizieren">
                    <fa-icon icon="clone" />
                  </button>
                  <button type="button" class="mk-ico" aria-label="Löschen">
                    <fa-icon icon="trash" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                4 edit affordance in the filter row ("Filter bearbeiten ›") + overflow menu
              </code>
              <div class="mk-card">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-ico" aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                  <button type="button" class="mk-link mk-push">
                    Filter bearbeiten
                    <fa-icon icon="angle-right" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>5 divider column, icons labelled under the glyph</code>
              <div class="mk-card mk-split">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-col2">
                  <button type="button" class="mk-tool">
                    <fa-icon icon="pencil-alt" />
                    Ändern
                  </button>
                  <button type="button" class="mk-tool">
                    <fa-icon icon="clone" />
                    Kopieren
                  </button>
                  <button type="button" class="mk-tool">
                    <fa-icon icon="trash" />
                    Löschen
                  </button>
                  <button type="button" class="mk-tool">
                    <fa-icon icon="expand-arrows-alt" />
                    Ziehen
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>6 tinted header band holds title + whole toolbar; filters on white body</code>
              <div class="mk-card mk-banded">
                <div class="mk-head">
                  <div class="mk-main">
                    <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                    <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  </div>
                  <div class="mk-side">
                    <button type="button" class="mk-ico mk-fill" aria-label="Bearbeiten">
                      <fa-icon icon="pencil-alt" />
                    </button>
                    <button type="button" class="mk-ico" aria-label="Duplizieren">
                      <fa-icon icon="clone" />
                    </button>
                    <button type="button" class="mk-ico" aria-label="Löschen">
                      <fa-icon icon="trash" />
                    </button>
                    <button type="button" class="mk-ico" aria-label="Verschieben">
                      <fa-icon icon="expand-arrows-alt" />
                    </button>
                  </div>
                </div>
                <div class="mk-body">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                7 split button: "Bearbeiten" + caret opens the rest; grip inline left of title
              </code>
              <div class="mk-card">
                <div class="mk-main mk-inline">
                  <span class="mk-gripi" aria-label="Verschieben">
                    <fa-icon icon="expand-arrows-alt" />
                  </span>
                  <div>
                    <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                    <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  </div>
                </div>
                <div class="mk-side mk-split-btn">
                  <button type="button" class="mk-btn mk-btn-l">
                    <fa-icon icon="pencil-alt" />
                    Bearbeiten
                  </button>
                  <button type="button" class="mk-btn mk-btn-r" aria-label="Mehr">
                    <fa-icon icon="chevron-down" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>8 per-filter edit: each filter row has its own pencil; header has only ⋮</code>
              <div class="mk-card">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-ico" aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                      <button type="button" class="mk-ico mk-sm" aria-label="Filter bearbeiten">
                        <fa-icon icon="pencil-alt" />
                      </button>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                9 solid accent action rail on the right, white icons (high contrast, cannot be
                missed)
              </code>
              <div class="mk-card mk-solidrail">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-rail2">
                  <button type="button" aria-label="Bearbeiten">
                    <fa-icon icon="pencil-alt" />
                  </button>
                  <button type="button" aria-label="Duplizieren"><fa-icon icon="clone" /></button>
                  <button type="button" aria-label="Löschen"><fa-icon icon="trash" /></button>
                  <button type="button" aria-label="Verschieben" class="mk-last">
                    <fa-icon icon="expand-arrows-alt" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                10 full-width footer call to action (large touch target), grip inline left
              </code>
              <div class="mk-card mk-col">
                <div class="mk-main mk-inline">
                  <span class="mk-gripi" aria-label="Verschieben">
                    <fa-icon icon="expand-arrows-alt" />
                  </span>
                  <div>
                    <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                    <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                    <div class="mk-foot">
                      <div class="mk-filters">
                        @for (f of mockFilters; track f.type) {
                        <div class="mk-frow">
                          <span class="mk-chip">{{ f.type }}</span>
                          @for (v of f.values; track v) {
                          <span class="mk-pill">{{ v }}</span>
                          }
                        </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" class="mk-cta">
                  <fa-icon icon="pencil-alt" />
                  Kriterium bearbeiten
                </button>
              </div>
            </div>

            <div class="mock">
              <code>11 labelled "Aktionen ▾" menu button (cog replaced by a word + caret)</code>
              <div class="mk-card ">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-btn">
                    Aktionen
                    <fa-icon icon="chevron-down" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                12 accent stripe; edit + delete visible; move via ▲▼ buttons (keyboard alternative
                to drag)
              </code>
              <div class="mk-card mk-stripe">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-ico mk-fill" aria-label="Bearbeiten">
                    <fa-icon icon="pencil-alt" />
                  </button>
                  <button type="button" class="mk-ico " aria-label="Löschen">
                    <fa-icon icon="trash" />
                  </button>
                  <button type="button" class="mk-ico " aria-label="Nach oben">
                    <fa-icon icon="arrow-up" />
                  </button>
                  <button type="button" class="mk-ico " aria-label="Nach unten">
                    <fa-icon icon="arrow-down" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>13 joined segmented toolbar: [✎ Bearbeiten | copy | delete | ⋮]</code>
              <div class="mk-card ">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side mk-seg">
                  <button type="button" class="mk-ico mk-wide">
                    <fa-icon icon="pencil-alt" />
                    Bearbeiten
                  </button>
                  <button type="button" class="mk-ico" aria-label="Duplizieren">
                    <fa-icon icon="clone" />
                  </button>
                  <button type="button" class="mk-ico" aria-label="Löschen">
                    <fa-icon icon="trash" />
                  </button>
                  <button type="button" class="mk-ico " aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                14 edit icon right next to the title (affordance beside the thing being edited) + ⋮
              </code>
              <div class="mk-card ">
                <div class="mk-main">
                  <div class="mk-titlerow">
                    <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                    <button type="button" class="mk-ico mk-sm mk-nm" aria-label="Bearbeiten">
                      <fa-icon icon="pencil-alt" />
                    </button>
                  </div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-ico " aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>15 floating action pill overlapping the bottom edge</code>
              <div class="mk-card mk-vis mk-col">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-float">
                  <button type="button" class="mk-ico mk-fill" aria-label="Bearbeiten">
                    <fa-icon icon="pencil-alt" />
                  </button>
                  <button type="button" class="mk-ico" aria-label="Duplizieren">
                    <fa-icon icon="clone" />
                  </button>
                  <button type="button" class="mk-ico" aria-label="Löschen">
                    <fa-icon icon="trash" />
                  </button>
                  <button type="button" class="mk-ico " aria-label="Verschieben">
                    <fa-icon icon="expand-arrows-alt" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                16 filter-count button "Filter bearbeiten (4)" shows how much is set; ⋮ for the rest
              </code>
              <div class="mk-card ">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-ico " aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
                <div class="mk-foot">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                  <button type="button" class="mk-btn mk-push">
                    <fa-icon icon="pencil-alt" />
                    Filter bearbeiten
                    <span class="mk-count">{{ mockFilters.length }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>17 left ▲▼ order column (replaces drag) + labelled edit button right</code>
              <div class="mk-card mk-3">
                <div class="mk-ord">
                  <button type="button" class="mk-ico mk-sm" aria-label="Nach oben">
                    <fa-icon icon="arrow-up" />
                  </button>
                  <button type="button" class="mk-ico mk-sm" aria-label="Nach unten">
                    <fa-icon icon="arrow-down" />
                  </button>
                </div>
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-btn">
                    <fa-icon icon="pencil-alt" />
                    Bearbeiten
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                18 collapsible: header toggle shows "Filter (4)", actions sit in the expanded footer
              </code>
              <div class="mk-card">
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                </div>
                <div class="mk-side">
                  <button
                    type="button"
                    class="mk-btn"
                    aria-controls="mk18-body"
                    [attr.aria-expanded]="open18()"
                    (click)="open18.set(!open18())"
                  >
                    Filter ({{ mockFilters.length }})
                    <fa-icon [icon]="open18() ? 'chevron-up' : 'chevron-down'" />
                  </button>
                </div>
                @if (open18()) {
                <div class="mk-foot" id="mk18-body">
                  <div class="mk-filters">
                    @for (f of mockFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (v of f.values; track v) {
                      <span class="mk-pill">{{ v }}</span>
                      }
                    </div>
                    }
                  </div>
                  <div class="mk-bar2">
                    <button type="button" class="mk-link">
                      <fa-icon icon="pencil-alt" />
                      Bearbeiten
                    </button>
                    <button type="button" class="mk-link">
                      <fa-icon icon="clone" />
                      Duplizieren
                    </button>
                    <button type="button" class="mk-link mk-danger">
                      <fa-icon icon="trash" />
                      Löschen
                    </button>
                  </div>
                </div>
                }
              </div>
            </div>

            <div class="mock">
              <code>19 numbered row (order matters in a query) + text link "Bearbeiten" + ⋮</code>
              <div class="mk-card mk-3">
                <div class="mk-num">1</div>
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
                <div class="mk-side">
                  <button type="button" class="mk-link">
                    <fa-icon icon="pencil-alt" />
                    Bearbeiten
                  </button>
                  <button type="button" class="mk-ico " aria-label="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                20 tab hanging off the top edge holds the toolbar (always visible, not inside the
                content)
              </code>
              <div class="mk-card mk-vis mk-col mk-tabbed">
                <div class="mk-tab">
                  <button type="button" class="mk-ico mk-sm mk-nm" aria-label="Bearbeiten">
                    <fa-icon icon="pencil-alt" />
                  </button>
                  <button type="button" class="mk-ico mk-sm mk-nm" aria-label="Duplizieren">
                    <fa-icon icon="clone" />
                  </button>
                  <button type="button" class="mk-ico mk-sm mk-nm" aria-label="Löschen">
                    <fa-icon icon="trash" />
                  </button>
                  <button type="button" class="mk-ico mk-sm mk-nm" aria-label="Verschieben">
                    <fa-icon icon="expand-arrows-alt" />
                  </button>
                </div>
                <div class="mk-main">
                  <div class="mk-title">Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut</div>
                  <div class="mk-info">Laboruntersuchung · 12962-7 · LOINC</div>
                  <div class="mk-foot">
                    <div class="mk-filters">
                      @for (f of mockFilters; track f.type) {
                      <div class="mk-frow">
                        <span class="mk-chip">{{ f.type }}</span>
                        @for (v of f.values; track v) {
                        <span class="mk-pill">{{ v }}</span>
                        }
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Twenty boxes">
          <h2 id="criteria-box-twenty">twenty criteria boxes (toggle: plain / with filters)</h2>
          <div class="row">
            @for (n of twenty; track n) {
            <div>
              <button
                type="button"
                [attr.aria-expanded]="expandedBoxes().has(n)"
                (click)="toggleBox(n)"
              >
                <fa-icon [icon]="expandedBoxes().has(n) ? 'chevron-up' : 'chevron-down'" />
                {{ n }}
              </button>
              <num-criteria-box
                [criterion]="expandedBoxes().has(n) ? criterionWithFilters : criterion"
                [isEditable]="true"
              />
            </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="Compact modes">
          <h2 id="criteria-box-compact">
            20 criteria box designs, 3 detail levels each (chevron on a card swaps it to the other
            level: minimal/reduced expand to full, full collapses to minimal)
          </h2>
          <div class="cd-grid cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}: {{ l.hint }}</strong>
            }
          </div>
          @for (d of cdDesigns; track d.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ d.name }}</code>
            <div class="cd-grid">
              @for (l of cdLevels; track l.level) {
              <div
                class="cd cd-{{ d.layout }}"
                [style.--bg]="d.skin.bg"
                [style.--bd]="d.skin.bd"
                [style.--ac]="d.skin.ac"
                [style.--r]="d.skin.r"
                [style.--bw]="d.skin.bw"
                [style.--sh]="d.skin.sh"
              >
                @let lv = cdLevel(i, l.level);
                <div class="cd-head">
                  <div class="cd-main">
                    <div class="cd-title">Hypertonie mit vielen Filtern</div>
                    @if (lv >= 1) {
                    <div class="cd-info">Diagnose · I10 · ICD-10-GM</div>
                    }
                  </div>
                  <div class="cd-act">
                    @if (lv === 0) {
                    <span class="cd-badge">{{ cdFilters.length }} Filter</span>
                    } @if (lv >= 1) {
                    <fa-icon icon="cog" aria-label="Bearbeiten" />
                    } @if (lv === 2) {
                    <fa-icon icon="expand-arrows-alt" aria-label="Verschieben" />
                    }
                    <button
                      type="button"
                      class="cd-tog"
                      [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                      [attr.aria-expanded]="lv === 2"
                      (click)="cdToggle(i, l.level)"
                    >
                      <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                    </button>
                  </div>
                </div>
                @if (lv === 2) {
                <div class="cd-body">
                  @for (f of cdFilters; track f.type) {
                  <div class="mk-frow">
                    <span class="mk-chip">{{ f.type }}</span>
                    @for (v of f.values; track v) {
                    <span class="mk-pill">{{ v }}</span>
                    }
                  </div>
                  }
                </div>
                } @else if (lv === 1) {
                <div class="cd-body mk-frow">
                  @for (f of cdFilters; track f.type) {
                  <span class="mk-pill">{{ f.type }} · {{ f.values.length }}</span>
                  }
                </div>
                }
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
        <mat-tab label="Compact designs">
          <h2 id="criteria-box-compact-20">
            20 compact structures, 3 detail levels each (chevron swaps a card to the other level;
            "hover" design shows details on hover)
          </h2>
          <div class="cd-grid cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}: {{ l.hint }}</strong>
            }
          </div>
          @for (d of cnDesigns; track d.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ d.name }}</code>
            <div class="cd-grid">
              @for (l of cdLevels; track l.level) { @let lv = cdLevel(i + 100, l.level);
              <div class="cn cn-k-{{ d.cls }}" [class.cn-open]="lv === 2">
                @if (d.cls === 'ticket') {
                <span class="cn-lead">I10</span>
                } @if (d.cls === 'icon') {
                <span class="cn-lead">D</span>
                }
                <div class="cn-main">
                  <span class="cn-title">Hypertonie mit vielen Filtern</span>
                  <span class="cn-info" [class.cn-off]="!(lv === 2 || (lv === 1 && d.info))">
                    Diagnose · I10 · ICD-10-GM
                  </span>
                </div>
                @if (lv < 2) {
                <div class="cn-sum">
                  @switch (lv === 1 ? d.s1 : d.s0) { @case ('badge') {
                  <span class="cd-badge">{{ cdFilters.length }} Filter</span>
                  } @case ('count') {
                  <span class="cd-badge">{{ cdFilters.length }}</span>
                  } @case ('dots') {
                  <span class="cn-dots"><i></i><i></i><i></i></span>
                  } @case ('bar') {
                  <span class="cn-bar"><i></i><i></i><i></i></span>
                  } @case ('names') { @for (f of cdFilters; track f.type) {
                  <span class="mk-pill">{{ f.type }}</span>
                  } } @case ('more') {
                  <span class="mk-pill">{{ cdFilters[0].type }}</span>
                  <span class="cn-more">+{{ cdFilters.length - 1 }}</span>
                  } @case ('text') {
                  <span class="cn-text">{{ cnNames }}</span>
                  } @case ('values') {
                  <span class="cn-text">{{ cnValues }}</span>
                  } }
                </div>
                } @if (lv >= 1 || d.cls === 'hover') {
                <div class="cn-act">
                  <fa-icon icon="cog" aria-label="Bearbeiten" />
                  @if (lv === 2) {
                  <fa-icon icon="expand-arrows-alt" aria-label="Verschieben" />
                  }
                </div>
                }
                <button
                  type="button"
                  class="cd-tog cn-tog"
                  [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                  [attr.aria-expanded]="lv === 2"
                  (click)="cdToggle(i + 100, l.level)"
                >
                  <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                </button>
                @if (lv === 2) {
                <div class="cn-body">
                  @for (f of cdFilters; track f.type) {
                  <div class="mk-frow">
                    <span class="mk-chip">{{ f.type }}</span>
                    @for (v of f.values; track v) {
                    <span class="mk-pill">{{ v }}</span>
                    }
                  </div>
                  }
                </div>
                }
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
        <mat-tab label="Divider column">
          <h2 id="criteria-box-divider">
            layout 5 (divider column, labelled icons) at the real box width of 448px; 12 ways to
            compact it (chevron swaps a card to the other level)
          </h2>
          <div class="dcg cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}</strong>
            }
          </div>
          @for (v of dcVariants; track v.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ v.name }}</code>
            <div class="dcg">
              @for (l of cdLevels; track l.level) { @let lv = cdLevel(i + 200, l.level); @let c =
              v.lv[lv];
              <div class="dc dc-{{ c.col }}" [class.dc-grid]="c.grid">
                <div class="dc-text">
                  <div class="dc-top">
                    <div class="mk-title">Hypertonie mit vielen Filtern</div>
                    <button
                      type="button"
                      class="cd-tog"
                      [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                      [attr.aria-expanded]="lv === 2"
                      (click)="cdToggle(i + 200, l.level)"
                    >
                      <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                    </button>
                  </div>
                  @if (c.info) {
                  <div class="mk-info">Diagnose · I10 · ICD-10-GM</div>
                  } @switch (c.f) { @case ('rows') {
                  <div class="mk-foot mk-filters">
                    @for (f of cdFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (x of f.values; track x) {
                      <span class="mk-pill">{{ x }}</span>
                      }
                    </div>
                    }
                  </div>
                  } @case ('names') {
                  <div class="mk-frow">
                    @for (f of cdFilters; track f.type) {
                    <span class="mk-pill">{{ f.type }} · {{ f.values.length }}</span>
                    }
                  </div>
                  } @case ('values') {
                  <span class="cn-text">{{ cnValues }}</span>
                  } @case ('count') {
                  <div><span class="cd-badge">{{ cdFilters.length }} Filter</span></div>
                  } }
                </div>
                @if (c.t.length || c.kebab) {
                <div class="dc-tools">
                  @for (k of c.t; track k) {
                  <button
                    type="button"
                    class="dc-tool"
                    [class.dc-ico]="!c.lab"
                    [attr.title]="c.lab ? null : dcTools[k].label"
                    [attr.aria-label]="dcTools[k].label"
                  >
                    <fa-icon [icon]="dcTools[k].icon" />
                    @if (c.lab) {
                    {{ dcTools[k].label }}
                    }
                  </button>
                  } @if (c.kebab) {
                  <button type="button" class="dc-tool dc-ico" aria-label="Mehr" title="Mehr">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                  }
                </div>
                }
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
        <mat-tab label="Footer + divider">
          <h2 id="criteria-box-footer-divider">
            footer bar (dark top, light bottom) + divider column, 448px. Grip always left; reduced:
            edit + delete right; minimal: menu right (chevron swaps a card to the other level)
          </h2>
          <div class="dcg cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}</strong>
            }
          </div>
          @for (v of fbVariants; track v.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ v.name }}</code>
            <div class="dcg">
              @for (l of cdLevels; track l.level) { @let lv = cdLevel(i + 300, l.level); @let lab =
              v.lab[lv]; @let foot = lv > 0 || v.f0 === 'foot';
              <div
                class="fb"
                [class.fb-rail-head]="v.rail === 'head'"
                [class.fb-col-head]="v.col === 'head'"
                [class.fb-white]="v.white"
              >
                <button
                  type="button"
                  class="dc-tool fb-rail"
                  [class.dc-ico]="!lab"
                  aria-label="Ziehen"
                  [attr.title]="lab ? null : 'Ziehen'"
                >
                  <fa-icon icon="expand-arrows-alt" />
                  @if (lab) { Ziehen }
                </button>
                <div class="fb-head">
                  <div class="dc-top">
                    <div class="mk-title">Hypertonie mit vielen Filtern</div>
                    <button
                      type="button"
                      class="cd-tog"
                      [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                      [attr.aria-expanded]="lv === 2"
                      (click)="cdToggle(i + 300, l.level)"
                    >
                      <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                    </button>
                  </div>
                  @if (lv > 0) {
                  <div class="mk-info">Diagnose · I10 · ICD-10-GM</div>
                  } @else if (v.f0 === 'badge') {
                  <div><span class="cd-badge">{{ cdFilters.length }} Filter</span></div>
                  }
                </div>
                @if (foot) {
                <div class="fb-foot">
                  @if (lv === 2) { @if (v.f2 === 'rows') {
                  <div class="mk-filters">
                    @for (f of cdFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (x of f.values; track x) {
                      <span class="mk-pill">{{ x }}</span>
                      }
                    </div>
                    }
                  </div>
                  } @else {
                  <div class="mk-frow">
                    @for (f of cdFilters; track f.type) {
                    <span class="mk-chip">{{ f.type }}</span>
                    @for (x of f.values; track x) {
                    <span class="mk-pill">{{ x }}</span>
                    } }
                  </div>
                  } } @else if (lv === 1) { @if (v.f1 === 'values') {
                  <span class="cn-text">{{ cnValues }}</span>
                  } @else {
                  <div class="mk-frow">
                    @for (f of cdFilters; track f.type) {
                    <span class="mk-pill">{{ f.type }} · {{ f.values.length }}</span>
                    }
                  </div>
                  } } @else {
                  <span class="cd-badge">{{ cdFilters.length }} Filter</span>
                  }
                </div>
                }
                <div class="dc-tools fb-tools">
                  @if (lv === 0) {
                  <button
                    type="button"
                    class="dc-tool"
                    [class.dc-ico]="!lab"
                    aria-label="Menü"
                    [attr.title]="lab ? null : 'Menü'"
                  >
                    <fa-icon icon="ellipsis-v" />
                    @if (lab) { Menü }
                  </button>
                  } @else { @for (k of lv === 2 ? 'ecd' : 'ed'; track k) {
                  <button
                    type="button"
                    class="dc-tool"
                    [class.dc-ico]="!lab"
                    [attr.aria-label]="dcTools[k].label"
                    [attr.title]="lab ? null : dcTools[k].label"
                  >
                    <fa-icon [icon]="dcTools[k].icon" />
                    @if (lab) {
                    {{ dcTools[k].label }}
                    }
                  </button>
                  } }
                </div>
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
        <mat-tab label="Proposal">
          <h2 id="criteria-box-proposal">
            proposal: two tones (dark header, white footer), everything on the right, one accent
            colour, info (I10, ICD-10-GM) as small tags. 448px (chevron swaps a card to the other
            level)
          </h2>
          <div class="dcg cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}</strong>
            }
          </div>
          @for (v of fcVariants; track v.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ v.name }}</code>
            <div class="dcg">
              @for (l of cdLevels; track l.level) { @let lv = cdLevel(i + 400, l.level); @let lab = lv
              === 2 || (lv === 1 && v.lab); @let metaFoot = v.info === 'footer' || v.info ===
              'eyebrow';
              <div
                class="fc"
                [class.fc-row]="lv === 0"
                [style.--tw]="lv === 0 ? '96px' : lab ? '72px' : '48px'"
              >
                <div class="fc-head">
                  @if (v.info === 'eyebrow' && lv > 0) {
                  <div class="fc-eyebrow">Diagnose</div>
                  }
                  <div class="dc-top">
                    <div class="mk-title">Hypertonie mit vielen Filtern</div>
                    <button
                      type="button"
                      class="cd-tog"
                      [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                      [attr.aria-expanded]="lv === 2"
                      (click)="cdToggle(i + 400, l.level)"
                    >
                      <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                    </button>
                  </div>
                  @if (lv > 0 && v.info === 'tags') {
                  <div class="fc-meta">
                    <span class="fc-plain">Diagnose</span>
                    <span class="fc-tag">I10</span>
                    <span class="fc-tag">ICD-10-GM</span>
                  </div>
                  } @if (lv > 0 && v.info === 'text') {
                  <div class="fc-text">Diagnose · I10 · ICD-10-GM</div>
                  } @if (lv === 0) {
                  <div><span class="cd-badge">{{ cdFilters.length }} Filter</span></div>
                  }
                </div>
                @if (lv > 0) {
                <div class="fc-foot">
                  @if (metaFoot) {
                  <div class="fc-meta">
                    @if (v.info === 'footer') {
                    <span class="fc-plain">Diagnose</span>
                    }
                    <span class="fc-tag">I10</span>
                    <span class="fc-tag">ICD-10-GM</span>
                  </div>
                  } @if (lv === 2) {
                  <div class="mk-filters">
                    @for (f of cdFilters; track f.type) {
                    <div class="mk-frow">
                      <span class="mk-chip">{{ f.type }}</span>
                      @for (x of f.values; track x) {
                      <span class="mk-pill">{{ x }}</span>
                      }
                    </div>
                    }
                  </div>
                  } @else if (v.f1 === 'values') {
                  <span class="cn-text">{{ cnValues }}</span>
                  } @else {
                  <div class="mk-frow">
                    @for (f of cdFilters; track f.type) {
                    <span class="mk-pill">{{ f.type }} · {{ f.values.length }}</span>
                    }
                  </div>
                  }
                </div>
                }
                <div class="fc-tools">
                  @for (k of lv === 2 ? 'ecdg' : lv === 1 ? 'edg' : 'g'; track k) {
                  <button
                    type="button"
                    class="dc-tool"
                    [class.dc-ico]="!lab"
                    [attr.aria-label]="dcTools[k].label"
                    [attr.title]="lab ? null : dcTools[k].label"
                  >
                    <fa-icon [icon]="dcTools[k].icon" />
                    @if (lab) {
                    {{ dcTools[k].label }}
                    }
                  </button>
                  } @if (lv === 0) {
                  <button type="button" class="dc-tool dc-ico" aria-label="Menü" title="Menü">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                  }
                </div>
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
        <mat-tab label="Refined">
          <h2 id="criteria-box-refined">
            refined proposal: hierarchy title › info › filter values › actions. Quiet labels and
            icons, soft value pills, accent only on hover/focus. 448px (chevron swaps a card to the
            other level)
          </h2>
          <div class="dcg cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}</strong>
            }
          </div>
          @for (v of fmVariants; track v.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ v.name }}</code>
            <div class="dcg">
              @for (l of cdLevels; track l.level) { @let lv = cdLevel(i + 500, l.level); @let col =
              v.tools === 'col' || v.tools === 'icons'; @let lab = v.tools === 'col' && lv > 0; @let
              keys = lv === 2 ? 'ecdg' : lv === 1 ? 'edg' : 'g';
              <div
                class="fm"
                [class.fm-edge]="v.edge"
                [class.fm-mini]="lv === 0"
                [class.fm-hov]="v.tools === 'hover'"
                [class.fm-rowv]="!col"
                [style.--tw]="col ? (lv === 0 ? '88px' : lab ? '72px' : '48px') : '0px'"
                [style.--tr]="lv === 2 ? '156px' : lv === 1 ? '120px' : '92px'"
              >
                <div class="fm-head">
                  <div class="fm-top">
                    <button
                      type="button"
                      class="fm-tog"
                      [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                      [attr.aria-expanded]="lv === 2"
                      (click)="cdToggle(i + 500, l.level)"
                    >
                      <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                    </button>
                    <div class="fm-title">Hypertonie mit vielen Filtern</div>
                  </div>
                  @if (lv > 0) {
                  <div class="fm-meta">
                    Diagnose <span class="fm-sep">·</span> <span class="fm-code">I10</span>
                    <span class="fm-sep">·</span> ICD-10-GM
                  </div>
                  } @else {
                  <div class="fm-meta">
                    <span class="fm-count">{{ cdFilters.length }} Filter</span>
                  </div>
                  }
                </div>
                @if (lv === 2) {
                <div class="fm-foot">
                  @for (f of cdFilters; track f.type) {
                  <div class="fm-row">
                    <span class="fm-lab">{{ f.type }}</span>
                    <span class="fm-vals">
                      @for (x of f.values; track x) {
                      <span class="fm-val">{{ x }}</span>
                      }
                    </span>
                  </div>
                  }
                </div>
                } @else if (lv === 1) {
                <div class="fm-foot fm-sumrow">
                  <span class="fm-count">{{ cdFilters.length }} Filter</span>
                  <span class="cn-text">{{ cnNames }}</span>
                </div>
                }
                <div [class]="col ? 'fm-tools' : 'fm-rowtools'">
                  @for (k of keys; track k) {
                  <button
                    type="button"
                    class="fm-tool"
                    [class.fm-del]="k === 'd'"
                    [attr.aria-label]="dcTools[k].label"
                    [attr.title]="lab ? null : dcTools[k].label"
                  >
                    <fa-icon [icon]="dcTools[k].icon" />
                    @if (lab) {
                    {{ dcTools[k].label }}
                    }
                  </button>
                  } @if (lv === 0) {
                  <button type="button" class="fm-tool" aria-label="Menü" title="Menü">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                  }
                </div>
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
        <mat-tab label="Impeccable">
          <h2 id="criteria-box-impeccable">
            impeccable proposal: one reading order (title › context › filters › actions), the code
            in its own hue, actions on a solid rail. 448px (chevron swaps a card to the other level)
          </h2>
          <div class="dcg cd-headrow">
            @for (l of cdLevels; track l.level) {
            <strong>{{ l.label }}</strong>
            }
          </div>
          @for (r of imRows; track r.name; let i = $index) {
          <div class="cd-row">
            <code>{{ i + 1 }} · {{ r.name }}</code>
            <div class="dcg">
              @for (l of cdLevels; track l.level) { @let lv = cdLevel(i + 600, l.level); @let lab =
              r.lab && lv > 0; @let keys = lv === 2 ? 'ecdg' : lv === 1 ? 'edg' : 'g';
              <div
                class="im"
                [class.im-mini]="lv === 0"
                [style.--tw]="lv === 0 ? '88px' : lab ? '76px' : '48px'"
              >
                <div class="im-head">
                  <div class="im-top">
                    <button
                      type="button"
                      class="im-tog"
                      [attr.aria-label]="lv === 2 ? 'Details einklappen' : 'Details ausklappen'"
                      [attr.aria-expanded]="lv === 2"
                      (click)="cdToggle(i + 600, l.level)"
                    >
                      <fa-icon [icon]="lv === 2 ? 'chevron-up' : 'chevron-down'" />
                    </button>
                    <div class="im-title">{{ r.item.title }}</div>
                    @if (lv === 0) {
                    <span class="im-count">{{ r.item.filters.length }} Filter</span>
                    }
                  </div>
                  @if (lv > 0) {
                  <div class="im-meta">
                    <span>{{ r.item.type }}</span>
                    <span class="im-sep">·</span>
                    <span class="im-code">{{ r.item.code }}</span>
                    <span class="im-sep">·</span>
                    <span>{{ r.item.system }}</span>
                  </div>
                  }
                </div>
                @if (lv === 2) {
                <div class="im-foot">
                  @for (f of r.item.filters; track f.type) {
                  <div class="im-row">
                    <span class="im-lab">{{ f.type }}</span>
                    <span class="im-vals">
                      @for (x of f.values; track x) {
                      <span class="im-val">{{ x }}</span>
                      }
                    </span>
                  </div>
                  }
                </div>
                } @else if (lv === 1) {
                <div class="im-foot im-sum">
                  <span class="im-count">{{ r.item.filters.length }} Filter</span>
                  <span class="im-names">{{ imNames(r.item) }}</span>
                </div>
                }
                <div class="im-tools">
                  @for (k of keys; track k) {
                  <button
                    type="button"
                    class="im-tool"
                    [class.im-del]="k === 'd'"
                    [attr.aria-label]="dcTools[k].label"
                    [attr.title]="lab ? null : dcTools[k].label"
                  >
                    <fa-icon [icon]="dcTools[k].icon" />
                    @if (lab) {
                    <span>{{ dcTools[k].label }}</span>
                    }
                  </button>
                  } @if (lv === 0) {
                  <button type="button" class="im-tool" aria-label="Menü" title="Menü">
                    <fa-icon icon="ellipsis-v" />
                  </button>
                  }
                </div>
              </div>
              }
            </div>
          </div>
          }
        </mat-tab>
      </mat-tab-group>
      }
      @if (shows('num-data-selection-boxes')) {
      <section class="pinned">
        <div class="pinned-head">
          <button
            type="button"
            class="pinned-toggle"
            aria-label="Current component"
            [attr.aria-expanded]="pinnedOpen()"
            (click)="pinnedOpen.set(!pinnedOpen())"
          >
            <fa-icon [icon]="pinnedOpen() ? 'chevron-up' : 'chevron-down'" />
          </button>
          <h2 id="num-data-selection-boxes">num-data-selection-boxes</h2>
        </div>
        @if (pinnedOpen()) {
        <div class="pinned-body">
          <div class="row">
            <num-data-selection-boxes [profile]="profile" [isEditable]="true" />
          </div>
        </div>
        }
      </section>
      <mat-tab-group
        [selectedIndex]="tabIndex(['data-selection-box-proposals'])"
        animationDuration="0ms"
      >
        <mat-tab label="Design proposals">
          <h2 id="data-selection-box-proposals">
            data selection box: 20 design proposals (static mocks: filter, fields, references,
            handling)
          </h2>
          <div class="mocks">
            <div class="mock">
              <code>1 header with actions, Felder + Filter as stacked labelled sections</code>
              <div class="ds">
                <div class="ds-head">
                  <div>
                    <div class="ds-t">
                      Diagnose
                      <span class="ds-n">#1</span>
                    </div>
                    <div class="ds-i">Condition</div>
                  </div>
                  <div class="ds-act">
                    <button type="button" class="ds-b">
                      <fa-icon icon="pencil-alt" />
                      Bearbeiten
                    </button>
                    <button type="button" class="ds-ic" aria-label="Mehr">
                      <fa-icon icon="ellipsis-v" />
                    </button>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-lbl">Felder ({{ dsFields.length }})</div>
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-lbl">Filter ({{ mockFilters.length }})</div>
                  @for (f of mockFilters; track f.type) {
                  <div class="ds-row">
                    <span class="ds-chip">{{ f.type }}</span>
                    @for (v of f.values; track v) {
                    <span class="ds-pill">{{ v }}</span>
                    }
                  </div>
                  }
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                2 collapsed one-liner with counts; click row to expand (dense lists of 10+ profiles)
              </code>
              <div class="ds ds-flat">
                <button type="button" class="ds-line">
                  <fa-icon icon="chevron-right" />
                  <span class="ds-t">Diagnose</span>
                  <span class="ds-cnt">{{ dsFields.length }} Felder</span>
                  <span class="ds-cnt">{{ mockFilters.length }} Filter</span>
                  <span class="ds-cnt ds-warn">1 Referenz</span>
                </button>
              </div>
            </div>

            <div class="mock">
              <code>
                3 accordion open: summary line stays visible, details below, edit jumps to section
              </code>
              <div class="ds">
                <button type="button" class="ds-line">
                  <fa-icon icon="chevron-down" />
                  <span class="ds-t">Diagnose</span>
                  <span class="ds-cnt">{{ dsFields.length }} Felder</span>
                  <span class="ds-cnt">{{ mockFilters.length }} Filter</span>
                </button>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                  <button type="button" class="ds-link">
                    Felder ändern
                    <fa-icon icon="angle-right" />
                  </button>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of mockFilters; track f.type) {
                    <span class="ds-chip">{{ f.type }}</span>
                    }
                  </div>
                  <button type="button" class="ds-link">
                    Filter ändern
                    <fa-icon icon="angle-right" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                4 field checklist inside the card with field search (toggle fields without leaving
                the list)
              </code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                  <label class="ds-search">
                    <fa-icon icon="search" />
                    <input type="text" placeholder="Feld suchen" aria-label="Feld suchen" />
                  </label>
                </div>
                <div class="ds-grid">
                  @for (f of dsAllFields; track f.n) {
                  <label class="ds-chk">
                    <input type="checkbox" [checked]="f.on" />
                    {{ f.n }}
                  </label>
                  }
                </div>
              </div>
            </div>

            <div class="mock">
              <code>5 removable filter chips + inline "Filter hinzufügen"</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of mockFilters; track f.type) {
                    <span class="ds-rm">
                      <b>{{ f.type }}</b>
                      {{ f.values.join(', ') }}
                      <button type="button" [attr.aria-label]="f.type + ' entfernen'">
                        <fa-icon icon="times" />
                      </button>
                    </span>
                    }
                    <button type="button" class="ds-add">
                      <fa-icon icon="plus" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>6 references as a linked strip: who points here, jump to it</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                  <div class="ds-i">Condition</div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                </div>
                <div class="ds-ref">
                  <fa-icon icon="link" />
                  Referenziert von
                  <a href="#" (click)="$event.preventDefault()">Prozedur #2</a>
                  <a href="#" (click)="$event.preventDefault()">Medikation #3</a>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>7 left rail: position number + up/down stacked (reorder always visible)</code>
              <div class="ds ds-railed">
                <div class="ds-rail">
                  <button type="button" class="ds-ic" aria-label="Nach oben">
                    <fa-icon icon="arrow-up" />
                  </button>
                  <b>1</b>
                  <button type="button" class="ds-ic" aria-label="Nach unten">
                    <fa-icon icon="arrow-down" />
                  </button>
                </div>
                <div>
                  <div class="ds-head">
                    <div class="ds-t">Diagnose</div>
                    <button type="button" class="ds-ic" aria-label="Mehr">
                      <fa-icon icon="ellipsis-v" />
                    </button>
                  </div>
                  <div class="ds-sec">
                    <div class="ds-row">
                      @for (f of dsFields; track f) {
                      <span class="ds-pill">{{ f }}</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                8 tabs inside the card: Felder | Filter | Referenzen (one thing at a time)
              </code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <div class="ds-tabs" role="tablist">
                  <button type="button" role="tab" aria-selected="true" class="on">
                    Felder
                    <span class="ds-cnt">{{ dsFields.length }}</span>
                  </button>
                  <button type="button" role="tab" aria-selected="false">
                    Filter
                    <span class="ds-cnt">{{ mockFilters.length }}</span>
                  </button>
                  <button type="button" role="tab" aria-selected="false">
                    Referenzen
                    <span class="ds-cnt">2</span>
                  </button>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>9 completeness meter: 6 of 14 fields selected</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                  <span class="ds-i">
                    {{ dsFields.length }} von {{ dsAllFields.length }} Feldern
                  </span>
                </div>
                <div
                  class="ds-meter"
                  role="progressbar"
                  [attr.aria-valuenow]="dsFields.length"
                  aria-valuemin="0"
                  [attr.aria-valuemax]="dsAllFields.length"
                >
                  <i [style.width.%]="(dsFields.length / dsAllFields.length) * 100"></i>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>10 tinted header band with full toolbar, white body</code>
              <div class="ds ds-bandw">
                <div class="ds-band">
                  <div>
                    <div class="ds-t">
                      Diagnose
                      <span class="ds-n">#1</span>
                    </div>
                    <div class="ds-i">Condition</div>
                  </div>
                  <div class="ds-act">
                    <button type="button" class="ds-ic" aria-label="Bearbeiten">
                      <fa-icon icon="pencil-alt" />
                    </button>
                    <button type="button" class="ds-ic" aria-label="Duplizieren">
                      <fa-icon icon="clone" />
                    </button>
                    <button type="button" class="ds-ic" aria-label="Löschen">
                      <fa-icon icon="trash" />
                    </button>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of mockFilters; track f.type) {
                    <span class="ds-chip">{{ f.type }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>11 fields grouped: Pflicht (fixed) vs Optional (removable)</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-lbl">Pflichtfelder</div>
                  <div class="ds-row">
                    @for (f of dsFields.slice(0, 2); track f) {
                    <span class="ds-pill ds-fix">
                      <fa-icon icon="check-circle" />
                      {{ f }}
                    </span>
                    }
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-lbl">Optional</div>
                  <div class="ds-row">
                    @for (f of dsFields.slice(2); track f) {
                    <span class="ds-rm">
                      {{ f }}
                      <button type="button" [attr.aria-label]="f + ' entfernen'">
                        <fa-icon icon="times" />
                      </button>
                    </span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>12 key/value table: filter name left, value right (scan, compare)</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <dl class="ds-kv">
                  @for (f of mockFilters; track f.type) {
                  <dt>{{ f.type }}</dt>
                  <dd>{{ f.values.join(', ') }}</dd>
                  }
                </dl>
              </div>
            </div>

            <div class="mock">
              <code>13 reference as a switch in the header + linked profile chips below</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                  <label class="ds-sw">
                    <input type="checkbox" role="switch" checked />
                    Referenz
                  </label>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    <span class="ds-lbl">Verknüpft mit</span>
                    <span class="ds-chip">Prozedur #2</span>
                    <span class="ds-chip">Medikation #3</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                14 empty / invalid state: no fields selected, red banner with one primary action
              </code>
              <div class="ds ds-err">
                <div class="ds-head">
                  <div class="ds-t">
                    Prozedur
                    <span class="ds-n">#2</span>
                  </div>
                </div>
                <div class="ds-alert">
                  <fa-icon icon="exclamation-triangle" />
                  Keine Felder ausgewählt. Ohne Felder werden keine Daten geliefert.
                  <button type="button" class="ds-b">Felder wählen</button>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>15 filter summary sentence instead of chips (readable at a glance)</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <p class="ds-sent">
                  Nur
                  <b>Schweregrad</b>
                  Leicht, Mittel, Schwer,
                  <b>Blutdruck</b>
                  90 – 140 mmHg,
                  <b>Zeitraum</b>
                  01.01.2020 – 31.12.2024.
                </p>
                <button type="button" class="ds-link">
                  Filter bearbeiten
                  <fa-icon icon="angle-right" />
                </button>
              </div>
            </div>

            <div class="mock">
              <code>16 split button: Bearbeiten + caret menu; sticky footer CTA</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                  <div class="ds-act">
                    <button type="button" class="ds-b ds-l">Bearbeiten</button>
                    <button type="button" class="ds-b ds-r" aria-label="Weitere Aktionen">
                      <fa-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                  </div>
                </div>
                <button type="button" class="ds-cta">
                  <fa-icon icon="plus" />
                  Filter hinzufügen
                </button>
              </div>
            </div>

            <div class="mock">
              <code>17 chip overflow: first 3 + "+N" expands inline</code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields.slice(0, 3); track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }
                    <button
                      type="button"
                      class="ds-more"
                      [attr.aria-label]="dsFields.length - 3 + ' weitere Felder anzeigen'"
                    >
                      +{{ dsFields.length - 3 }}
                    </button>
                  </div>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of mockFilters.slice(0, 2); track f.type) {
                    <span class="ds-chip">{{ f.type }}</span>
                    }
                    <button
                      type="button"
                      class="ds-more"
                      [attr.aria-label]="mockFilters.length - 2 + ' weitere Filter anzeigen'"
                    >
                      +{{ mockFilters.length - 2 }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>18 drag handle + "2 / 5" position and move buttons on hover</code>
              <div class="ds ds-railed">
                <div class="ds-rail">
                  <span class="ds-grip" aria-label="Verschieben"><fa-icon icon="bars" /></span>
                  <b>2 / 5</b>
                </div>
                <div>
                  <div class="ds-head">
                    <div class="ds-t">Prozedur</div>
                    <div class="ds-act">
                      <button type="button" class="ds-ic" aria-label="Nach oben">
                        <fa-icon icon="arrow-up" />
                      </button>
                      <button type="button" class="ds-ic" aria-label="Nach unten">
                        <fa-icon icon="arrow-down" />
                      </button>
                    </div>
                  </div>
                  <div class="ds-sec">
                    <div class="ds-row">
                      @for (f of dsFields.slice(0, 4); track f) {
                      <span class="ds-pill">{{ f }}</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mock">
              <code>
                19 tree: parent profile with indented referenced children and connector line
              </code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                  <span class="ds-cnt">2 Referenzen</span>
                </div>
                <ul class="ds-tree">
                  <li>
                    <fa-icon icon="sitemap" />
                    Prozedur
                    <span class="ds-n">#2</span>
                    <span class="ds-i">über Feld „Encounter“</span>
                  </li>
                  <li>
                    <fa-icon icon="sitemap" />
                    Medikation
                    <span class="ds-n">#3</span>
                    <span class="ds-i">über Feld „Subject“</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="mock">
              <code>
                20 toolbar on top: field search + filter dropdown + view toggle, chips below
              </code>
              <div class="ds">
                <div class="ds-head">
                  <div class="ds-t">
                    Diagnose
                    <span class="ds-n">#1</span>
                  </div>
                </div>
                <div class="ds-tools">
                  <label class="ds-search">
                    <fa-icon icon="search" />
                    <input
                      type="text"
                      placeholder="Felder und Filter durchsuchen"
                      aria-label="Durchsuchen"
                    />
                  </label>
                  <button type="button" class="ds-b">
                    <fa-icon icon="filter" />
                    Alle
                    <fa-icon icon="chevron-down" />
                  </button>
                </div>
                <div class="ds-sec">
                  <div class="ds-row">
                    @for (f of dsFields; track f) {
                    <span class="ds-pill">{{ f }}</span>
                    }@for (f of mockFilters; track f.type) {
                    <span class="ds-chip">{{ f.type }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
      }
      @if (shows('num-action-bar')) {
      <section class="pinned">
        <div class="pinned-head">
          <button
            type="button"
            class="pinned-toggle"
            aria-label="Current component"
            [attr.aria-expanded]="pinnedOpen()"
            (click)="pinnedOpen.set(!pinnedOpen())"
          >
            <fa-icon [icon]="pinnedOpen() ? 'chevron-up' : 'chevron-down'" />
          </button>
          <h2 id="num-action-bar">num-action-bar</h2>
        </div>
        @if (pinnedOpen()) {
        <div class="pinned-body">
          <div class="row"><num-action-bar /></div>
        </div>
        }
      </section>
      <mat-tab-group
        [selectedIndex]="tabIndex(['action-bar-split', 'action-bar-glass', 'action-bar-best', 'action-bar-aero', 'action-bar-segment', 'action-bar-redesign', 'action-bar-redesign-more', 'action-bar-white-disabled', 'action-bar-white-disabled-best', 'action-bar-variants'])"
        animationDuration="0ms"
      >
        <mat-tab label="Split, 8">
          <h2 id="action-bar-split">split style closer to the current bar, with a soft glass touch: 8 designs</h2>
          @for (v of splitVariants; track v.label) {
          <div [style]="v.vars">
            <code>{{ v.label }}</code>
            @for (off of [false, true]; track off) {
            <div class="sp-bar">
              <div class="sp-plate">
                @for (a of rdActions; track a.icon) {
                <button type="button" [disabled]="off && !$first">
                  <fa-icon [icon]="a.icon" /><span>{{ a.label }}</span>
                </button>
                }
              </div>
              <span class="sp-sel">Selected <b>3</b></span>
            </div>
            }
          </div>
          }
        </mat-tab>
        <mat-tab label="Glass, 20">
          <h2 id="action-bar-glass">glass edge on the current action bar look: 20 designs (no backdrop)</h2>
          @for (v of glassVariants; track v.label) {
          <div [style]="v.vars">
            <code>{{ v.label }}</code>
            @for (off of [false, true]; track off) {
            <div class="gl-bar">
              <div class="gl-grp">
                @for (a of rdActions; track a.icon) {
                <button type="button" [disabled]="off && !$first">
                  <fa-icon [icon]="a.icon" /><span>{{ a.label }}</span>
                </button>
                }
              </div>
              <span class="gl-sel">Selected <b>3</b></span>
            </div>
            }
          </div>
          }
        </mat-tab>
        <mat-tab label="Best">
          <h2 id="action-bar-best">best: joined segment, icon + label, white disabled, keyboard and screen-reader friendly</h2>
          @for (off of [false, true]; track off) {
          <div class="best-bar">
            <div class="best-seg" role="group" aria-label="Query actions">
              <button type="button" class="best-primary">
                <fa-icon [icon]="'upload'" /><span>Upload</span>
              </button>
              <button
                type="button"
                [attr.aria-disabled]="off ? 'true' : null"
                [attr.aria-describedby]="off ? 'best-why' : null"
              >
                <fa-icon [icon]="'download'" /><span>Download</span>
              </button>
              <button
                type="button"
                [attr.aria-disabled]="off ? 'true' : null"
                [attr.aria-describedby]="off ? 'best-why' : null"
              >
                <fa-icon [icon]="'save'" /><span>Save</span>
              </button>
            </div>
            <p class="best-sel" role="status">Selected <b>3</b></p>
          </div>
          @if (off) {
          <p id="best-why" class="best-why">
            Download and save need at least one valid criterion.
          </p>
          } }
        </mat-tab>
        <mat-tab label="Aero glass">
          <h2 id="action-bar-aero">Windows Vista / Aero glass style: 6 designs (top all enabled, bottom download + save disabled)</h2>
          @for (d of aeros; track d) {
          <div class="aero-stage">
            <code>{{ d }}</code>
            @for (off of [false, true]; track off) {
            <div [class]="'rd rd-' + d">
              @for (a of rdActions; track a.icon) {
              <button type="button" [disabled]="off && !$first">
                <fa-icon [icon]="a.icon" /><span>{{ a.label }}</span>
              </button>
              }
              <span class="rd-sel">Selected <b>3</b></span>
            </div>
            }
          </div>
          }
        </mat-tab>
        <mat-tab label="Segment, 5">
          <h2 id="action-bar-segment">segment style: 5 designs (top all enabled, bottom download + save disabled)</h2>
          @for (d of segments; track d) {
          <div class="rd-wrap">
            <code>{{ d }}</code>
            @for (off of [false, true]; track off) {
            <div [class]="'rd rd-' + d">
              @for (a of rdActions; track a.icon) {
              <button type="button" [disabled]="off && !$first">
                <fa-icon [icon]="a.icon" /><span>{{ a.label }}</span>
              </button>
              }
              <span class="rd-sel">Selected <b>3</b></span>
            </div>
            }
          </div>
          }
        </mat-tab>
        <mat-tab label="Redesign">
          <h2 id="action-bar-redesign">action bar redesign: six concepts (top all enabled, bottom download + save disabled)</h2>
          @for (d of redesigns; track d) {
          <div class="rd-wrap">
            <code>{{ d }}</code>
            @for (off of [false, true]; track off) {
            <div [class]="'rd rd-' + d">
              @for (a of rdActions; track a.icon) {
              <button type="button" [disabled]="off && !$first">
                <fa-icon [icon]="a.icon" /><span>{{ a.label }}</span>
              </button>
              }
              <span class="rd-sel">Selected <b>3</b></span>
            </div>
            }
          </div>
          }
        </mat-tab>
        <mat-tab label="Redesign, 20 more">
          <h2 id="action-bar-redesign-more">action bar redesign: 20 more concepts (top all enabled, bottom download + save disabled)</h2>
          @for (d of redesigns2; track d) {
          <div class="rd-wrap">
            <code>{{ d }}</code>
            @for (off of [false, true]; track off) {
            <div [class]="'rd rd-' + d">
              @for (a of rdActions; track a.icon) {
              <button type="button" [disabled]="off && !$first">
                <fa-icon [icon]="a.icon" /><span>{{ a.label }}</span>
              </button>
              }
              <span class="rd-sel">Selected <b>3</b></span>
            </div>
            }
          </div>
          }
        </mat-tab>
        <mat-tab label="White disabled">
          <h2 id="action-bar-white-disabled">num-action-bar with white disabled buttons</h2>
          <div class="white-disabled"><num-action-bar /></div>
          <div class="variants">
            @for (v of whiteDisabled; track v.label) {
            <div
              class="wd"
              [style.--bg]="v.bg"
              [style.--fg]="v.fg"
              [style.--sh]="v.sh"
              [style.--wd-op]="v.op"
            >
              <code>{{ v.label }}</code>
              <num-action-bar />
            </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="White disabled, best 20">
          <h2 id="action-bar-white-disabled-best">white disabled: 20 most usable (readable icon, clearly not clickable)</h2>
          <div class="variants">
            @for (v of whiteDisabledBest; track v.label) {
            <div
              class="wd"
              [style.--bg]="v.bg"
              [style.--fg]="v.fg"
              [style.--sh]="v.sh"
              [style.--wd-op]="v.op"
              [style.--ol]="v.ol"
            >
              <code>{{ v.label }}</code>
              <num-action-bar />
            </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="Variants">
          <h2 id="action-bar-variants">num-action-bar variants (tint / opacity / badge color)</h2>
          <div class="variants">
            @for (v of barVariants; track v.label) {
            <div
              class="variant"
              [style.--tint]="v.tint"
              [style.--op]="v.opacity"
              [style.--fg]="v.fg"
            >
              <code>{{ v.label }} · {{ v.ratio }}:1 {{ v.verdict }}</code>
              <num-action-bar>
                <span class="selection-text">Selected</span>
                <span class="count-badge">3</span>
              </num-action-bar>
            </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
      }
      @if (shows('num-availability-status-bar')) {
        @if (!variant()) {
      <h2 id="num-availability-status-bar">num-availability-status-bar</h2>
      <div class="row">
        @for (a of availability; track a) {
        <num-availability-status-bar [status]="a" />
        }
      </div>

      }
      }
      @if (shows('num-info-tile')) {
        @if (!variant()) {
      <h2 id="num-info-tile">num-info-tile</h2>
      <div class="row">
        <num-info-tile value="1.234" label="Patients" />
        <num-info-tile value="0" label="Errors" color="red" />
      </div>

      }
      }
      @if (shows('num-info-tooltip-card')) {
        @if (!variant()) {
      <h2 id="num-info-tooltip-card">num-info-tooltip-card</h2>
      <div class="row">
        <num-info-tooltip-card title="Title" text="Some <b>explanatory</b> text." />
      </div>

      }
      }
      @if (shows('num-filter-chips')) {
      <section class="pinned">
        <div class="pinned-head">
          <button
            type="button"
            class="pinned-toggle"
            aria-label="Current component"
            [attr.aria-expanded]="pinnedOpen()"
            (click)="pinnedOpen.set(!pinnedOpen())"
          >
            <fa-icon [icon]="pinnedOpen() ? 'chevron-up' : 'chevron-down'" />
          </button>
          <h2 id="num-filter-chips">num-filter-chips</h2>
        </div>
        @if (pinnedOpen()) {
        <div class="pinned-body">
          <div class="row"><num-filter-chips [filterChips]="chips" [showAll]="true" /></div>
        </div>
        }
      </section>
      <mat-tab-group [selectedIndex]="tabIndex(['filter-chip-borders'])" animationDuration="0ms">
        <mat-tab label="Border variants">
          <h2 id="filter-chip-borders">
            filter chip border variants (box bg #eef2f7 / hover #e1e7f1; ratios: border vs bg, text
            vs chip)
          </h2>
          <div class="chipvs">
            @for (v of chipVariants; track v.name) {
            <div
              class="chipv"
              [style.--b]="v.border"
              [style.--f]="v.fill"
              [style.--c]="v.text"
              [style.--bw]="v.bw"
            >
              <code>
                {{ v.name }} · border {{ v.onBox }} · hover {{ v.onHover }} · text {{ v.textRatio }}
              </code>
              <div class="box"><num-filter-chips [filterChips]="chips" [showAll]="true" /></div>
              <div class="box hov"><num-filter-chips [filterChips]="chips" [showAll]="true" /></div>
            </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
      }
      @if (shows('num-header')) {
        @if (!variant()) {
      <h2 id="num-header">num-header / num-section-name / num-information-section</h2>
      <div class="row"><num-header [showToggle]="true">Header title</num-header></div>
      <div class="row"><num-section-name>Section name</num-section-name></div>
      <div class="row">
        <num-information-section>
          <span slot="title">Information title</span>
          Information content
        </num-information-section>
      </div>

      }
      }
      @if (shows('num-linked-badge')) {
        @if (!variant()) {
      <h2 id="num-linked-badge">num-linked-badge / num-placeholder-box / num-missing-filter</h2>
      <div class="row">
        <num-linked-badge />
        <num-placeholder-box>Placeholder content</num-placeholder-box>
        <num-missing-filter><span message>Required filter missing</span></num-missing-filter>
      </div>

      }
      }
      @if (shows('num-logic-switch')) {
        @if (!variant()) {
      <h2 id="num-logic-switch">num-logic-switch / num-search-mode-toggle</h2>
      <div class="row">
        <num-logic-switch />
        <num-search-mode-toggle />
      </div>

      }
      }
      @if (shows('num-searchbar')) {
        @if (!variant()) {
      <h2 id="num-searchbar">num-searchbar</h2>
      <div class="row"><num-searchbar /></div>

      }
      }
      @if (shows('num-search-filter')) {
        @if (!variant()) {
      <h2 id="num-search-filter">num-search-filter</h2>
      <div class="row"><num-search-filter [(filter)]="searchFilter" /></div>

      }
      }
      @if (shows('num-selected-items-list')) {
        @if (!variant()) {
      <h2 id="num-selected-items-list">num-selected-items-list</h2>
      <div class="row"><num-selected-items-list [items]="selectedItems" /></div>

      }
      }
      @if (shows('num-date-picker')) {
        @if (!variant()) {
      <h2 id="num-date-picker">num-date-picker / num-value-select / num-spinner</h2>
      <div class="row">
        <num-date-picker />
        <num-value-select label="Value" [value]="5" />
        <num-spinner [countdown]="10" />
      </div>
      } }
      @if (shows('num-table')) {
        @if (!variant()) {
      <h2 id="num-table">num-table</h2>
      <num-table [tableData]="tableData" />

      }
      }
    </div>
    <aside class="css-pane">
      <div class="css-head">
        <button
          type="button"
          class="css-toggle"
          [attr.aria-label]="cssOpen() ? 'Collapse CSS' : 'Expand CSS'"
          [attr.aria-expanded]="cssOpen()"
          (click)="cssOpen.set(!cssOpen())"
        >
          <span>{{ cssOpen() ? '»' : '«' }}</span>
          CSS
        </button>
        <span>CSS of {{ only() ?? 'all components' }} (live)</span>
        <button type="button" class="css-reload" (click)="loadCss()">Reload</button>
      </div>
      <div class="css-edit" [hidden]="!cssOpen()">
        <pre #hl aria-hidden="true" [innerHTML]="html()"></pre>
        <textarea
          spellcheck="false"
          aria-label="Live CSS"
          [value]="loaded()"
          (input)="applyCss($any($event.target).value)"
          (scroll)="hl.scrollTop = $any($event.target).scrollTop; hl.scrollLeft = $any($event.target).scrollLeft"
        ></textarea>
      </div>
    </aside>
  `,
  styles: `
    :host { display: grid; grid-template-columns: minmax(0, 1fr) 36rem; column-gap: 24px; padding: 24px; }
    .usages { margin: 16px 0 32px; font-size: 13px; }
    .usage-groups { display: grid; gap: 12px; max-height: 60vh; overflow: auto; padding: 4px; }
    .usage-group { border: 1px solid #d5d9e0; border-radius: 8px; padding: 12px 16px; background: #fff; }
    .usage-head { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; }
    .usage-count { color: #5a6270; font-size: 12px; }
    .usage-file { margin: 2px 0 8px; font: 11px/1.4 monospace; color: #5a6270; word-break: break-all; }
    .usage-uses { margin: 0 0 10px; padding: 0; list-style: none; display: grid; gap: 4px; }
    .usage-uses li { display: flex; gap: 12px; }
    .usage-uses code { flex: none; min-width: 5rem; color: #1d4e89; }
    .usage-pages { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .usage-key { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5a6270; margin-right: 4px; }
    .chip { padding: 2px 10px; border-radius: 999px; background: #e6edf7; color: #1d4e89; font: 12px monospace; }
    .chip-dialog { background: #f1ecf8; color: #5b3c8c; }
    .chip-more { background: #eceef1; color: #5a6270; }
    .usage-none { color: #8a909a; }
    :host.css-collapsed { grid-template-columns: minmax(0, 1fr) 4rem; }
    :host > :not(.css-pane) { grid-column: 1; }
    .css-pane { grid-column: 2; grid-row: 3; position: sticky; top: 24px; align-self: start; height: calc(100vh - 48px); display: flex; flex-direction: column; background: #1e1e1e; color: #d4d4d4; border-radius: 8px; overflow: hidden; }
    :host.css-collapsed .css-pane { height: auto; }
    :host.css-collapsed .css-head > span, :host.css-collapsed .css-reload { display: none; }
    .css-toggle { flex: none; width: 3.5rem; height: 4.5rem; margin: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 0; border-radius: 8px; background: #0e639c; color: #fff; font: 700 12px/1 sans-serif; cursor: pointer; }
    .css-toggle span { font-size: 24px; }
    .css-toggle:hover { background: #1177bb; }
    .css-head { display: flex; align-items: center; gap: 12px; padding-right: 12px; background: #252526; font: 12px/1 sans-serif; }
    .css-head > span { flex: 1; }
    .css-reload { background: #0e639c; color: #fff; border: 0; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
    .css-edit { position: relative; flex: 1; min-height: 0; }
    .css-edit pre, .css-edit textarea { position: absolute; inset: 0; margin: 0; padding: 12px; border: 0; outline: 0; font: 12px/1.5 Consolas, 'Courier New', monospace; tab-size: 2; white-space: pre; overflow: auto; }
    .css-edit pre { overflow: hidden; pointer-events: none; }
    .css-edit textarea { resize: none; background: transparent; color: transparent; caret-color: #fff; }
    .css-edit ::ng-deep .t-sel { color: #d7ba7d; }
    .css-edit ::ng-deep .t-attr { color: #808080; }
    .css-edit ::ng-deep .t-pseudo { color: #c586c0; }
    .css-edit ::ng-deep .t-prop { color: #9cdcfe; }
    .css-edit ::ng-deep .t-col { color: #ce9178; }
    .css-edit ::ng-deep .t-num { color: #b5cea8; }
    .css-edit ::ng-deep .t-var { color: #4ec9b0; }
    .css-edit ::ng-deep .t-str { color: #ce9178; }
    num-action-bar { display: block; flex: 1 1 auto; min-width: 0; width: 100%; }
    .white-disabled ::ng-deep .num-button.green.icon.disabled { background-color: #fff; position: relative; }
    .wd code { display: block; margin-bottom: 4px; font-size: 12px; }
    .wd ::ng-deep .num-button.green.icon.disabled {
      position: relative;
      background-color: var(--bg);
      color: var(--fg);
      box-shadow: var(--sh);
      opacity: var(--wd-op);
      outline: var(--ol, none);
      outline-offset: -1px;
    }
    .rd-wrap { margin-bottom: 28px; }
    .rd-wrap code { display: block; margin-bottom: 6px; font-size: 12px; }
    .rd { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; padding: 8px 12px; font: 600 13px 'Open Sans', sans-serif; }
    .rd button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; transition: transform .15s, background-color .15s, box-shadow .15s; }
    .rd button:disabled { cursor: not-allowed; }
    .rd button span { display: none; }
    .rd-sel { margin-left: auto; font-size: 12px; opacity: .8; }
    .rd-sel b { display: inline-block; min-width: 20px; padding: 1px 4px; border: 2px solid currentColor; border-radius: 5px; text-align: center; }
    .rd-pill { width: fit-content; min-width: 420px; background: #fff; border-radius: 999px; box-shadow: 0 6px 18px rgba(0,0,0,.12); color: #566a0e; }
    .rd-pill button { width: 44px; height: 44px; border-radius: 50%; color: #566a0e; }
    .rd-pill button:first-of-type { background: #9bb823; color: #fff; }
    .rd-pill button:not(:disabled):not(:first-of-type):hover { background: #eef3d6; }
    .rd-pill button:first-of-type:hover { background: #87a01c; }
    .rd-pill button:disabled { color: #c4c4c4; }
    .rd-segment { width: fit-content; min-width: 420px; padding: 0; border: 1px solid #9bb823; border-radius: 10px; overflow: hidden; color: #566a0e; background: #fff; }
    .rd-segment button { width: 56px; height: 46px; border-right: 1px solid #c5d37a; }
    .rd-segment button:first-of-type { background: #9bb823; color: #fff; }
    .rd-segment button:not(:disabled):not(:first-of-type):hover { background: #eef3d6; }
    .rd-segment button:disabled { background: repeating-linear-gradient(45deg, #fff 0 5px, #f3f3f3 5px 10px); color: #c4c4c4; }
    .rd-segment .rd-sel { padding-right: 14px; }
    .rd-glass { width: fit-content; min-width: 420px; padding: 8px 14px; background: linear-gradient(135deg, #2f3a1c, #1d2412); border-radius: 14px; box-shadow: 0 8px 20px rgba(0,0,0,.25); color: #dfe9a8; }
    .rd-glass button { width: 44px; height: 44px; border-radius: 10px; }
    .rd-glass button:first-of-type { background: #9bb823; color: #1d2412; }
    .rd-glass button:not(:disabled):not(:first-of-type):hover { background: rgba(255,255,255,.12); }
    .rd-glass button:disabled { color: rgba(255,255,255,.25); }
    .rd-labeled { background: #fff; border-bottom: 3px solid #9bb823; border-radius: 4px 4px 0 0; color: #566a0e; box-shadow: 0 2px 6px rgba(0,0,0,.06); }
    .rd-labeled button { height: 40px; padding: 0 14px; border-radius: 6px; }
    .rd-labeled button span { display: inline; }
    .rd-labeled button:first-of-type { background: #9bb823; color: #fff; }
    .rd-labeled button:not(:disabled):not(:first-of-type):hover { background: #eef3d6; }
    .rd-labeled button:disabled { color: #b5b5b5; }
    .rd-stripe { background: #f4f7e6; border-left: 5px solid #9bb823; border-radius: 4px 10px 10px 4px; color: #566a0e; }
    .rd-stripe button { width: 42px; height: 42px; border-radius: 8px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.18); }
    .rd-stripe button:first-of-type { background: #566a0e; color: #fff; }
    .rd-stripe button:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,.2); }
    .rd-stripe button:disabled { box-shadow: none; outline: 1px dashed #b9c98a; outline-offset: -1px; color: #b5b5b5; background: transparent; }
    .rd-dock { width: fit-content; min-width: 420px; padding: 10px 16px; background: linear-gradient(135deg, #9bb823, #566a0e); border-radius: 18px; box-shadow: 0 8px 20px rgba(86,106,14,.35); color: #fff; }
    .rd-dock button { width: 48px; height: 48px; border-radius: 14px; background: #fff; color: #566a0e; }
    .rd-dock button:not(:disabled):hover { transform: translateY(-4px) scale(1.08); box-shadow: 0 8px 14px rgba(0,0,0,.25); }
    .rd-dock button:disabled { background: rgba(255,255,255,.22); color: rgba(255,255,255,.6); }
    .rd-neon { width: fit-content; min-width: 420px; background: #0b0f06; border-radius: 12px; color: #b6ff3b; }
    .rd-neon button { width: 44px; height: 44px; border-radius: 10px; border: 1px solid #b6ff3b; box-shadow: 0 0 8px #b6ff3b, inset 0 0 6px rgba(182,255,59,.4); text-shadow: 0 0 6px #b6ff3b; }
    .rd-neon button:first-of-type { background: #b6ff3b; color: #0b0f06; }
    .rd-neon button:not(:disabled):hover { box-shadow: 0 0 16px #b6ff3b, 0 0 30px rgba(182,255,59,.6); }
    .rd-neon button:disabled { border-color: #3a4a22; box-shadow: none; color: #3a4a22; text-shadow: none; }
    .rd-ticket { width: fit-content; min-width: 420px; padding: 10px 28px; background: radial-gradient(circle at 0 50%, #fff 0 9px, transparent 10px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, #fff 0 9px, transparent 10px) right / 51% 100% no-repeat; background-color: #eef3d6; color: #566a0e; filter: drop-shadow(0 2px 3px rgba(0,0,0,.15)); }
    .rd-ticket button { width: 42px; height: 42px; border-radius: 6px; border: 1px dashed #9bb823; }
    .rd-ticket button:first-of-type { background: #9bb823; color: #fff; border-style: solid; }
    .rd-ticket button:disabled { border-color: #ccd; color: #bbb; }
    .rd-paper { background: #fffbe8; border: 1px solid #e6dca8; box-shadow: 2px 3px 0 #e6dca8; transform: rotate(-.4deg); font-family: 'Comic Sans MS', cursive; color: #4b5a10; }
    .rd-paper button { height: 38px; padding: 0 12px; text-decoration: underline wavy #9bb823; }
    .rd-paper button span { display: inline; }
    .rd-paper button:hover:not(:disabled) { background: #fff2a8; }
    .rd-paper button:disabled { text-decoration: line-through; color: #aaa; }
    .rd-terminal { background: #000; color: #3dff6a; font-family: Consolas, monospace; border-radius: 4px; padding: 10px 14px; }
    .rd-terminal button { padding: 4px 6px; }
    .rd-terminal button fa-icon { display: none; }
    .rd-terminal button span { display: inline; text-transform: lowercase; }
    .rd-terminal button span::before { content: '[ '; } .rd-terminal button span::after { content: ' ]'; }
    .rd-terminal button:hover:not(:disabled) { background: #3dff6a; color: #000; }
    .rd-terminal button:disabled { color: #1d6b32; }
    .rd-retro { background: #c0c0c0; color: #000; border: 2px solid; border-color: #fff #808080 #808080 #fff; font-family: Tahoma, sans-serif; }
    .rd-retro button { height: 32px; padding: 0 12px; background: #c0c0c0; border: 2px solid; border-color: #fff #404040 #404040 #fff; }
    .rd-retro button span { display: inline; }
    .rd-retro button:active:not(:disabled) { border-color: #404040 #fff #fff #404040; }
    .rd-retro button:disabled { color: #808080; text-shadow: 1px 1px #fff; }
    .rd-neumorph { width: fit-content; min-width: 420px; padding: 14px 18px; background: #e8ecdc; border-radius: 20px; box-shadow: 8px 8px 16px #c7cbbb, -8px -8px 16px #fff; color: #566a0e; }
    .rd-neumorph button { width: 46px; height: 46px; border-radius: 14px; background: #e8ecdc; box-shadow: 4px 4px 8px #c7cbbb, -4px -4px 8px #fff; }
    .rd-neumorph button:active:not(:disabled), .rd-neumorph button:first-of-type { box-shadow: inset 3px 3px 6px #c7cbbb, inset -3px -3px 6px #fff; color: #7c9618; }
    .rd-neumorph button:disabled { box-shadow: none; color: #b7bba8; }
    .rd-gradborder { width: fit-content; min-width: 420px; background: linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #9bb823, #2fb4a6, #5a79af) border-box; border: 2px solid transparent; border-radius: 14px; color: #566a0e; }
    .rd-gradborder button { width: 42px; height: 42px; border-radius: 10px; }
    .rd-gradborder button:first-of-type { background: linear-gradient(135deg, #9bb823, #2fb4a6); color: #fff; }
    .rd-gradborder button:not(:disabled):hover { background: #eef3d6; }
    .rd-gradborder button:disabled { color: #ccc; }
    .rd-fab { padding-left: 0; color: #fff; }
    .rd-fab button { width: 40px; height: 40px; border-radius: 50%; background: #566a0e; box-shadow: 0 3px 6px rgba(0,0,0,.25); margin-left: -8px; border: 2px solid #fff; }
    .rd-fab button:first-of-type { width: 56px; height: 56px; background: #9bb823; margin-left: 0; z-index: 1; }
    .rd-fab button:not(:disabled):hover { transform: scale(1.12); }
    .rd-fab button:disabled { background: #cfd5bd; box-shadow: none; }
    .rd-fab .rd-sel { color: #566a0e; }
    .rd-folder { align-items: flex-end; padding-bottom: 0; border-bottom: 3px solid #9bb823; gap: 3px; color: #566a0e; }
    .rd-folder button { height: 36px; padding: 0 16px; border-radius: 10px 10px 0 0; background: #eef3d6; }
    .rd-folder button span { display: inline; }
    .rd-folder button:first-of-type { height: 42px; background: #9bb823; color: #fff; }
    .rd-folder button:disabled { background: #f3f3f3; color: #b5b5b5; }
    .rd-slide { gap: 18px; color: #566a0e; border-bottom: 1px solid #dfe6bd; }
    .rd-slide button { height: 40px; padding: 0 6px; background: linear-gradient(#9bb823, #9bb823) bottom / 0 3px no-repeat; transition: background-size .25s; }
    .rd-slide button:not(:disabled):hover, .rd-slide button:first-of-type { background-size: 100% 3px; }
    .rd-slide button:disabled { color: #c9c9c9; }
    .rd-stamp { gap: 12px; color: #566a0e; }
    .rd-stamp button { padding: 8px 14px; border: 2px dashed #9bb823; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; transform: rotate(-3deg); }
    .rd-stamp button:nth-of-type(2) { transform: rotate(2deg); }
    .rd-stamp button span { display: inline; }
    .rd-stamp button:first-of-type { background: #9bb823; color: #fff; border-style: solid; }
    .rd-stamp button:disabled { border-color: #ccc; color: #bbb; }
    .rd-chips { gap: 8px; color: #566a0e; }
    .rd-chips button { height: 34px; padding: 0 14px; border: 1px solid #9bb823; border-radius: 999px; }
    .rd-chips button span { display: inline; }
    .rd-chips button:first-of-type { background: #9bb823; color: #fff; }
    .rd-chips button:not(:disabled):hover { background: #eef3d6; }
    .rd-chips button:first-of-type:hover { background: #87a01c !important; }
    .rd-chips button:disabled { border-color: #ddd; color: #bbb; }
    .rd-cards { gap: 10px; color: #566a0e; }
    .rd-cards button { flex-direction: column; gap: 4px; width: 84px; height: 66px; background: #fff; border: 1px solid #dfe6bd; border-radius: 12px; font-size: 12px; }
    .rd-cards button span { display: inline; }
    .rd-cards button:first-of-type { background: #9bb823; color: #fff; border-color: #9bb823; }
    .rd-cards button:not(:disabled):hover { box-shadow: 0 6px 12px rgba(0,0,0,.12); transform: translateY(-2px); }
    .rd-cards button:disabled { background: #fafafa; color: #c4c4c4; border-style: dashed; }
    .rd-ribbon { width: fit-content; min-width: 460px; padding: 10px 56px 10px 16px; background: #9bb823; color: #fff; clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%); }
    .rd-ribbon button { width: 42px; height: 42px; border-radius: 8px; background: #566a0e; }
    .rd-ribbon button:not(:disabled):hover { background: #3f4f0a; }
    .rd-ribbon button:disabled { background: rgba(255,255,255,.25); color: rgba(255,255,255,.6); }
    .rd-hairline { gap: 28px; padding: 14px 4px; border-bottom: 1px solid #566a0e; color: #566a0e; }
    .rd-hairline button { width: 24px; height: 24px; }
    .rd-hairline button:not(:disabled):hover { color: #9bb823; transform: translateY(-2px); }
    .rd-hairline button:disabled { color: #d0d0d0; }
    .rd-track { width: fit-content; min-width: 420px; padding: 6px; background: #e3e8cf; border-radius: 999px; box-shadow: inset 0 2px 5px rgba(0,0,0,.12); color: #566a0e; }
    .rd-track button { width: 44px; height: 44px; border-radius: 50%; }
    .rd-track button:first-of-type { background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,.25); color: #7c9618; }
    .rd-track button:not(:disabled):hover { background: rgba(255,255,255,.7); }
    .rd-track button:disabled { color: #a9b08f; }
    .rd-blueprint { background: #12457a; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px); background-size: 14px 14px; color: #fff; border-radius: 4px; font-family: Consolas, monospace; }
    .rd-blueprint button { width: 44px; height: 44px; border: 1px dashed #fff; }
    .rd-blueprint button:first-of-type { border-style: solid; background: rgba(255,255,255,.2); }
    .rd-blueprint button:not(:disabled):hover { background: rgba(255,255,255,.3); }
    .rd-blueprint button:disabled { border-color: rgba(255,255,255,.3); color: rgba(255,255,255,.35); }
    .rd-candy { gap: 12px; color: #fff; }
    .rd-candy button { width: 52px; height: 48px; border-radius: 16px; background: linear-gradient(#b7d447, #8ba91d); border-bottom: 5px solid #566a0e; }
    .rd-candy button:nth-of-type(2) { background: linear-gradient(#6fb3ff, #3a86e0); border-bottom-color: #1f55a0; }
    .rd-candy button:nth-of-type(3) { background: linear-gradient(#ffb85c, #f08a1c); border-bottom-color: #a85c0a; }
    .rd-candy button:active:not(:disabled) { transform: translateY(4px); border-bottom-width: 1px; }
    .rd-candy button:disabled { background: #e6e6e6; border-bottom-color: #c9c9c9; color: #fff; }
    .rd-glasslight { width: fit-content; min-width: 420px; padding: 12px 16px; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.7); border-radius: 18px; box-shadow: 0 8px 24px rgba(86,106,14,.2); color: #3f4f0a; position: relative; }
    .rd-glasslight::before { content: ''; position: absolute; inset: -20px; z-index: -1; background: radial-gradient(circle at 20% 30%, #9bb823 0 40px, transparent 41px), radial-gradient(circle at 80% 70%, #2fb4a6 0 50px, transparent 51px); }
    .rd-glasslight button { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,.55); }
    .rd-glasslight button:not(:disabled):hover { background: rgba(255,255,255,.9); }
    .rd-glasslight button:disabled { opacity: .45; }
    .rd-brutal { gap: 12px; background: #e9f56a; border: 3px solid #000; box-shadow: 6px 6px 0 #000; color: #000; text-transform: uppercase; width: fit-content; min-width: 460px; }
    .rd-brutal button { height: 40px; padding: 0 12px; background: #fff; border: 3px solid #000; box-shadow: 3px 3px 0 #000; }
    .rd-brutal button span { display: inline; }
    .rd-brutal button:first-of-type { background: #9bb823; }
    .rd-brutal button:active:not(:disabled) { transform: translate(3px, 3px); box-shadow: none; }
    .rd-brutal button:disabled { background: #ddd; color: #777; box-shadow: none; border-style: dashed; }
    .rd-seg { padding: 0; width: fit-content; min-width: 460px; gap: 0; overflow: hidden; }
    .rd-seg button { height: 46px; padding: 0 20px; }
    .rd-seg button span { display: inline; }
    .rd-seg .rd-sel { padding: 0 16px; }
    .rd-seg-outline { border: 2px solid #566a0e; border-radius: 12px; color: #566a0e; background: #fff; }
    .rd-seg-outline button + button { border-left: 2px solid #566a0e; }
    .rd-seg-outline button:first-of-type { background: #566a0e; color: #fff; }
    .rd-seg-outline button:not(:disabled):not(:first-of-type):hover { background: #eef3d6; }
    .rd-seg-outline button:disabled { background: #f4f4f4; color: #9a9a9a; }
    .rd-seg-pill { border-radius: 999px; background: #e3e8cf; padding: 4px; color: #566a0e; box-shadow: inset 0 1px 3px rgba(0,0,0,.15); }
    .rd-seg-pill button { border-radius: 999px; height: 40px; }
    .rd-seg-pill button:first-of-type { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); }
    .rd-seg-pill button:not(:disabled):not(:first-of-type):hover { background: rgba(255,255,255,.6); }
    .rd-seg-pill button:disabled { color: #a3aa89; }
    .rd-seg-filled { border-radius: 10px; background: #9bb823; color: #fff; }
    .rd-seg-filled button + button { border-left: 1px solid rgba(255,255,255,.55); }
    .rd-seg-filled button:first-of-type { background: #566a0e; }
    .rd-seg-filled button:not(:disabled):hover { background: #87a01c; }
    .rd-seg-filled button:first-of-type:hover { background: #3f4f0a !important; }
    .rd-seg-filled button:disabled { background: repeating-linear-gradient(45deg, #b5c95a 0 6px, #aabf4a 6px 12px); color: rgba(255,255,255,.7); }
    .rd-seg-underline { border-bottom: 2px solid #dfe6bd; color: #566a0e; border-radius: 0; }
    .rd-seg-underline button { border-bottom: 3px solid transparent; margin-bottom: -2px; border-radius: 0; }
    .rd-seg-underline button:first-of-type { border-bottom-color: #9bb823; font-weight: 700; }
    .rd-seg-underline button:not(:disabled):hover { background: #f4f7e6; border-bottom-color: #9bb823; }
    .rd-seg-underline button:disabled { color: #bdbdbd; }
    .rd-seg-split { border-radius: 10px; background: #fff; color: #566a0e; box-shadow: 0 3px 10px rgba(0,0,0,.14); }
    .rd-seg-split button { border-radius: 0; }
    .rd-seg-split button:first-of-type { background: #9bb823; color: #fff; padding: 0 28px; clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%); margin-right: -10px; padding-right: 36px; }
    .rd-seg-split button:not(:disabled):not(:first-of-type):hover { background: #eef3d6; }
    .rd-seg-split button:disabled { color: #c0c0c0; }
    .aero-stage { position: relative; margin-bottom: 20px; padding: 18px; border-radius: 10px; overflow: hidden; background: radial-gradient(circle at 15% 20%, #e8ff8a 0 60px, transparent 140px), radial-gradient(circle at 85% 80%, #5fd3e0 0 70px, transparent 160px), linear-gradient(135deg, #1f5a3a, #6f9a1a 45%, #2a8f9a 75%, #3a5fa0); }
    .aero-stage code { display: block; margin-bottom: 8px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.6); font-size: 12px; }
    .rd-aero { width: fit-content; min-width: 440px; gap: 8px; color: #fff; text-shadow: none; }
    .rd-aero button { transition: background-color .15s; }
    .rd-aero button:disabled { opacity: .45; }
    .rd-aero-glass { padding: 10px 14px; background: rgba(255,255,255,.22); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.4); border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,.18); }
    .rd-aero-glass button { width: 44px; height: 42px; border-radius: 8px; background: rgba(255,255,255,.12); }
    .rd-aero-glass button:first-of-type { background: rgba(255,255,255,.4); }
    .rd-aero-glass button:not(:disabled):hover { background: rgba(255,255,255,.3); }
    .rd-aero-orb { padding: 8px 14px; gap: 14px; background: rgba(0,0,0,.25); backdrop-filter: blur(10px); border-radius: 40px; }
    .rd-aero-orb button { width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(255,255,255,.5); background: rgba(255,255,255,.14); }
    .rd-aero-orb button:first-of-type { background: #7f9f1c; border-color: transparent; }
    .rd-aero-orb button:not(:disabled):hover { background: rgba(255,255,255,.3); }
    .rd-aero-orb button:first-of-type:hover { background: #8fb11f !important; }
    .rd-aero-taskbar { padding: 6px 10px; background: rgba(20,24,16,.6); backdrop-filter: blur(12px); border-top: 1px solid rgba(255,255,255,.25); border-radius: 0; }
    .rd-aero-taskbar button { width: 52px; height: 40px; border-radius: 6px; }
    .rd-aero-taskbar button:first-of-type { background: rgba(255,255,255,.18); }
    .rd-aero-taskbar button:not(:disabled):hover { background: rgba(255,255,255,.14); }
    .rd-aero-explorer { padding: 6px 10px; background: #f0f4fa; border: 1px solid #c9d5e4; border-radius: 4px; color: #1b3a5c; font-family: 'Segoe UI', 'Open Sans', sans-serif; }
    .rd-aero-explorer button { height: 32px; padding: 0 12px; border-radius: 3px; }
    .rd-aero-explorer button span { display: inline; }
    .rd-aero-explorer button:first-of-type { background: #dde8f5; }
    .rd-aero-explorer button:not(:disabled):hover { background: #e4edf8; }
    .rd-aero-explorer button:disabled { color: #8a98a8; opacity: 1; }
    .rd-aero-explorer .rd-sel { color: #3b5878; }
    .rd-aero-gel { padding: 10px 14px; gap: 10px; background: rgba(255,255,255,.18); backdrop-filter: blur(10px); border-radius: 14px; }
    .rd-aero-gel button { height: 40px; padding: 0 18px; border-radius: 20px; background: #7f9f1c; }
    .rd-aero-gel button span { display: inline; }
    .rd-aero-gel button:not(:disabled):hover { background: #8fb11f; }
    .rd-aero-gel button:disabled { background: rgba(255,255,255,.2); }
    .rd-aero-frame { padding: 8px; background: rgba(255,255,255,.25); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.45); border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,.2); flex-wrap: wrap; }
    .rd-aero-frame::before { content: 'Actions'; flex: 1 0 100%; padding: 0 6px 6px; font-weight: 700; }
    .rd-aero-frame button { height: 38px; padding: 0 16px; background: rgba(255,255,255,.88); color: #3f5a0a; border-radius: 6px; }
    .rd-aero-frame button span { display: inline; }
    .rd-aero-frame button:first-of-type { background: #fff; font-weight: 700; }
    .rd-aero-frame button:not(:disabled):hover { background: #fff; }
    .rd-aero-frame .rd-sel { margin-left: auto; padding-right: 6px; }
    .best-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px; margin-top: 8px; background: rgba(155,184,35,.15); border: 1px solid rgba(63,79,10,.25); border-radius: 12px; }
    .best-seg { display: inline-flex; overflow: hidden; background: #fff; border: 2px solid #3f4f0a; border-radius: 10px; }
    .best-seg button { display: inline-flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 18px; border: 0; background: #fff; color: #2f3b08; font: 600 15px 'Open Sans', sans-serif; cursor: pointer; }
    .best-seg button + button { border-left: 2px solid #3f4f0a; }
    .best-seg .best-primary { background: #3f4f0a; color: #fff; }
    .best-seg button:hover:not([aria-disabled='true']) { background: #e4ebc4; text-decoration: underline; text-underline-offset: 3px; }
    .best-seg .best-primary:hover { background: #2f3b08; }
    .best-seg button:focus-visible { outline: 3px solid #111; outline-offset: -5px; }
    .best-seg button[aria-disabled='true'] { background: #fff; color: #767676; cursor: not-allowed; }
    .best-sel { display: flex; align-items: center; gap: 8px; margin: 0 0 0 auto; color: #2f3b08; font: 600 13px 'Open Sans', sans-serif; }
    .best-sel b { min-width: 24px; padding: 1px 5px; background: #fff; border: 2px solid #3f4f0a; border-radius: 6px; text-align: center; }
    .best-why { margin: 6px 4px 20px; color: #404040; font: 13px/1.4 'Open Sans', sans-serif; }
    @media (prefers-reduced-motion: no-preference) { .best-seg button { transition: background-color .15s; } }
    @media (forced-colors: active) { .best-seg, .best-seg button + button { border-color: ButtonText; } .best-seg button[aria-disabled='true'] { color: GrayText; } }
    .gl-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 6px 0 10px; background: var(--bb); border: var(--bbd); border-radius: var(--brad); box-shadow: var(--bsh); }
    .gl-grp { display: inline-flex; gap: var(--gap); overflow: var(--ov); background: var(--gbg); border: var(--gbd); border-radius: var(--grad); }
    .gl-grp button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: var(--h); min-width: var(--w); padding: 0 var(--px); border: var(--bd); border-radius: var(--rad); background: var(--bg); color: var(--fg); box-shadow: var(--sh); font: 600 15px 'Open Sans', sans-serif; cursor: pointer; }
    .gl-grp button span { display: var(--lab); }
    .gl-grp button + button { border-left: var(--div); }
    .gl-grp button:first-of-type { background: var(--pb); color: var(--pf); }
    .gl-grp button:hover:not(:disabled) { filter: brightness(.93); }
    .gl-grp button:disabled { background: #fff; color: var(--dfg); border-color: var(--dbd); box-shadow: none; cursor: not-allowed; }
    .gl-sel { display: flex; align-items: center; gap: 8px; margin-left: auto; color: var(--tx); font: 600 12px 'Open Sans', sans-serif; }
    .gl-sel b { min-width: 20px; padding: 1px 4px; background: #fff; border: 2px solid #566a0e; border-radius: 5px; color: #566a0e; text-align: center; }
    .sp-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 6px 0 10px; background: var(--bb); border: var(--bbd); border-radius: 5px; box-shadow: var(--bsh); }
    .sp-plate { display: inline-flex; background: var(--pl); border: var(--plbd); border-radius: var(--prad); box-shadow: var(--plsh); overflow: hidden; }
    .sp-plate button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: var(--h); min-width: var(--w); padding: 0 var(--px); border: 0; background: transparent; color: var(--fg); font: 600 15px 'Open Sans', sans-serif; cursor: pointer; }
    .sp-plate button span { display: var(--lab); }
    .sp-plate button:first-of-type { background: var(--pbg); color: var(--pfg); clip-path: var(--clip); padding-right: calc(var(--sl) + var(--px)); margin-right: calc(var(--sl) * -0.6); position: relative; z-index: 1; }
    .sp-plate button:hover:not(:disabled) { background-color: rgba(155,184,35,.18); }
    .sp-plate button:first-of-type:hover:not(:disabled) { filter: brightness(.92); }
    .sp-plate button:disabled { background: #fff; color: #767676; cursor: not-allowed; }
    .sp-sel { display: flex; align-items: center; gap: 8px; margin-left: auto; color: var(--tx); font: 600 12px 'Open Sans', sans-serif; }
    .sp-sel b { min-width: 20px; padding: 1px 4px; background: #fff; border: 2px solid #566a0e; border-radius: 5px; color: #566a0e; text-align: center; }
    .row { display: flex; gap: 40px; align-items: center; margin-bottom: 48px; }
    .variants { display: grid; grid-template-columns: 1fr; gap: 0 24px; }
    .shade code { display: block; margin-bottom: 4px; font-size: 12px; }
    .shade .row { margin-bottom: 20px; gap: 16px; }
    .shade ::ng-deep .vbtn:not(.outline) { background-color: var(--bg); color: #fff; }
    .shade ::ng-deep .vbtn.outline { border-color: var(--bg); color: var(--bg); }
    .shade ::ng-deep .vbtn:not(.outline):hover:not(.disabled),
    .shade ::ng-deep .vbtn.v-hover { background-color: var(--hover) !important; color: #fff !important; }
    .tech code { display: block; margin-bottom: 4px; font-size: 12px; }
    .tech .row { margin-bottom: 20px; gap: 16px; }
    .tech ::ng-deep .tbtn {
      background-color: var(--bg);
      color: var(--fg);
      font-weight: var(--fw);
      font-size: var(--fs);
      box-shadow: 0 0 0 var(--rw) var(--ring) !important;
    }
    .tech ::ng-deep .tbtn:hover:not(.disabled), .tech ::ng-deep .tbtn.v-hover {
      background-color: var(--hover) !important;
      color: var(--fg) !important;
    }
    .chipvs { display: grid; grid-template-columns: 1fr; gap: 0 24px; }
    .chipv code { display: block; margin-bottom: 4px; font-size: 12px; }
    .chipv .box { background: #eef2f7; padding: 8px; margin-bottom: 4px; }
    .chipv .box.hov { background: #e1e7f1; margin-bottom: 20px; }
    .chipv ::ng-deep .chip-container:not(.count-badge) {
      border: var(--bw) solid var(--b);
      background: var(--f);
      color: var(--c);
    }
    .pinned { position: sticky; top: 0; z-index: 2; margin-bottom: 16px; background: #fff; border-bottom: 1px solid var(--color-accent-border); }
    .pinned-head { display: flex; align-items: center; gap: 4px; }
    .pinned-head h2 { margin: 8px 0; }
    .pinned-toggle { padding: 4px 8px; border: 0; background: none; font: inherit; color: var(--color-accent); cursor: pointer; }
    .pinned-toggle:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
    .pinned-body { max-height: 60vh; overflow: auto; padding-bottom: 8px; }
    .cvars { display: grid; grid-template-columns: 1fr; gap: 0 24px; }
    .cvar { margin-bottom: 24px; }
    .cvar code { display: block; margin-bottom: 4px; font-size: 12px; }
    .cvar.cvar ::ng-deep num-criteria-box > .container {
      background-color: var(--bg);
      border: var(--bw) solid var(--b);
      box-shadow: var(--sh);
    }
    .mocks { display: grid; grid-template-columns: 1fr; gap: 0 24px; }
    .mock { margin-bottom: 28px; }
    .mock code { display: block; margin-bottom: 4px; font-size: 12px; }
    .mk-card {
      position: relative; overflow: hidden; width: 100%; box-sizing: border-box;
      display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 12px; padding: 16px;
      background: #eef2f7; border-radius: var(--border-radius-card);
      box-shadow: 0 0 0 1px #5a79af, var(--shadow-card);
    }
    .mk-main { min-width: 0; }
    .mk-title { font-weight: 600; color: #2b3a55; line-height: 24px; }
    .mk-info { color: #5f6266; font-size: 14px; margin-top: 4px; }
    .mk-foot { grid-column: 1 / -1; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(90, 121, 175, 0.2); }
    .mk-main .mk-foot { grid-column: auto; }
    .mk-chip { background: #48659d; color: #fff; font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
    .mk-pill { border: 1px solid #48659d; color: #2b3a55; background: #fff; font-size: 14px; padding: 1px 8px; border-radius: 4px; }
    .mk-side { display: flex; align-items: flex-start; gap: 8px; }
    .mk-btn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border: 1px solid #48659d; border-radius: 4px; background: #fff; color: #2b3a55; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
    .mk-btn:hover { background: #48659d; color: #fff; }
    .mk-ico { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid #5a79af; border-radius: 4px; background: #fff; color: #48659d; font-size: 15px; cursor: pointer; }
    .mk-ico:hover, .mk-ico.mk-fill { background: #48659d; color: #fff; }
    .mk-link { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; color: #48659d; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; padding: 4px 0; }
    .mk-link:hover { text-decoration: underline; }
    .mk-danger { color: #b3261e; }
    .mk-filters { display: flex; flex-direction: column; gap: 8px; }
    .mk-frow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
    .mk-push { display: flex; margin: 8px 0 0 auto; }
    .mk-col { grid-template-columns: 1fr; padding-bottom: 0; }
    .mk-bar { display: flex; gap: 24px; margin: 12px -16px 0; padding: 4px 16px; border-top: 1px solid rgba(90, 121, 175, 0.2); background: rgba(255, 255, 255, 0.6); }
    .mk-rail { grid-template-columns: auto minmax(0, 1fr) auto; padding-left: 0; }
    .mk-grip { display: flex; align-items: center; justify-content: center; width: 32px; margin: -16px 12px -16px 0; background: rgba(90, 121, 175, 0.18); color: #48659d; cursor: grab; border-right: 1px solid rgba(90, 121, 175, 0.4); }
    .mk-rail .mk-side { flex-direction: column; }
    .mk-split { grid-template-columns: minmax(0, 1fr) auto; padding-right: 0; }
    .mk-col2 { display: flex; flex-direction: column; margin: -16px 0; border-left: 1px solid rgba(90, 121, 175, 0.4); }
    .mk-tool { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; width: 72px; border: 0; background: transparent; color: #48659d; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
    .mk-tool + .mk-tool { border-top: 1px solid rgba(90, 121, 175, 0.2); }
    .mk-tool:hover { background: #48659d; color: #fff; }
    .mk-sm { width: 24px; height: 24px; font-size: 12px; margin-left: auto; }
    .mk-banded { display: block; padding: 0; }
    .mk-head { display: flex; justify-content: space-between; gap: 12px; padding: 16px; background: rgba(90, 121, 175, 0.18); border-bottom: 1px solid rgba(90, 121, 175, 0.4); }
    .mk-body { padding: 12px 16px 16px; background: #fff; }
    .mk-banded .mk-side { flex-wrap: nowrap; }
    .mk-inline { display: flex; gap: 8px; }
    .cn { position: relative; box-sizing: border-box; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 8px 12px; background: #eef2f7; border: 1px solid #5a79af; border-radius: 8px; color: #2b3a55; font-size: 14px; }
    .cn-main { flex: 1 1 0; min-width: 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 10px; }
    .cn-title { font-weight: 600; }
    .cn-info { color: #5f6266; font-size: 12px; }
    .cn-off { display: none; }
    .cn-sum { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-width: 0; }
    .cn-act { display: flex; gap: 10px; color: #48659d; }
    .cn-tog { color: #48659d; }
    .cn-body { flex-basis: 100%; display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
    .cn-text { color: #5f6266; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
    .cn-more { color: #48659d; font-weight: 700; font-size: 12px; }
    .cn-dots, .cn-bar { display: inline-flex; gap: 3px; }
    .cn-dots i { width: 8px; height: 8px; border-radius: 50%; background: #48659d; }
    .cn-bar i { width: 28px; height: 4px; border-radius: 2px; background: #48659d; }
    .cn .mk-pill { font-size: 12px; padding: 0 6px; }
    .cn-lead { display: inline-flex; align-items: center; justify-content: center; font-weight: 700; color: #48659d; }
    .cn-k-row { background: none; border: 0; border-bottom: 1px solid #c5d0e3; border-radius: 0; padding: 4px 8px; flex-wrap: nowrap; }
    .cn-k-row .cn-main { flex-wrap: nowrap; white-space: nowrap; overflow: hidden; }
    .cn-k-row.cn-open { flex-wrap: wrap; }
    .cn-k-pill { width: fit-content; border-radius: 999px; padding: 2px 6px 2px 14px; }
    .cn-k-pill.cn-open { width: auto; border-radius: 14px; }
    .cn-k-pill .cn-main { flex: 0 1 auto; }
    .cn-k-tile { width: 200px; flex-direction: column; align-items: flex-start; padding: 10px 12px; }
    .cn-k-tile .cn-main { flex-direction: column; flex: none; gap: 2px; }
    .cn-k-tile .cn-act { position: absolute; top: 8px; right: 10px; }
    .cn-k-tile.cn-open { width: auto; }
    .cn-k-strip { background: #fff; border: 0; border-left: 4px solid #48659d; border-radius: 2px; padding: 3px 8px; }
    .cn-k-table { display: grid; grid-template-columns: 2fr 1.4fr 1.6fr auto auto; border-radius: 4px; padding: 4px 10px; }
    .cn-k-table .cn-main { display: contents; }
    .cn-k-table .cn-off { display: block; visibility: hidden; }
    .cn-k-table .cn-body { grid-column: 1 / -1; }
    .cn-k-tag { width: fit-content; background: #48659d; color: #fff; border: 0; border-radius: 0; padding: 4px 22px 4px 12px; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%); }
    .cn-k-tag .cn-info, .cn-k-tag .cn-act, .cn-k-tag .cn-tog { color: #fff; }
    .cn-k-tag .cn-main { flex: 0 1 auto; }
    .cn-k-tag.cn-open { width: auto; clip-path: none; border-radius: 8px; }
    .cn-k-split { align-items: stretch; flex-wrap: nowrap; }
    .cn-k-split .cn-main { flex-direction: column; }
    .cn-k-split .cn-sum { flex: 1 1 0; justify-content: flex-end; border-left: 1px solid #c5d0e3; padding-left: 10px; }
    .cn-k-split.cn-open { flex-wrap: wrap; }
    .cn-k-bar { gap: 2px 10px; }
    .cn-k-bar .cn-sum { flex-basis: 100%; order: 5; }
    .cn-k-underline { background: none; border: 0; border-bottom: 2px solid #48659d; border-radius: 0; padding: 2px 0; }
    .cn-k-dashed { background: transparent; border-style: dashed; border-radius: 6px; padding: 4px 10px; }
    .cn-k-cloud { background: none; border: 0; padding: 0; gap: 4px; }
    .cn-k-cloud .cn-title { background: #48659d; color: #fff; padding: 2px 8px; border-radius: 4px; }
    .cn-k-cloud .cn-main { flex: 0 1 auto; }
    .cn-k-cloud .cn-info { display: none; }
    .cn-k-accordion { padding: 0; overflow: hidden; }
    .cn-k-accordion .cn-tog { order: -1; margin-left: 4px; }
    .cn-k-accordion .cn-main { padding: 6px 0; }
    .cn-k-accordion .cn-sum, .cn-k-accordion .cn-act { padding-right: 10px; }
    .cn-k-accordion .cn-body { background: #fff; margin: 0; padding: 8px 12px; border-top: 1px solid #c5d0e3; }
    .cn-k-corner { margin-top: 10px; padding-right: 12px; }
    .cn-k-corner .cn-sum { position: absolute; top: -10px; right: 8px; }
    .cn-k-icon { border-radius: 8px; }
    .cn-k-icon .cn-lead { width: 28px; height: 28px; border-radius: 50%; background: #48659d; color: #fff; }
    .cn-k-right .cn-main { justify-content: space-between; }
    .cn-k-right .cn-info { margin-left: auto; }
    .cn-k-ticket { padding: 0; overflow: hidden; }
    .cn-k-ticket .cn-lead { align-self: stretch; padding: 0 12px; background: #dbe3f0; border-right: 2px dashed #5a79af; }
    .cn-k-ticket .cn-tog, .cn-k-ticket .cn-sum { margin-right: 8px; }
    .cn-k-ticket .cn-body { padding: 0 12px 8px; }
    .cn-k-hover .cn-info, .cn-k-hover .cn-sum, .cn-k-hover .cn-act { display: none; }
    .cn-k-hover:hover .cn-info, .cn-k-hover:hover .cn-sum, .cn-k-hover:hover .cn-act, .cn-k-hover:focus-within .cn-sum, .cn-k-hover:focus-within .cn-act { display: flex; }
    .cn-k-hover:hover .cn-info { display: inline; }
    .cn-k-twoline .cn-main { flex-basis: 100%; }
    .cn-k-twoline .cn-sum { flex-basis: 100%; order: 5; flex-wrap: nowrap; }
    .cn-k-twoline .cn-act { order: 1; }
    .cn-k-footer { padding: 0; overflow: hidden; }
    .cn-k-footer .cn-main { padding: 8px 0 8px 12px; }
    .cn-k-footer .cn-act { padding-right: 4px; }
    .cn-k-footer .cn-sum { flex-basis: 100%; order: 5; padding: 4px 12px; background: #dbe3f0; border-top: 1px solid #c5d0e3; }
    .cn-k-footer .cn-body { order: 4; padding: 0 12px 8px; }
    .cn-k-stack { width: 170px; flex-direction: column; align-items: flex-start; }
    .cn-k-stack .cn-main { flex-direction: column; flex: none; }
    .cn-k-stack .cn-sum { flex-direction: column; align-items: flex-start; }
    .cn-k-stack.cn-open { width: auto; }
    .dcg { display: grid; grid-template-columns: repeat(auto-fit, minmax(448px, max-content)); gap: 16px; align-items: start; }
    .dc { position: relative; box-sizing: border-box; width: 448px; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; padding: 16px; overflow: hidden; background: #eef2f7; border-radius: var(--border-radius-card); box-shadow: 0 0 0 1px #5a79af, var(--shadow-card); }
    .dc-text { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
    .dc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .dc-tools { display: flex; flex-direction: column; margin: -16px -16px -16px 12px; border-left: 1px solid rgba(90, 121, 175, 0.4); }
    .dc-tool { flex: 1; width: 72px; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; border: 0; background: transparent; color: #48659d; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
    .dc-tool.dc-ico { width: 44px; }
    .dc-tool + .dc-tool { border-top: 1px solid rgba(90, 121, 175, 0.2); }
    .dc-tool:hover { background: #48659d; color: #fff; }
    .dc-none, .dc-bottom { grid-template-columns: 1fr; }
    .dc-left { grid-template-columns: auto minmax(0, 1fr); }
    .dc-left .dc-tools { order: -1; margin: -16px 12px -16px -16px; border-left: 0; border-right: 1px solid rgba(90, 121, 175, 0.4); }
    .dc-bottom .dc-tools { flex-direction: row; margin: 12px -16px -16px; border-left: 0; border-top: 1px solid rgba(90, 121, 175, 0.4); }
    .dc-bottom .dc-tool { flex-direction: row; gap: 6px; min-height: 36px; width: auto; }
    .dc-bottom .dc-tool.dc-ico { width: auto; }
    .dc-bottom .dc-tool + .dc-tool { border-top: 0; border-left: 1px solid rgba(90, 121, 175, 0.2); }
    .dc-grid .dc-tools { display: grid; grid-template-columns: repeat(2, auto); }
    .dc-grid .dc-tool + .dc-tool { border-top: 0; }
    .dc-grid .dc-tool:nth-child(even) { border-left: 1px solid rgba(90, 121, 175, 0.2); }
    .dc-grid .dc-tool:nth-child(n + 3) { border-top: 1px solid rgba(90, 121, 175, 0.2); }
    .fb { position: relative; box-sizing: border-box; width: 448px; max-width: 100%; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; overflow: hidden; background: #f7f9fc; border-radius: var(--border-radius-card); box-shadow: 0 0 0 1px #5a79af, var(--shadow-card); }
    .fb-white { background: #fff; }
    .fb-head { grid-area: 1 / 2; padding: 12px 16px; background: #dbe3f0; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .fb-foot { grid-row: 2; grid-column: 2 / 3; padding: 10px 16px 12px; min-width: 0; border-top: 1px solid rgba(90, 121, 175, 0.3); }
    .fb-rail-head .fb-foot { grid-column-start: 1; }
    .fb-col-head .fb-foot { grid-column-end: -1; }
    .fb-rail { grid-area: 1 / 1 / span 2; background: #e5ebf4; border-right: 1px solid rgba(90, 121, 175, 0.4); }
    .fb-tools { grid-area: 1 / 3 / span 2; margin: 0; background: #e5ebf4; }
    .fb-rail-head .fb-rail { grid-row: 1; background: #dbe3f0; }
    .fb-col-head .fb-tools { grid-row: 1; background: #dbe3f0; }
    .fc { position: relative; box-sizing: border-box; width: 448px; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) var(--tw); --ac: #48659d; overflow: hidden; background: #fff; border-radius: var(--border-radius-card); box-shadow: 0 0 0 1px #5a79af, var(--shadow-card); }
    .fc-head { grid-area: 1 / 1; min-width: 0; padding: 12px 16px; background: #dfe7f3; display: flex; flex-direction: column; gap: 6px; }
    .fc-foot { grid-area: 2 / 1; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; min-width: 0; border-top: 1px solid rgba(90, 121, 175, 0.3); }
    .fc-tools { grid-area: 1 / 2 / 3 / 3; display: flex; flex-direction: column; border-left: 1px solid rgba(90, 121, 175, 0.4); background: #fff; }
    .fc-row .fc-tools { flex-direction: row; grid-row: 1; }
    .fc-row .fc-tools .dc-tool + .dc-tool { border-top: 0; border-left: 1px solid rgba(90, 121, 175, 0.2); }
    .fc-tools .dc-tool { width: auto; min-height: 40px; }
    .fc-tools .dc-tool:hover { background: #48659d; color: #fff; }
    .fc .dc-top { justify-content: flex-start; align-items: center; }
    .fc .cd-tog { order: -1; margin-left: -4px; }
    .fc-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; }
    .fc-plain { color: #48659d; font-weight: 600; }
    .fc-tag { padding: 0 8px; border-radius: 10px; background: #fff; border: 1px solid #b9c7df; color: #48659d; font-weight: 600; }
    .fc-foot .fc-tag { background: #eef2f7; }
    .fc-text { color: #48659d; font-size: 12px; font-weight: 600; }
    .fc-eyebrow { color: #48659d; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .fm { --ink: #1f2d4a; --mut: #667089; --acc: #3f5f9b; --line: rgba(63, 95, 155, 0.14); --tint: #f3f6fb; --pill: #e8eef8; position: relative; box-sizing: border-box; width: 448px; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) var(--tw); overflow: hidden; background: #fff; border-radius: 12px; box-shadow: 0 0 0 1px var(--line), 0 1px 2px rgba(20, 35, 70, 0.06), 0 4px 12px rgba(20, 35, 70, 0.05); }
    .fm-edge { box-shadow: inset 3px 0 0 var(--acc), 0 0 0 1px var(--line), 0 1px 2px rgba(20, 35, 70, 0.06), 0 4px 12px rgba(20, 35, 70, 0.05); }
    .fm-head { grid-area: 1 / 1; min-width: 0; padding: 14px 16px 12px; background: var(--tint); display: flex; flex-direction: column; gap: 2px; }
    .fm-rowv .fm-head { padding-right: var(--tr); }
    .fm-top { display: flex; align-items: center; gap: 4px; }
    .fm-tog { display: inline-flex; border: 0; border-radius: 6px; background: none; color: var(--mut); padding: 4px; margin-left: -6px; font-size: 12px; cursor: pointer; }
    .fm-tog:hover { background: var(--pill); color: var(--acc); }
    .fm-title { font-size: 15px; line-height: 22px; font-weight: 600; color: var(--ink); }
    .fm-meta { font-size: 12px; line-height: 18px; color: var(--mut); }
    .fm-sep { opacity: 0.5; margin: 0 2px; }
    .fm-code { color: var(--acc); font-weight: 600; font-variant-numeric: tabular-nums; }
    .fm-count { display: inline-block; padding: 0 8px; border-radius: 10px; background: var(--pill); color: var(--acc); font-size: 12px; line-height: 18px; font-weight: 600; white-space: nowrap; }
    .fm-foot { grid-area: 2 / 1; min-width: 0; padding: 12px 16px 14px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--line); }
    .fm-sumrow { flex-direction: row; align-items: center; gap: 8px; padding: 10px 16px; }
    .fm-row { display: grid; grid-template-columns: 108px 1fr; align-items: baseline; gap: 8px; }
    .fm-lab { font-size: 12px; line-height: 20px; font-weight: 500; color: var(--mut); }
    .fm-vals { display: flex; flex-wrap: wrap; gap: 6px; }
    .fm-val { padding: 0 8px; border-radius: 6px; background: var(--pill); color: var(--ink); font-size: 13px; line-height: 20px; }
    .fm-tools { grid-area: 1 / 2 / 3 / 3; display: flex; flex-direction: column; border-left: 1px solid rgba(63, 95, 155, 0.25); background: #dfe7f3; }
    .fm-mini .fm-tools { flex-direction: row; grid-row: 1; }
    .fm-tool { flex: 1; min-height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; border: 0; background: transparent; color: var(--acc); font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; transition: color 0.15s, background-color 0.15s; }
    .fm-tool:hover, .fm-tool:focus-visible { color: #fff; background: var(--acc); }
    .fm-tool:focus-visible { outline: 2px solid var(--acc); outline-offset: -2px; }
    .fm-tool.fm-del:hover { background: #b3261e; }
    .fm-tools .fm-tool + .fm-tool { border-top: 1px solid rgba(63, 95, 155, 0.18); }
    .fm-mini .fm-tools .fm-tool + .fm-tool { border-top: 0; border-left: 1px solid rgba(63, 95, 155, 0.18); }
    .fm-rowtools { grid-area: 1 / 1; justify-self: end; align-self: start; display: flex; gap: 2px; margin: 8px 10px; padding: 2px; border-radius: 10px; background: #dfe7f3; transition: opacity 0.15s; }
    .fm-rowtools .fm-tool { flex: none; width: 32px; min-height: 32px; border-radius: 8px; }
    .fm-hov .fm-rowtools { opacity: 0; }
    .fm-hov:hover .fm-rowtools, .fm-hov:focus-within .fm-rowtools { opacity: 1; }
    .im { --ink: #17233d; --mut: #5b6682; --brand: #3f5f9b; --code: #0f6b73; --edge: rgba(23, 35, 61, 0.1); --head: #f3f6fb; --rail: #dde5f1; --pill: #e9eff8; position: relative; box-sizing: border-box; width: 448px; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) var(--tw); overflow: hidden; background: #fff; color: var(--ink); border-radius: 12px; box-shadow: 0 0 0 1px var(--edge), 0 1px 2px rgba(23, 35, 61, 0.06), 0 8px 18px -8px rgba(23, 35, 61, 0.16); }
    .im ::selection { background: #cfdcf2; color: var(--ink); }
    .im :focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
    .im-head { grid-area: 1 / 1; min-width: 0; padding: 14px 16px 12px 10px; background: var(--head); box-shadow: inset 0 1px 0 #fff; display: flex; flex-direction: column; gap: 2px; }
    .im-top { display: flex; align-items: flex-start; gap: 4px; }
    .im-tog { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 0; border-radius: 8px; background: none; color: var(--mut); font-size: 12px; cursor: pointer; transition: background-color 0.15s, color 0.15s; }
    .im-tog:hover { background: var(--pill); color: var(--brand); }
    .im-title { flex: 1; min-width: 0; padding-top: 3px; font-size: 15px; line-height: 22px; font-weight: 600; letter-spacing: -0.005em; text-wrap: pretty; overflow-wrap: anywhere; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; }
    .im-meta { padding-left: 32px; font-size: 12px; line-height: 18px; color: var(--mut); }
    .im-sep { margin: 0 4px; opacity: 0.55; }
    .im-code { color: var(--code); font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0.01em; }
    .im-count { flex: none; margin-top: 2px; padding: 0 8px; border-radius: 10px; background: var(--pill); color: var(--brand); font-size: 12px; line-height: 20px; font-weight: 600; white-space: nowrap; }
    .im-foot { grid-area: 2 / 1; min-width: 0; padding: 12px 16px 14px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--edge); animation: im-in 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
    .im-sum { flex-direction: row; align-items: center; gap: 8px; padding: 9px 16px; }
    .im-names { min-width: 0; color: var(--mut); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .im-row { display: grid; grid-template-columns: 116px minmax(0, 1fr); align-items: baseline; gap: 8px; }
    .im-lab { font-size: 12px; line-height: 22px; color: var(--mut); overflow-wrap: anywhere; }
    .im-vals { display: flex; flex-wrap: wrap; gap: 4px 6px; }
    .im-val { padding: 0 8px; border-radius: 6px; background: var(--pill); font-size: 13px; line-height: 22px; font-variant-numeric: tabular-nums; }
    .im-tools { grid-area: 1 / 2 / 3 / 3; display: flex; flex-direction: column; background: var(--rail); border-left: 1px solid var(--edge); }
    .im-mini .im-tools { flex-direction: row; grid-row: 1; }
    .im-tool { flex: 1; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; border: 0; background: transparent; color: var(--brand); font: inherit; font-size: 12px; line-height: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.15s, color 0.15s; }
    .im-tool + .im-tool { border-top: 1px solid rgba(63, 95, 155, 0.16); }
    .im-mini .im-tool + .im-tool { border-top: 0; border-left: 1px solid rgba(63, 95, 155, 0.16); }
    .im-tool:hover { background: var(--brand); color: #fff; }
    .im-tool.im-del:hover { background: #b3261e; }
    .im-tool:focus-visible { outline-offset: -3px; }
    @keyframes im-in { from { opacity: 0; transform: translateY(-6px); } }
    @media (prefers-reduced-motion: reduce) { .im-foot { animation: none; } .im-tog, .im-tool { transition: none; } }
    .cd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; align-items: start; }
    .cd-headrow { margin-bottom: 8px; font-size: 13px; }
    .cd-row { margin-bottom: 24px; }
    .cd-row code { display: block; margin-bottom: 4px; font-size: 12px; }
    .cd { position: relative; overflow: hidden; box-sizing: border-box; padding: 12px 16px; background: var(--bg); border: var(--bw) solid var(--bd); border-radius: var(--r); box-shadow: var(--sh); }
    .cd-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .cd-main { min-width: 0; }
    .cd-title { font-weight: 600; color: #2b3a55; line-height: 24px; }
    .cd-info { color: #5f6266; font-size: 14px; }
    .cd-act { display: flex; align-items: center; gap: 12px; color: var(--ac); }
    .cd-badge { background: var(--ac); color: #fff; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 10px; white-space: nowrap; }
    .cd-tog { border: 0; background: none; color: var(--ac); cursor: pointer; padding: 4px; }
    .cd-tog:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
    .cd-body { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
    .cd-body.mk-frow { flex-direction: row; }
    .cd .mk-chip { background: var(--ac); text-transform: uppercase; }
    .cd .mk-pill { border-color: var(--ac); }
    .cd-side .cd-act { align-self: stretch; padding-left: 12px; border-left: 1px solid var(--bd); }
    .cd-leftbar { border-left: 6px solid var(--ac); }
    .cd-banded { padding: 0; }
    .cd-banded .cd-head { padding: 12px 16px; background: color-mix(in srgb, var(--ac) 14%, transparent); }
    .cd-banded .cd-body { margin: 0; padding: 10px 16px 14px; background: #fff; }
    .cd-dense { padding: 6px 12px; }
    .cd-dense .cd-main { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }
    .cd-dense .cd-title { line-height: 20px; font-size: 14px; }
    .cd-dense .cd-info { font-size: 12px; }
    .cd-dense .cd-body { margin-top: 4px; }
    .cd-dense .mk-chip, .cd-dense .mk-pill { font-size: 11px; padding: 0 6px; }
    .mk-gripi { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; color: #48659d; cursor: grab; }
    .mk-split-btn { gap: 0; }
    .mk-btn-l { border-radius: 4px 0 0 4px; }
    .mk-btn-r { padding: 0 10px; border-left: 0; border-radius: 0 4px 4px 0; }
    .mk-solidrail { grid-template-columns: minmax(0, 1fr) auto; padding: 16px 0 16px 16px; }
    .mk-rail2 { display: flex; flex-direction: column; margin: -16px 0 -16px 16px; background: #48659d; }
    .mk-rail2 button { flex: 1; width: 48px; border: 0; background: transparent; color: #fff; font-size: 16px; cursor: pointer; }
    .mk-rail2 button + button { border-top: 1px solid rgba(255, 255, 255, 0.3); }
    .mk-rail2 button:hover { background: #2e4884; }
    .mk-cta { margin: 16px -16px -16px; height: 44px; border: 0; border-top: 1px solid #5a79af; background: #fff; color: #2b3a55; font: inherit; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
    .mk-cta:hover { background: #48659d; color: #fff; }
    .mk-stripe { border-left: 4px solid #48659d; }
    .mk-wide { width: auto; padding: 0 12px; gap: 6px; font: inherit; font-size: 14px; font-weight: 600; color: #2b3a55; }
    .mk-seg { gap: 0; }
    .mk-seg .mk-ico { border-radius: 0; margin-left: -1px; }
    .mk-seg .mk-ico:first-child { border-radius: 4px 0 0 4px; margin-left: 0; }
    .mk-seg .mk-ico:last-child { border-radius: 0 4px 4px 0; }
    .mk-titlerow { display: flex; align-items: flex-start; gap: 8px; }
    .mk-nm { margin-left: 0; flex: none; }
    .mk-vis { overflow: visible; margin-bottom: 28px; }
    .mk-float { position: absolute; right: 16px; bottom: -20px; display: flex; gap: 6px; padding: 6px; background: #fff; border: 1px solid #5a79af; border-radius: 24px; box-shadow: var(--shadow-card); }
    .mk-float .mk-ico { border-radius: 50%; }
    .mk-count { display: inline-block; min-width: 20px; padding: 0 6px; border-radius: 10px; background: #48659d; color: #fff; font-size: 12px; line-height: 20px; text-align: center; }
    .mk-btn:hover .mk-count { background: #fff; color: #48659d; }
    .mk-3 { grid-template-columns: auto minmax(0, 1fr) auto; }
    .mk-ord { display: flex; flex-direction: column; gap: 8px; }
    .mk-bar2 { display: flex; gap: 24px; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(90, 121, 175, 0.2); }
    .mk-num { width: 28px; height: 28px; border-radius: 50%; background: #48659d; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .mk-tabbed { margin-top: 36px; }
    .mk-tab { position: absolute; top: -33px; right: 16px; display: flex; gap: 4px; padding: 4px 8px 0; background: #eef2f7; border: 1px solid #5a79af; border-bottom: 0; border-radius: 6px 6px 0 0; }
    .ds { box-sizing: border-box; width: 100%; padding: 16px; background: #eef2f7; border-radius: var(--border-radius-card); box-shadow: 0 0 0 1px #5a79af, var(--shadow-card); color: #2b3a55; font-size: 14px; }
    .ds-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .ds-t { font-weight: 600; line-height: 24px; }
    .ds-n { color: #5f6266; font-weight: 400; }
    .ds-i { color: #5f6266; font-size: 14px; }
    .ds-sec { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(90, 121, 175, 0.2); }
    .ds-head + .ds-sec { margin-top: 8px; }
    .ds-lbl { font-size: 12px; font-weight: 700; color: #48659d; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
    .ds-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
    .ds-sec .ds-row + .ds-row { margin-top: 6px; }
    .ds-chip { background: #48659d; color: #fff; font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
    .ds-pill { border: 1px solid #48659d; background: #fff; font-size: 14px; padding: 1px 8px; border-radius: 4px; }
    .ds-cnt { display: inline-block; padding: 0 8px; border-radius: 10px; background: #48659d; color: #fff; font-size: 12px; line-height: 20px; }
    .ds-warn { background: #8a4b00; }
    .ds-act { display: flex; gap: 8px; }
    .ds-b { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border: 1px solid #48659d; border-radius: 4px; background: #fff; color: #2b3a55; font: inherit; font-weight: 600; cursor: pointer; }
    .ds-b:hover { background: #48659d; color: #fff; }
    .ds-ic { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid #5a79af; border-radius: 4px; background: #fff; color: #48659d; cursor: pointer; }
    .ds-ic:hover { background: #48659d; color: #fff; }
    .ds-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; border: 0; background: transparent; color: #48659d; font: inherit; font-weight: 600; cursor: pointer; padding: 4px 0; }
    .ds-link:hover { text-decoration: underline; }
    .ds-flat { padding: 0; }
    .ds-line { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 16px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
    .ds-line:hover { background: rgba(90, 121, 175, 0.12); }
    .ds-line .ds-t { flex: 1; }
    .ds > .ds-line { margin: -16px -16px 0; width: calc(100% + 32px); }
    .ds-search { display: flex; align-items: center; gap: 6px; height: 32px; padding: 0 8px; border: 1px solid #48659d; border-radius: 4px; background: #fff; color: #48659d; }
    .ds-search input { border: 0; outline: 0; background: transparent; font: inherit; width: 160px; color: #2b3a55; }
    .ds-search:focus-within { box-shadow: 0 0 0 2px #2e4884; }
    .ds-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 12px; margin-top: 12px; }
    .ds-chk { display: flex; align-items: center; gap: 6px; }
    .ds-rm { display: inline-flex; align-items: center; gap: 4px; border: 1px solid #48659d; background: #fff; padding: 1px 4px 1px 8px; border-radius: 4px; }
    .ds-rm button { display: inline-flex; border: 0; background: transparent; color: #48659d; cursor: pointer; padding: 2px; }
    .ds-rm button:hover { color: #b3261e; }
    .ds-add, .ds-more { border: 1px dashed #48659d; background: transparent; color: #48659d; font: inherit; font-weight: 600; padding: 1px 8px; border-radius: 4px; cursor: pointer; }
    .ds-add:hover, .ds-more:hover { background: #48659d; color: #fff; }
    .ds-ref { margin: 12px -16px -16px; padding: 8px 16px; background: rgba(255, 255, 255, 0.6); border-top: 1px solid rgba(90, 121, 175, 0.2); display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .ds-ref a { color: #2e4884; font-weight: 600; }
    .ds-railed { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; padding-left: 0; }
    .ds-rail { display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 4px; margin: -16px 0; padding: 8px; background: rgba(90, 121, 175, 0.18); border-right: 1px solid rgba(90, 121, 175, 0.4); }
    .ds-grip { cursor: grab; color: #48659d; padding: 8px; }
    .ds-tabs { display: flex; gap: 4px; margin-top: 8px; border-bottom: 1px solid rgba(90, 121, 175, 0.4); }
    .ds-tabs button { display: inline-flex; gap: 6px; align-items: center; border: 0; border-bottom: 3px solid transparent; background: transparent; color: #2b3a55; font: inherit; font-weight: 600; padding: 6px 10px; cursor: pointer; }
    .ds-tabs button.on { border-bottom-color: #48659d; }
    .ds-tabs .ds-sec { border-top: 0; }
    .ds-meter { height: 6px; margin-top: 8px; border-radius: 3px; background: #fff; box-shadow: inset 0 0 0 1px #5a79af; overflow: hidden; }
    .ds-meter i { display: block; height: 100%; background: #48659d; }
    .ds-bandw { padding: 0; overflow: hidden; background: #fff; }
    .ds-band { display: flex; justify-content: space-between; gap: 12px; padding: 16px; background: rgba(90, 121, 175, 0.18); border-bottom: 1px solid rgba(90, 121, 175, 0.4); }
    .ds-bandw .ds-sec { margin: 0; padding: 12px 16px; border-top: 0; }
    .ds-fix { background: #eef2f7; }
    .ds-kv { display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; margin: 12px 0 0; }
    .ds-kv dt { font-weight: 700; color: #48659d; }
    .ds-kv dd { margin: 0; }
    .ds-sw { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
    .ds-err { box-shadow: 0 0 0 2px #b3261e, var(--shadow-card); }
    .ds-alert { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; padding: 8px 12px; background: #fff; border-left: 4px solid #b3261e; color: #8c1d18; }
    .ds-alert .ds-b { margin-left: auto; }
    .ds-sent { margin: 12px 0 0; line-height: 1.5; }
    .ds-l { border-radius: 4px 0 0 4px; }
    .ds-r { border-radius: 0 4px 4px 0; border-left: 0; padding: 0 10px; }
    .ds-act:has(.ds-l) { gap: 0; }
    .ds-cta { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 16px -16px -16px; width: calc(100% + 32px); height: 44px; border: 0; border-top: 1px solid #5a79af; background: #fff; color: #2b3a55; font: inherit; font-weight: 600; cursor: pointer; }
    .ds-cta:hover { background: #48659d; color: #fff; }
    .ds-tree { list-style: none; margin: 8px 0 0 8px; padding: 0 0 0 16px; border-left: 2px solid #48659d; }
    .ds-tree li { position: relative; padding: 6px 0; }
    .ds-tree li::before { content: ''; position: absolute; left: -16px; top: 50%; width: 12px; border-top: 2px solid #48659d; }
    .ds-tools { display: flex; gap: 8px; margin-top: 8px; }
    .ds-tools .ds-search { flex: 1; }
    .ds-tools .ds-search input { width: 100%; }
    .variant code { display: block; margin-bottom: 4px; font-size: 12px; }
    .variant ::ng-deep .container::before { background: var(--tint); opacity: var(--op); }
    .variant ::ng-deep .count-badge { color: var(--fg); border-color: var(--fg); }
  `,
})
export class GalleryComponent implements AfterViewInit {
  // /playground/gallery/:component shows one component with all its variants, /playground/gallery shows all
  readonly only = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('component')))
  )
  readonly variant = toSignal(inject(ActivatedRoute).fragment)
  readonly pinnedOpen = signal(true)
  readonly twenty = Array.from({ length: 20 }, (_, i) => i + 1)
  readonly expandedBoxes = signal(new Set<number>())
  toggleBox(n: number): void {
    this.expandedBoxes.update((s) => {
      const t = new Set(s)
      t.delete(n) || t.add(n)
      return t
    })
  }
  tabIndex(ids: string[]): number {
    return Math.max(0, ids.indexOf(this.variant() ?? ''))
  }
  // only the real button variants filter the pinned buttons; design fragments just pick a tab
  showsButton(id: string): boolean {
    const v = this.variant()
    return !v?.startsWith('num-button-') || v === id
  }
  // the green shade/technique tabs belong to the green menu items only, not to the general num-button page
  showsGreenTabs(): boolean {
    return ['num-button-green', 'green-button-shades', 'green-button-techniques'].includes(
      this.variant() ?? ''
    )
  }
  shows(key: string): boolean {
    return !this.only() || this.only() === key
  }
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
  readonly tableData: TableData = {
    header: {
      headers: [
        { label: 'Name', addAllCheckbox: false },
        { label: 'Code', addAllCheckbox: false },
      ],
    },
    body: {
      rows: [
        ['Hauptdiagnose', 'I10'],
        ['Nebendiagnose', 'I11'],
        ['Prozedur', '5-470'],
      ].map(([name, code]) => ({
        id: code,
        // ponytail: placeholder row, the gallery never reads originalEntry
        originalEntry: undefined as never,
        cells: [
          { type: TableCellKind.TEXT, value: name },
          { type: TableCellKind.TEXT, value: code },
        ],
      })),
    },
  }
  readonly selectedItems = [
    { display: this.display('Hauptdiagnose', 'Main diagnosis'), code: 'I10' },
    { display: this.display('Nebendiagnose', 'Secondary diagnosis'), code: 'I11' },
  ]

  // white disabled buttons on the action bar: softer ways to say "not available"
  readonly whiteDisabled = [
    ['ring 1px green', '#fff', '#9bb823', '0 0 0 1px #9bb823', 1],
    ['ring 1px green @0.5', '#fff', '#9bb823', '0 0 0 1px rgba(155,184,35,.5)', 1],
    ['ring 1px green @0.3', '#fff', '#9bb823', '0 0 0 1px rgba(155,184,35,.3)', 1],
    ['no ring, icon green', '#fff', '#9bb823', 'none', 1],
    ['no ring, icon green @0.5', '#fff', '#9bb823', 'none', 0.5],
    ['no ring, icon grey', '#fff', '#a8a8a8', 'none', 1],
    ['ring grey, icon grey', '#fff', '#a8a8a8', '0 0 0 1px #d0d0d0', 1],
    ['ring grey, icon green', '#fff', '#9bb823', '0 0 0 1px #d0d0d0', 1],
    ['ring light green, icon grey', '#fff', '#a8a8a8', '0 0 0 1px rgba(155,184,35,.4)', 1],
    ['whole button @0.6', '#fff', '#9bb823', '0 0 0 1px #9bb823', 0.6],
    ['whole button @0.4', '#fff', '#9bb823', '0 0 0 1px #9bb823', 0.4],
    ['whole button @0.4, no ring', '#fff', '#9bb823', 'none', 0.4],
    ['soft shadow only', '#fff', '#9bb823', '0 1px 3px rgba(0,0,0,.12)', 1],
    ['soft shadow, icon @0.5', '#fff', '#9bb823', '0 1px 3px rgba(0,0,0,.12)', 0.5],
    ['soft shadow + ring grey', '#fff', '#a8a8a8', '0 0 0 1px #e0e0e0, 0 1px 3px rgba(0,0,0,.1)', 1],
    ['inner ring green @0.4', '#fff', '#9bb823', 'inset 0 0 0 1px rgba(155,184,35,.4)', 1],
    ['inner shadow (sunken)', '#fff', '#9bb823', 'inset 0 1px 3px rgba(0,0,0,.18)', 1],
    ['off-white #fafafa, ring grey', '#fafafa', '#a8a8a8', '0 0 0 1px #e0e0e0', 1],
    ['off-white #f5f8ea, ring green @0.3', '#f5f8ea', '#9bb823', '0 0 0 1px rgba(155,184,35,.3)', 1],
    ['dark green icon @0.4, no ring', '#fff', '#566a0e', 'none', 0.4],
  ].map(([label, bg, fg, sh, op]) => ({ label, bg, fg, sh, op }))

  // best-of white disabled: icon contrast >= 4.5 where possible (#566a0e, #757575), ring keeps the shape visible
  readonly whiteDisabledBest = [
    ['1 ring green, icon dark green', '#566a0e', '0 0 0 1px #9bb823', 1],
    ['2 ring green @0.6, icon #6b8210', '#6b8210', '0 0 0 1px rgba(155,184,35,.6)', 1],
    ['3 ring dark green @0.4, icon dark green', '#566a0e', '0 0 0 1px rgba(86,106,14,.4)', 1],
    ['4 ring grey, icon grey (AA)', '#757575', '0 0 0 1px #bdbdbd', 1],
    ['5 ring grey, icon dark green', '#566a0e', '0 0 0 1px #bdbdbd', 1],
    ['6 soft shadow, icon #6b8210', '#6b8210', '0 1px 3px rgba(0,0,0,.15)', 1],
    ['7 dashed green outline, icon #6b8210', '#6b8210', 'none', 1, '1px dashed #9bb823'],
    ['8 dashed grey outline, icon grey', '#757575', 'none', 1, '1px dashed #9e9e9e'],
    ['9 ring green + soft shadow', '#566a0e', '0 0 0 1px #9bb823, 0 1px 3px rgba(0,0,0,.12)', 1],
    ['10 ring green @0.5 + inner ring', '#6b8210', '0 0 0 1px rgba(155,184,35,.5), inset 0 0 0 1px rgba(155,184,35,.25)', 1],
    ['11 whole button @0.7, ring green', '#566a0e', '0 0 0 1px #9bb823', 0.7],
    ['12 ring 2px green @0.3', '#6b8210', '0 0 0 2px rgba(155,184,35,.3)', 1],
    ['13 whole button @0.8, ring green', '#6b8210', '0 0 0 1px #9bb823', 0.8],
    ['14 ring light green, icon #6b8210', '#6b8210', '0 0 0 1px #c5d37a', 1],
    ['15 ring light green, icon grey', '#757575', '0 0 0 1px #c5d37a', 1],
    ['16 inner ring light green', '#6b8210', 'inset 0 0 0 1px #c5d37a', 1],
    ['17 ring light green + shadow, icon dark', '#566a0e', '0 0 0 1px #c5d37a, 0 2px 4px rgba(0,0,0,.08)', 1],
    ['18 dotted green outline', '#566a0e', 'none', 0.8, '1px dotted #6b8210'],
    ['19 ring green + white halo', '#566a0e', '0 0 0 1px #9bb823, 0 0 0 3px #fff', 1],
    ['20 double ring light green', '#6b8210', '0 0 0 1px #c5d37a, 0 0 0 2px #fff, 0 0 0 3px #c5d37a', 1],
  ].map(([label, fg, sh, op, ol]) => ({ label, bg: '#fff', fg, sh, op, ol }))

  readonly redesigns = ['pill', 'segment', 'glass', 'labeled', 'stripe', 'dock']
  readonly redesigns2 = ['neon', 'ticket', 'paper', 'terminal', 'retro', 'neumorph', 'gradborder', 'fab', 'folder', 'slide', 'stamp', 'chips', 'cards', 'ribbon', 'hairline', 'track', 'blueprint', 'candy', 'glasslight', 'brutal']
  readonly segments = ['seg rd-seg-outline', 'seg rd-seg-pill', 'seg rd-seg-filled', 'seg rd-seg-underline', 'seg rd-seg-split']
  readonly aeros = ['aero rd-aero-glass', 'aero rd-aero-orb', 'aero rd-aero-taskbar', 'aero rd-aero-explorer', 'aero rd-aero-gel', 'aero rd-aero-frame']
  readonly glassVariants = [
 {
  label: "1 current look: tint bar, outlined icon buttons",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "2 + glass edge (light border, inset highlight)",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "1px solid rgba(255,255,255,.8)",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px, inset 0 1px 0 #fff",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "3 glass gradient bar",
  vars: {
   "--bb": "linear-gradient(rgba(155,184,35,.28), rgba(155,184,35,.08))",
   "--bbd": "1px solid rgba(255,255,255,.9)",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px, inset 0 1px 0 #fff",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "4 segment, white, green outline",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "1px solid #9bb823",
   "--grad": "5px",
   "--gbg": "transparent",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "0",
   "--rad": "0",
   "--bg": "#fff",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "5 segment, translucent glass",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "1px solid rgba(255,255,255,.8)",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px, inset 0 1px 0 #fff",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "1px solid rgba(255,255,255,.9)",
   "--grad": "5px",
   "--gbg": "transparent",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "0",
   "--rad": "0",
   "--bg": "rgba(255,255,255,.55)",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "6 segment, tinted buttons",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "1px solid #9bb823",
   "--grad": "5px",
   "--gbg": "transparent",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "0",
   "--rad": "0",
   "--bg": "rgba(155,184,35,.14)",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "7 separate, icon + label",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "auto",
   "--px": "16px",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "inline",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "8 segment, icon + label",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "1px solid #9bb823",
   "--grad": "5px",
   "--gbg": "transparent",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "auto",
   "--px": "16px",
   "--bd": "0",
   "--rad": "0",
   "--bg": "#fff",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "inline",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "9 soft: radius 12, white glass buttons",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "12px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid rgba(255,255,255,.95)",
   "--rad": "8px",
   "--bg": "rgba(255,255,255,.6)",
   "--fg": "#566a0e",
   "--sh": "0 1px 3px rgba(0,0,0,.12)",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid rgba(255,255,255,.95)"
  }
 },
 {
  label: "10 pill bar, round buttons",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "999px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "50%",
   "--bg": "rgba(255,255,255,.6)",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "11 stronger tint with green edge",
  vars: {
   "--bb": "rgba(155,184,35,.25)",
   "--bbd": "1px solid rgba(155,184,35,.55)",
   "--bsh": "none",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "12 frosted white bar, green edge",
  vars: {
   "--bb": "rgba(255,255,255,.7)",
   "--bbd": "1px solid #9bb823",
   "--bsh": "0 4px 14px rgba(86,106,14,.18)",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "13 vertical tint gradient",
  vars: {
   "--bb": "linear-gradient(rgba(155,184,35,.25), rgba(155,184,35,.06))",
   "--bbd": "none",
   "--bsh": "none",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "14 raised white buttons",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "0",
   "--rad": "5px",
   "--bg": "#fff",
   "--fg": "#566a0e",
   "--sh": "0 1px 3px rgba(0,0,0,.22)",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "15 segment, white, soft shadow",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "0",
   "--grad": "5px",
   "--gbg": "#fff",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "0",
   "--rad": "0",
   "--bg": "#fff",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "16 segment pill",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "1px solid #9bb823",
   "--grad": "999px",
   "--gbg": "transparent",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "46px",
   "--px": "6px",
   "--bd": "0",
   "--rad": "0",
   "--bg": "rgba(255,255,255,.5)",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 },
 {
  label: "17 flat tint, no shadow",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "none",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid #9bb823",
   "--rad": "5px",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid #9bb823"
  }
 },
 {
  label: "18 embossed bar and buttons",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "1px solid rgba(86,106,14,.2)",
   "--bsh": "inset 0 1px 0 #fff, inset 0 -1px 0 rgba(86,106,14,.25)",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid rgba(86,106,14,.35)",
   "--rad": "5px",
   "--bg": "linear-gradient(#fff, #eef3d6)",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "1px solid rgba(86,106,14,.35)"
  }
 },
 {
  label: "19 dark green bar, light buttons",
  vars: {
   "--bb": "rgba(63,79,10,.92)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "8px",
   "--gbd": "none",
   "--grad": "0",
   "--gbg": "transparent",
   "--ov": "visible",
   "--h": "46px",
   "--w": "46px",
   "--px": "0",
   "--bd": "1px solid rgba(255,255,255,.5)",
   "--rad": "5px",
   "--bg": "rgba(255,255,255,.14)",
   "--fg": "#fff",
   "--sh": "none",
   "--pb": "#fff",
   "--pf": "#566a0e",
   "--lab": "none",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#fff",
   "--div": "1px solid rgba(255,255,255,.5)"
  }
 },
 {
  label: "20 text segment",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--brad": "5px",
   "--gap": "0",
   "--gbd": "1px solid #9bb823",
   "--grad": "5px",
   "--gbg": "transparent",
   "--ov": "hidden",
   "--h": "46px",
   "--w": "auto",
   "--px": "16px",
   "--bd": "0",
   "--rad": "0",
   "--bg": "transparent",
   "--fg": "#566a0e",
   "--sh": "none",
   "--pb": "#9bb823",
   "--pf": "#fff",
   "--lab": "inline",
   "--dfg": "#767676",
   "--dbd": "#d6d6d6",
   "--tx": "#2f3b08",
   "--div": "0"
  }
 }
]
  readonly splitVariants = [
 {
  label: "1 current look: tint bar, white plate, green slanted upload",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--pl": "#fff",
   "--plbd": "none",
   "--plsh": "0 1px 3px rgba(0,0,0,.14)",
   "--prad": "5px",
   "--pbg": "#9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "2 glass edge on plate",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "1px solid rgba(255,255,255,.8)",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--pl": "#fff",
   "--plbd": "1px solid rgba(255,255,255,.9)",
   "--plsh": "0 1px 3px rgba(0,0,0,.14), inset 0 1px 0 #fff",
   "--prad": "5px",
   "--pbg": "#9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "3 glass gradient bar, translucent plate",
  vars: {
   "--bb": "linear-gradient(rgba(155,184,35,.28), rgba(155,184,35,.08))",
   "--bbd": "1px solid rgba(255,255,255,.9)",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px, inset 0 1px 0 #fff",
   "--pl": "rgba(255,255,255,.65)",
   "--plbd": "1px solid rgba(255,255,255,.95)",
   "--plsh": "0 1px 3px rgba(0,0,0,.14)",
   "--prad": "5px",
   "--pbg": "#9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "4 soft sheen on the green segment",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--pl": "#fff",
   "--plbd": "1px solid rgba(255,255,255,.9)",
   "--plsh": "0 1px 3px rgba(0,0,0,.14)",
   "--prad": "5px",
   "--pbg": "linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,0) 60%), #9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "5 icon + label",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--pl": "#fff",
   "--plbd": "none",
   "--plsh": "0 1px 3px rgba(0,0,0,.14)",
   "--prad": "5px",
   "--pbg": "#9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
   "--lab": "inline",
   "--px": "14px",
   "--w": "auto",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "6 no outer bar, plate only",
  vars: {
   "--bb": "transparent",
   "--bbd": "none",
   "--bsh": "none",
   "--pl": "#fff",
   "--plbd": "none",
   "--plsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--prad": "5px",
   "--pbg": "#9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "7 slant leaning the other way",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--pl": "#fff",
   "--plbd": "none",
   "--plsh": "0 1px 3px rgba(0,0,0,.14)",
   "--prad": "5px",
   "--pbg": "#9bb823",
   "--pfg": "#fff",
   "--sl": "14px",
   "--clip": "polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 },
 {
  label: "8 steeper slant, dark green gradient",
  vars: {
   "--bb": "rgba(155,184,35,.15)",
   "--bbd": "none",
   "--bsh": "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px",
   "--pl": "#fff",
   "--plbd": "none",
   "--plsh": "0 1px 3px rgba(0,0,0,.14)",
   "--prad": "5px",
   "--pbg": "linear-gradient(#7f9a1c, #566a0e)",
   "--pfg": "#fff",
   "--sl": "24px",
   "--clip": "polygon(0 0, 100% 0, calc(100% - 24px) 100%, 0 100%)",
   "--lab": "none",
   "--px": "6px",
   "--w": "46px",
   "--h": "46px",
   "--fg": "#566a0e",
   "--tx": "#2f3b08"
  }
 }
]
  readonly rdActions = [
    { icon: 'upload', label: 'Upload' },
    { icon: 'download', label: 'Download' },
    { icon: 'save', label: 'Save' },
  ] as const

  readonly barVariants = (() => {
    const out = []
    for (const tint of ['#9bb823', '#7a9a1c']) {
      for (const opacity of [0.06, 0.1, 0.15]) {
        for (const fg of ['#9bb823', '#6b8210', '#566a0e', '#3f4f0a']) {
          const ratio = contrast(fg, blendOnWhite(tint, opacity))
          out.push({
            tint,
            opacity,
            fg,
            ratio: ratio.toFixed(2),
            verdict: rate(ratio),
            label: `tint ${tint} @${opacity} · fg ${fg}`,
          })
        }
      }
    }
    return out
  })()

  // box bg = --color-accent-bg over white (criteria-box, data-selection-boxes); hover = side-menu tint
  readonly chipVariants = (() => {
    const box = '#eef2f7'
    const hov = '#e1e7f1'
    const a500 = '#5a79af'
    const a700 = '#48659d'
    const a900 = '#2e4884'
    return [
      {
        name: 'current: transparent, accent-500 @0.2',
        border: blend(a500, 0.2, box),
        fill: 'transparent',
        text: a500,
      },
      { name: '1 solid accent-500 border', border: a500, fill: 'transparent', text: a500 },
      { name: '2 solid accent-700 border', border: a700, fill: 'transparent', text: a700 },
      { name: '3 solid accent-900 border + text', border: a900, fill: 'transparent', text: a900 },
      { name: '4 white fill + accent-500 border', border: a500, fill: '#ffffff', text: a900 },
      { name: '5 white fill + accent-700 border', border: a700, fill: '#ffffff', text: a900 },
      { name: '6 white fill + grey-700 border', border: '#7c8b98', fill: '#ffffff', text: a900 },
      {
        name: '7 white fill + 2px accent-500 border',
        border: a500,
        fill: '#ffffff',
        text: a900,
        bw: '2px',
      },
      { name: '8 filled accent-700, white text', border: a700, fill: a700, text: '#ffffff' },
    ].map((v) => ({
      bw: '1px',
      ...v,
      onBox: fmt(contrast(v.border, box)),
      onHover: fmt(contrast(v.border, hov)),
      textRatio: fmt(contrast(v.text, v.fill === 'transparent' ? box : v.fill)),
    }))
  })()

  // criteria-box edge vs white page; fill #eef2f7 = --color-accent-bg over white
  readonly criteriaVariants = (() => {
    const fill = '#eef2f7'
    const a500 = '#5a79af'
    const a700 = '#48659d'
    const grey = '#7c8b98'
    const none = 'none'
    return [
      { name: 'current: fill only', edge: fill },
      { name: '1 1px accent-500 border', edge: a500, border: a500 },
      { name: '2 1px accent-700 border', edge: a700, border: a700 },
      { name: '3 2px accent-500 border', edge: a500, border: a500, bw: '2px' },
      { name: '4 white fill + 1px accent-500', edge: a500, border: a500, fill: '#ffffff' },
      { name: '5 1px grey-700 border', edge: grey, border: grey },
      { name: '6 4px accent-700 left bar', edge: a700, shadow: `inset 4px 0 0 ${a700}` },
      {
        name: '7 1px accent-500 + soft shadow',
        edge: a500,
        border: a500,
        shadow: '0 1px 4px rgba(0,0,0,.25)',
      },
      { name: '8 shadow only (not measurable)', edge: fill, shadow: '0 1px 4px rgba(0,0,0,.45)' },
    ].map((v) => ({
      fill,
      border: 'transparent',
      bw: '1px',
      shadow: none,
      ...v,
      ratio: fmt(contrast(v.edge, '#ffffff')),
    }))
  })()

  // bar background from the action-bar variant chosen above (#9bb823 @0.15)
  readonly greenShades = ['#9bb823', '#8aa51a', '#839e00', '#6b8210', '#566a0e', '#3f4f0a'].map(
    (bg) => {
      const hover = mixBlack(bg, 0.15)
      return {
        bg,
        hover,
        label: fmt(contrast('#ffffff', bg)),
        onBar: fmt(contrast(bg, '#f0f4de')),
        hoverLabel: fmt(contrast('#ffffff', hover)),
      }
    }
  )

  // bar = #f0f4de (tint #9bb823 @0.15)
  readonly techniques = [
    { name: 'current: white on green', bg: '#9bb823', fg: '#ffffff' },
    { name: '1 dark text', bg: '#9bb823', fg: '#1f1f1f' },
    {
      name: '1+2 dark text + 1px ring',
      bg: '#9bb823',
      fg: '#1f1f1f',
      ring: '#566a0e',
      ringWidth: '1px',
    },
    {
      name: '1+2 dark text + 2px ring',
      bg: '#9bb823',
      fg: '#1f1f1f',
      ring: '#3f4f0a',
      ringWidth: '2px',
    },
    {
      name: '3 white bold 14px on green-3',
      bg: '#839e00',
      fg: '#ffffff',
      weight: '700',
      size: '14px',
    },
    {
      name: '2+3 white bold 14px + ring',
      bg: '#839e00',
      fg: '#ffffff',
      weight: '700',
      size: '14px',
      ring: '#3f4f0a',
      ringWidth: '2px',
    },
    { name: '4 white on darker fill', bg: '#566a0e', fg: '#ffffff' },
  ].map((t) => {
    const ring = t.ring ?? 'transparent'
    return {
      weight: '400',
      size: '16px',
      ringWidth: '0px',
      ...t,
      ring,
      hover: mixBlack(t.bg, 0.15),
      text: fmt(contrast(t.fg, t.bg)),
      fillBar: fmt(contrast(t.bg, '#f0f4de')),
      ringBar: t.ring ? fmt(contrast(t.ring, '#f0f4de')) : '–',
    }
  })

  readonly open18 = signal(true)
  readonly dsFields = ['Code', 'Beginn', 'Ende', 'Schweregrad', 'Status', 'Kategorie']
  readonly dsAllFields = [
    ...this.dsFields,
    'Notiz',
    'Ort',
    'Autor',
    'Evidenz',
    'Stadium',
    'Körperstelle',
    'Verifizierung',
    'Kontext',
  ].map((n, i) => ({ n, on: i < this.dsFields.length }))

  readonly cdLevels = [
    { level: 2, label: 'Full details', hint: 'everything, as today' },
    { level: 1, label: 'Reduced details', hint: 'info line + filter names with count' },
    { level: 0, label: 'Only needed', hint: 'title + filter count' },
  ]
  readonly cnNames = 'Schweregrad · Terminologie-Codes · Zwischen'
  readonly cnValues = 'Leicht, Schwer · I10, I11 · 01.01.2020 – 31.12.2024'
  readonly cnDesigns: { name: string; cls: string; info: boolean; s1: string; s0: string }[] = [
    { name: 'one-line list row', cls: 'row', info: true, s1: 'badge', s0: 'count' },
    { name: 'pill', cls: 'pill', info: false, s1: 'count', s0: 'count' },
    { name: 'small tile', cls: 'tile', info: true, s1: 'badge', s0: 'count' },
    { name: 'accent strip', cls: 'strip', info: true, s1: 'dots', s0: 'dots' },
    { name: 'table row (columns)', cls: 'table', info: true, s1: 'values', s0: 'text' },
    { name: 'arrow tag', cls: 'tag', info: false, s1: 'count', s0: 'none' },
    { name: 'split: title | filters', cls: 'split', info: true, s1: 'names', s0: 'badge' },
    { name: 'filter segment bar', cls: 'bar', info: true, s1: 'bar', s0: 'bar' },
    { name: 'underline only', cls: 'underline', info: true, s1: 'text', s0: 'count' },
    { name: 'dashed outline, first filter + more', cls: 'dashed', info: true, s1: 'more', s0: 'badge' },
    { name: 'chip cloud', cls: 'cloud', info: false, s1: 'names', s0: 'count' },
    { name: 'accordion (chevron left)', cls: 'accordion', info: true, s1: 'badge', s0: 'badge' },
    { name: 'corner badge', cls: 'corner', info: true, s1: 'count', s0: 'count' },
    { name: 'leading icon', cls: 'icon', info: true, s1: 'badge', s0: 'count' },
    { name: 'info right-aligned', cls: 'right', info: true, s1: 'text', s0: 'dots' },
    { name: 'ticket with code stub', cls: 'ticket', info: false, s1: 'badge', s0: 'count' },
    { name: 'hover reveals details', cls: 'hover', info: true, s1: 'badge', s0: 'count' },
    { name: 'two lines, values ellipsis', cls: 'twoline', info: false, s1: 'values', s0: 'none' },
    { name: 'footer bar', cls: 'footer', info: true, s1: 'names', s0: 'badge' },
    { name: 'narrow stack', cls: 'stack', info: false, s1: 'names', s0: 'count' },
  ]
  readonly dcTools: Record<string, { icon: string; label: string }> = {
    e: { icon: 'pencil-alt', label: 'Ändern' },
    c: { icon: 'clone', label: 'Kopieren' },
    d: { icon: 'trash', label: 'Löschen' },
    g: { icon: 'expand-arrows-alt', label: 'Ziehen' },
  }
  // one config per detail level [only needed, reduced, full]: tools column position, tools (e edit, c copy,
  // d delete, g grip), labels under glyph, info line, filter display, extra (k kebab, g 2x2 grid)
  private static dc(col: string, t: string, lab: number, info: number, f: string, x = '') {
    return { col, t: t.split(''), lab: !!lab, info: !!info, f, kebab: x === 'k', grid: x === 'g' }
  }
  readonly dcVariants = (() => {
    const d = GalleryComponent.dc
    return [
      { name: 'fewer tools: 4 → 2 → 1', lv: [d('right', 'g', 1, 0, 'count'), d('right', 'eg', 1, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'labels drop, tools stay', lv: [d('right', 'eg', 0, 0, 'none'), d('right', 'ecdg', 0, 1, 'values'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'collapse into kebab', lv: [d('right', '', 0, 0, 'count', 'k'), d('right', 'e', 1, 1, 'names', 'k'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'column becomes bottom bar', lv: [d('none', '', 0, 0, 'count'), d('bottom', 'ecdg', 1, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: '2×2 tool grid at full', lv: [d('right', 'g', 0, 0, 'count'), d('right', 'eg', 1, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows', 'g')] },
      { name: 'column on the left (rail)', lv: [d('left', 'g', 0, 0, 'count'), d('left', 'ecdg', 0, 1, 'names'), d('left', 'ecdg', 1, 1, 'rows')] },
      { name: 'text compacts, tools unchanged', lv: [d('right', 'ecdg', 1, 0, 'count'), d('right', 'ecdg', 1, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'tools compact, text unchanged', lv: [d('right', 'g', 0, 1, 'rows'), d('right', 'eg', 0, 1, 'rows'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'no tools until expanded', lv: [d('none', '', 0, 0, 'none'), d('right', 'e', 0, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'values line instead of chips', lv: [d('right', 'g', 0, 0, 'none'), d('right', 'eg', 1, 1, 'values'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'bottom bar only at reduced', lv: [d('right', 'g', 0, 0, 'count'), d('bottom', 'eg', 1, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows')] },
      { name: 'left rail only at minimal', lv: [d('left', 'g', 0, 0, 'count'), d('right', 'eg', 1, 1, 'names'), d('right', 'ecdg', 1, 1, 'rows')] },
    ]
  })()
  // rail/col: grip rail and tools column span the full height or only the dark header
  // lab: labels under the glyph per level [minimal, reduced, full]
  // f0: minimal shows 'badge' (count in header), 'foot' (count in footer) or nothing; f1/f2: reduced/full filter display
  readonly fbVariants = [
    { name: 'base', rail: 'full', col: 'full', lab: [0, 1, 1], f0: 'badge', f1: 'names', f2: 'rows', white: false },
    { name: 'icons only below full', rail: 'full', col: 'full', lab: [0, 0, 1], f0: 'badge', f1: 'names', f2: 'rows', white: false },
    { name: 'labels always (Ziehen, Menü)', rail: 'full', col: 'full', lab: [1, 1, 1], f0: 'badge', f1: 'names', f2: 'rows', white: false },
    { name: 'rail + tools only in dark header', rail: 'head', col: 'head', lab: [0, 1, 1], f0: 'foot', f1: 'names', f2: 'rows', white: false },
    { name: 'rail full, tools in header only', rail: 'full', col: 'head', lab: [0, 1, 1], f0: 'badge', f1: 'names', f2: 'rows', white: false },
    { name: 'rail in header only, tools full', rail: 'head', col: 'full', lab: [0, 1, 1], f0: 'badge', f1: 'names', f2: 'rows', white: false },
    { name: 'values line at reduced, footer gone at minimal', rail: 'full', col: 'full', lab: [0, 1, 1], f0: 'none', f1: 'values', f2: 'rows', white: false },
    { name: 'inline chips at full, count footer at minimal', rail: 'full', col: 'full', lab: [0, 1, 1], f0: 'foot', f1: 'names', f2: 'chips', white: false },
    { name: 'white footer', rail: 'full', col: 'full', lab: [0, 1, 1], f0: 'badge', f1: 'names', f2: 'rows', white: true },
  ]
  // info: where I10 / ICD-10-GM sit (tags in header, coloured text, tags in footer, eyebrow + tags in footer)
  // lab: labels under the glyph at reduced; f1: reduced footer shows filter names or a values line
  readonly fcVariants = [
    { name: 'info tags in header', info: 'tags', lab: true, f1: 'names' },
    { name: 'info tags in header, icons only at reduced', info: 'tags', lab: false, f1: 'names' },
    { name: 'info as coloured text', info: 'text', lab: true, f1: 'names' },
    { name: 'info tags in filter section', info: 'footer', lab: true, f1: 'names' },
    { name: 'info tags in filter section, values line at reduced', info: 'footer', lab: true, f1: 'values' },
    { name: 'eyebrow "Diagnose" + code tags in filter section', info: 'eyebrow', lab: true, f1: 'names' },
  ]
  // tools: 'col' labelled column, 'icons' icon column, 'row' icon row in header, 'hover' icon row shown on hover/focus
  readonly fmVariants = [
    { name: 'quiet column, labelled', tools: 'col', edge: false },
    { name: 'quiet column, icons only', tools: 'icons', edge: false },
    { name: 'icon row in header', tools: 'row', edge: false },
    { name: 'icon row, shown on hover/focus', tools: 'hover', edge: false },
    { name: 'labelled column + accent edge', tools: 'col', edge: true },
  ]
  private static readonly imItem = {
    title: 'Hypertonie mit vielen Filtern',
    type: 'Diagnose',
    code: 'I10',
    system: 'ICD-10-GM',
    filters: [
      { type: 'Schweregrad', values: ['Leicht', 'Schwer'] },
      { type: 'Terminologie-Codes', values: ['I10', 'I11'] },
      { type: 'Zwischen', values: ['Von 01.01.2020 bis 31.12.2024'] },
    ],
  }
  readonly imRows = [
    { name: 'labelled rail', lab: true, item: GalleryComponent.imItem },
    { name: 'icon-only rail (tooltips)', lab: false, item: GalleryComponent.imItem },
    {
      name: 'stress test: long title, many values',
      lab: true,
      item: {
        title: 'Harnstoff-Stickstoff [Masse/Volumen] in venösem Blut und weiteren Körperflüssigkeiten',
        type: 'Laboruntersuchung',
        code: '12962-7',
        system: 'LOINC',
        filters: [
          { type: 'Wert', values: ['90 – 140 mmHg'] },
          { type: 'Schweregrad', values: ['Leicht', 'Mittel', 'Schwer', 'Lebensbedrohlich'] },
          { type: 'Zeitraum', values: ['Von 01.01.2020 bis 31.12.2024'] },
        ],
      },
    },
  ]
  imNames(item: { filters: { type: string }[] }): string {
    return item.filters.map((f) => f.type).join(' · ')
  }
  readonly cdFilters = [
    { type: 'Schweregrad', values: ['Leicht', 'Schwer'] },
    { type: 'Terminologie-Codes', values: ['I10', 'I11'] },
    { type: 'Zwischen', values: ['Von 01.01.2020 bis 31.12.2024'] },
  ]
  // 5 layouts x 4 skins = 20 designs
  private static readonly cdSkins = [
    { n: 'classic', bg: '#eef2f7', bd: '#5a79af', ac: '#48659d', r: '8px', bw: '1px', sh: 'var(--shadow-card)' },
    { n: 'white', bg: '#fff', bd: '#c5d0e3', ac: '#48659d', r: '4px', bw: '1px', sh: '0 1px 2px rgba(0,0,0,.12)' },
    { n: 'flat', bg: '#f4f6fa', bd: 'transparent', ac: '#2b3a55', r: '12px', bw: '1px', sh: 'none' },
    { n: 'bold', bg: '#fff', bd: '#48659d', ac: '#48659d', r: '2px', bw: '2px', sh: 'none' },
  ]
  readonly cdDesigns = ([] as { name: string; layout: string; skin: (typeof GalleryComponent.cdSkins)[number] }[]).concat(
    ...['side', 'top', 'leftbar', 'banded', 'dense'].map((layout) =>
      GalleryComponent.cdSkins.map((skin) => ({ name: `${layout} · ${skin.n}`, layout, skin }))
    )
  )
  // key `${design}-${card level}` -> card is swapped to the other level
  private readonly cdSwapped = signal(new Set<string>())
  cdLevel(design: number, level: number): number {
    return this.cdSwapped().has(`${design}-${level}`) ? (level === 2 ? 0 : 2) : level
  }
  cdToggle(design: number, level: number): void {
    const k = `${design}-${level}`
    this.cdSwapped.update((s) => {
      const t = new Set(s)
      t.delete(k) || t.add(k)
      return t
    })
  }

  readonly mockFilters = [
    { type: 'VOR', values: ['07.10.2026'] },
    { type: 'Schweregrad', values: ['Leicht', 'Mittel', 'Schwer'] },
    { type: 'Blutdruck', values: ['90 – 140 mmHg'] },
    { type: 'Zeitraum', values: ['01.01.2020 – 31.12.2024'] },
  ]

  readonly states = Object.keys(STATES) as State[]
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage')
  private readonly forced = signal<State[]>([])
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly live = document.createElement('style')
  // one entry per component on the open page (a page can cover several components)
  readonly usageSets = signal<UsageSet[]>([])
  shortFile(f: string): string {
    return f.split('/').pop() ?? f
  }
  readonly cssOpen = signal(false)
  readonly loaded = signal('')
  private readonly css = signal('')
  readonly html = computed(() => highlight(this.css()))

  constructor() {
    // usage lists for the open page's components (served by scripts/playground-tabs.cjs)
    effect(() => {
      const page = this.only()
      const v = this.variant()
      // button variants filter by type; the other variant ids (disabled, tabs) show all uses
      const type = page === 'num-button' ? /^num-button-(blue|green|red|cancel)$/.exec(v ?? '')?.[1] : undefined
      const tags = galleryComponents.filter((c) => c.page === page).map((c) => c.name)
      const sets: UsageSet[] = tags.map((tag) => ({ tag, count: null, failed: false, groups: [] }))
      this.usageSets.set(sets)
      tags.forEach((tag, i) => {
        const q = new URLSearchParams({ tag, ...(tag === 'num-button' && type && { type }) })
        fetch(`/playground-api/usages?${q}`, { headers: { 'X-Playground': '1' } })
          .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
          .then((list: Usage[]) => (sets[i] = { tag, count: list.length, failed: false, groups: groupUsages(list) }))
          .catch(() => (sets[i] = { tag, count: null, failed: true, groups: [] })) // helper not running or outdated
          .then(() => this.usageSets.set([...sets]))
      })
    })
    // reload once the new component page is rendered
    effect(() => {
      this.only()
      this.variant()
      setTimeout(() => this.loadCss())
    })
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
    this.live.dataset['pgLive'] = ''
    document.head.append(this.live)
    this.loadCss()
  }

  // Lists every top-level rule that matches something inside the stage; edits go to a <style> appended last.
  // ponytail: no @media/@supports rules, and a rule matches if any stage element does (pseudo-parts ignored).
  loadCss(): void {
    this.live.textContent = ''
    const stage = this.stage().nativeElement
    // the active tab's content if the page has tabs, else the open component's host element(s), else the whole stage
    // a variant picked in the side menu (#fragment) wins: its section/tab, or the pinned row for button variants
    const v = this.variant()
    const target = v ? stage.querySelector(`#${CSS.escape(v)}`) : null
    const tabs = Array.from(stage.querySelectorAll('.mat-mdc-tab-body-active'))
    const roots = target
      ? [target.closest('.mat-mdc-tab-body, section') ?? target]
      : v
        ? [stage.querySelector('.pinned-body') ?? stage]
        : tabs.length
          ? tabs
          : this.only()
            ? Array.from(stage.querySelectorAll(this.only() as string))
            : [stage]
    const hits = (sel: string): boolean =>
      roots.some((r) => r.matches(sel) || r.querySelector(sel) !== null)
    const out: string[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      if (sheet.ownerNode === this.live) continue
      try {
        for (const r of Array.from(sheet.cssRules)) {
          if (!(r instanceof CSSStyleRule) || r.selectorText.includes('.pg-')) continue
          try {
            const sel = r.selectorText.replace(PSEUDO_ANY, '')
            // skip bare element selectors (resets like `button`): they match everything
            if (/[.#[]/.test(sel) && hits(sel)) out.push(prettify(r.cssText))
          } catch {
            // selector not valid after stripping pseudo parts
          }
        }
      } catch {
        // cross-origin sheet
      }
    }
    this.loaded.set(out.join('\n\n'))
    this.css.set(this.loaded())
    // the [value] binding does not re-fire when the text is unchanged, so reset edits by hand
    const ta = this.host.nativeElement.querySelector('textarea')
    if (ta) ta.value = this.loaded()
  }

  // switching a tab swaps the scope, so reload (this also resets live edits)
  onStageClick(el: HTMLElement): void {
    if (el.closest('.mat-mdc-tab-header')) setTimeout(() => this.loadCss())
  }

  applyCss(value: string): void {
    this.live.textContent = value
    this.css.set(value)
  }

  toggle(st: State): void {
    this.forced.update((f) => (f.includes(st) ? f.filter((x) => x !== st) : [...f, st]))
  }
}
