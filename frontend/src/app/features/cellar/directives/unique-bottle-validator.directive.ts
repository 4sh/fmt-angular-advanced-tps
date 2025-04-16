import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {map, Observable, of} from 'rxjs';
import {Directive, forwardRef, Input} from '@angular/core';
import {CellarService} from '../services/cellar.service';
import {Bottle} from '../models/bottle.model';

@Directive({
    selector: '[uniqueBottle]',
    providers: [{
        provide: NG_ASYNC_VALIDATORS,
        useExisting: forwardRef(() => UniqueBottleValidatorDirective),
        multi: true,
    }]
})
export class UniqueBottleValidatorDirective implements AsyncValidator {
    @Input() uniqueBottle?: Bottle;

    constructor(private cellarService: CellarService) {}

    public validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const {estate, vintage, color} = control.value;
        if (estate && vintage && color) {
            return this.cellarService
                .getManyBottles({estate, vintage, color})
                .pipe(
                    map(bottles => bottles.filter(bottle => bottle.id !== this.uniqueBottle?.id)),
                    map(bottles => bottles.length > 0 ? {alreadyExists: true} : null)
                );
        } else {
            return of(null);
        }
    }
}
