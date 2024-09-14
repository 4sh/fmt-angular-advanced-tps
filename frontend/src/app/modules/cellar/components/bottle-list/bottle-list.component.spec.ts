import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import {CellarModule} from '../../cellar.module';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {routes} from '../../cellar.routes';
import {TestUtils} from '../../services/test-utils';
import {BottleListComponent} from './bottle-list.component';

describe('BottlesListComponent', () => {
    let fixture: ComponentFixture<BottleListComponent>;
    const testBottles = TestUtils.buildBottles();

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                imports: [
                    CellarModule,
                    TranslateModule.forRoot({}),
                    RouterModule.forRoot(routes),
                ],
                providers: [
                    {provide: ComponentFixtureAutoDetect, useValue: true}
                ]
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BottleListComponent);
    });

    it('should properly create component', () => {
        expect(fixture.componentInstance)
            .toBeDefined();
    });

    it('should properly display loaded bottles', async () => {
        // when
        fixture.componentInstance.bottles = testBottles;
        fixture.detectChanges();

        // then
        const displayBottleEstates = Array
            .from<HTMLDivElement>(fixture.nativeElement.querySelectorAll('div.bottleTile-title'))
            .map(node => node.textContent) as string[];
        expect(displayBottleEstates)
            .toHaveSize(testBottles.length);
    });
});
