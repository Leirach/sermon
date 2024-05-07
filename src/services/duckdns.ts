import { readFile, stat } from 'fs/promises';
import { Express } from 'express';
import { ServiceStatus, ServiceStatusResponse } from '../types';

interface DuckStatus extends ServiceStatusResponse {
    lastUpdate: Date
}

export function HealthCheckDuckDns(app: Express): void {
    app.get('/duckdns', async (req, res, next) => {
        try {
            var fileStat = await stat(process.env.DUCKDNS_LOG_PATH);
            var file = await readFile(process.env.DUCKDNS_LOG_PATH, 'utf-8');

            const duckStatus: DuckStatus = {
                status: file == "OK" ? ServiceStatus.up : ServiceStatus.down,
                lastUpdate: fileStat.mtime
            };
            res.json(duckStatus);
        }
        catch (err) {
            next(err);
        }
    });
}
