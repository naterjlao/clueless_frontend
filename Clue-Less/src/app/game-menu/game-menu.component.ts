import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit {

  private context: any;
  private socket: any;

  playerId;
  allPlayers = [];
  whosTurn = 0;

  constructor() { }

    ngOnInit() {
      this.socket = io('http://brian.natelao.com:3000'); //TODO - this is temporary, IP and port needs to be placed into a configuration file
    }

    ngAfterViewInit() {
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
