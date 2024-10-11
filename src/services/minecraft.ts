import { Express } from 'express';
import { ServiceStatus, ServiceStatusResponse } from '../types';
import { ping } from 'bedrock-protocol';

interface MinecraftStatus extends ServiceStatusResponse {
    players: number
    world: string,
    version: string
}

const defaultPort = parseInt(process.env.SERVICE_MINECRAFT_PORT) || 19132;
const url = process.env.SERVICE_MINECRAFT_URL || "127.0.0.1";

export function HealthCheckMinecraft(app: Express): void {
    app.get('/minecraft', async (req, res, next) => {
        try {
            const portNumber = parseInt(req.query.port as string);
            const serverResponse = await BedrockPing(portNumber || defaultPort);
            res.json(serverResponse);
        }
        catch (err) {
            next(err);
        }
    });
}

// GameDig is a lot slower than bedrook-tools ~2000ms
async function BedrockPing(port: number): Promise<MinecraftStatus> {
    var status = await ping({
        host: url,
        port: port
    });

    return {
        status: ServiceStatus.up,
        players: status.playersOnline,
        world: status.levelName,
        version: status.version
    };
}
