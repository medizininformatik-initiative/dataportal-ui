import { Component, OnInit, input } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { MatTooltip } from '@angular/material/tooltip'
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgClass } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    MatTooltip,
    MatMenuTrigger,
    FontAwesomeModule,
    MatMenu,
    MatMenuItem,
    NgClass,
    TranslateModule,
  ],
})
export class MenuComponent implements OnInit {
  readonly id = input<string>(undefined)

  readonly menuItems = input<MenuItemInterface[]>([])

  constructor() {}

  ngOnInit() {}
}
