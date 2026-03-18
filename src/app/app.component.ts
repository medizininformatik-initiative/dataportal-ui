import { Component, OnInit } from '@angular/core';
import { TabTitleService } from './service/TabTitle.service';

@Component({
  selector: 'num-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'num-portal-webapp';
  constructor(private tabTitleService1: TabTitleService) {}

  ngOnInit() {
    this.tabTitleService1.initializeTitleListener();
  }
}
