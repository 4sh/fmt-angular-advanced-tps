import {Component, Input} from '@angular/core';
import {Bottle} from '../../../models/bottle.model';
import {CellarService} from '../../../services/cellar.service';

@Component({
    selector: 'related-bottle-list-page',
    templateUrl: './related-bottle-list-page.component.html',
    styleUrl: './related-bottle-list-page.component.scss'
})
export class RelatedBottleListPageComponent {
    public bottles?: Bottle[];

    @Input({required: true})
    public set bottle(bottle: Bottle) {
        if (bottle.id) {
            this.cellarService
                .getManyRelatedBottlesByBottleId(bottle.id)
                .subscribe(bottles => this.bottles = bottles);
        }
    }

    constructor(private cellarService: CellarService) {
    }
}
