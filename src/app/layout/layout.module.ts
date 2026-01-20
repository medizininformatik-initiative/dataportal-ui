import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../shared/directives/directives.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FONT_AWESOME_ICONS } from './font-awesome-icons';
import { HeaderComponent } from './components/header/header.component';
import { LanguageComponent } from './components/language/language.component';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorLogComponent } from './components/error-log/error-log.component';

const SHARED_MODULES = [MaterialModule, FlexLayoutModule, FontAwesomeModule];

@NgModule({
  declarations: [
    AppLayoutComponent,
    HeaderComponent,
    SideMenuComponent,
    LanguageComponent,
    AboutModalComponent,
    ErrorLogComponent,
  ],
  imports: [
    ...SHARED_MODULES,
    CommonModule,
    RouterModule,
    TranslateModule,
    DirectivesModule,
    SharedComponentsModule,
  ],
  exports: [...SHARED_MODULES, AppLayoutComponent],
})
export class LayoutModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...FONT_AWESOME_ICONS);
  }
}
