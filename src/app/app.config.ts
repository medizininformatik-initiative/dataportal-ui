import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ApplicationConfig, ErrorHandler, importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { OAuthModule } from 'angular-oauth2-oidc'
import { routes } from './app-routing.module'
import { DataportalErrorHandlerService } from './core/DataportalErrorHandlerService'
import { AuthTokenInterceptor } from './core/interceptors/AuthToken.interceptor'
import { HttpErrorInterceptor } from './core/interceptors/HttpError.interceptor'
import { CoreInitService } from './CoreInit.service'
import { FONT_AWESOME_ICONS } from './layout/font-awesome-icons'
import { DisplayTranslationPipe } from './shared/pipes/DisplayTranslationPipe'

export const HttpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http)

const DATE_FORMATS_GERMAN = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}

function initializeFontAwesome(): void {
  inject(FaIconLibrary).addIcons(...FONT_AWESOME_ICONS)
}

function provideTranslateModule() {
  return TranslateModule.forRoot({
    defaultLanguage: 'de',
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter(DATE_FORMATS_GERMAN),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    importProvidersFrom(OAuthModule.forRoot(), provideTranslateModule()),
    provideAppInitializer(() => inject(CoreInitService).init()),
    provideAppInitializer(() => initializeFontAwesome()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: DataportalErrorHandlerService },
    DisplayTranslationPipe,
  ],
}
