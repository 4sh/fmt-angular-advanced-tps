import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {RouterModule} from '@angular/router';
import {routes} from './app-root.routes';
import {AppRootPageComponent} from './pages/app-root-page/app-root-page.component';
import {AppHeaderComponent} from './components/app-header/app-header.component';
import {AppFooterComponent} from './components/app-footer/app-footer.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './modules/auth/interceptors/auth.interceptor';
import {errorInterceptor} from './modules/auth/interceptors/error.interceptor';
import {AuthModule} from './modules/auth/auth.module';
import {CellarModule} from './modules/cellar/cellar.module';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LocaleService} from './services/locale.service';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import {AppLocalePickerComponent} from './components/app-locale-picker/app-locale-picker.component';
import {cellarInterceptor} from './modules/cellar/interceptors/cellar.interceptor';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';

registerLocaleData(localeEn);
registerLocaleData(localeFr);
registerLocaleData(localeEs);

export function createTranslateLoader(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, '/static/i18n/labels_', '.json');
}

const components: unknown[] = [
    AppHeaderComponent,
    AppFooterComponent,
    AppLocalePickerComponent
];

const pages: unknown[] = [
    AppRootPageComponent
];

@NgModule({
    declarations: [
        components,
        pages
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes, {bindToComponentInputs: true, paramsInheritanceStrategy: 'always'}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler
            }
        }),
        FormsModule,
        AuthModule,
        CellarModule
    ],
    bootstrap: [AppRootPageComponent],
    providers: [
        provideHttpClient(
            withInterceptors([authInterceptor, errorInterceptor, cellarInterceptor])
        ),
        {
            provide: LOCALE_ID,
            deps: [LocaleService],
            useFactory: (localeService: LocaleService) => localeService.getCurrentLocale()
        }
    ]
})
export class AppRootModule {
}
