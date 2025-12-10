import { Component, OnInit } from '@angular/core';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';

@Component({
  selector: 'num-display-action-bar',
  templateUrl: './display-action-bar.component.html',
  styleUrls: ['./display-action-bar.component.scss'],
})
export class DisplayActionBarComponent implements OnInit {
  constructor(private navigationHelperService: NavigationHelperService) {}

  ngOnInit(): void {}

  public onNavigateToDataSelectionSearch(): void {
    this.navigationHelperService.navigateToDataSelectionSearch();
  }
}
