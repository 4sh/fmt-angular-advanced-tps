import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bottle, BottleCriteria} from '../models/bottle.model';
import {Stats} from '../models/stats.model';
import {Observable} from 'rxjs';
import {BottleScore} from '../models/score.model';

@Injectable({
    providedIn: 'root'
})
export class CellarService {
    constructor(private httpClient: HttpClient) {
    }

    public getManyBottles(criteria?: BottleCriteria): Observable<Bottle[]> {
        return this.httpClient
            .get<Bottle[]>('/api/private/bottle', {params: criteria});
    }

    public getOneBottleById(id: string): Observable<Bottle> {
        return this.httpClient
            .get<Bottle>(`/api/private/bottle/${id}`);
    }

    public createOneBottle(bottle: Bottle): Observable<Bottle> {
        return this.httpClient
            .post<Bottle>(`/api/private/bottle`, bottle);
    }

    public updateOneBottle(bottle: Bottle): Observable<Bottle> {
        return this.httpClient
            .put<Bottle>(`/api/private/bottle/${bottle.id}`, bottle);
    }

    public getManyScoresByBottleId(id: string) {
        return this.httpClient
            .get<BottleScore[]>(`/api/private/bottle/${id}/score`);
    }

    public createOneScoreByBottleId(bottleId: string, score: number) {
        return this.httpClient
            .post<BottleScore>(`/api/private/bottle/${bottleId}/score`, {value: score});
    }

    public getStats(): Observable<Stats> {
        return this.httpClient
            .get<Stats>(`/api/private/stats`);
    }
}
