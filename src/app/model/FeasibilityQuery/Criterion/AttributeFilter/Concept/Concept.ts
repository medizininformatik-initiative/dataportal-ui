import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ConceptData } from 'src/app/model/Interface/ConceptData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

/**
 * @todo the id of a concept needs to be set in the future --> can be system + code or uuid maybe
 */
export class Concept {
  private readonly display: Display
  private readonly terminologyCode: TerminologyCode

  constructor(display: Display, terminologyCode: TerminologyCode) {
    this.display = display
    this.terminologyCode = terminologyCode
  }

  /**
   * Returns the Display object.
   * @returns The Display object.
   */
  public getDisplay(): Display {
    return this.display
  }

  /**
   * The TerminologyCode of the concept.
   * @returns The TerminologyCode of the concept.
   */
  public getTerminologyCode(): TerminologyCode {
    return this.terminologyCode
  }

  /**
   * @param json
   * @returns
   */
  public static fromJson(json: ConceptData): Concept {
    const display = Display.fromJson(json.display)
    const terminologyCode = TerminologyCode.fromJson(json.terminologyCode)
    return new Concept(display, terminologyCode)
  }
}
