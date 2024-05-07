import { exec } from 'child_process';
import { Express } from 'express';
import { ServiceStatus, ServiceStatusResponse } from '../types';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SambaStatus extends ServiceStatusResponse {}

export function HealthCheckSamba(app: Express): void {
    app.get('/samba', async (req, res, next) => {
        try {
            await execAsync("smbclient -U nobody% -L localhost");

            const sambastatus: SambaStatus = {
                status: ServiceStatus.up
            };
            res.json(sambastatus);
        }
        catch (err) {
            next(err);
        }
    });
}
