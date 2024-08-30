import {AuthService} from './services/auth.js';
import {BottlesService} from './services/bottles.js';
import {ScoresService} from './services/scores.js';
import {StatsService} from './services/stats.js';

export type Services = {
    auth: AuthService;
    bottles: BottlesService;
    scores: ScoresService;
    stats: StatsService;
}

const services: { [cellarId: string]: Services; } = {};

export function getServices(cellarId: string) {
    if (!services[cellarId]) {
        const auth = new AuthService();
        const scores = new ScoresService(cellarId, auth);
        const bottles = new BottlesService(cellarId, scores);
        const stats = new StatsService(bottles, scores);
        services[cellarId] = {auth, scores, bottles, stats};
    }
    return services[cellarId];
}
