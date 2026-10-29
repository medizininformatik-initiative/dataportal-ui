import { Injectable } from '@angular/core'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { v3 as uuidv3 } from 'uuid'
import { TerminologyCode } from '../model/Terminology/TerminologyCode'
import { UuidPaths } from './Backend/Paths/UuidPaths'

@Injectable({
  providedIn: 'root',
})
export class HashService {
  constructor() {}

  public createCriterionHash(context: TerminologyCode, termCode: TerminologyCode): string {
    const contextSystem = context?.getSystem() || ''
    const contextCode = context?.getCode() || ''
    const contextVersion = context?.getVersion() || ''

    const hashCode = `${contextSystem}${contextCode}${contextVersion}${termCode.getSystem()}${termCode.getCode()}`

    return uuidv3(hashCode, UuidPaths.UUID_NAMESPACE)
  }

  public createConceptHash(termCode: TerminologyCodeData): string {
    const hashCode = `${termCode?.code}${termCode?.system}`
    return uuidv3(hashCode, UuidPaths.UUID_NAMESPACE)
  }
}
