import * as http from 'http';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as io from 'socket.io';

import { Message } from './model/Message';

class Server {
  static readonly PORT: number = 3000;
  app: express.Express;
  port: number;
  server: any;
  io: SocketIO.Server;

  public static bootstrap(): Server {
    return new Server();
  }

  private routes(): void {
    let router = express.Router();

    router.get('/api', (req, res, next) => {
      res.json({
        message: 'hello world!'
      });
    });

    router.post('/api', (req, res, next) => {
      this.io.emit('message', 'post!');
      res.status(200).end();
    });

    this.app.use(router);
  }

  constructor() {
    this.app = express();
    this.routes();
    this.port = process.env.PORT || Server.PORT;
    this.server = http.createServer(this.app);
    this.io = io(this.server);

    this.server.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });

    this.io.on('connect', (socket: SocketIO.Socket) => {
      console.log(`Connected client on port ${this.port}`);
      socket.on('message', (m: Message) => {
        let clients = this.io.clients();
        console.log(`[server](message): ${socket.client.id}: ${m}`);
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('client disconnected');
      });
    });
  }
}

let server = Server.bootstrap();
export default server.app;
