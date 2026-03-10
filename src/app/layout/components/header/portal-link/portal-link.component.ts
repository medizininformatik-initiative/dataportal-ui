import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service';
import { Component } from '@angular/core';

@Component({
  selector: 'num-header-portal-link',
  templateUrl: './portal-link.component.html',
  styleUrls: ['./portal-link.component.scss'],
})
export class PortalLinkComponent {
  constructor(private appSettingsProviderService: AppSettingsProviderService) {}

  public navigateToProposalPortal(): void {
    const link = this.appSettingsProviderService.getPortalLink();
    window.open(link, '_blank');
  }
}
