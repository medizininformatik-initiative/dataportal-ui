import { NgClass } from '@angular/common'
import { Component, OnInit, input } from '@angular/core'
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'

@Component({
  selector: 'num-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [MatTooltip, MatMenuTrigger, FontAwesomeModule, MatMenu, MatMenuItem, NgClass, TranslateModule, NumDataCyDirective],
})
export class MenuComponent implements OnInit {
  public readonly id = input<string>()

  public readonly menuItems = input<MenuItemInterface[]>([])

  public readonly args = input<Record<string, unknown>>({})

  constructor() {}

  public ngOnInit() {}
}
