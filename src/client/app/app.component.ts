import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'angles-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'angles';

  constructor(private http: Http) {

  }

  ngOnInit(): void {
    this.http.get('/api').subscribe(x => {
      this.title = x.json().message;
    });
  }

}
