import { AbstractQuantityFilter } from './StructuredQuery/Criterion/Abstract/Quantity/AbstractQuantityFilter';
import { AttributeFilter } from './FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { ConceptFilter } from './FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Display } from './DataSelection/Profile/Display';
import { TemplateRef } from '@angular/core';
import { ValueFilter } from './FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

export interface TemplateContext<T> {
  $implicit: T
}

export interface TabItem<T = unknown> {
  template: TemplateRef<TemplateContext<T>>
  name?: string
  display?: Display
  context?: TemplateContext<T>
}

export type CriterionTabData =
  | AttributeFilter
  | ValueFilter
  | ConceptFilter
  | AbstractQuantityFilter;
