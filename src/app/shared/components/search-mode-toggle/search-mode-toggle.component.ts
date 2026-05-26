import { ActivatedRoute } from '@angular/router'
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { SwitchComponent } from '../switch/switch.component'
import { TranslateModule } from '@ngx-translate/core'

export type SearchMode = 'search' | 'bulk-search'

@Component({
  selector: 'num-search-mode-toggle',
  templateUrl: './search-mode-toggle.component.html',
  styleUrls: ['./search-mode-toggle.component.scss'],
  standalone: true,
  imports: [SwitchComponent, TranslateModule],
})
export class SearchModeToggleComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)

  @Input()
  selectedMode: SearchMode = 'search'

  @Output()
  modeChange = new EventEmitter<SearchMode>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegments) => {
      const lastSegment = urlSegments[urlSegments.length - 1].path
      if (lastSegment === 'bulk-search') {
        this.selectedMode = 'bulk-search'
      } else {
        this.selectedMode = 'search'
      }
    })
  }
  public onModeChange(mode: SearchMode): void {
    this.selectedMode = mode
    this.modeChange.emit(mode)
  }
}
