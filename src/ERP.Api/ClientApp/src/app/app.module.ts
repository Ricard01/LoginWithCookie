import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule, isDevMode} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from "./layout/layout.module";
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {CoreModule} from "./core/core.module";
import {CsrfInterceptor} from "./core/interceptor/csrf.interceptor";
import {ErrorInterceptor} from "./core/interceptor/error.interceptor";
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule,
    // SharedModule,
    StoreModule.forRoot({}, {
      // metaReducers: [loggingMetaReducer],
      runtimeChecks: {
        strictStateImmutability: true, // Avoid writing wrong
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      }
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),
    EffectsModule.forRoot([]),
    //EffectsModule.forRoot([]),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
