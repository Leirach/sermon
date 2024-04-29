import { Express } from 'express';
import { ServiceStatus, ServiceStatusResponse } from '../types';
import { GameDig } from 'gamedig';
import { ping } from 'bedrock-protocol';

interface MinecraftStatus extends ServiceStatusResponse {
    players: number
    world: string,
    version: string
}

const port = parseInt(process.env.SERVICE_MINECRAFT_PORT) || 19132;
const url = process.env.SERVICE_MINECRAFT_URL || "127.0.0.1";

export function HealthCheckMinecraft(app: Express): void {
    app.get('/minecraft', async (req, res, next) => {
        try {
            const serverResponse = await BedrockPing();
            res.json(serverResponse);
        }
        catch (err) {
            next(err);
        }
    });
}

// GameDig is a lot slower than bedrook-tools ~2000ms
async function BedrockPing(): Promise<MinecraftStatus> {
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
