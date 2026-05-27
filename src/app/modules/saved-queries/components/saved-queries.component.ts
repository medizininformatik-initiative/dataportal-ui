import { Component, OnInit } from '@angular/core'
import { HeaderComponent } from '../../../shared/components/header/header.component'
import { FeasibilityComponent } from './feasibility/feasibility.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-saved-queries',
  templateUrl: './saved-queries.component.html',
  styleUrls: ['./saved-queries.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FeasibilityComponent, TranslateModule],
})
export class SavedQueriesComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
