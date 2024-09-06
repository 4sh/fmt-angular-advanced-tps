import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {CurrentCellarService} from '../services/current-cellar.service';

export const cellarInterceptor: HttpInterceptorFn = (req, next) => {
    const currentCellarService = inject(CurrentCellarService);
    const currentCellarId = currentCellarService.getCurrentCellarId();
    if (currentCellarId) {
        return next(
            req.clone({
                headers: req.headers.append('X-Cellar-Id', currentCellarId)
            })
        );
    } else {
        return next(req);
    }
};
