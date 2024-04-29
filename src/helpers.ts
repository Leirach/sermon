import { Express, Request, Response, NextFunction } from 'express';
import { ServiceStatus, ServiceStatusResponse } from './types';

const statusDown: ServiceStatusResponse = {
    status: ServiceStatus.down
};

export function SetupErrorHandler(app: Express) {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.json(statusDown);
    });
}
