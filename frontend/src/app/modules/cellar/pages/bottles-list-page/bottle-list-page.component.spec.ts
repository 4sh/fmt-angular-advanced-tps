import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import {BottlesListPageComponent} from './bottles-list-page.component';
import {CellarModule} from '../../cellar.module';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {routes} from '../../cellar.routes';
import {of} from 'rxjs';
import {TestUtils} from '../../services/test-utils';
import {CellarService} from '../../services/cellar.service';
import {By} from '@angular/platform-browser';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('BottlesListPageComponent', () => {
    let fixture: ComponentFixture<BottlesListPageComponent>;
    let cellarServiceSpy: SpyObj<CellarService>;
    const testBottles = TestUtils.buildBottles();

    beforeEach(() => {
        cellarServiceSpy = createSpyObj('CellarService', ['getManyBottles']);
        cellarServiceSpy.getManyBottles.and
            .callFake((criteria) =>
                of(testBottles
                    .filter(bottle => !criteria?.q || bottle.estate.match(new RegExp(criteria.q, 'i')))
                )
            );
    });

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                imports: [
                    CellarModule,
                    TranslateModule.forRoot({}),
                    RouterModule.forRoot(routes),
                ],
                providers: [
                    {provide: ComponentFixtureAutoDetect, useValue: true},
                    {provide: CellarService, useValue: cellarServiceSpy}
                ],
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BottlesListPageComponent);
    });

    it('should properly create page component', () => {
        // then
        expect(fixture.componentInstance)
            .toBeDefined();
    });

    it('should properly load bottles in the internal page component\'s context', () => {
        // then
        expect(cellarServiceSpy.getManyBottles)
            .toHaveBeenCalled();
        expect(fixture.componentInstance.bottles)
            .toEqual(testBottles);
    });

    it('should properly trigger search on user input', async () => {
        // given
        const userInputNode = fixture.debugElement.query(By.css('input'));
        const userInput = 'Carbo';

        // when
        userInputNode.nativeElement.value = userInput;
        userInputNode.nativeElement.dispatchEvent(new Event('input'));
        await fixture.whenStable();

        // then
        expect(userInputNode)
            .toBeDefined();
        expect(cellarServiceSpy.getManyBottles)
            .toHaveBeenCalledWith({q: userInput});
        expect(fixture.componentInstance.bottles)
            .toHaveSize(1);
    });
});
