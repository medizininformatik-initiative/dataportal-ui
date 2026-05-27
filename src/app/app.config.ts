import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core'
import { provideRouter } from '@angular/router'
import { routes } from './app-routing.module'
import { AuthTokenInterceptor } from './core/interceptors/AuthToken.interceptor'
import { CoreInitService } from './CoreInit.service'
import { DataportalErrorHandlerService } from './core/DataportalErrorHandlerService'
import { DisplayTranslationPipe } from './shared/pipes/DisplayTranslationPipe'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { FONT_AWESOME_ICONS } from './layout/font-awesome-icons'
import { HttpErrorInterceptor } from './core/interceptors/HttpError.interceptor'
import { OAuthModule } from 'angular-oauth2-oidc'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS_GERMAN },
    importProvidersFrom(
      OAuthModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [CoreInitService],
      useFactory: (initService: CoreInitService) => () => initService.init(),
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [FaIconLibrary],
      useFactory: (library: FaIconLibrary) => () => library.addIcons(...FONT_AWESOME_ICONS),
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: DataportalErrorHandlerService },
    DisplayTranslationPipe,
  ],
}
