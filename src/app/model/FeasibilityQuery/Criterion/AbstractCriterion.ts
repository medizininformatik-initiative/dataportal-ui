import { AbstractTimeRestriction } from './TimeRestriction/AbstractTimeRestriction';
import { AttributeFilter } from './AttributeFilter/AttributeFilter';
import { CritGroupPosition } from '../CritGroupPosition';
import { Display } from '../../DataSelection/Profile/Display';
import { TerminologyCode } from '../../Terminology/TerminologyCode';
import { ValueFilter } from './AttributeFilter/ValueFilter';
import { FilterTypes } from '../../Utilities/FilterTypes';
import { AbstractQuantityFilter } from './AttributeFilter/Quantity/AbstractQuantityFilter';

/**
 * Abstract class representing a criterion with various filters and properties.
 */
export abstract class AbstractCriterion {
  private attributeFilters?: Array<AttributeFilter> = [];
  private context?: TerminologyCode;
  private criterionHash?: string;
  private display: Display;
  private isInvalid?: boolean = false;
  private isReference = false;
  private position?: CritGroupPosition;
  private termCodes?: Array<TerminologyCode> = [];
  private timeRestriction?: AbstractTimeRestriction;
  private id: string;
  private valueFilters?: Array<ValueFilter> = [];
  private isRequiredFilterSet: boolean;

  /**
   * Constructor for AbstractCriterion.
   *
   * @param isReference - Wether a criterion is a reference
   * @param attributeFilters - Array of AttributeFilter objects.
   * @param criterionHash - Hash string for the criterion.
   * @param context - TerminologyCode object representing the context.
   * @param display - Display string for the criterion.
   * @param isInvalid - Boolean flag indicating if the criterion is invalid.
   * @param position - CritGroupPosition object representing the position.
   * @param id - Unique identifier for the criterion.
   * @param termCodes - Array of TerminologyCode objects.
   * @param timeRestriction - AbstractTimeRestriction object.
   * @param valueFilters - Array of ValueFilter objects.
   * @param isRequiredFilterSet
   */
  constructor(
    isReference: boolean,
    attributeFilters?: Array<AttributeFilter>,
    context?: TerminologyCode,
    criterionHash?: string,
    display?: Display,
    isInvalid?: boolean,
    isRequiredFilterSet?: boolean,
    position?: CritGroupPosition,
    termCodes?: Array<TerminologyCode>,
    timeRestriction?: AbstractTimeRestriction,
    id?: string,
    valueFilters?: Array<ValueFilter>
  ) {
    this.isRequiredFilterSet = isRequiredFilterSet;
    this.attributeFilters = attributeFilters;
    this.context = context;
    this.criterionHash = criterionHash;
    this.display = display;
    this.isInvalid = isInvalid;
    this.isReference = isReference;
    this.position = position;
    this.termCodes = termCodes;
    this.timeRestriction = timeRestriction;
    this.id = id;
    this.valueFilters = valueFilters;
  }

  /**
   *
   * @param isReference
   */
  public setisReference(isReference: boolean) {
    this.isReference = isReference;
  }

  /**
   *
   * @returns
   */
  public getisReference(): boolean {
    return this.isReference;
  }

  /**
   * Gets the attribute filters.
   *
   * @returns Array of AttributeFilter objects or false if attributeFilters is undefined.
   */
  public isAttributeFiltersSet(): boolean {
    if (this.attributeFilters === undefined) {
      return false;
    }
    return true;
  }

  public getAttributeFilters(): Array<AttributeFilter> {
    if (this.attributeFilters === undefined) {
      return [];
    }
    return this.attributeFilters;
  }

  /**
   * Sets the attribute filters.
   *
   * @param attributeFilters - Array of AttributeFilter objects.
   */
  public setAttributeFilters(attributeFilters: Array<AttributeFilter>): void {
    this.attributeFilters = attributeFilters;
  }

  /**
   * Gets the context.
   *
   * @returns TerminologyCode object representing the context.
   */
  public getContext(): TerminologyCode | undefined {
    return this.context;
  }

  /**
   * Sets the context.
   *
   * @param context - TerminologyCode object representing the context.
   */
  public setContext(context: TerminologyCode): void {
    this.context = context;
  }

  /**
   * Gets the criterion hash.
   *
   * @returns Hash string for the criterion.
   */
  public getCriterionHash(): string | undefined {
    return this.criterionHash;
  }

  /**
   * Sets the criterion hash.
   *
   * @param criterionHash - Hash string for the criterion.
   */
  public setCriterionHash(criterionHash: string): void {
    this.criterionHash = criterionHash;
  }

  /**
   * Gets the display string.
   *
   * @returns Display string for the criterion.
   */
  public getDisplay(): Display {
    return this.display;
  }

  /**
   * Sets the display string.
   *
   * @param display - Display string for the criterion.
   */
  public setDisplay(display: Display): void {
    this.display = display;
  }

  /**
   * Gets the invalid flag.
   *
   * @returns Boolean flag indicating if the criterion is invalid.
   */
  public getIsInvalid(): boolean | undefined {
    return this.isInvalid;
  }

  /**
   * Sets the invalid flag.
   *
   * @param isInvalid - Boolean flag indicating if the criterion is invalid.
   */
  public setIsInvalid(isInvalid: boolean): void {
    this.isInvalid = isInvalid;
  }

  /**
   * Gets the position.
   *
   * @returns CritGroupPosition object representing the position.
   */
  public getPosition(): CritGroupPosition | undefined {
    return this.position;
  }

  /**
   * Sets the position.
   *
   * @param position - CritGroupPosition object representing the position.
   */
  public setPosition(position: CritGroupPosition): void {
    this.position = position;
  }

  /**
   * Gets the term codes.
   *
   * @returns Array of TerminologyCode objects.
   */
  public getTermCodes(): Array<TerminologyCode> {
    return this.termCodes;
  }

  /**
   * Sets the term codes.
   *
   * @param termCodes - Array of TerminologyCode objects.
   */
  public setTermCodes(termCodes: Array<TerminologyCode>): void {
    this.termCodes = termCodes;
  }

  /**
   * Gets the time restriction.
   *
   * @returns AbstractTimeRestriction object.
   */
  public getTimeRestriction(): AbstractTimeRestriction | undefined {
    return this.timeRestriction;
  }

  /**
   * Sets the time restriction.
   *
   * @param timeRestriction - AbstractTimeRestriction object.
   */
  public setTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    this.timeRestriction = timeRestriction;
  }

  /**
   * Gets the unique ID.
   *
   * @returns Unique identifier for the criterion.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the unique ID.
   *
   * @param id - Unique identifier for the criterion.
   */
  public setId(id: string): void {
    this.id = id;
  }

  /**
   * Gets the value filters.
   *
   * @returns Array of ValueFilter objects or false if valueFilters is undefined.
   */
  public getValueFilters(): Array<ValueFilter> {
    return this.valueFilters;
  }

  /**
   * Sets the value filters.
   *
   * @param valueFilters - Array of ValueFilter objects.
   */
  public setValueFilters(valueFilters: Array<ValueFilter>): void {
    this.valueFilters = valueFilters;
  }

  public setIsRequiredFilterSet(isRequiredFilterSet: boolean): void {
    this.isRequiredFilterSet = isRequiredFilterSet;
  }

  public getIsRequiredFilterSet(): boolean {
    return this.isRequiredFilterSet;
  }

  /**
   * Convenient method to get concept attribute filters.
   * @returns Array of AttributeFilter containing instances of type CONCEPT.
   */
  public getConceptAttributeFilters(): AttributeFilter[] {
    return this.getAttributeFiltersByType(FilterTypes.CONCEPT);
  }

  /**
   * Convenient method to get reference attribute filters.
   * @returns Array of AttributeFilter containing instances of type REFERENCE.
   */
  public getReferenceAttributeFilters(): AttributeFilter[] {
    return this.getAttributeFiltersByType(FilterTypes.REFERENCE);
  }

  /**
   * Convenient method to get quantity attribute filters.
   * @returns Array of AttributeFilter containing instances of type QUANTITY.
   */
  public getQuantityAttributeFilters(): AttributeFilter[] {
    return this.getAttributeFiltersByType(FilterTypes.QUANTITY);
  }

  /**
   * Convenient method to get quantity value filters.
   * @returns Array of ValueFilter containing instances of type QUANTITY.
   */
  public getQuantityValueFilters(): ValueFilter[] {
    return this.getValueFiltersByType(FilterTypes.QUANTITY);
  }

  /**
   * Convenient method to get concept value filters.
   * @returns Array of ValueFilter containing instances of type CONCEPT.
   */
  public getConceptValueFilters(): ValueFilter[] {
    return this.getValueFiltersByType(FilterTypes.CONCEPT);
  }

  /**
   * Helper method to filter attribute filters by type.
   * @param type
   * @returns Array of AttributeFilter containing instances of the specified type.
   */
  protected getAttributeFiltersByType(type: FilterTypes): AttributeFilter[] {
    return this.getAttributeFilters().filter((f) => f.getFilterType() === type);
  }

  /**
   * Helper method to filter value filters by type.
   * @param type
   * @returns Array of ValueFilter containing instances of the specified type.
   */
  protected getValueFiltersByType(type: FilterTypes): ValueFilter[] {
    return this.getValueFilters().filter((f) => f.getFilterType() === type);
  }
}
