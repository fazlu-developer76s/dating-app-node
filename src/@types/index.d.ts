import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            authUser: {
                id: any; role: string
            };
            identifierType?: string;
            modelName: {}
        }
    }
}