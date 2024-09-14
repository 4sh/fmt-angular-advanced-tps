import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';
import {Session, UserIdentity} from '../models/session.model';

export type OptionalUserIdentity = ({id: string} & UserIdentity) | undefined;
export const storageKey = '_winecellar.io_session_id_';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserIdentity = new BehaviorSubject<OptionalUserIdentity>(undefined);

    constructor(private httpClient: HttpClient) {
    }

    public get currentSession(): Session | undefined {
        const storedItem = localStorage.getItem(storageKey);
        if (storedItem) {
            const currentSession: Session = JSON.parse(storedItem);
            this.currentUserIdentity.next({id: currentSession.userId, ...currentSession.userIdentity});
            return currentSession;
        } else {
            this.currentUserIdentity.next(undefined);
            return undefined;
        }
    }

    public set currentSession(session: Session | undefined) {
        if (session) {
            this.currentUserIdentity.next({id: session.userId, ...session.userIdentity});
            localStorage.setItem(storageKey, JSON.stringify(session));
        } else {
            this.currentUserIdentity.next(undefined);
            localStorage.removeItem(storageKey);
        }
    }

    public getCurrentUserIdentity(): Observable<OptionalUserIdentity> {
        return this.currentUserIdentity.asObservable();
    }

    public login(login: string, password: string): Observable<UserIdentity> {
        return this.httpClient
            .post<Session>('/api/public/session', {login, password})
            .pipe(
                tap(session => this.currentSession = session),
                map(session => session.userIdentity),
            );
    }

    public logout(): Observable<UserIdentity | undefined> {
        return this.httpClient
            .delete<Session>('/api/private/session/current')
            .pipe(
                catchError(() => of(undefined)),
                map(session => session?.userIdentity),
                tap(() => this.currentSession = undefined)
            );
    }
}
