import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {MessageParams, NotificationService} from '../../../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);
    return next(req)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                const context = getI18nContext(error);
                if (context) {
                    notificationService.error(context.key, context.params);
                }
                if (req.method !== 'HEAD' && req.method !== 'OPTIONS') {
                    if (error.status === 404) {
                        router.navigate(['/']).then();
                    } else if (error.status === 401 || error.status === 403) {
                        router.navigate(['/auth']).then();
                    }
                }
                return throwError(() => error);
            })
        );
};

function getI18nContext(error: HttpErrorResponse): I18nContext | undefined {
    if (error.headers.get('X-Response-With-i18n-Message') !== null) {
        try {
            return error.error;
        } catch (e) {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export type I18nContext = {key: string, params: MessageParams};
