import {Component} from '@angular/core';
import {TabComponent} from './tab/tab.component';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss'
})
export class TabsComponent {
    public tabs: TabComponent[] = [];

    public register(tab: TabComponent) {
        if (this.tabs.length === 0) {
            tab.active = true;
        }
        this.tabs.push(tab);
    }

    public selectTab(tab: TabComponent) {
        this.tabs.map(tab => tab.active = false);
        tab.active = true;
    }
}
