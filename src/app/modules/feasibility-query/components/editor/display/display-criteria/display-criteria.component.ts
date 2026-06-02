import {
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  TemplateRef,
  inject,
  input,
  viewChild,
} from '@angular/core'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { map, Observable, Subscription } from 'rxjs'
import { NgTemplateOutlet, AsyncPipe, NgClass } from '@angular/common'
import { CriteriaBoxComponent } from '../../../../../../shared/components/criteria-box/criteria-box.component'
import { BoolLogicSwitchComponent } from '../bool-logic-switch/bool-logic-switch.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-display-criteria',
  templateUrl: './display-criteria.component.html',
  styleUrls: ['./display-criteria.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CriteriaBoxComponent,
    BoolLogicSwitchComponent,
    FontAwesomeModule,
    AsyncPipe,
    TranslateModule,
    NgClass,
  ],
})
export class DisplayCriteriaComponent implements OnInit, OnDestroy {
  private queryService = inject(FeasibilityQueryProviderService)
  criterionProvider = inject(CriterionProviderService)

  readonly outletRef = viewChild('outlet', { read: ViewContainerRef })
  readonly contentRef = viewChild('content', { read: TemplateRef })

  readonly groupType = input<string>(undefined)

  readonly isEditable = input<boolean>(undefined)

  criteriaArray$: Observable<string[][]>
  private querySubscription: Subscription
  private criteriaSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.criteriaSubscription = this.criterionProvider.getAll().subscribe(() => {
      this.initialize()
      setTimeout(() => {
        this.rerender()
      }, 50)
    })
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe()
    this.criteriaSubscription?.unsubscribe()
  }

  public rerender() {
    this.outletRef().clear()
    this.outletRef().createEmbeddedView(this.contentRef())
  }

  initialize(): void {
    const groupType = this.groupType()
    if (groupType === 'Inclusion') {
      this.criteriaArray$ = this.queryService
        .getActiveFeasibilityQuery()
        .pipe(map((feasibilityQuery) => feasibilityQuery.getInclusionCriteria()))
    }
    if (groupType === 'Exclusion') {
      this.criteriaArray$ = this.queryService
        .getActiveFeasibilityQuery()
        .pipe(map((feasibilityQuery) => feasibilityQuery.getExclusionCriteria()))
    }
  }

  getInnerLabelKey(): 'AND' | 'OR' {
    return this.groupType() === 'Inclusion' ? 'OR' : 'AND'
  }

  getOuterLabelKey(): 'AND' | 'OR' {
    return this.groupType() === 'Exclusion' ? 'OR' : 'AND'
  }

  splitInnerArray(i: number, j: number): void {
    let tempcrit: string[][] = []

    this.queryService
      .getActiveFeasibilityQuery()
      .subscribe((query: FeasibilityQuery) => {
        const groupType = this.groupType()
        if (groupType === 'Inclusion') {
          tempcrit = this.splitInnerArray2(query.getInclusionCriteria(), i, j)
        }
        if (groupType === 'Exclusion') {
          tempcrit = this.splitInnerArray2(query.getExclusionCriteria(), i, j)
        }
      })
      .unsubscribe()
    const groupType = this.groupType()
    if (groupType === 'Inclusion') {
      this.queryService.setInclusionCriteria(tempcrit)
    }
    if (groupType === 'Exclusion') {
      this.queryService.setExclusionCriteria(tempcrit)
    }
  }

  joinInnerArrays(i: number): void {
    let tempcrit: string[][] = []

    this.queryService
      .getActiveFeasibilityQuery()
      .subscribe((query: FeasibilityQuery) => {
        const groupType = this.groupType()
        if (groupType === 'Inclusion') {
          tempcrit = this.joinInnerArrays2(query.getInclusionCriteria(), i)
        }
        if (groupType === 'Exclusion') {
          tempcrit = this.joinInnerArrays2(query.getExclusionCriteria(), i)
        }
      })
      .unsubscribe()
    const groupType = this.groupType()
    if (groupType === 'Inclusion') {
      this.queryService.setInclusionCriteria(tempcrit)
    }
    if (groupType === 'Exclusion') {
      this.queryService.setExclusionCriteria(tempcrit)
    }
  }

  public splitInnerArray2(critGroup: string[][], i: number, j: number): string[][] {
    const critGroupTemp: string[][] = []

    let index = 0
    critGroup.forEach((subarray) => {
      if (index === i) {
        critGroupTemp.push(subarray.slice(0, j + 1))
        critGroupTemp.push(subarray.slice(j + 1))
      } else {
        critGroupTemp.push(subarray)
      }
      index++
    })

    return critGroupTemp
  }

  public joinInnerArrays2(critGroup: string[][], i: number): string[][] {
    const critGroupTemp: string[][] = []

    let index = 0
    let subarrayTemp
    critGroup.forEach((subarray) => {
      if (index === i) {
        subarrayTemp = subarray
      } else if (index === i + 1) {
        critGroupTemp.push(subarrayTemp.concat(subarray))
      } else {
        critGroupTemp.push(subarray)
      }
      index++
    })

    return critGroupTemp
  }
}
