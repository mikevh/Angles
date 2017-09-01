import * as http from 'http';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as io from 'socket.io';
import * as async from 'async';
import * as msRestAzure from 'ms-rest-azure';
import * as armResource from 'azure-arm-resource';
import * as armCompute from 'azure-arm-compute';
import * as armWebsite from 'azure-arm-website';

// import { Message } from './model/Message';

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

    router.post('/api/arm', (req, res, next) => {
      let clientId = '<clientid>';
      let secret = '<secret>';
      let domain = '<aad guid>';
      let subscriptionId = '<subid>';

      msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, (err, creds) => {
        if (err) {
          return console.log(err);
        }
        let resourceClient: armResource.ResourceManagementClient = new armResource.ResourceManagementClient(creds, subscriptionId);
        // let wam = new armWebsite.WebAppManagementclient(creds, subscriptionId);
       

        async.series([
          (cb) => {
            this.createResourceGroup( resourceClient, (error, result) => {
              if (error) {
                return cb(error);
              }

              cb(null, result);
            });
          },
          () => {
            this.createVM(resourceClient, (error, result) => {

            });
          },
          (cb) => {
              this.listResourceGroups( resourceClient, (error, result) => {
                if (error) {
                  return cb(error);
                }

                console.log('got groups!');
                
                cb(null, result);
              });
          },
          (cb) => {
            console.log('ok!');
            cb(null);
          }
        ]);

      });
    });

    router.post('/api', (req, res, next) => {
      this.io.emit('message', 'post!');
      res.status(200).end();
    });

    this.app.use(router);
  }

  createVM(client: armResource.ResourceManagementClient, cb) {
    
  }

  createResourceGroup(client: armResource.ResourceManagementClient, cb): Promise<any>{
    let groupParameters = {
      location: 'westus2'
    };
    return client.resourceGroups.createOrUpdate('fromts3', groupParameters, cb);
  }

  listResourceGroups(client: armResource.ResourceManagementClient, cb) {
    return client.resourceGroups.list(cb);
  }

  constructor() {
    this.app = express();
    this.app.use(express.static('dist'));
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
