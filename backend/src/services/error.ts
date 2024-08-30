export class DataConsistencyError implements Error {
    name: string = 'ConsistencyError';
    i18n: string = 'common.error.parameter'

    constructor(public message: string) {
    }
}

export type I18nContext = { key: string, params: any };

export abstract class InternationalizedError extends Error {
    i18n: I18nContext;
    stack: string = '';

    constructor(message: string, i18n: I18nContext) {
        super(message);
        this.i18n = i18n;
    }
}

export class ParameterError extends InternationalizedError {
    name: string = 'ParameterError';

    constructor(public message: string) {
        super(message, {key: 'common.error.parameter', params: {}});
    }
}

export abstract class AlreadyExistsError extends InternationalizedError {
}

export class NotFoundError extends InternationalizedError {
    name: string = 'NotFoundError';

    constructor(id: string | undefined) {
        super(
            'Requested element has not been found',
            {key: 'common.error.notFound', params: {id}}
        );
    }
}
