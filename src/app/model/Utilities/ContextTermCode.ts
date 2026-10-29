import { TerminologyCode } from '../Terminology/TerminologyCode'

export class ContextTermCode {
  private static readonly CODE = 'Einwilligung'
  private static readonly DISPLAY_NAME = 'Einwilligung'
  private static readonly SYSTEM = 'fdpg.mii.cds'
  private static readonly VERSION = '1.0.0'

  public static getContextTermCode(): TerminologyCode {
    return new TerminologyCode(ContextTermCode.CODE, ContextTermCode.DISPLAY_NAME, ContextTermCode.SYSTEM, ContextTermCode.VERSION)
  }
}
