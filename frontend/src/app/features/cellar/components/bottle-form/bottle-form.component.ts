import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bottle, Color} from '../../models/bottle.model';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {KeyValuePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ExistingUrlValidatorDirective} from '../../directives/existing-url-validator.directive';

@Component({
    selector: 'bottle-form',
    templateUrl: './bottle-form.component.html',
    imports: [
        FormsModule,
        TranslatePipe,
        KeyValuePipe,
        RouterLink,
        ExistingUrlValidatorDirective
    ],
    styleUrl: './bottle-form.component.scss'
})
export class BottleFormComponent {
    @Input()
    public set bottle(bottle: Bottle | undefined) {
        if (bottle) {
            this._bottle = bottle;
        }
    }

    public get bottle(): Bottle {
        return this._bottle;
    }

    @Output()
    public submitted = new EventEmitter<Bottle>();

    public Color = Color;

    public _bottle: Bottle = {id: undefined, estate: '', color: Color.RED, vintage: 2000, quantity: 1};
    public vintageMaxYear: number = new Date().getFullYear();
}
