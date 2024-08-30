import {Bottle} from './bottle.model';
import {UserIdentity} from '../../auth/models/session.model';

export type BottleScore = {
    id: string;
    bottle?: Bottle;
    userId?: string;
    userIdentity?: UserIdentity;
    timestamp: Date;
    score: number;
};


