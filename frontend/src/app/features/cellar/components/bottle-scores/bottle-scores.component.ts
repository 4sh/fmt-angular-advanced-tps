import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottleScore} from '../../models/score.model';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ScorePipe} from '../../pipes/score.pipe';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'bottle-scores',
    templateUrl: './bottle-scores.component.html',
    imports: [
        FormsModule,
        TranslatePipe,
        ScorePipe,
        DatePipe
    ],
    styleUrl: './bottle-scores.component.scss'
})
export class BottleScoresComponent {
    @Input({required: true})
    public scores?: BottleScore[];

    @Output()
    public submitted = new EventEmitter<number>();
    public score?: number;

    public onNewScore(): void {
        if (this.scores) {
            this.submitted.emit(this.score);
            this.score = undefined;
        }
    }
}
