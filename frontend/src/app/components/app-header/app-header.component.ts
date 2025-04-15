import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserIdentity} from '../../features/auth/models/session.model';
import {AuthService} from '../../features/auth/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserIdentityPipe} from '../../features/auth/pipes/user-identity.pipe';
import {AppLocalePickerComponent} from '../app-locale-picker/app-locale-picker.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    imports: [
        RouterLink,
        UserIdentityPipe,
        AppLocalePickerComponent,
        TranslatePipe
    ],
    styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent implements OnInit, OnDestroy {
    public currentUserIdentity?: UserIdentity;
    private currentUserSubscription?: Subscription;
    private logoutSubscription?: Subscription;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.currentUserSubscription = this.authService
            .getCurrentUserIdentity()
            .subscribe(identity => this.currentUserIdentity = identity);
    }

    public logout(): void {
        this.logoutSubscription = this.authService
            .logout()
            .subscribe(() => this.router.navigate(['/auth']));
    }

    ngOnDestroy(): void {
        this.currentUserSubscription?.unsubscribe();
        this.logoutSubscription?.unsubscribe();
    }
}
