import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import io from 'socket.io-client';
import { network } from '../../environments/environment'; // TODO probably want absolute reference

@Component({
  selector: 'game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit {

  @ViewChild('game', {static: false}) private gameCanvas: ElementRef;

  private context: any;
  private socket: any;

  playerId;
  allPlayers = [];
  whosTurn = 0;
  
  constructor() { }

    ngOnInit() {
    this.socket = io(network.SERVER_IP+':'+network.SERVER_PORT, { forceNew: true }); //TODO - this is temporary, IP and port needs to be placed into a configuration file
    }

    ngAfterViewInit() {
      this.context = this.gameCanvas.nativeElement.getContext('2d');

      this.socket.on('position', position => {
        this.context.clearRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.height);
        this.context.fillRect(position.x,position.y,10,10);
      });

      this.socket.on('turnChange', turn => {
        this.whosTurn = turn;
      });
    }

    move(direction: string) {
      this.socket.emit('move', direction);
    }

    endTurn() {
      this.socket.emit('pass_turn');
    }

}
