import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'num-filter-tabs',
  templateUrl: './filter-tabs.component.html',
  styleUrls: ['./filter-tabs.component.scss'],
})
export class FilterTabsComponent implements OnInit {
  @Input()
  content: { template: TemplateRef<any>; name: string; context?: any }[];
  selectedIndex = 0;

  constructor() {}

  ngOnInit(): void {}
}
