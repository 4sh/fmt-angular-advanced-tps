import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CellarMenuComponent} from '../../components/cellar-menu/cellar-menu.component';

@Component({
    selector: 'cellar-page',
    templateUrl: './cellar-page.component.html',
    imports: [
        RouterOutlet,
        CellarMenuComponent
    ],
    styleUrl: './cellar-page.component.scss'
})
export class CellarPageComponent {

}
