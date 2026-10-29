import { NgTemplateOutlet } from '@angular/common'
import { Component, input, OnInit, TemplateRef } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-filter-tabs',
  templateUrl: './filter-tabs.component.html',
  styleUrls: ['./filter-tabs.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, TranslateModule, DisplayTranslationPipe],
})
export class FilterTabsComponent implements OnInit {
  public readonly content = input.required<
    {
      template: TemplateRef<any>
      name: string
      context?: any
      display?: Display
      active?: boolean
    }[]
  >()

  public selectedIndex = 0

  constructor() {}

  public ngOnInit(): void {
    const activeTabIndex = this.content().findIndex((tab) => tab.active)
    this.selectedIndex = activeTabIndex !== -1 ? activeTabIndex : 0
  }
}
