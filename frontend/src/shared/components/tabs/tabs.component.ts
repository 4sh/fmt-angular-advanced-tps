import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    styleUrl: './tabs.component.scss'
})
export class TabsComponent implements AfterViewInit {
    public tabs: TabComponent[] = [];
    @ViewChild(RouterOutlet) public outlet?: RouterOutlet;

    constructor(private router: Router, private route: ActivatedRoute) {}

    public ngAfterViewInit(): void {
        this.activateDefaultTab();
    }

    public register(tab: TabComponent) {
        this.tabs.push(tab);
    }

    private activateDefaultTab(): void {
        if (this.outlet?.isActivated === false) {
            const defaultTab = this.tabs.find(tab => tab.default());
            if (defaultTab) {
                this.router.navigate(['.', {outlets: {tab: defaultTab.path()}}], {relativeTo: this.route}).then();
            }
        }
    }
}
