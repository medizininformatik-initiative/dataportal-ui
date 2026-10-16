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
        [selectedIndex]="tabIndex(['green-button-shades', 'green-button-techniques'])"
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
        [selectedIndex]="tabIndex(['criteria-box-variants', 'criteria-box-layouts'])"
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
      <mat-tab-group [selectedIndex]="tabIndex(['action-bar-variants'])" animationDuration="0ms">
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
  readonly selectedItems = [
    { display: this.display('Hauptdiagnose', 'Main diagnosis'), code: 'I10' },
    { display: this.display('Nebendiagnose', 'Secondary diagnosis'), code: 'I11' },
  ]

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
