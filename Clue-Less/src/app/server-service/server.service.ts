import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject  } from 'rxjs';
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
  positionChange: Subject<object> = new Subject<object>();

  constructor() { }

  createSocket() {
    this.socket = io(env.hostServer + ':' + env.serverPort, { forceNew: true });

    // add methods which trigger when a signal is emitted from the server
    this.getStartInfo();
    this.getWhosTurn();
    this.updatePosition();
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

  updatePosition() {
    this.socket.on('position', pos => {
      this.positionChange.next({x: pos.x, y: pos.y, w: 10, h: 10});
    });
  }

  getWhosTurn() {
    this.socket.on('turnChange', turn => {
      this.whosTurn.next(turn);
    });
  }

  /* Methods that send a signal to the server */

  enteredGame() {
    this.socket.emit('enteredGame');
  }

  move(direction: string) {
    this.socket.emit('move', direction);
  }

  endTurn() {
    this.socket.emit('pass_turn');
  }

}
