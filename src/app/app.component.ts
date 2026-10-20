import { AppSettingsProviderService } from './service/Config/AppSettingsProvider.service'
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
  private readonly appSettings = inject(AppSettingsProviderService)

  title = 'num-portal-webapp'
  constructor() {}

  ngOnInit() {
    this.tabTitleService1.initializeTitleListener()
    this.applyStylesheet()
  }

  /** Swaps the default theme class from index.html for the one named in the app config. */
  private applyStylesheet() {
    const stylesheet = this.appSettings.getStylesheet()
    if (stylesheet) {
      document.body.classList.remove('FDPGTheme')
      document.body.classList.add(stylesheet)
    }
  }
}
