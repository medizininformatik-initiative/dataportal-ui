import { Component, inject, OnInit } from '@angular/core'
import { AppLayoutComponent } from './layout/components/app-layout/app-layout.component'
import { TabTitleService } from './service/TabTitle.service'

@Component({
  selector: 'num-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AppLayoutComponent],
})
export class AppComponent implements OnInit {
  private readonly tabTitleService1 = inject(TabTitleService)

  public title = 'num-portal-webapp'
  constructor() {}

  public ngOnInit() {
    this.tabTitleService1.initializeTitleListener()
  }
}
