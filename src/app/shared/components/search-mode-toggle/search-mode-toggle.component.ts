import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type SearchMode = 'search' | 'bulk-search';

@Component({
  selector: 'num-search-mode-toggle',
  templateUrl: './search-mode-toggle.component.html',
  styleUrls: ['./search-mode-toggle.component.scss'],
})
export class SearchModeToggleComponent implements OnInit {
  @Input()
  selectedMode: SearchMode = 'search';

  @Output()
  modeChange = new EventEmitter<SearchMode>();

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegments) => {
      const lastSegment = urlSegments[urlSegments.length - 1].path;
      if (lastSegment === 'bulk-search') {
        this.selectedMode = 'bulk-search';
      } else {
        this.selectedMode = 'search';
      }
    });
  }
  public onModeChange(mode: SearchMode): void {
    this.selectedMode = mode;
    this.modeChange.emit(mode);
  }
}
