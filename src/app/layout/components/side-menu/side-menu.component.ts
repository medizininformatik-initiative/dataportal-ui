import INavItem from '../../models/nav-item.interface';
import { mainNavItems } from '../../../core/constants/navigation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'num-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  mainNavItems = mainNavItems;
  @Input() isSideMenuExpanded = true;

  @Output() toggleSideMenu = new EventEmitter<boolean>();

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'cohort-network',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/cohort-network.svg')
    );
  }

  ngOnInit(): void {}

  menuItemClicked($event: Event, item?: INavItem): void {
    const target = $event.currentTarget as HTMLElement;
    target.blur();
  }

  public toggleMenu(): void {
    this.isSideMenuExpanded = !this.isSideMenuExpanded;
    this.toggleSideMenu.emit(this.isSideMenuExpanded);
  }
}
