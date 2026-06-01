import { AppLayoutComponent } from './layout/components/app-layout/app-layout.component'
import { Component, inject, OnInit } from '@angular/core'
import { TabTitleService } from './service/TabTitle.service'

@Component({
  selector: 'num-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AppLayoutComponent],
})
export class AppComponent implements OnInit {
  private tabTitleService1 = inject(TabTitleService)

  title = 'num-portal-webapp'
  constructor() {}

  ngOnInit() {
    this.tabTitleService1.initializeTitleListener()
  }
}
