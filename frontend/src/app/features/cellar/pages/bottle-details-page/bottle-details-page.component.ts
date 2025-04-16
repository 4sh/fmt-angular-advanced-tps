import {Component, input, OnDestroy} from '@angular/core';
import {CellarService} from '../../services/cellar.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Bottle} from '../../models/bottle.model';
import {NotificationService} from '../../../../../shared/services/notification.service';
import {BottleScore} from '../../models/score.model';
import {BottleFormComponent} from '../../components/bottle-form/bottle-form.component';
import {TranslatePipe} from '@ngx-translate/core';
import {TabsComponent} from '../../../../../shared/components/tabs/tabs.component';
import {TabComponent} from '../../../../../shared/components/tabs/tab/tab.component';

@Component({
    selector: 'bottle-details-page',
    templateUrl: './bottle-details-page.component.html',
    imports: [
        BottleFormComponent,
        TranslatePipe,
        TabsComponent,
        TabComponent
    ],
    styleUrl: './bottle-details-page.component.scss'
})
export class BottleDetailsPageComponent implements OnDestroy {
    public bottle = input<Bottle | undefined>(undefined);
    public scores?: BottleScore[];
    private fetchBottleSubscription?: Subscription;
    private saveBottleSubscription?: Subscription;

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
