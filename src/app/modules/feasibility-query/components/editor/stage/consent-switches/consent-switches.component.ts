import { NgClass } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { AnalysisType } from 'src/app/model/Utilities/Consent/AnalysisType'
import { ContactOption } from 'src/app/model/Utilities/Consent/ContactOption'
import { GdprCompliance } from 'src/app/model/Utilities/Consent/GdprCompliance'
import { InsuranceData } from 'src/app/model/Utilities/Consent/InsuranceData'
import { ConsentService } from 'src/app/service/Consent/Consent.service'
import { SectionNameComponent } from '../../../../../../shared/components/section-name/section-name.component'
import { SwitchComponent } from '../../../../../../shared/components/switch/switch.component'

@Component({
  selector: 'num-consent-switches',
  templateUrl: './consent-switches.component.html',
  styleUrls: ['./consent-switches.component.scss'],
  standalone: true,
  imports: [SwitchComponent, SectionNameComponent, NgClass, TranslateModule],
})
export class ConsentSwitchesComponent implements OnInit {
  private readonly consentService = inject(ConsentService)

  public analysisType = AnalysisType

  public contactOption = ContactOption

  public gdprCompliance = GdprCompliance

  public insuranceData = InsuranceData

  public distributedAnalysis = false
  public euGdpr = true
  public insuranceDataBoolean = false
  public contact = false

  public provisionCode: string

  public consent = true

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit(): void {
    this.getProvisionCode()
    this.consent = this.consentService.getConsent()
    ;[this.distributedAnalysis, this.euGdpr, this.insuranceDataBoolean, this.contact] = this.consentService
      .getConsentLookUpTableKey()
      .split(':')
      .map((v) => v === 'true')
  }

  public toggleConsent() {
    this.consent = !this.consent
    this.consentService.setConsent(this.consent)
  }

  public onToggleChange(toggleKey: string): void {
    switch (toggleKey) {
      case 'analysisType':
        this.distributedAnalysis = !this.distributedAnalysis // Toggle the value
        break
      case 'gdprCompliance':
        this.euGdpr = !this.euGdpr // Toggle the value
        break
      case 'insuranceData':
        this.insuranceDataBoolean = !this.insuranceDataBoolean // Toggle the value
        break
      case 'contactOption':
        this.contact = !this.contact // Toggle the value
        break
    }
    this.consentService.setProvisionCode(this.distributedAnalysis, this.euGdpr, this.insuranceDataBoolean, this.contact)
    this.getProvisionCode()
  }

  private getProvisionCode(): void {
    this.provisionCode = this.consentService.getConsentTermCode().getCode()
  }
}
