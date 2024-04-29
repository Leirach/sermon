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
exports.HealthCheckSamba = void 0;
const child_process_1 = require("child_process");
const types_1 = require("../types");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function HealthCheckSamba(app) {
    app.get('/samba', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("huh");
            yield execAsync("smbclient -U nobody% -L localhost");
            const sambastatus = {
                status: types_1.ServiceStatus.up
            };
            res.json(sambastatus);
        }
        catch (err) {
            next(err);
        }
    }));
}
exports.HealthCheckSamba = HealthCheckSamba;
