import {Component, Input, OnDestroy} from '@angular/core';
import {CellarService} from '../../services/cellar.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Bottle} from '../../models/bottle.model';
import {NotificationService} from '../../../../../shared/services/notification.service';
import {BottleScore} from '../../models/score.model';
import {BottleFormComponent} from '../../components/bottle-form/bottle-form.component';
import {BottleScoresComponent} from '../../components/bottle-scores/bottle-scores.component';

@Component({
    selector: 'bottle-details-page',
    templateUrl: './bottle-details-page.component.html',
    imports: [
        BottleFormComponent,
        BottleScoresComponent
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
            this.fetchBottleById(id);
            this.fetchScoresByBottleId(id);
        }
    }

    constructor(private router: Router,
                private notificationService: NotificationService,
                private cellarService: CellarService) {
    }

    private fetchScoresByBottleId(id: string) {
        this.cellarService
            .getManyScoresByBottleId(id!)
            .subscribe(scores => this.scores = scores);
    }

    private fetchBottleById(id: string) {
        this.cellarService
            .getOneBottleById(id!)
            .subscribe(bottle => this.bottle = bottle);
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

    public createScore(score: number): void {
        if (score) {
            const bottleId = this.bottle!.id!;
            this.cellarService
                .createOneScoreByBottleId(bottleId, score)
                .subscribe(() => this.fetchScoresByBottleId(bottleId));
        }
    }

    ngOnDestroy(): void {
        this.fetchBottleSubscription?.unsubscribe();
        this.saveBottleSubscription?.unsubscribe();
    }
}
