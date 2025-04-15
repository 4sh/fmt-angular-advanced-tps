import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bottle} from '../../models/bottle.model';
import {LowerCasePipe, NgClass} from '@angular/common';
import {BottleStickerImageComponent} from '../bottle-sticker-image/bottle-sticker-image.component';
import {TranslatePipe} from '@ngx-translate/core';
import {ScorePipe} from '../../pipes/score.pipe';

@Component({
    selector: 'bottle-tile',
    templateUrl: './bottle-tile.component.html',
    imports: [
        NgClass,
        BottleStickerImageComponent,
        TranslatePipe,
        LowerCasePipe,
        ScorePipe
    ],
    styleUrl: './bottle-tile.component.scss'
})
export class BottleTileComponent {
    @Input() public bottle?: Bottle;
    @Output() public selected = new EventEmitter<Bottle>();

    public select(bottle: Bottle): void {
        this.selected.emit(bottle);
    }
}
