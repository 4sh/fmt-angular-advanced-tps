import {authenticate, clearSession, getSessionId} from '../fixtures/auth';
import {setLocale} from '../fixtures/locale';
import {Bottle} from '../../src/app/features/cellar/models/bottle.model';

describe('Cellar workflow', () => {
    const createBottles: Bottle[] = [];

    beforeEach(() => {
        clearSession();
        setLocale();
        authenticate();
    });

    beforeEach(() => {
        cy.intercept<Bottle, Bottle>('POST', '/api/private/bottle', (req) => {
            req.continue((res) => {
                createBottles.push(res.body);
            });
        });
    });

    after(() => {
        createBottles.forEach(bottle => {
            cy.request({
                method: 'DELETE',
                url: `/api/private/bottle/${bottle.id}`,
                headers: {
                    Authorization: getSessionId()
                }
            });
        });
    });

    it('should properly render cellar page', () => {
        // then
        cy.url().should('include', '/cellar/list');
        cy.get('bottle-tile').should('not.be.empty');
    });

    it('should properly redirect user to bottle form', () => {
        // when
        cy.get('bottles-list-page >> button').click();

        // then
        cy.url().should('include', '/cellar/bottle/new');
    });

    it('should properly handle bottle creation', () => {
        // given
        const testBottleEstate = 'Test10 estate';
        const testBottleVintage = 2004;

        // when
        cy.get('bottles-list-page >> button').click();
        cy.get('bottle-form > form > input[id=estate]').type(testBottleEstate).trigger('blur');
        cy.get('bottle-form > form > input[id=vintage]').clear().type(testBottleVintage.toString()).trigger('blur');
        cy.get('bottle-form > form').submit();

        // then
        cy.url().should('include', '/cellar/list');
        cy.get('bottle-tile >> .bottleTile-title').contains(testBottleEstate).should('not.be.empty');
    });
});
