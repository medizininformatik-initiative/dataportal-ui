import { HttpContextToken } from '@angular/common/http';

export const IS_VALIDATION = new HttpContextToken<boolean>(() => false);

export const IS_FEASIBILITY_REQUEST = new HttpContextToken<boolean>(() => false);
