import { AuthTokenInterceptor } from './core/interceptors/AuthToken.interceptor'
import { CoreInitService } from './CoreInit.service'
import { DataportalErrorHandlerService } from './core/DataportalErrorHandlerService'
import { DisplayTranslationPipe } from './shared/pipes/DisplayTranslationPipe'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { FONT_AWESOME_ICONS } from './layout/font-awesome-icons'
import { HttpErrorInterceptor } from './core/interceptors/HttpError.interceptor'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core'
import { OAuthModule } from 'angular-oauth2-oidc'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { routes } from './app-routing.module'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'

export const HttpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http)

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
