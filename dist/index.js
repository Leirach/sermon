"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const minecraft_1 = require("./services/minecraft");
const samba_1 = require("./services/samba");
const valheim_1 = require("./services/valheim");
const helpers_1 = require("./helpers");
const duckdns_1 = require("./services/duckdns");
const wireguard_1 = require("./services/wireguard");
if (process.env.NODE_ENV == "production") {
    dotenv_1.default.config({ path: ".env.production" });
}
else {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, minecraft_1.HealthCheckMinecraft)(app);
(0, samba_1.HealthCheckSamba)(app);
(0, valheim_1.HealthCheckValheim)(app);
(0, duckdns_1.HealthCheckDuckDns)(app);
(0, wireguard_1.HealthCheckWireGuard)(app);
(0, helpers_1.SetupErrorHandler)(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
