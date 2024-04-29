"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupErrorHandler = void 0;
const types_1 = require("./types");
const statusDown = {
    status: types_1.ServiceStatus.down
};
function SetupErrorHandler(app) {
    app.use((err, req, res, next) => {
        console.error(err);
        res.json(statusDown);
    });
}
exports.SetupErrorHandler = SetupErrorHandler;
