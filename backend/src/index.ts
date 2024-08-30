import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {getServices} from './services.js';
import {Cellar} from './services/cellar.js';
import {AuthService} from './services/auth.js';
import {BottlesService} from './services/bottles.js';
import {ScoresService} from './services/scores.js';
import {StatsService} from './services/stats.js';
import {AlreadyExistsError, InternationalizedError, NotFoundError} from './services/error.js';

const app = express();
const publicRouter = express.Router()
const privateRouter = express.Router()
const cellars: Cellar[] = [
    {id: 'cellar1', name: 'Cave 1', default: true},
    {id: 'cellar2', name: 'Cave 2', default: false}
];
const defaultCellarId = cellars.find(c => c.default)!.id;
const port = 3000;

app.listen(port, () => {
    console.log(`==========================================`)
    console.log(`API listening on port ${port}`)
    console.log(`==========================================`)
    cellars.forEach(c => getServices(c.id));
});

app.all('*', (req, res, next) => {
    const cellarId = req.header('X-Cellar-Id')?.trim() || defaultCellarId;
    const start = new Date().getTime();
    try {
        res.locals.services = getServices(cellarId);
        next();
    } finally {
        const stop = new Date().getTime();
        console.log(`>> [${cellarId}] - ${req.method} >> ${req.url} << ${res.statusCode} - ${stop - start}ms`);
    }
});

app.use(express.json());
app.use(cors());

app.use('/static', express.static('static'))

app.use('/api/public', publicRouter);

publicRouter.route(`/cellar`)
    .get((_, res) => {
        res.json(cellars);
    });

publicRouter.route(`/session`)
    .post((req, res) => {
        try {
            res.json((res.locals.services.auth as AuthService).createSession(req.body));
        } catch (e) {
            res.sendStatus(401);
        }
    });

app.use('/api/private', privateRouter);

privateRouter.all('*', (req, res, next) => {
    const sessionId = req.header('Authorization')?.trim();
    if (!sessionId) {
        res.sendStatus(401);
    } else {
        const session = (res.locals.services.auth as AuthService).getSessionById(sessionId);
        if (!session) {
            res.sendStatus(403);
        } else {
            res.locals.session = session;
            next();
        }
    }
});

privateRouter.route(`/session/current`)
    .get((_, res) => {
        res.json(res.locals.session);
    })
    .delete((req, res) => {
        res.json((res.locals.services.auth as AuthService).deleteSession(res.locals.session));
    });

privateRouter.route(`/estate`)
    .get((req, res) => {
        if (typeof req.query.q === 'string') {
            res.json((res.locals.services.bottles as BottlesService).getManyEstates(req.query.q));
        } else {
            res.json([]);
        }
    });

privateRouter.route(`/bottle`)
    .get((req, res) => {
        const service = res.locals.services.bottles as BottlesService;
        if (req.query) {
            res.json(
                service.getManyBottles({
                    q: typeof req.query.q === 'string' ? req.query.q : undefined,
                    estate: typeof req.query.estate === 'string' ? req.query.estate : undefined,
                    vintage: typeof req.query.vintage === 'string' ? parseInt(req.query.vintage) : undefined,
                    color: typeof req.query.color === 'string' ? req.query.color : undefined,
                })
            );
        } else {
            res.json(service.getManyBottles());
        }
    })
    .post((req, res) => {
        res.json((res.locals.services.bottles as BottlesService).createBottle(req.body));
    });

privateRouter.route(`/bottle/:id`)
    .get((req, res) => {
        res.json((res.locals.services.bottles as BottlesService).getOneBottleById(req.params.id));
    })
    .put((req, res) => {
        res.json((res.locals.services.bottles as BottlesService).updateBottle(req.body));
    })
    .delete((req, res) => {
        res.json((res.locals.services.bottles as BottlesService).deleteBottle(req.params.id));
    });

privateRouter.route(`/bottle/:id/related`)
    .get((req, res) => {
        res.json((res.locals.services.bottles as BottlesService).getManyRelatedBottlesByBottleId(req.params.id));
    });

privateRouter.route(`/bottle/:id/score`)
    .get((req, res) => {
        res.json((res.locals.services.scores as ScoresService).getManyScoresByBottleId(req.params.id));
    })
    .post((req, res) => {
        res.json((res.locals.services.scores as ScoresService).createScore(req.params.id, res.locals.session.userId, req.body));
    })
    .delete((req, res) => {
        res.json((res.locals.services.scores as ScoresService).deleteScore(req.params.id));
    });

privateRouter.route(`/stats`)
    .get((_, res) => {
        res.json((res.locals.services.stats as StatsService).computeStats());
    });

app.use((error: Error, _request: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof NotFoundError) {
        res.status(404);
    } else if (error instanceof AlreadyExistsError) {
        res.status(409);
    } else {
        res.status(400);
    }
    if (error instanceof InternationalizedError && error.i18n) {
        res.header('X-Response-With-i18n-Message', 'true');
        res.send(JSON.stringify(error.i18n));
    }
});
