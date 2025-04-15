import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocaleService} from '../../services/locale.service';
import {AppHeaderComponent} from '../../components/app-header/app-header.component';
import {RouterOutlet} from '@angular/router';
import {AppFooterComponent} from '../../components/app-footer/app-footer.component';

@Component({
    selector: 'app-root-page',
    templateUrl: './app-root-page.component.html',
    imports: [
        AppHeaderComponent,
        RouterOutlet,
        AppFooterComponent
    ],
    styleUrl: './app-root-page.component.scss'
})
export class AppRootPageComponent {
    constructor(translateService: TranslateService, localeService: LocaleService) {
        translateService.use(localeService.getCurrentLocale());
    }
}
