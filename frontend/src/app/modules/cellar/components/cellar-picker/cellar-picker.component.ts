import {Component, OnInit} from '@angular/core';
import {Cellar} from '../../models/cellar.model';
import {CurrentCellarService} from '../../services/current-cellar.service';
import {tap} from 'rxjs';

@Component({
    selector: 'cellar-picker',
    templateUrl: './cellar-picker.component.html',
    styleUrl: './cellar-picker.component.scss'
})
export class CellarPickerComponent implements OnInit {
    public cellars: Cellar[] = [];
    public currentCellarId?: string;

    constructor(private currentCellarService: CurrentCellarService) {
    }

    ngOnInit(): void {
        this.currentCellarService
            .searchManyCellars()
            .pipe(
                tap(cellars => this.initCurrentCellar(cellars))
            )
            .subscribe(cellars => this.cellars = cellars);
    }

    private initCurrentCellar(cellars: Cellar[]) {
        const currentCellarId = this.currentCellarService.getCurrentCellarId();
        if (currentCellarId && currentCellarId !== 'undefined') {
            this.currentCellarId = cellars.find(c => c.id === currentCellarId)?.id;
        } else {
            this.currentCellarId = cellars.find(c => c.default)?.id;
        }
        if (this.currentCellarId) {
            this.currentCellarService.setCurrentCellarId(this.currentCellarId);
        }
    }

    public onCellarChange(cellarId: string) {
        if (cellarId) {
            this.currentCellarService.setCurrentCellarId(cellarId);
            location.reload();
        }
    }
}
