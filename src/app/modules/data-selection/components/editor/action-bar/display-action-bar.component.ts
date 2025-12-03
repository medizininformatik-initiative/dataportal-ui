import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'num-display-action-bar',
  templateUrl: './display-action-bar.component.html',
  styleUrls: ['./display-action-bar.component.scss'],
})
export class DisplayActionBarComponent implements OnInit, OnDestroy {
  saveDataQueryModalSubscription: Subscription;

  constructor(
    private navigationHelperService: NavigationHelperService,
    private saveDataQueryModalService: SaveDataQueryModalService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.saveDataQueryModalSubscription?.unsubscribe();
  }

  public onNavigateToDataSelectionSearch(): void {
    this.navigationHelperService.navigateToDataSelectionSearch();
  }

  public onNavigateToDataRequest(): void {
    this.navigationHelperService.navigateToDataQueryDataSelection();
  }

  public onSaveDataQuery(): void {
    this.saveDataQueryModalSubscription?.unsubscribe();
    this.saveDataQueryModalSubscription = this.saveDataQueryModalService
      .openSaveDataQueryModal()
      .subscribe();
  }
}
