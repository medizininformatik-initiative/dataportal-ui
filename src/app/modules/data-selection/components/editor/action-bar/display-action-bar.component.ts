import { Component, OnInit } from '@angular/core'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-display-action-bar',
  templateUrl: './display-action-bar.component.html',
  styleUrls: ['./display-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatTooltip, TranslateModule],
})
export class DisplayActionBarComponent implements OnInit {
  constructor(private navigationHelperService: NavigationHelperService) {}

  ngOnInit(): void {}

  public onNavigateToDataSelectionSearch(): void {
    this.navigationHelperService.navigateToDataSelectionSearch()
  }
}
