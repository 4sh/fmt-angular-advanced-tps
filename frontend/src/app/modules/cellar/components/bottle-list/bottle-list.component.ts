import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bottle} from '../../models/bottle.model';

@Component({
    selector: 'bottle-list',
    templateUrl: './bottle-list.component.html',
    styleUrl: './bottle-list.component.scss'
})
export class BottleListComponent {
    @Input({required: true}) public bottles?: Bottle[];
    @Output() public selected = new EventEmitter<Bottle>();
}
