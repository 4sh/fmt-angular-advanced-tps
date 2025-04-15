import {Routes} from '@angular/router';
import {authRoutes} from './features/auth/auth.routes';
import {cellarRoutes} from './features/cellar/cellar.routes';

export const routes: Routes = [
    ...authRoutes,
    ...cellarRoutes,
    {
        path: '**',
        redirectTo: '/cellar'
    }
];
