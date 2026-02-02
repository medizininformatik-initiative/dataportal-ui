import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthTokenInterceptor } from './core/interceptors/AuthToken.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreInitService } from './CoreInit.service';
import { CoreModule } from './core/core.module';
import { DataportalErrorHandlerService } from './core/DataportalErrorHandlerService';
import { DataProtectionComponent } from './site/data-protection/data-protection.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/HttpError.interceptor';
import { LayoutModule } from './layout/layout.module';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export const HttpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http);

@NgModule({
  declarations: [AppComponent, DataProtectionComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    LayoutModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [CoreInitService],
      useFactory: (initService: CoreInitService) => () => initService.init(),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: DataportalErrorHandlerService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
