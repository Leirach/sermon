import { Express } from 'express';
import { ServiceStatus, ServiceStatusResponse } from '../types';
import { GameDig } from 'gamedig';

interface ValheimStatus extends ServiceStatusResponse {
    players: number
    world: string
}

export function HealthCheckValheim(app: Express): void {
    const url = process.env.SERVICE_VALHEIM_URL || "127.0.0.1";
    const port = parseInt(process.env.SERVICE_VALHEIM_PORT) || 2456;
    app.get('/valheim', async (req, res, next) => {
        try {
            var status = await GameDig.query({
                type: 'valheim',
                host: url,
                port: port
            });

            const vStatus: ValheimStatus = {
                status: ServiceStatus.up,
                players: status.numplayers,
                world: status.map
            };
            res.json(vStatus);
        }
        catch (err) {
            next(err);
        }
    });
}
