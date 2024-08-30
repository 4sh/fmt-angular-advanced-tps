import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Cellar} from '../models/cellar.model';

const storageKey = '_winecellar.io_current_cellar_id';

@Injectable({
    providedIn: 'root'
})
export class CurrentCellarService {
    public currentCellarId = new BehaviorSubject<string | undefined>(this.getCurrentCellarId());

    constructor(private httpClient: HttpClient) {
    }

    public searchManyCellars(): Observable<Cellar[]> {
        return this.httpClient
            .get<Cellar[]>('/api/public/cellar');
    }

    public getCurrentCellarId(): string | undefined {
        return localStorage.getItem(storageKey) || undefined;
    }

    public setCurrentCellarId(cellarId: string): void {
        localStorage.setItem(storageKey, cellarId);
        this.currentCellarId.next(cellarId);
    }
}
