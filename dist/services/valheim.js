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
exports.HealthCheckValheim = void 0;
const types_1 = require("../types");
const gamedig_1 = require("gamedig");
function HealthCheckValheim(app) {
    const url = process.env.SERVICE_VALHEIM_URL || "127.0.0.1";
    const port = parseInt(process.env.SERVICE_VALHEIM_PORT) || 2456;
    app.get('/valheim', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            var status = yield gamedig_1.GameDig.query({
                type: 'valheim',
                host: url,
                port: port
            });
            const vStatus = {
                status: types_1.ServiceStatus.up,
                players: status.numplayers
            };
            res.json(vStatus);
        }
        catch (err) {
            next(err);
        }
    }));
}
exports.HealthCheckValheim = HealthCheckValheim;
