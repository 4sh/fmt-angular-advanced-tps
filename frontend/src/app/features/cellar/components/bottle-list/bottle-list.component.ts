import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {Bottle} from '../../models/bottle.model';
import {BottleTileComponent} from '../bottle-tile/bottle-tile.component';

@Component({
    selector: 'bottle-list',
    templateUrl: './bottle-list.component.html',
    imports: [BottleTileComponent],
    styleUrl: './bottle-list.component.scss'
})
export class BottleListComponent {
    public bottles: InputSignal<Bottle[] | undefined> = input.required<Bottle[] | undefined>();
    public selected: OutputEmitterRef<Bottle> = output<Bottle>();
}
