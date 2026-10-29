import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { DisplayData } from 'src/app/model/Interface/DisplayData'
import { CodeableConceptResultListData } from 'src/app/model/Interface/Search/CodeableConceptResultList'
import { CodeableConceptResultListEntryData } from 'src/app/model/Interface/Search/CodeableConceptResultListEntryData'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { TypeAssertion } from 'src/app/service/TypeGuard/TypeAssersations'
import { v4 as uuidv4 } from 'uuid'
import { MappingStrategy } from '../../../Interface/InterfaceMappingStrategy'

export class CodeableConceptResultMapperStrategy implements MappingStrategy<CodeableConceptResultListEntry, CodeableConceptResultList> {
  public mapResponseToResultList(response: CodeableConceptResultListData): CodeableConceptResultList {
    const listEntries: CodeableConceptResultListEntry[] = this.mapResponseToEntries(response.results)
    return new CodeableConceptResultList(response.totalHits, listEntries)
  }

  public mapResponseToEntries(response: CodeableConceptResultListEntryData[]): CodeableConceptResultListEntry[] {
    return response.map((resultItem: CodeableConceptResultListEntryData) => {
      const terminologyCode = this.mapTerminologyCode(resultItem.termCode)
      const concept = new Concept(this.instantiateDisplayData(resultItem.display), terminologyCode)
      return new CodeableConceptResultListEntry(concept, uuidv4())
    })
  }

  private mapTerminologyCode(terminologyCodeData: TerminologyCodeData): TerminologyCode {
    TypeAssertion.assertTerminologyCodeData(terminologyCodeData)
    return TerminologyCode.fromJson(terminologyCodeData)
  }

  public instantiateDisplayData(data: DisplayData): Display {
    TypeAssertion.assertDisplayData(data)
    return Display.fromJson(data)
  }
}
