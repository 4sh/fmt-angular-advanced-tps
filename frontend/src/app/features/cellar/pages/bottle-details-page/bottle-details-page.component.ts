import {Component, Input, OnDestroy} from '@angular/core';
import {CellarService} from '../../services/cellar.service';
import {Router} from '@angular/router';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {Bottle} from '../../models/bottle.model';
import {NotificationService} from '../../../../../shared/services/notification.service';
import {BottleScore} from '../../models/score.model';
import {BottleFormComponent} from '../../components/bottle-form/bottle-form.component';
import {BottleScoresComponent} from '../../components/bottle-scores/bottle-scores.component';
import {TranslatePipe} from '@ngx-translate/core';
import {TabsComponent} from '../../../../../shared/components/tabs/tabs.component';
import {TabComponent} from '../../../../../shared/components/tabs/tab/tab.component';
import {RelatedBottleListComponent} from '../../components/related-bottle-list/related-bottle-list.component';

@Component({
    selector: 'bottle-details-page',
    templateUrl: './bottle-details-page.component.html',
    imports: [
        BottleFormComponent,
        BottleScoresComponent,
        TranslatePipe,
        TabsComponent,
        TabComponent,
        RelatedBottleListComponent
    ],
    styleUrl: './bottle-details-page.component.scss'
})
export class BottleDetailsPageComponent implements OnDestroy {
    public bottle?: Bottle;
    public scores?: BottleScore[];
    private fetchBottleSubscription?: Subscription;
    private saveBottleSubscription?: Subscription;

    @Input()
    public set id(id: string) {
        if (id) {
            this.fetchDataByBottleId(id);
        }
    }

    private fetchDataByBottleId(id: string) {
        combineLatest([
            this.fetchBottleById(id),
            this.fetchScoresByBottleId(id)
        ])
            .subscribe(([bottle, scores]) => {
                this.bottle = bottle;
                this.scores = scores;
            });
    }

    constructor(private router: Router,
                private notificationService: NotificationService,
                private cellarService: CellarService) {
    }

    private fetchScoresByBottleId(id: string): Observable<BottleScore[]> {
        return this.cellarService
            .getManyScoresByBottleId(id!);
    }

    private fetchBottleById(id: string): Observable<Bottle> {
        return this.cellarService
            .getOneBottleById(id!);
    }

    public saveBottle(bottle: Bottle): void {
        const onAfterSave = () => {
            this.notificationService.success('bottle.createOrUpdate.success');
            this.router.navigate(['/cellar/list']);
        };
        if (bottle.id) {
            this.saveBottleSubscription = this.cellarService
                .updateOneBottle(bottle)
                .subscribe(onAfterSave);
        } else {
            this.saveBottleSubscription = this.cellarService
                .createOneBottle(bottle)
                .subscribe(onAfterSave);
        }
    }

    public createScore(score: number | undefined | null): void {
        if (score) {
            const bottleId = this.bottle!.id!;
            this.cellarService
                .createOneScoreByBottleId(bottleId, score)
                .subscribe(() => this.fetchDataByBottleId(bottleId));
        }
    }

    ngOnDestroy(): void {
        this.fetchBottleSubscription?.unsubscribe();
        this.saveBottleSubscription?.unsubscribe();
    }
}
