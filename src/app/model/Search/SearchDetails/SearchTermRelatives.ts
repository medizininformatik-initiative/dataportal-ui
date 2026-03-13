import { Display } from '../../DataSelection/Profile/Display';
import { CriteriaRelativeData } from '../../Interface/CriteriaRelativesData';
import { TerminologySystemDictionary } from '../../Utilities/TerminologySystemDictionary';

/**
 * Represents the relatives (parents, children, related terms) and translations of a search term.
 */
export class SearchTermRelatives {
  private display: Display;
  private readonly selectable: boolean = true;
  private readonly termcode: string;
  private readonly terminology: string;
  private readonly contextualizedTermcodeHash: string;
  constructor(
    display: Display,
    termcode: string,
    terminology: string,
    contextualizedTermcodeHash: string,
    selectable: boolean = true
  ) {
    this.display = display;
    this.termcode = termcode;
    this.terminology = terminology;
    this.contextualizedTermcodeHash = contextualizedTermcodeHash;
    this.selectable = selectable;
  }

  public getSelectable(): boolean {
    return this.selectable;
  }

  /**
   * Gets the display of the term.
   * @returns The display of the term.
   */
  public getDisplay(): Display {
    return this.display;
  }

  /**
   * Sets the display of the term.
   * @param display - The new display of the term.
   */
  public setDisplay(display: Display): void {
    this.display = display;
  }

  public getTermcode(): string {
    return this.termcode;
  }

  public getTerminology(): string {
    return this.terminology;
  }

  public getTranslatedTerminologyDisplay(): Display | string {
    const display = TerminologySystemDictionary.getNameByUrl(this.terminology);
    return display ? display : this.terminology;
  }

  /**
   * Gets the contextualized term code hash.
   * @returns The contextualizedTermcodeHash as a string, or undefined if not set.
   */
  public getContextualizedTermcodeHash(): string | undefined {
    return this.contextualizedTermcodeHash;
  }

  /**
   *
   * @param json
   * @returns
   */
  public static fromJson(json: CriteriaRelativeData): SearchTermRelatives {
    const display = Display.fromJson(json.display);
    const contextualizedTermcodeHash = json.contextualizedTermcodeHash;
    const selectable = json.selectable;
    const termcode = json.termcode;
    const terminology = json.terminology;
    return new SearchTermRelatives(
      display,
      termcode,
      terminology,
      contextualizedTermcodeHash,
      selectable
    );
  }
}
