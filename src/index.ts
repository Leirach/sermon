import dotenv from 'dotenv';
import express from 'express';
import { HealthCheckMinecraft } from './services/minecraft';
import { HealthCheckSamba } from './services/samba';
import { HealthCheckValheim } from './services/valheim';
import { SetupErrorHandler } from './helpers';
import { HealthCheckDuckDns } from './services/duckdns';

if (process.env.NODE_ENV == "production") {
    dotenv.config({path: ".env.production"});
}
else {
    dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

HealthCheckMinecraft(app);
HealthCheckSamba(app);
HealthCheckValheim(app);
HealthCheckDuckDns(app);

SetupErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
