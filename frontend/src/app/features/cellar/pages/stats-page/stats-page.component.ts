import {Component, OnDestroy, OnInit} from '@angular/core';
import {Stats} from '../../models/stats.model';
import {CellarService} from '../../services/cellar.service';
import {Subscription} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {KeyValuePipe} from '@angular/common';

@Component({
    selector: 'stats-page',
    templateUrl: './stats-page.component.html',
    imports: [
        TranslatePipe,
        KeyValuePipe
    ],
    styleUrl: './stats-page.component.scss'
})
export class StatsPageComponent implements OnInit, OnDestroy {
    public stats?: Stats;
    private subscription?: Subscription;

    constructor(private cellarService: CellarService) {
    }

    ngOnInit(): void {
        this.subscription = this.cellarService
            .getStats()
            .subscribe(stats => this.stats = stats);
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
