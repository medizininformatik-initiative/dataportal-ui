import { Injectable, inject } from '@angular/core'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'

@Injectable({
  providedIn: 'root',
})
export class CodeableConceptTranslatorService {
  private terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public translate(terminologyCodes: TerminologyCodeData) {}
}
