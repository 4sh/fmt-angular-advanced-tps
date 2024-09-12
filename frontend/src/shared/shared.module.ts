import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FilterByPipe} from './pipes/filter-by.pipe';
import {ToastrModule} from 'ngx-toastr';
import {TabsComponent} from './components/tabs/tabs.component';
import {TabComponent} from './components/tabs/tab/tab.component';
import {RouterModule} from '@angular/router';

const components: unknown[] = [
    TabsComponent,
    TabComponent
];

const pipes: unknown[] = [
    FilterByPipe
];

@NgModule({
    declarations: [
        components,
        pipes
    ],
    exports: [
        components,
        pipes
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            progressBar: true,
        })
    ]
})
export class SharedModule {
}
