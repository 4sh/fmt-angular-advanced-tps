import {authenticate} from '../fixtures/auth';
import {setLocale} from '../fixtures/locale';

describe('Authentication', () => {
    before(() => {
        setLocale();
    });

    it('should properly handle authentication, then route the user to the authenticated space of the app', () => {
        // when
        cy.visit('/');

        // then
        cy.url().should('include', '/auth');
        cy.contains('Login');

        // when
        authenticate();

        // then
        cy.url().should('include', '/cellar/list');
    });
});
