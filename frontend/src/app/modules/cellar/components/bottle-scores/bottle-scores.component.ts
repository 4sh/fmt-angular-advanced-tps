import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottleScore} from '../../models/score.model';

@Component({
    selector: 'bottle-scores',
    templateUrl: './bottle-scores.component.html',
    styleUrl: './bottle-scores.component.scss'
})
export class BottleScoresComponent {
    @Input({required: true}) public scores?: BottleScore[];
    @Output() public submitted = new EventEmitter<number>();
    public score?: number;

    public onNewScore(): void {
        if (this.scores) {
            this.submitted.emit(this.score);
            this.score = undefined;
        }
    }
}
