import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routes} from './cellar.routes';
import {BottleTileComponent} from './components/bottle-tile/bottle-tile.component';
import {CellarPageComponent} from './pages/cellar-page/cellar-page.component';
import {BottlesListPageComponent} from './pages/bottles-list-page/bottles-list-page.component';
import {BottleStickerImageComponent} from './components/bottle-sticker-image/bottle-sticker-image.component';
import {StatsPageComponent} from './pages/stats-page/stats-page.component';
import {BottleDetailsPageComponent} from './pages/bottle-details-page/bottle-details-page.component';
import {CellarMenuComponent} from './components/cellar-menu/cellar-menu.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../shared/shared.module';
import {BottleFormComponent} from './components/bottle-form/bottle-form.component';
import {BottleScoresPageComponent} from './pages/bottle-details-page/bottle-scores-page/bottle-scores-page.component';
import {CellarPickerComponent} from './components/cellar-picker/cellar-picker.component';
import {ScorePipe} from './pipes/score.pipe';
import {FilterByEstatePipe} from './pipes/filter-by-estate.pipe';
import {ExistingUrlValidatorDirective} from './directives/existing-url-validator.directive';
import {BottleListComponent} from './components/bottle-list/bottle-list.component';
import {
    RelatedBottleListPageComponent
} from './pages/bottle-details-page/related-bottle-list-page/related-bottle-list-page.component';
import {UniqueBottleValidatorDirective} from './directives/unique-bottle-validator.directive';

const components: unknown[] = [
    CellarMenuComponent,
    CellarPickerComponent,
    BottleTileComponent,
    BottleStickerImageComponent,
    BottleFormComponent,
    BottleListComponent
];

const pages: unknown[] = [
    CellarPageComponent,
    BottlesListPageComponent,
    BottleDetailsPageComponent,
    BottleScoresPageComponent,
    RelatedBottleListPageComponent,
    StatsPageComponent
];

const pipes: unknown[] = [
    ScorePipe,
    FilterByEstatePipe
];

const directives: unknown[] = [
    ExistingUrlValidatorDirective,
    UniqueBottleValidatorDirective
];

@NgModule({
    declarations: [
        components,
        pages,
        pipes,
        directives
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SharedModule,
        NgOptimizedImage
    ]
})
export class CellarModule {
}
