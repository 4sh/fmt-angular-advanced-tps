import {Component, effect, input, InputSignal, signal, untracked} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BottleScore} from '../../../models/score.model';
import {uniqueScoreValidator} from '../../../validators/unique-score.validator';
import {AuthService} from '../../../../auth/services/auth.service';
import {TranslatePipe} from '@ngx-translate/core';
import {ScorePipe} from '../../../pipes/score.pipe';
import {DatePipe} from '@angular/common';
import {CellarService} from '../../../services/cellar.service';
import {Bottle} from '../../../models/bottle.model';

type BottleScoreFormItem = {
    score: FormControl<number | undefined | null>
};

@Component({
    selector: 'bottle-scores-page',
    templateUrl: './bottle-scores-page.component.html',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslatePipe,
        ScorePipe,
        DatePipe
    ],
    styleUrl: './bottle-scores-page.component.scss'
})
export class BottleScoresPageComponent {
    public bottle: InputSignal<Bottle> = input.required<Bottle>();
    public scoreForm?: FormGroup<BottleScoreFormItem>;
    public scores = signal<BottleScore[]>([]);

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private cellarService: CellarService
    ) {
        this.scoreForm = this.formBuilder.group<BottleScoreFormItem>({
            score: new FormControl<number | undefined | null>(
                undefined,
                {
                    validators: [Validators.required, Validators.min(0), Validators.max(20)],
                    asyncValidators: [uniqueScoreValidator(this.authService, this.scores())],
                    updateOn: 'blur'
                }
            )
        });

        effect(() => {
            const id = this.bottle()?.id;
            untracked(() => this.loadBottleScores(id));
        });
    }

    public createScore(): void {
        const score = this.scoreForm?.value.score;
        if (score !== undefined && score !== null && !isNaN(score)) {
            const bottleId = this.bottle().id!;
            this.cellarService
                .createOneScoreByBottleId(bottleId, score)
                .subscribe(() => this.loadBottleScores(bottleId));
        }
    }

    private loadBottleScores(id?: string) {
        if(id) {
            this.cellarService
                .getManyScoresByBottleId(id)
                .subscribe(scores => this.scores.set(scores));
        } else {
            this.scores.set([]);
        }
    }
}
