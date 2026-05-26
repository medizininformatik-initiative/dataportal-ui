import { Component, OnInit, inject } from '@angular/core'
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
  private tabTitleService1 = inject(TabTitleService)

  title = 'num-portal-webapp'

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  ngOnInit() {
    this.tabTitleService1.initializeTitleListener()
  }
}
