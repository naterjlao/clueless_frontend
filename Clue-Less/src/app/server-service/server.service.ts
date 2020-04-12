import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../environments/environment';
const env = environment;

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private socket;
  playerId: Subject<string> = new Subject<string>();
  whosTurn: Subject<number> = new Subject<number>();

  constructor() { }

  createSocket(gameCanvas, context) {
    this.socket = io(env.hostServer + ':' + env.serverPort, { forceNew: true });

    // add methods which trigger when a signal is emitted from the server
    this.getStartInfo();
    this.updatePosition(gameCanvas, context);
    this.getWhosTurn();
  }

  getSocket() {
    return this.socket;
  }

  removeSocket() {
    this.socket.emit('disconnect');
    this.socket = null;
  }

  /* Methods that receive a signal from the server */
  getStartInfo() {
    this.socket.on('startInfo', data => {
      this.playerId.next(data.player);
    });
  }

  updatePosition(gameCanvas, context) {
    this.socket.on('position', position => {
      context.clearRect(0,0,gameCanvas.nativeElement.width,gameCanvas.nativeElement.height);
      context.fillRect(position.x,position.y,10,10);
    });
  }

  getWhosTurn() {
    this.socket.on('turnChange', turn => {
      this.whosTurn.next(turn);
    });
  }

  /* Methods that send a signal to the server */
  move(direction: string) {
    this.socket.emit('move', direction);
  }

  endTurn() {
    this.socket.emit('pass_turn');
  }

}
