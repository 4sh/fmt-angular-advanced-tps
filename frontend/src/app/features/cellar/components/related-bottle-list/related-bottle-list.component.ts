import {Component, input, InputSignal, Signal} from '@angular/core';
import {Bottle} from '../../models/bottle.model';
import {CellarService} from '../../services/cellar.service';
import {BottleListComponent} from '../bottle-list/bottle-list.component';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';

@Component({
    selector: 'related-bottle-list',
    templateUrl: './related-bottle-list.component.html',
    imports: [BottleListComponent],
    styleUrl: './related-bottle-list.component.scss'
})
export class RelatedBottleListComponent {
    public bottle: InputSignal<Bottle | undefined> = input.required<Bottle | undefined>();
    public bottles: Signal<Bottle[] | undefined> = toSignal(
        toObservable(this.bottle).pipe(
            switchMap(bottle => bottle?.id ? this.cellarService.getManyRelatedBottlesByBottleId(bottle.id) : of([]))
        ),
        { initialValue: [] }
    );

    constructor(private cellarService: CellarService) {}
}
