import {Session} from '../../src/app/modules/auth/models/session.model';
import {storageKey} from '../../src/app/modules/auth/services/auth.service';

function getSession(): Session | undefined {
    const session = window.localStorage.getItem(storageKey);
    if (session) {
        return JSON.parse(session) as Session;
    }
    return undefined;
}

export function getSessionId() {
    return getSession()?.id;
}

export function clearSession() {
    window.localStorage.removeItem(storageKey);
}

export function authenticate() {
    cy.visit('/');
    cy.get('#login').type('test');
    cy.get('#password').type('test');
    cy.get('button[type=submit]').click();
}
