"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckMinecraft = void 0;
const types_1 = require("../types");
const bedrock_protocol_1 = require("bedrock-protocol");
const port = parseInt(process.env.SERVICE_MINECRAFT_PORT) || 19132;
const url = process.env.SERVICE_MINECRAFT_URL || "127.0.0.1";
function HealthCheckMinecraft(app) {
    app.get('/minecraft', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const serverResponse = yield BedrockPing();
            res.json(serverResponse);
        }
        catch (err) {
            next(err);
        }
    }));
}
exports.HealthCheckMinecraft = HealthCheckMinecraft;
// GameDig is a lot slower than bedrook-tools ~2000ms
function BedrockPing() {
    return __awaiter(this, void 0, void 0, function* () {
        var status = yield (0, bedrock_protocol_1.ping)({
            host: url,
            port: port
        });
        return {
            status: types_1.ServiceStatus.up,
            players: status.playersOnline,
            world: status.levelName,
            version: status.version
        };
    });
}
