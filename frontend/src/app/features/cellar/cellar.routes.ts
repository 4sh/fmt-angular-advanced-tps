import {Routes} from '@angular/router';
import {CellarPageComponent} from './pages/cellar-page/cellar-page.component';
import {BottlesListPageComponent} from './pages/bottles-list-page/bottles-list-page.component';
import {isAuthenticated} from '../auth/guards/is-authenticated.guard';
import {BottleDetailsPageComponent} from './pages/bottle-details-page/bottle-details-page.component';
import {StatsPageComponent} from './pages/stats-page/stats-page.component';
import {bottleResolver} from './services/bottle.resolver';
import {
    RelatedBottleListPageComponent
} from './pages/bottle-details-page/related-bottle-list-page/related-bottle-list-page.component';
import {BottleScoresPageComponent} from './pages/bottle-details-page/bottle-scores-page/bottle-scores-page.component';

export const cellarRoutes: Routes = [
    {
        path: 'cellar',
        component: CellarPageComponent,
        canActivate: [isAuthenticated],
        children: [
            {
                path: 'list',
                component: BottlesListPageComponent
            },
            {
                path: 'bottle/:id/details',
                component: BottleDetailsPageComponent,
                resolve: {bottle: bottleResolver},
                children: [
                    {path: 'scores', outlet: 'tab', component: BottleScoresPageComponent},
                    {path: 'related', outlet: 'tab', component: RelatedBottleListPageComponent}
                ]
            },
            {
                path: 'bottle/new',
                component: BottleDetailsPageComponent
            },
            {
                path: 'stats',
                component: StatsPageComponent
            },
            {
                path: '**',
                redirectTo: 'list'
            }
        ]
    }
];
