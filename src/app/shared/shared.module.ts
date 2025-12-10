import { CommonModule } from '@angular/common';
import { DirectivesModule } from './directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

export const FORMATS_GERMAN = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

const SHARED_MODULES = [
  TranslateModule,
  FormsModule,
  ReactiveFormsModule,
  DirectivesModule,
  SharedComponentsModule,
];

const SHARED_DECLARATIONS = [];

@NgModule({
  declarations: [...SHARED_DECLARATIONS],
  imports: [...SHARED_MODULES, CommonModule, LayoutModule, MatMomentDateModule],
  exports: [...SHARED_MODULES, ...SHARED_DECLARATIONS],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }, // FIXED
    { provide: MAT_DATE_FORMATS, useValue: FORMATS_GERMAN }, // ADDED
  ],
})
export class SharedModule {}
