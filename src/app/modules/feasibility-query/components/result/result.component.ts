import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { FeasibilityQueryResultService } from 'src/app/service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { DisplayFeasibilityQueryComponent } from '../editor/display/display.component'
import { ResultActionBarComponent } from './action-bar/result-action-bar.component'
import { SimpleResultComponent } from './simple-result/simple-result.component'
@Component({
  selector: 'num-feasibility-query-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderDescriptionComponent,
    SimpleResultComponent,
    DisplayFeasibilityQueryComponent,
    ResultActionBarComponent,
    TranslateModule,
  ],
})
export class ResultComponent implements OnInit, OnDestroy {
  private readonly feasibilityQueryResultService = inject(FeasibilityQueryResultService)

  public resultLoaded = false
  public hasQueryResult: Observable<boolean>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public ngOnInit() {}

  public ngOnDestroy() {
    this.feasibilityQueryResultService.stopPolling()
  }

  public setResultLoaded(value: boolean) {
    this.resultLoaded = value
  }
}
