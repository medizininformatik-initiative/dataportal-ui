import { Injectable } from '@angular/core'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

@Injectable({
  providedIn: 'root',
})
export class TerminologyCodeTranslator {
  /**
   * Translates an array of TerminologyCode objects by copying the values from the first element
   * to each subsequent element, while ensuring that the UID is set to undefined.
   *
   * @param {TerminologyCode[]} termCodes Array of TerminologyCode to be translated.
   * @returns {TerminologyCode[]} A new array of TerminologyCode objects with the translated values.
   */
  public translateTermCodes(termCodes: TerminologyCode[]): TerminologyCode[] {
    if (termCodes.length === 0) {
      return []
    }

    return termCodes.map((termCode) => this.mapToTranslatedCode(termCode))
  }

  /**
   * Maps a given TerminologyCode to a new TerminologyCode instance
   *
   * @param {TerminologyCode} termCode The source TerminologyCode from which to copy values.
   * @returns {TerminologyCode} A new TerminologyCode instance with values copied from the source code.
   */
  private mapToTranslatedCode(termCode: TerminologyCode): TerminologyCode {
    return new TerminologyCode(termCode.getCode(), termCode.getDisplay(), termCode.getSystem(), termCode.getVersion() ?? undefined)
  }
}
