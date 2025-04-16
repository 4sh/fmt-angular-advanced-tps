import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottleScore} from '../../models/score.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ScorePipe} from '../../pipes/score.pipe';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../auth/services/auth.service';
import {uniqueScoreValidator} from '../../validators/unique-score.validator';

type BottleScoreFormItem = {
    score: FormControl<number | undefined | null>
};

@Component({
    selector: 'bottle-scores',
    templateUrl: './bottle-scores.component.html',
    imports: [
        FormsModule,
        TranslatePipe,
        ScorePipe,
        DatePipe,
        ReactiveFormsModule
    ],
    styleUrl: './bottle-scores.component.scss'
})
export class BottleScoresComponent {
    @Output() public submitted = new EventEmitter<number | undefined | null>();
    public scoreForm?: FormGroup<BottleScoreFormItem>;
    private _scores?: BottleScore[];

    @Input({required: true})
    public set scores(scores: BottleScore[] | undefined) {
        this._scores = scores;
        if (scores) {
            this.scoreForm = this.formBuilder.group<BottleScoreFormItem>({
                score: new FormControl<number | undefined | null>(
                    undefined,
                    {
                        validators: [Validators.required, Validators.min(0), Validators.max(20)],
                        asyncValidators: [uniqueScoreValidator(this.authService, scores)],
                        updateOn: 'blur'
                    }
                )
            });
        }
    }

    public get scores(): BottleScore[] | undefined {
        return this._scores;
    }

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

    public onNewScore(): void {
        if (this.scoreForm) {
            this.submitted.emit(this.scoreForm.value.score);
            this.scoreForm.setValue({score: null});
        }
    }
}
