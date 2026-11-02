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

  /**
   * Creates a hash from the context and the term code.
   * @param {TerminologyCode} context
   * @param {TerminologyCode} termCode
   * @returns {string}
   */
  public createCriterionHash(context: TerminologyCode, termCode: TerminologyCode): string {
    const contextSystem = context?.getSystem() || ''
    const contextCode = context?.getCode() || ''
    const contextVersion = context?.getVersion() || ''

    const hashCode = `${contextSystem}${contextCode}${contextVersion}${termCode.getSystem()}${termCode.getCode()}`

    return uuidv3(hashCode, UuidPaths.UUID_NAMESPACE)
  }

  /**
   * Creates a hash from the code and system of the term code.
   * @param {TerminologyCodeData} termCode
   * @returns {string}
   */
  public createConceptHash(termCode: TerminologyCodeData): string {
    const hashCode = `${termCode?.code}${termCode?.system}`
    return uuidv3(hashCode, UuidPaths.UUID_NAMESPACE)
  }
}
