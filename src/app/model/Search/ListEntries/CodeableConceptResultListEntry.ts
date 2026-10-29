import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { CodeableConceptResultListEntryData } from '../../Interface/Search/CodeableConceptResultListEntryData'
import { AbstractListEntry } from './AbstractListEntry'

export class CodeableConceptResultListEntry extends AbstractListEntry {
  private isSelected: boolean
  private concept: Concept

  constructor(concept: Concept, id: string, isSelected: boolean = false) {
    super(id)
    this.concept = concept
    this.isSelected = isSelected
  }

  public setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected
  }

  public getIsSelected(): boolean {
    return this.isSelected
  }

  public getConcept(): Concept {
    return this.concept
  }

  public setConcept(concept: Concept) {
    this.concept = concept
  }

  /**
   * Creates a new instance of CodeableConceptResultListEntry from JSON.
   * @param {CodeableConceptResultListEntryData} json The JSON object to convert.
   * @returns {CodeableConceptResultListEntry} A new instance of CodeableConceptResultListEntry.
   */
  public static fromJson(json: CodeableConceptResultListEntryData): CodeableConceptResultListEntry {
    return new CodeableConceptResultListEntry(
      Concept.fromJson({
        id: json.id,
        display: json.display,
        terminologyCode: json.termCode,
      }),
      json.id
    )
  }
}
