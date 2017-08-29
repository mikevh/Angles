import * as express from 'express';
import * as bodyParser from 'body-parser';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    private routes(): void {
        let router = express.Router();

        router.get('/api', (req, res, next) => {
            res.json({
                message: 'hello worldx'
            });
        });
        this.express.use(router);
    }
}

export default new App().express;