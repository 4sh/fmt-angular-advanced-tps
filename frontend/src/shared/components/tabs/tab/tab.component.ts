import {Component, input, InputSignal, OnInit} from '@angular/core';
import {TabsComponent} from '../tabs.component';

@Component({
    selector: 'tab',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss'
})
export class TabComponent implements OnInit {
    public title: InputSignal<string> = input.required<string>();
    public active: boolean = false;

    constructor(private tabsComponent: TabsComponent) {
    }

    ngOnInit(): void {
        this.tabsComponent.register(this);
    }
}
