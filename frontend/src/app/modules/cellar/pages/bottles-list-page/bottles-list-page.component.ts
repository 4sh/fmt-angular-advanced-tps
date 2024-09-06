import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Bottle, BottleCriteria} from '../../models/bottle.model';
import {CellarService} from '../../services/cellar.service';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, map, Subscription} from 'rxjs';

@Component({
    selector: 'bottles-list-page',
    templateUrl: './bottles-list-page.component.html',
    styleUrl: './bottles-list-page.component.scss'
})
export class BottlesListPageComponent implements OnInit, OnDestroy {
    public bottles: Bottle[] = [];
    public query: string = '';

    private fetchBottlesSubscription?: Subscription;
    public queryChange = new EventEmitter<string>();

    constructor(private router: Router,
                private cellarService: CellarService) {
    }

    ngOnInit(): void {
        this.fetchBottles();
        this.queryChange
            .pipe(
                map(q => q.trim()),
                distinctUntilChanged(),
                debounceTime(200)
            )
            .subscribe(query => this.fetchBottles({q: query}));
    }

    private fetchBottles(criteria?: BottleCriteria) {
        this.fetchBottlesSubscription?.unsubscribe();
        this.fetchBottlesSubscription = this.cellarService
            .getManyBottles(criteria)
            .subscribe(bottles => this.bottles = bottles);
    }

    public edit(bottle: Bottle): void {
        this.router.navigate(['/cellar/bottle', bottle.id, 'details']).then();
    }

    ngOnDestroy(): void {
        this.fetchBottlesSubscription?.unsubscribe();
    }
}
