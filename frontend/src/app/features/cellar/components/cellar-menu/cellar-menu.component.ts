import {Component} from '@angular/core';
import {CellarPickerComponent} from '../cellar-picker/cellar-picker.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'cellar-menu',
    templateUrl: './cellar-menu.component.html',
    imports: [
        CellarPickerComponent,
        RouterLink,
        TranslatePipe,
        RouterLinkActive
    ],
    styleUrl: './cellar-menu.component.scss'
})
export class CellarMenuComponent {
}
