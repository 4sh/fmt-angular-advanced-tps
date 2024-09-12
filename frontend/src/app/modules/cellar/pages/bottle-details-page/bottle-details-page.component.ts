import {Component, Input, OnDestroy} from '@angular/core';
import {CellarService} from '../../services/cellar.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Bottle} from '../../models/bottle.model';
import {NotificationService} from '../../../../../shared/services/notification.service';

@Component({
    selector: 'bottle-details-page',
    templateUrl: './bottle-details-page.component.html',
    styleUrl: './bottle-details-page.component.scss'
})
export class BottleDetailsPageComponent implements OnDestroy {
    public _bottle?: Bottle;
    private fetchBottleSubscription?: Subscription;
    private saveBottleSubscription?: Subscription;

    @Input()
    public set bottle(bottle: Bottle) {
        this._bottle = bottle;
    }

    public get bottle(): Bottle | undefined {
        return this._bottle;
    }

    constructor(private router: Router,
                private notificationService: NotificationService,
                private cellarService: CellarService) {
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

    ngOnDestroy(): void {
        this.fetchBottleSubscription?.unsubscribe();
        this.saveBottleSubscription?.unsubscribe();
    }
}
