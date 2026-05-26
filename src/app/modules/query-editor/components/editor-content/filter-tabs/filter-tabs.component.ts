import { Component, Input, OnInit, TemplateRef } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-filter-tabs',
  templateUrl: './filter-tabs.component.html',
  styleUrls: ['./filter-tabs.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, TranslateModule, DisplayTranslationPipe],
})
export class FilterTabsComponent implements OnInit {
  @Input()
  content: { template: TemplateRef<any>; name: string; context?: any }[]
  selectedIndex = 0

  constructor() {}

  ngOnInit(): void {}
}
