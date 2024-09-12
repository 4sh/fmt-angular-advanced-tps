import {Component, Input} from '@angular/core';
import {BottleScore} from '../../../models/score.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../auth/services/auth.service';
import {Bottle} from '../../../models/bottle.model';
import {CellarService} from '../../../services/cellar.service';
import {uniqueScoreValidator} from '../../../validators/unique-score.validator';

type BottleScoreFormItem = {
    score: FormControl<number | undefined | null>
};

@Component({
    selector: 'bottle-scores-page',
    templateUrl: './bottle-scores-page.component.html',
    styleUrl: './bottle-scores-page.component.scss'
})
export class BottleScoresPageComponent {
    public _bottle!: Bottle;
    public scores: BottleScore[] = [];
    public scoreForm: FormGroup<BottleScoreFormItem>;

    @Input({required: true})
    public set bottle(bottle: Bottle) {
        this._bottle = bottle;
        this.loadBottleScores(bottle.id!);
    }

    constructor(
        formBuilder: FormBuilder,
        authService: AuthService,
        private cellarService: CellarService
    ) {
        this.scoreForm = formBuilder.group<BottleScoreFormItem>({
            score: new FormControl<number | undefined>(
                undefined,
                {
                    validators: [Validators.required, Validators.min(0), Validators.max(20)],
                    asyncValidators: [uniqueScoreValidator(authService, this.scores)],
                    updateOn: 'blur'
                }
            )
        });
    }

    public createScore(): void {
        const score = this.scoreForm.value.score;
        if (score) {
            const bottleId = this._bottle.id!;
            this.cellarService
                .createOneScoreByBottleId(bottleId, score)
                .subscribe(() => this.loadBottleScores(bottleId));
        }
    }

    private loadBottleScores(id: string) {
        this.cellarService
            .getManyScoresByBottleId(id)
            .subscribe(scores => {
                this.scores.splice(0, this.scores.length);
                this.scores.unshift(...scores);
            });
    }
}
