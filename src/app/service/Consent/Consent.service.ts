import { Injectable, OnDestroy, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { StructuredQueryCriterion } from 'src/app/model/StructuredQuery/Criterion/StructuredQueryCriterion'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { ContextTermCode } from 'src/app/model/Utilities/ContextTermCode'
import { FeasibilityQueryProviderService } from '../Provider/FeasibilityQueryProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ConsentService implements OnDestroy {
  private readonly feasibilityQueryProviderService = inject(FeasibilityQueryProviderService)

  /**
   * Unsubscribes from the active feasibility query.
   */
  public ngOnDestroy(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
  }

  private consent = false
  private consentTermcode: TerminologyCode
  private consentLookUpTableKey: string

  private activeFeasibilityQuerySusbscription: Subscription
  private readonly lookupTable: { [key: string]: { code: string; display: string; system: string } } = {
    'true:true:true:true': {
      code: 'yes-yes-yes-yes',
      display: 'Verteilte, EU-DSGVO konforme Analyse, mit Krankenkassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:true:true:false': {
      code: 'yes-yes-yes-no',
      display: 'Verteilte, EU-DSGVO konforme Analyse, mit Krankenkassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:true:false:true': {
      code: 'yes-yes-no-yes',
      display: 'Verteilte, EU-DSGVO konforme Analyse, ohne Krankenkassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:true:false:false': {
      code: 'yes-yes-no-no',
      display: 'Verteilte, EU-DSGVO konforme Analyse, ohne Krankenkassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:false:true:true': {
      code: 'yes-no-yes-yes',
      display: 'Verteilte, nicht EU-DSGVO konforme Analyse, mit Krankenkassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:false:true:false': {
      code: 'yes-no-yes-no',
      display: 'Verteilte, nicht EU-DSGVO konforme Analyse, mit Krankenkassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:false:false:true': {
      code: 'yes-no-no-yes',
      display: 'Verteilte, nicht EU-DSGVO konforme Analyse, ohne Krankenassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'true:false:false:false': {
      code: 'yes-no-no-no',
      display: 'Verteilte, nicht EU-DSGVO konforme Analyse, ohne Krankenassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:true:true:true': {
      code: 'no-yes-yes-yes',
      display: 'Zentrale, EU-DSGVO konforme Analyse, mit Krankenkassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:true:true:false': {
      code: 'no-yes-yes-no',
      display: 'Zentrale, EU-DSGVO konforme Analyse, mit Krankenkassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:true:false:true': {
      code: 'no-yes-no-yes',
      display: 'Zentrale, EU-DSGVO konforme Analyse, ohne Krankenassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:true:false:false': {
      code: 'no-yes-no-no',
      display: 'Zentrale, EU-DSGVO konforme Analyse, ohne Krankenassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:false:true:true': {
      code: 'no-no-yes-yes',
      display: 'Zentrale, nicht EU-DSGVO konforme Analyse, mit Krankenkassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:false:true:false': {
      code: 'no-no-yes-no',
      display: 'Zentrale, nicht EU-DSGVO konforme Analyse, mit Krankenkassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:false:false:true': {
      code: 'no-no-no-yes',
      display: 'Zentrale, nicht EU-DSGVO konforme Analyse, ohne Krankenassendaten, und mit Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
    'false:false:false:false': {
      code: 'no-no-no-no',
      display: 'Zentrale, nicht EU-DSGVO konforme Analyse, ohne Krankenkassendaten, und ohne Rekontaktierung',
      system: 'fdpg.consent.combined',
    },
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    this.setProvisionCode(false, true, false, false)
  }

  /**
   * Writes the consent criterion into the active feasibility query.
   */
  public setFeasibilityQueryConsent() {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.activeFeasibilityQuerySusbscription = this.feasibilityQueryProviderService
      .getActiveFeasibilityQuery()
      .subscribe((feasibilityQuery: FeasibilityQuery) => {
        feasibilityQuery.setConsent(this.consent)
      })
  }

  /**
   * Returns the consent look-up table key.
   * @returns {string}
   */
  public getConsentLookUpTableKey(): string {
    return this.consentLookUpTableKey
  }

  /**
   * Sets the consent look-up table key.
   * @param {string} key
   */
  public setConsentLookUpTableKey(key: string) {
    this.consentLookUpTableKey = key
  }

  /**
   * Returns the consent terminology code.
   * @returns {TerminologyCode}
   */
  public getConsentTermCode(): TerminologyCode {
    return this.consentTermcode
  }

  /**
   * Returns whether consent is given.
   * @returns {boolean}
   */
  public getConsent() {
    return this.consent
  }

  /**
   * Sets the consent and updates the feasibility query.
   * @param {boolean} consent
   */
  public setConsent(consent: boolean) {
    this.consent = consent
    this.setFeasibilityQueryConsent()
  }

  /**
   * Builds the consent criterion for the structured query.
   * @returns {StructuredQueryCriterion}
   */
  public getConsentStructuredQueryCriterion(): StructuredQueryCriterion {
    const criterion = new StructuredQueryCriterion()
    criterion.setContext(ContextTermCode.getContextTermCode())
    criterion.setTermCodes([this.getConsentTermCode()])
    return criterion
  }

  /**
   * Sets the provision code from the four consent options.
   * @param {boolean} distributedAnalysis
   * @param {boolean} euGdpr
   * @param {boolean} insuranceData
   * @param {boolean} contact
   */
  public setProvisionCode(distributedAnalysis: boolean, euGdpr: boolean, insuranceData: boolean, contact: boolean) {
    const key = `${distributedAnalysis}:${euGdpr}:${insuranceData}:${contact}`
    this.consentLookUpTableKey = key
    this.consentTermcode = this.createTerminologyCode(key)
  }

  /**
   * Creates the terminology code for a look-up table key.
   * @param {string} key
   * @returns {TerminologyCode}
   */
  private createTerminologyCode(key: string) {
    const termCodeObject = this.lookupTable[key]
    return new TerminologyCode(termCodeObject.code, termCodeObject.display, termCodeObject.system)
  }

  /**
   * Returns the boolean flags.
   *
   * @param {string} provisionsCode
   * @returns {{ distributedAnalysis: boolean euGdpr: boolean insuranceData: boolean contact: boolean } | null}
   */
  public getBooleanFlags(provisionsCode: string): {
    distributedAnalysis: boolean
    euGdpr: boolean
    insuranceData: boolean
    contact: boolean
  } | null {
    for (const key in this.lookupTable) {
      if (Object.prototype.hasOwnProperty.call(this.lookupTable, key)) {
        const value = this.lookupTable[key]

        if (value.code === provisionsCode) {
          const [distributedAnalysis, euGdpr, insuranceData, contact] = key.split(':').map((v: string) => v === 'true')
          return { distributedAnalysis, euGdpr, insuranceData, contact }
        }
      }
    }

    return null
  }
  /**
   * Resets the consent to its default.
   */
  public clearConsent(): void {
    this.setProvisionCode(false, true, false, false)
    this.setConsent(false)
  }
}
