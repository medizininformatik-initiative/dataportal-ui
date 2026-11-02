import { Injectable, inject } from '@angular/core'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { ConsentService } from 'src/app/service/Consent/Consent.service'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryFactoryService {
  private readonly feasibilityQueryService = inject(FeasibilityQueryProviderService)
  private readonly consentService = inject(ConsentService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates a new feasibility query and registers it.
   * @returns {FeasibilityQuery}
   */
  public instantiate(): FeasibilityQuery {
    const feasibilityQuery = new FeasibilityQuery(uuidv4())
    this.feasibilityQueryService.setFeasibilityQueryById(feasibilityQuery, feasibilityQuery.getId(), true)
    this.consentService.setConsent(false)
    this.consentService.setProvisionCode({ distributedAnalysis: false, euGdpr: false, insuranceData: false, contact: false })
    return feasibilityQuery
  }
}
