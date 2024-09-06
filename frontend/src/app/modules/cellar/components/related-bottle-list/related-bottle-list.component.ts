import {Component, Input} from '@angular/core';
import {Bottle} from '../../models/bottle.model';
import {CellarService} from '../../services/cellar.service';

@Component({
    selector: 'related-bottle-list',
    templateUrl: './related-bottle-list.component.html',
    styleUrl: './related-bottle-list.component.scss'
})
export class RelatedBottleListComponent {
    public bottles?: Bottle[];

    constructor(private cellarService: CellarService) {
    }

    @Input({required: true})
    public set bottle(bottle: Bottle | undefined) {
        if (bottle?.id) {
            this.cellarService
                .getManyRelatedBottlesByBottleId(bottle.id)
                .subscribe(bottles => this.bottles = bottles);
        }
    }
}
