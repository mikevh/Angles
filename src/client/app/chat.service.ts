import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  url = 'http://localhost:3000';
  socket: any;

  constructor() { }

  sendMessage(message): void {
    this.socket.emit('message', message);
    console.log('message sent');
  }

  getMessages(): Observable<string> {
    return new Observable(o => {
      this.socket = io(this.url);

      this.socket.on('message', (data) => {
        o.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

}
