import { exec } from 'child_process';
import { Express } from 'express';
import { ServiceStatus, ServiceStatusResponse } from '../types';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface WireGuardStatus extends ServiceStatusResponse {
    interface: string,
    peers: number
}

export function HealthCheckWireGuard(app: Express): void {
    app.get('/wireguard', async (req, res, next) => {
        try {
            const output = await execAsync("sudo wg show");
            const wgStatus = parseWGOutput(output.stdout);

            res.json(wgStatus);
        }
        catch (err) {
            next(err);
        }
    });
}

function parseWGOutput(output: string): WireGuardStatus {
    const lines = output.split('\n');
    if (lines.length == 0) {
        return {
            status: ServiceStatus.down,
            interface: "",
            peers: 0
        };
    }

    let wgStatus: WireGuardStatus = {
        status: ServiceStatus.up,
        interface: "",
        peers: 0
    };

    wgStatus.interface = lines[0].split(':')[1].trim();

    for (var line of lines) {
        line = line.trim();
        if (line.startsWith('latest handshake:')) {
            const latestHandshake = line.split(':')[1].trim();
            if (peerIsRecent(latestHandshake)) {
                wgStatus.peers++;
            }
        }
    }

    return wgStatus;
}

function peerIsRecent(latestHandshake: string): boolean {
    if (latestHandshake == "Now") {
        return true;
    }

    const onlySeconds = latestHandshake.match(/^(\d+) second(s)?/);
    if (onlySeconds) {
        return true;
    }

    const minuteMatch = latestHandshake.match(/^(\d+) minute(s)?/);
    if (minuteMatch) {
        const minutes = parseInt(minuteMatch[0]);
        if (minutes < 3) {
            return true;
        }
    }

    return false;
}
