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
exports.HealthCheckWireGuard = void 0;
const child_process_1 = require("child_process");
const types_1 = require("../types");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function HealthCheckWireGuard(app) {
    app.get('/wireguard', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const output = yield execAsync("sudo wg show");
            const wgStatus = parseWGOutput(output.stdout);
            res.json(wgStatus);
        }
        catch (err) {
            next(err);
        }
    }));
}
exports.HealthCheckWireGuard = HealthCheckWireGuard;
function parseWGOutput(output) {
    const lines = output.split('\n');
    if (lines.length == 0) {
        return {
            status: types_1.ServiceStatus.down,
            interface: "",
            peers: 0
        };
    }
    let wgStatus = {
        status: types_1.ServiceStatus.up,
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
function peerIsRecent(latestHandshake) {
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
