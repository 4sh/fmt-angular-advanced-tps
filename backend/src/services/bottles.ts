import {JSONSyncPreset} from 'lowdb/node';
import {LowSync} from 'lowdb';
import crypto from 'crypto';
import {ScoresService} from './scores.js';
import lodash from 'lodash';
import {AlreadyExistsError, DataConsistencyError, NotFoundError, ParameterError} from './error.js';

const {uniq} = lodash;

export class BottlesService {
    private bottles: LowSync<BottleEntity[]>;

    constructor(cellarId: string, private scoresService: ScoresService) {
        const bottles = JSONSyncPreset<BottleEntity[]>(`db/${cellarId}/bottles.json`, []);

        const startupConsistencyChecks: string[] = [];
        bottles.data.forEach((b, index) => {
            if (bottles.data.filter(bottle => bottle.id === b.id).length > 1) {
                startupConsistencyChecks.push(`[db - ${cellarId} - bottles] - startup checks - error - duplicated ID: ${b.id}`);
            }
        });
        if (startupConsistencyChecks.length > 0) {
            throw new DataConsistencyError(startupConsistencyChecks.join('\n'));
        } else {
            console.log(`[db - ${cellarId} - bottles] - all startup checks passed`);
        }

        this.bottles = bottles;
    }

    public getManyBottles(criteria?: BottleCriteria): Bottle[] {
        let bottles: BottleEntity[];
        if (criteria) {
            bottles = this.bottles.data.filter(b => this.applyCriteria(b, criteria));
        } else {
            bottles = this.bottles.data;
        }
        return bottles.map(b => this.fromEntity(b));
    }

    public getManyRelatedBottlesByBottleId(id: string): Bottle[] {
        const bottle = this.getOneBottleById(id);
        if (bottle) {
            return this.bottles.data
                .filter(b => b.id !== id)
                .filter(b => b.estate === bottle?.estate)
                .map(b => this.fromEntity(b));
        } else {
            return [];
        }
    }

    public getManyEstates(q: string): string[] {
        return uniq(
            this.bottles.data
                .map(b => b.estate)
                .filter(e => e.match(new RegExp(q, 'i')) !== null)
        );
    }

    public getOneBottleById(id: string) {
        const bottle = this.getBottleById(id);
        if (bottle) {
            return this.fromEntity(bottle);
        } else {
            return undefined;
        }
    }

    public createBottle(bottle: Bottle) {
        const entity = this.toEntity(bottle);
        if (!entity) {
            throw new ParameterError(`${bottle} - MUST NOT BE NULL`);
        }
        if (entity.id) {
            throw new ParameterError(`${bottle.id} - ID MUST BE NULL`);
        }
        const existingBottles = this.getManyBottles({
            estate: bottle.estate,
            vintage: bottle.vintage,
            color: bottle.color
        });
        if (existingBottles.length > 0) {
            throw new BottleAlreadyExistsError();
        }
        entity.id = this.generateBottleId();
        this.bottles.data.push(entity);
        this.bottles.write();
        return this.fromEntity(entity);
    }

    public updateBottle(bottle: Bottle) {
        const entity = this.toEntity(bottle);
        if (!entity) {
            throw new ParameterError(`${bottle} - MUST NOT BE NULL`);
        }
        const index = this.getBottleIndex(entity);
        if (index >= 0) {
            this.bottles.data[index] = entity;
            this.bottles.write();
            return this.fromEntity(entity);
        } else {
            throw new NotFoundError(entity.id);
        }
    }

    public deleteBottle(id: string) {
        const index = this.getBottleIndexFromId(id);
        if (index >= 0) {
            const bottle = this.bottles.data[index];
            this.bottles.data.splice(index, 1);
            this.bottles.write();
            return bottle;
        } else {
            throw new NotFoundError(id);
        }
    }

    private toEntity(bottle: Bottle): BottleEntity {
        return {
            id: bottle.id,
            estate: bottle.estate,
            vintage: bottle.vintage,
            color: bottle.color,
            quantity: bottle.quantity,
            stickerUrl: bottle.stickerUrl
        };
    }

    private fromEntity(bottle: BottleEntity): Bottle {
        return {
            id: bottle.id,
            estate: bottle.estate,
            vintage: bottle.vintage,
            color: bottle.color,
            quantity: bottle.quantity,
            stickerUrl: bottle.stickerUrl,
            computed: {
                averageScore: bottle.id ? this.scoresService.getAverageScoreByBottleId(bottle.id) : undefined
            }
        };
    }

    private getBottleById(id: string) {
        return this.bottles.data.find((b: BottleEntity) => b.id === id);
    }

    private getBottleIndex(bottle: BottleEntity) {
        if (bottle.id) {
            return this.getBottleIndexFromId(bottle.id);
        } else {
            return -1;
        }
    }

    private getBottleIndexFromId(id: string) {
        return this.bottles.data.findIndex(b => b.id === id);
    }

    private generateBottleId(): string {
        const randomId = crypto.randomUUID();
        if (this.getBottleIndexFromId(randomId) < 0) {
            return randomId;
        }
        return this.generateBottleId();
    }

    private applyCriteria(bottle: BottleEntity, criteria: BottleCriteria): boolean {
        return (!criteria.q || bottle.estate.match(new RegExp(criteria.q, 'i')) !== null)
            && (!criteria.estate || bottle.estate?.toLowerCase() === criteria.estate?.toLowerCase())
            && (!criteria.color || bottle.color === criteria.color)
            && (!criteria.vintage || bottle.vintage === criteria.vintage);
    }
}

export enum Color {
    RED = 'RED',
    ROSE = 'ROSE',
    WHITE = 'WHITE'
}

type BottleEntity = {
    id?: string;
    estate: string;
    vintage: number;
    color: Color;
    stickerUrl?: string;
    quantity: number;
};

export type Bottle = {
    id?: string;
    estate: string;
    vintage: number;
    color: Color;
    stickerUrl?: string;
    quantity: number;
    computed: BottleComputedData;
};

export type BottleComputedData = {
    averageScore?: number;
};

export type BottleCriteria = {
    q?: string;
    estate?: string;
    color?: string;
    vintage?: number;
};

export class BottleAlreadyExistsError extends AlreadyExistsError {
    name: string = 'BottleAlreadyExistsError';

    constructor() {
        super(
            'Bottle already exists',
            {key: 'bottle.error.alreadyExists', params: {}}
        );
    }
}
