import {Bottle, BottlesService} from './bottles.js';
import lodash from 'lodash';
import {ScoresService} from './scores.js';

const {groupBy, mapValues, pickBy} = lodash;

export class StatsService {
    constructor(private bottlesService: BottlesService,
                private scoresService: ScoresService) {
    }

    public computeStats(): Stats {
        const bottles = this.bottlesService.getManyBottles();
        const scores = this.scoresService.getManyScores();
        const sumQuantities = (bottles: Bottle[]) => bottles.reduce((sum, bottle) => sum + bottle.quantity, 0);
        return {
            byColor: mapValues(
                groupBy(bottles, b => b.color),
                (bottles, _) => sumQuantities(bottles)
            ),
            byEstate: mapValues(
                groupBy(bottles, b => b.estate),
                (bottles, _) => sumQuantities(bottles)
            ),
            byVintage: mapValues(
                groupBy(bottles, b => b.vintage),
                (bottles, _) => sumQuantities(bottles)
            ),
            byAverageScore: pickBy(
                mapValues(
                    groupBy(bottles, b => this.scoresService.getAverageScore(scores.filter(s => s.bottleId === b.id))),
                    (bottles, _) => bottles.length
                ),
                (_, score) => score !== 'undefined'
            )
        };
    }
}

export type Stats = {
    byColor: { [c: string]: number },
    byEstate: { [e: string]: number },
    byVintage: { [v: number]: number },
    byAverageScore: { [v: number]: number },
}
