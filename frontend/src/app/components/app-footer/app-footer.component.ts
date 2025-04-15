import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: './app-footer.component.html',
    imports: [
        TranslatePipe
    ],
    styleUrl: './app-footer.component.scss'
})
export class AppFooterComponent {

}
