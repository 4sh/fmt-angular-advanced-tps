import {AppRootPageComponent} from './app/pages/app-root-page/app-root-page.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {authInterceptor} from './app/features/auth/interceptors/auth.interceptor';
import {errorInterceptor} from './app/features/auth/interceptors/error.interceptor';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app/app-root.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {LOCALE_ID} from '@angular/core';
import {LocaleService} from './app/services/locale.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import {cellarInterceptor} from './app/features/cellar/interceptors/cellar.interceptor';

registerLocaleData(localeEn);
registerLocaleData(localeFr);

bootstrapApplication(AppRootPageComponent, {
    providers: [
        provideHttpClient(
            withInterceptorsFromDi(),
            withInterceptors([authInterceptor, errorInterceptor, cellarInterceptor])
        ),
        provideRouter(routes, withComponentInputBinding()),
        provideAnimations(),
        provideToastr({
            positionClass: 'toast-bottom-right',
            progressBar: true,
        }),
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        {
            provide: LOCALE_ID,
            deps: [LocaleService],
            useFactory: (localeService: LocaleService) => localeService.getCurrentLocale()
        }
    ]
})
    .catch(err => console.error(err));

export function createTranslateLoader(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, '/static/i18n/labels_', '.json');
}
