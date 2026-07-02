import { ConsentService } from 'src/app/service/Consent/Consent.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { Injectable, inject } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryFactoryService {
  private feasibilityQueryService = inject(FeasibilityQueryProviderService)
  private consentService = inject(ConsentService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public instantiate(): FeasibilityQuery {
    const feasibilityQuery = new FeasibilityQuery(uuidv4())
    this.feasibilityQueryService.setFeasibilityQueryById(
      feasibilityQuery,
      feasibilityQuery.getId(),
      true
    )
    this.consentService.setConsent(false)
    this.consentService.setProvisionCode(false, false, false, false)
    return feasibilityQuery
  }
}
