import { Component, inject, model, OnInit, output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

export type SearchMode = 'search' | 'bulk-search'

@Component({
  selector: 'num-search-mode-toggle',
  templateUrl: './search-mode-toggle.component.html',
  styleUrls: ['./search-mode-toggle.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
})
export class SearchModeToggleComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)

  public readonly selectedMode = model<SearchMode>('search')

  public readonly modeChange = output<SearchMode>()

  constructor() {}

  public ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegments) => {
      const lastSegment = urlSegments[urlSegments.length - 1].path
      if (lastSegment === 'bulk-search') {
        this.selectedMode.set('bulk-search')
      } else {
        this.selectedMode.set('search')
      }
    })
  }
  public onModeChange(mode: SearchMode): void {
    this.selectedMode.set(mode)
    this.modeChange.emit(mode)
  }
}
