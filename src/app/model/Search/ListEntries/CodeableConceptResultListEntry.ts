import { AbstractListEntry } from './AbstractListEntry';
import { CodeableConceptResultListEntryData } from '../../Interface/Search/CodeableConceptResultListEntryData';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';

export class CodeableConceptResultListEntry extends AbstractListEntry {
  private isSelected: boolean;
  private concept: Concept;

  /**
   * @param concept
   * @param id
   */
  constructor(concept: Concept, id: string, isSelected: boolean = false) {
    super(id);
    this.concept = concept;
    this.isSelected = isSelected;
  }

  public setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }

  /**
   * @returns
   */
  public getIsSelected(): boolean {
    return this.isSelected;
  }

  /**
   * @returns
   */
  public getConcept(): Concept {
    return this.concept;
  }

  /**
   * @param concept
   */
  public setConcept(concept: Concept) {
    this.concept = concept;
  }

  /**
   * Creates a new instance of CodeableConceptResultListEntry from JSON.
   * @param json The JSON object to convert.
   * @returns A new instance of CodeableConceptResultListEntry.
   */
  public static fromJson(json: CodeableConceptResultListEntryData): CodeableConceptResultListEntry {
    return new CodeableConceptResultListEntry(
      Concept.fromJson({
        id: json.id,
        display: json.display,
        terminologyCode: json.termCode,
      }),
      json.id
    );
  }
}
