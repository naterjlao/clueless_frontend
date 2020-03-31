import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

@ViewChild('game') private gameCanvas: ElementRef;

private context: any;
private socket: any;

  ngOnInit() {
    this.socket = io('http://john.natelao.com:3000');
  }

  ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext('2d');

    this.socket.on('position', position => {
      this.context.clearRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x,position.y,20,20);
    });
  }

  move(direction: string) {
    this.socket.emit('move', direction);
  }

}
