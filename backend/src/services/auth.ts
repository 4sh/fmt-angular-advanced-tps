import crypto from 'crypto';
import {JSONSyncPreset} from 'lowdb/node';

export class AuthService {
    private users = JSONSyncPreset<User[]>('db/users.json', []);
    private sessions = JSONSyncPreset<Session[]>('db/sessions.json', []);

    private authenticator = (credentials: UserCredentials): User | undefined =>
        this.users.data.find(user => user.credentials.login === credentials.login &&
            user.credentials.password === credentials.password);

    public createSession(credentials: UserCredentials): Session {
        const user = this.authenticator(credentials);
        if (!user) {
            throw new AuthenticationError();
        } else {
            const existingSession = this.getSessionByUser(user);
            if (existingSession) {
                return existingSession;
            } else {
                const session: Session = {
                    id: crypto.randomUUID(),
                    userId: user.id,
                    userLogin: user.credentials.login,
                    userIdentity: user.identity
                };
                this.sessions.data.push(session);
                this.sessions.write();
                return session;
            }
        }
    }

    public getSessionById(id: string): Session | undefined {
        return this.sessions.data.find(session => session.id === id);
    }

    public getOneUserIdentityById(id: string): UserIdentity | undefined {
        return this.users.data.find(user => user.id === id)?.identity;
    }

    public deleteSession(session: Session): Session {
        const sessionIndex = this.sessions.data.findIndex(s => s.id === session.id);
        if (sessionIndex >= 0) {
            this.sessions.data.splice(sessionIndex, 1);
            this.sessions.write();
        }
        return session;
    }

    private getSessionByUser(user: User): Session | undefined {
        return this.sessions.data.find(session => session.userLogin === user.credentials.login);
    }
}

export class AuthenticationError implements Error {
    message: string = 'AUTHENTICATION ERROR';
    name: string = 'AuthenticationError';
    stack: string = '';
}

export type User = {
    id: string;
    identity: UserIdentity;
    credentials: UserCredentials;
}

export type UserIdentity = {
    firstName: string;
    lastName: string;
}

export type UserCredentials = {
    login: string;
    password: string;
}

export type Session = {
    id: string;
    userId: string;
    userLogin: string;
    userIdentity: UserIdentity;
}
