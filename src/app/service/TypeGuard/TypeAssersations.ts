import { AnnotatedCRTDLData } from '../../model/Interface/AnnotatedCRTDLData';
import { AttributeCode } from '../../model/Interface/AttributeCode';
import { AttributeDefinitionData } from '../../model/Interface/AttributeDefinitionData';
import { AttributeFilterBaseData } from '../../model/Interface/AttributeFilterBaseData';
import { AttributeFilterData } from '../../model/Interface/AttributeFilterData';
import { AttributeGroupsData } from '../../model/Interface/AttributeGroupsData';
import { AttributesData } from '../../model/Interface/AttributesData';
import { CodeableConceptResultListData } from 'src/app/model/Interface/Search/CodeableConceptResultList';
import { ComparatorTypeData } from '../../model/Interface/ComparatorTypeData';
import { ContextData } from '../../model/Interface/ContextData';
import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData';
import { CriteriaProfileData } from '../../model/Interface/CriteriaProfileData';
import { CriteriaRelationsData } from 'src/app/model/Interface/CriteriaRelationsData';
import { CriteriaRelativeData } from 'src/app/model/Interface/CriteriaRelativesData';
import { CRTDLData } from '../../model/Interface/CRTDLData';
import { DataExtractionData } from '../../model/Interface/DataExtractionData';
import { DisplayData } from '../../model/Interface/DisplayData';
import { FilterData } from '../../model/Interface/FilterData';
import { IssueData } from '../../core/model/Feasibility/IssueData';
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData';
import { QuantityUnitData } from '../../model/Interface/Unit';
import { QueryResultData } from '../../model/Interface/QueryResultData';
import { QueryResultLineData } from '../../model/Interface/QueryResultLineData';
import { ReferenceCriteriaListEntryData } from 'src/app/model/Interface/Search/ReferenceCriteriaListEntryData';
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData';
import { SavedDataQueryData } from '../../model/Interface/SavedDataQueryData';
import { SavedDataQueryListItemData } from '../../model/Interface/SavedDataQueryListItemData';
import { StructuredQueryCriterionData } from '../../model/Interface/StructuredQueryCriterionData';
import { StructuredQueryData } from '../../model/Interface/StructuredQueryData';
import { TerminologyCodeBaseData } from '../../model/Interface/TerminologyBaseData';
import { TerminologyCodeData } from '../../model/Interface/TerminologyCodeData';
import { TimeRestrictionData } from '../../model/Interface/TimeRestrictionData';
import { TranslationData } from '../../model/Interface/TranslationData';
import { TypeGuard } from './TypeGuard';
import { UiProfileData } from '../../model/Interface/UiProfileData';
import { ValueDefinitionData } from '../../model/Interface/ValueDefinition';
import { ValueFilterData } from '../../model/Interface/ValueFilterData';

/**
 * Class containing methods for type assertions.
 */
export class TypeAssertion {
  /**
   * Asserts that the object is of type AttributeFilterData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AttributeFilterData.
   */
  public static assertAttributeFilterData(obj: unknown): asserts obj is AttributeFilterData {
    if (!TypeGuard.isAttributeFilterData(obj)) {
      throw new Error(`Invalid AttributeFilterData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type AttributeFilterBaseData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AttributeFilterBaseData.
   */
  public static assertAttributeFilterBaseData(
    obj: unknown
  ): asserts obj is AttributeFilterBaseData {
    if (!TypeGuard.isAttributeFilterBaseData(obj)) {
      throw new Error(`Invalid AttributeFilterBaseData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type ComparatorTypeData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type ComparatorTypeData.
   */
  public static assertComparatorTypeData(obj: unknown): asserts obj is ComparatorTypeData {
    if (!TypeGuard.isComparatorTypeData(obj)) {
      throw new Error(`Invalid ComparatorTypeData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type ContextData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type ContextData.
   */
  public static assertContextData(obj: unknown): asserts obj is ContextData {
    if (!TypeGuard.isContextData(obj)) {
      throw new Error(`Invalid ContextData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type CriteriaProfileData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type CriteriaProfileData.
   */
  public static assertCriteriaProfileData(obj: unknown): asserts obj is CriteriaProfileData {
    if (!TypeGuard.isCriteriaProfileData(obj)) {
      throw new Error(`Invalid CriteriaProfileData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type CRTDLData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type CRTDLData.
   */
  public static assertCRTDLData(obj: unknown): asserts obj is CRTDLData {
    if (!TypeGuard.isCRTDLData(obj)) {
      throw new Error(`Invalid CRTDLData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type DataExtractionData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type DataExtractionData.
   */
  public static assertDataExtractionData(obj: unknown): asserts obj is DataExtractionData {
    if (!TypeGuard.isDataExtractionData(obj)) {
      throw new Error(`Invalid DataExtractionData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type DisplayData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type DisplayData.
   */
  public static assertDisplayData(obj: unknown): asserts obj is DisplayData {
    if (!TypeGuard.isDisplayData(obj)) {
      throw new Error(`Invalid DisplayData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type FilterData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type FilterData.
   */
  public static assertFilterData(obj: unknown): asserts obj is FilterData {
    if (!TypeGuard.isFilterData(obj)) {
      throw new Error(`Invalid FilterData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type IssueData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type IssueData.
   */
  public static assertIssueData(obj: unknown): asserts obj is IssueData {
    if (!TypeGuard.isIssueData(obj)) {
      throw new Error(`Invalid IssueData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type QueryResultData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type QueryResultData.
   */
  public static assertQueryResultData(obj: unknown): asserts obj is QueryResultData {
    if (!TypeGuard.isQueryResultData(obj)) {
      throw new Error(`Invalid QueryResultData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type QueryResultLineData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type QueryResultLineData.
   */
  public static assertQueryResultLineData(obj: unknown): asserts obj is QueryResultLineData {
    if (!TypeGuard.isQueryResultLineData(obj)) {
      throw new Error(`Invalid QueryResultLineData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type Relations.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type Relations.
   */
  public static assertCriteriaRelationsData(obj: unknown): asserts obj is CriteriaRelationsData {
    if (!TypeGuard.isCriteriaRelations(obj)) {
      throw new Error(`Invalid Relations: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type Relatives.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type Relatives.
   */
  public static assertRelatives(obj: unknown): asserts obj is CriteriaRelativeData {
    if (!TypeGuard.isCriteriaRelative(obj)) {
      throw new Error(`Invalid Relatives: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type SavedDataQueryData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type SavedDataQueryData.
   */
  public static assertSavedDataQueryData(obj: unknown): asserts obj is SavedDataQueryData {
    if (!TypeGuard.isSavedDataQueryData(obj)) {
      throw new Error(`Invalid SavedDataQueryData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type SavedDataQueryListItemData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type SavedDataQueryListItemData.
   */
  public static assertSavedDataQueryListItemData(
    obj: unknown
  ): asserts obj is SavedDataQueryListItemData {
    if (!TypeGuard.isSavedDataQueryListItemData(obj)) {
      throw new Error(`Invalid SavedDataQueryListItemData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type SearchResponse.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type SearchResponse.
   */
  public static assertListEntryData(obj: unknown): asserts obj is ListEntryData {
    if (!TypeGuard.isListEntryData(obj)) {
      throw new Error(`Invalid ListEntryData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type SearchResult.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type SearchResult.
   */
  public static assertResultListData<C extends ListEntryData>(
    obj: unknown
  ): asserts obj is ResultListData<C> {
    if (!TypeGuard.isListEntryData(obj)) {
      throw new Error(`Invalid ResultListData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type StructuredQueryCriterionData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type StructuredQueryCriterionData.
   */
  public static assertStructuredQueryCriterionData(
    obj: unknown
  ): asserts obj is StructuredQueryCriterionData {
    if (!TypeGuard.isStructuredQueryCriterionData(obj)) {
      throw new Error(`Invalid StructuredQueryCriterionData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type StructuredQueryData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type StructuredQueryData.
   */
  public static assertStructuredQueryData(obj: unknown): asserts obj is StructuredQueryData {
    if (!TypeGuard.isStructuredQueryData(obj)) {
      throw new Error(`Invalid StructuredQueryData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type TerminologyCodeBaseData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type TerminologyCodeBaseData.
   */
  public static assertTerminologyCodeBaseData(
    obj: unknown
  ): asserts obj is TerminologyCodeBaseData {
    if (!TypeGuard.isTerminologyCodeBaseData(obj)) {
      throw new Error(`Invalid TerminologyCodeBaseData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type TerminologyCodeData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type TerminologyCodeData.
   */
  public static assertTerminologyCodeData(obj: unknown): asserts obj is TerminologyCodeData {
    if (!TypeGuard.isTerminologyCodeData(obj)) {
      throw new Error(`Invalid TerminologyCodeData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type TimeRestrictionData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type TimeRestrictionData.
   */
  public static assertTimeRestrictionData(obj: unknown): asserts obj is TimeRestrictionData {
    if (!TypeGuard.isTimeRestrictionData(obj)) {
      throw new Error(`Invalid TimeRestrictionData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type TranslationData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type TranslationData.
   */
  public static assertTranslationData(obj: unknown): asserts obj is TranslationData {
    if (!TypeGuard.isTranslationData(obj)) {
      throw new Error(`Invalid TranslationData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type UiProfileData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type UiProfileData.
   */
  public static assertUiProfileData(obj: unknown): asserts obj is UiProfileData {
    if (!TypeGuard.isUiProfileData(obj)) {
      throw new Error(`Invalid UiProfileData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type ValueDefinitionData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type ValueDefinitionData.
   */
  public static assertValueDefinitionData(obj: unknown): asserts obj is ValueDefinitionData {
    if (!TypeGuard.isValueDefinitionData(obj)) {
      throw new Error(`Invalid ValueDefinitionData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type ValueFilterData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type ValueFilterData.
   */
  public static assertValueFilterData(obj: unknown): asserts obj is ValueFilterData {
    if (!TypeGuard.isValueFilterData(obj)) {
      throw new Error(`Invalid ValueFilterData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type QuantityUnitData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type QuantityUnitData.
   */
  public static assertQuantityUnitData(obj: unknown): asserts obj is QuantityUnitData {
    if (!TypeGuard.isQuantityUnitData(obj)) {
      throw new Error(`Invalid QuantityUnitData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type AttributeDefinitionData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AttributeDefinitionData.
   */
  public static assertAttributeDefinitionData(
    obj: unknown
  ): asserts obj is AttributeDefinitionData {
    if (!TypeGuard.isAttributeDefinitionData(obj)) {
      throw new Error(`Invalid AttributeDefinitionData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type AttributeCode.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AttributeCode.
   */
  public static assertAttributeCode(obj: unknown): asserts obj is AttributeCode {
    if (!TypeGuard.isAttributeCode(obj)) {
      throw new Error(`Invalid AttributeCode: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type AnnotatedCRTDLData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AnnotatedCRTDLData.
   */
  public static assertAnnotatedCRTDLData(obj: unknown): asserts obj is AnnotatedCRTDLData {
    if (!TypeGuard.isAnnotatedCRTDLData(obj)) {
      throw new Error(`Invalid AnnotatedCRTDLData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type AttributesData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AttributesData.
   */
  public static assertAttributesData(obj: unknown): asserts obj is AttributesData {
    if (!TypeGuard.isAttributesData(obj)) {
      throw new Error(`Invalid AttributesData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type AttributeGroupsData.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type AttributeGroupsData.
   */
  public static assertAttributeGroupsData(obj: unknown): asserts obj is AttributeGroupsData {
    if (!TypeGuard.isAttributeGroupsData(obj)) {
      throw new Error(`Invalid AttributeGroupsData: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * Asserts that the object is of type CodeableConceptResult.
   * @param obj - The object to check.
   * @throws Will throw an error if the object is not of type CodeableConceptResult.
   */
  public static assertCodeableConceptResult(
    obj: unknown
  ): asserts obj is CodeableConceptResultListData {
    if (!TypeGuard.isCodeableConceptResult(obj)) {
      throw new Error(`Invalid CodeableConceptResult: ${JSON.stringify(obj)}`);
    }
  }

  public static assertReferenceCriteriaListEntryData(
    obj: unknown
  ): asserts obj is ReferenceCriteriaListEntryData {
    if (!TypeGuard.isReferenceCriteriaListEntryData(obj)) {
      throw new Error(`Invalid ReferenceCriteriaListEntryData: ${JSON.stringify(obj)}`);
    }
  }

  public static assertCriteriaListListEntryData(
    obj: unknown
  ): asserts obj is CriteriaListEntryData {
    if (!TypeGuard.isCriteriaListListEntryData(obj)) {
      throw new Error(`Invalid CriteriaListListEntryData: ${JSON.stringify(obj)}`);
    }
  }

  public static assertCriteriaRelativeData(obj: unknown): asserts obj is CriteriaRelativeData {
    if (!TypeGuard.isCriteriaRelative(obj)) {
      throw new Error(`Invalid CriteriaRelativeData: ${JSON.stringify(obj)}`);
    }
  }
}
