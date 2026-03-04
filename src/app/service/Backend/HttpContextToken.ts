import { HttpContextToken } from '@angular/common/http';
import { TypeAssertion } from '../TypeGuard/TypeAssersations';

export const IS_VALIDATION = new HttpContextToken<boolean>(() => false);

export const IS_FEASIBILITY_REQUEST = new HttpContextToken<boolean>(() => false);

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export type ResponseGuard<T> = (value: unknown) => value is T;

export const RESPONSE_GUARD = new HttpContextToken<ResponseGuard<any> | null>(() => null);

export interface HttpContextTokenOptions<T = unknown> {
  guard?: ResponseGuard<T>
  skipAuth?: boolean
  validateResponse?: boolean
}

export type ResponseAssert<T> = (value: unknown) => asserts value is T;

export const RESPONSE_ASSERT = new HttpContextToken<ResponseAssert<any> | null>(() => null);

export type AssertionMethod = (typeof TypeAssertion)[keyof typeof TypeAssertion];
