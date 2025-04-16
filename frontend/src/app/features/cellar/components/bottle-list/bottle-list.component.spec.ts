import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BottleListComponent} from './bottle-list.component';
import {CellarTestUtils} from '../../test/cellar-test-utils';
import {BottleTileComponent} from '../bottle-tile/bottle-tile.component';
import {TranslateModule} from '@ngx-translate/core';

describe('BottlesListComponent', () => {
    let fixture: ComponentFixture<BottleListComponent>;
    const testBottles = CellarTestUtils.buildBottles();

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                imports: [
                    BottleTileComponent,
                    TranslateModule.forRoot({}),
                ]
            })
            .compileComponents();

        fixture = TestBed.createComponent(BottleListComponent);
    });

    it('should properly create component', () => {
        expect(fixture.componentInstance).toBeDefined();
    });

    it('should properly display loaded bottles', async () => {
        fixture.componentRef.setInput('bottles', testBottles);
        fixture.detectChanges();

        const displayBottleEstates = Array
            .from<HTMLDivElement>(fixture.nativeElement.querySelectorAll('div.bottleTile-title'))
            .map(node => node.textContent) as string[];

        expect(displayBottleEstates).toHaveSize(testBottles.length);
    });
});
