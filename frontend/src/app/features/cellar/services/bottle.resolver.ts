import {ResolveFn} from '@angular/router';
import {Bottle} from '../models/bottle.model';
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {CellarService} from './cellar.service';

export const bottleResolver: ResolveFn<Observable<Bottle>> = (route, _) => {
    const bottleId = route.paramMap.get('id');
    return inject(CellarService).getOneBottleById(bottleId!);
};
