require('dotenv').config();
import { default as express } from 'express';
import * as bodyParser from 'body-parser';

import { Database } from './database';

import { SchedulerController } from './modules/scheduler/SchedulerController';
import { MailController } from './modules/mail/MailController';

import { CronJob } from './modules/startup/cronjob';

export class App {
    public app: express.Application;
    public port: string;

    constructor(port: string) {
        this.app = express();
        this.port = port;
        this.configure();
    }

    private configure() {
        this.app.use(bodyParser.json());
        this.configureDatabase();
        this.accessControl();
        this.initializeController();
        new CronJob();
    }

    private async configureDatabase() {
        try {
            await new Database().databaseConnection();
            this.listen();
        } catch (err) {
            process.exit(1);
        }
    }

    private accessControl() {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            next();
        })
    }

    private initializeController() {
        this.app.use('/api/scheduler', new SchedulerController().router);
        this.app.use('/api/mail', new MailController().router);
    }

    private listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on ${this.port}`);
        });
    }
}
