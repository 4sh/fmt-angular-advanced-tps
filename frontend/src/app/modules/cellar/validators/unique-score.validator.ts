import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {BottleScore} from '../models/score.model';
import {AuthService} from '../../auth/services/auth.service';
import {map, Observable, take} from 'rxjs';

export function uniqueScoreValidator(authService: AuthService, scores: BottleScore[]): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return authService.getCurrentUserIdentity()
            .pipe(
                map(user => {
                    if (typeof control.value === 'number') {
                        const alreadyExistingScore = scores
                            .filter(score => score.userId === user?.id)
                            .find(score => score.score === control.value);
                        if (alreadyExistingScore) {
                            return {
                                'alreadyExists': true
                            };
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }),
                take(1)
            );
    };
}
