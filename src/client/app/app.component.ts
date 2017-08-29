import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Message } from 'primeng/primeng';

@Component({
  selector: 'angles-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'angles';
  msgs: Message[] = [];

  constructor(private http: Http) {

  }

  onclick(): void {
    this.msgs.push({severity:'info', summary:'Info Message', detail:'PrimeNG rocks'});
  }

  ngOnInit(): void {
    this.http.get('/api').subscribe(x => {
      this.title = x.json().message;
    });
  }

}
