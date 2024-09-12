import {Component, Input, OnInit} from '@angular/core';
import {TabsComponent} from '../tabs.component';

@Component({
    selector: 'tab',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss'
})
export class TabComponent implements OnInit {
    @Input({required: true}) public title?: string;
    @Input({required: true}) public path?: string;
    @Input() public default?: boolean;
    public active: boolean = false;

    constructor(private tabsComponent: TabsComponent) {
    }

    ngOnInit(): void {
        this.tabsComponent.register(this);
    }
}
