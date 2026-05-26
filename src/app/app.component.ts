import { Component, OnInit } from '@angular/core'
import { TabTitleService } from './service/TabTitle.service'
import { AppLayoutComponent } from './layout/components/app-layout/app-layout.component'

@Component({
  selector: 'num-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AppLayoutComponent],
})
export class AppComponent implements OnInit {
  title = 'num-portal-webapp'
  constructor(private tabTitleService1: TabTitleService) {}

  ngOnInit() {
    this.tabTitleService1.initializeTitleListener()
  }
}
