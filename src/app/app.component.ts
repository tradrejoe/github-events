import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public url = "http://www.pyfia.com:3000";
  public socket;
  public events : any[];
  public time: string;
  public logo = "./images/github.png";

  constructor() { 
  }
  
  ngOnInit() {
    this.socket = io(this.url);
    console.log("socket connection established...");
    this.socket.on("github-events", (data) => {
      console.log("github-events..." + JSON.stringify(data));
      this.events = [];
      for(var i=0; i<data.length;i++) {
        this.events.push(JSON.stringify(data[i]));
      }
    });
    this.socket.on("github-time", (t) => {
      //console.log("github-time..." + JSON.stringify(t));
      this.time = ", Current UTC Time in ISO Format: " + t;
    });    
  }
  title = 'GitHub Public Events';
}
