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
exports.HealthCheckDuckDns = void 0;
const promises_1 = require("fs/promises");
const types_1 = require("../types");
function HealthCheckDuckDns(app) {
    app.get('/duckdns', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            var fileStat = yield (0, promises_1.stat)(process.env.DUCKDNS_LOG_PATH);
            var file = yield (0, promises_1.readFile)(process.env.DUCKDNS_LOG_PATH, 'utf-8');
            const duckStatus = {
                status: file == "OK" ? types_1.ServiceStatus.up : types_1.ServiceStatus.down,
                lastUpdate: fileStat.mtime
            };
            res.json(duckStatus);
        }
        catch (err) {
            next(err);
        }
    }));
}
exports.HealthCheckDuckDns = HealthCheckDuckDns;
