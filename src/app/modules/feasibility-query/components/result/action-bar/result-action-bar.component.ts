import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'num-result-action-bar',
  templateUrl: './result-action-bar.component.html',
  styleUrls: ['./result-action-bar.component.scss'],
})
export class ResultActionBarComponent implements OnInit, OnDestroy {
  @Input()
  hasQueryResult: boolean;

  saveDataQueryModalSubscription: Subscription;

  constructor(
    private navigationHelperService: NavigationHelperService,
    private saveDataQueryModalService: SaveDataQueryModalService
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.saveDataQueryModalSubscription?.unsubscribe();
  }

  public saveQuery() {
    this.saveDataQueryModalSubscription?.unsubscribe();
    this.saveDataQueryModalSubscription = this.saveDataQueryModalService
      .openSaveDataQueryModal()
      .subscribe();
  }

  public editStage(): void {
    this.navigationHelperService.navigateToFeasibilityQueryEditor();
  }
}
