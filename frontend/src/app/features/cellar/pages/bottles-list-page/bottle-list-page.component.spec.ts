import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import {BottlesListPageComponent} from './bottles-list-page.component';
import {of} from 'rxjs';
import {CellarService} from '../../services/cellar.service';
import {By} from '@angular/platform-browser';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import {CellarTestUtils} from '../../test/cellar-test-utils';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {cellarRoutes} from '../../cellar.routes';

describe('BottlesListPageComponent', () => {
    let fixture: ComponentFixture<BottlesListPageComponent>;
    let cellarServiceSpy: SpyObj<CellarService>;
    const testBottles = CellarTestUtils.buildBottles();

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
                    BottlesListPageComponent,
                    TranslateModule.forRoot({}),
                    RouterModule.forRoot(cellarRoutes)
                ],
                providers: [
                    {provide: ComponentFixtureAutoDetect, useValue: true},
                    {provide: CellarService, useValue: cellarServiceSpy}
                ],
            })
            .compileComponents();

        fixture = TestBed.createComponent(BottlesListPageComponent);
    });

    it('should properly create page component', () => {
        expect(fixture.componentInstance).toBeDefined();
    });

    it('should properly load bottles in the internal page component\'s context', () => {
        expect(cellarServiceSpy.getManyBottles).toHaveBeenCalled();
        expect(fixture.componentInstance.bottles).toEqual(testBottles);
    });

    it('should properly trigger search on user input', async () => {
        const userInputNode = fixture.debugElement.query(By.css('input'));
        const userInput = 'Carbo';

        userInputNode.nativeElement.value = userInput;
        userInputNode.nativeElement.dispatchEvent(new Event('input'));
        await fixture.whenStable();

        expect(userInputNode).toBeDefined();
        expect(cellarServiceSpy.getManyBottles).toHaveBeenCalledWith({q: userInput});
        expect(fixture.componentInstance.bottles).toHaveSize(1);
    });
});
