import {Injectable} from '@angular/core';

export const supportedLocales: string[] = ['fr-FR', 'en-GB'];
const defaultLocale: string = 'fr-FR';
const storageKey = '_winecellar.io_current_locale';

@Injectable({
    providedIn: 'root'
})
export class LocaleService {

    public getCurrentLocale(): string {
        return localStorage.getItem(storageKey) || defaultLocale;
    }

    public setCurrentLocale(locale: string): void {
        localStorage.setItem(storageKey, locale);
    }
}
