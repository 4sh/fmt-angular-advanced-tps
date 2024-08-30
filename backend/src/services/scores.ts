import {JSONSyncPreset} from 'lowdb/node';
import crypto from 'crypto';
import {AuthService, UserIdentity} from './auth.js';
import {LowSync} from 'lowdb';
import {DataConsistencyError, NotFoundError} from './error.js';

export class ScoresService {
    private scores: LowSync<BottleScoreEntity[]>;

    constructor(cellarId: string, private authService: AuthService) {
        const scores = JSONSyncPreset<BottleScoreEntity[]>(`db/${cellarId}/scores.json`, []);

        const startupConsistencyChecks: string[] = [];
        scores.data.forEach((s, index) => {
            if (scores.data.filter(score => score.id === s.id).length > 1) {
                startupConsistencyChecks.push(`[db - ${cellarId} - scores] - startup checks - error - duplicated ID: ${s.id}`);
            }
        });
        if (startupConsistencyChecks.length > 0) {
            throw new DataConsistencyError(startupConsistencyChecks.join('\n'));
        } else {
            console.log(`[db - ${cellarId} - scores] - all startup checks passed`);
        }

        this.scores = scores;
    }

    public getManyScores(): BottleScore[] {
        return this.scores.data.map(s => this.fromEntity(s));
    }

    public getManyScoresByBottleId(id: string): BottleScore[] {
        return this.getBottleScoreEntities(id)
            .map(s => this.fromEntity(s));
    }

    public getAverageScoreByBottleId(id: string): number | undefined {
        return this.getAverageScore(this.getBottleScoreEntities(id));
    }

    public getAverageScore(scores: BottleScore[]): number | undefined {
        if (scores.length === 0) {
            return undefined;
        } else {
            const sum = scores.reduce((sum, score) => sum + score.score, 0);
            return Math.round(sum / scores.length);
        }
    }

    public createScore(bottleId: string, userId: string, score: { value: string }): BottleScore {
        const bottleScore: BottleScoreEntity = {
            id: this.generateScoreId(),
            userId,
            timestamp: new Date().toISOString(),
            bottleId,
            score: parseInt(score.value)
        };
        this.scores.data.push(bottleScore);
        this.scores.write();
        return this.fromEntity(bottleScore);
    }

    public deleteScore(id: string) {
        const index = this.getScoreIndexFromId(id);
        if (index >= 0) {
            const score = this.scores.data[index];
            this.scores.data.splice(index, 1);
            this.scores.write();
            return score;
        } else {
            throw new NotFoundError(id);
        }
    }

    private getBottleScoreEntities(id: string) {
        return this.scores.data
            .filter((s: BottleScoreEntity) => s.bottleId === id);
    }

    private generateScoreId(): string {
        const randomId = crypto.randomUUID();
        if (this.getScoreIndexFromId(randomId) < 0) {
            return randomId;
        }
        return this.generateScoreId();
    }

    private getScoreIndexFromId(id: string) {
        return this.scores.data.findIndex(b => b.id === id);
    }

    private fromEntity(score: BottleScoreEntity): BottleScore {
        return {
            id: score.id,
            bottleId: score.bottleId,
            userId: score.userId,
            userIdentity: this.authService.getOneUserIdentityById(score.userId),
            timestamp: score.timestamp,
            score: score.score
        };
    }
}

type BottleScoreEntity = {
    id: string;
    bottleId: string;
    userId: string;
    timestamp: string;
    score: number;
};

export type BottleScore = {
    id: string;
    bottleId: string;
    userId: string;
    userIdentity?: UserIdentity;
    timestamp: string;
    score: number;
};
