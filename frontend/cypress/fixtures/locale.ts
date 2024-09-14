import {storageKey} from '../../src/app/services/locale.service';

export function setLocale() {
    window.localStorage.setItem(storageKey, 'en-GB');
}

export function clearLocale() {
    window.localStorage.removeItem(storageKey);
}
