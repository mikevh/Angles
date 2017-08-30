import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { Message } from 'primeng/primeng';

import { ChatService } from './chat.service';

@Component({
  selector: 'angles-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'angles';
  msgs: Message[] = [];
  connection: Subscription;
  message = '';

  constructor(private http: Http, private chat: ChatService) {

  }

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

  onclick(): void {
    this.chat.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit(): void {
    this.connection = this.chat.getMessages().subscribe((m: string) => {
      this.msgs.push({summary: m});

    });

    this.http.get('/api').subscribe(x => {
      this.title = x.json().message;
    });
  }

}
