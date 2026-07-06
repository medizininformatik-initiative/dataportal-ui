import { Component, input, OnInit, TemplateRef } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../../../../shared/pipes/DisplayTranslationPipe'
import { NgTemplateOutlet } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-filter-tabs',
  templateUrl: './filter-tabs.component.html',
  styleUrls: ['./filter-tabs.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, TranslateModule, DisplayTranslationPipe],
})
export class FilterTabsComponent implements OnInit {
  readonly content = input.required<
    {
      template: TemplateRef<any>
      name: string
      context?: any
      display?: Display
      active?: boolean
    }[]
  >()

  selectedIndex = 0

  constructor() {}

  ngOnInit(): void {
    const activeTabIndex = this.content().findIndex((tab) => tab.active)
    this.selectedIndex = activeTabIndex !== -1 ? activeTabIndex : 0
  }
}
