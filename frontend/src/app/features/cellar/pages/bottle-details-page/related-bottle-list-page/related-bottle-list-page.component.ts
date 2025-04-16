import {Component, input, InputSignal, Signal} from '@angular/core';
import {Bottle} from '../../../models/bottle.model';
import {CellarService} from '../../../services/cellar.service';
import {BottleListComponent} from '../../../components/bottle-list/bottle-list.component';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';

@Component({
    selector: 'related-bottle-list-page',
    templateUrl: './related-bottle-list-page.component.html',
    imports: [
        BottleListComponent
    ],
    styleUrl: './related-bottle-list-page.component.scss'
})
export class RelatedBottleListPageComponent {
    public bottle: InputSignal<Bottle | undefined> = input.required<Bottle | undefined>();
    public bottles: Signal<Bottle[] | undefined> = toSignal(
        toObservable(this.bottle).pipe(
            switchMap(bottle => bottle?.id ? this.cellarService.getManyRelatedBottlesByBottleId(bottle.id) : of([]))
        ),
        { initialValue: [] }
    );

    constructor(private cellarService: CellarService) {}
}
