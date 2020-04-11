import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../environments/environment';
const env = environment;

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  sockets = [];
  playerId: Subject<string> = new Subject<string>();
  whosTurn: Subject<number> = new Subject<number>();

  constructor() { }

  getInitialSocket(gameCanvas, context) {
    let newSocket = io(env.hostServer + ':' + env.serverPort, { forceNew: true });

    // add methods which trigger when a signal is emitted from the server
    this.getStartInfo(newSocket);
    this.updatePosition(newSocket, gameCanvas, context);
    this.getWhosTurn(newSocket);

    this.sockets.push(newSocket);
    return newSocket;
  }

  getAllSockets() {
    return this.getAllSockets;
  }

  removeSocket(socket) {
    const index = this.sockets.indexOf(socket);
    if (index > -1) {
      this.sockets.splice(index, 1);
    }
  }

  /* Methods that receive a signal from the server */
  getStartInfo(socket) {
    socket.on('startInfo', data => {
      this.playerId.next(data.player);
    });
  }

  updatePosition(socket, gameCanvas, context) {
    socket.on('position', position => {
      context.clearRect(0,0,gameCanvas.nativeElement.width,gameCanvas.nativeElement.height);
      context.fillRect(position.x,position.y,10,10);
    });
  }

  getWhosTurn(socket) {
    socket.on('turnChange', turn => {
      this.whosTurn.next(turn);
    });
  }

  /* Methods that send a signal to the server */
  move(socket, direction: string) {
    socket.emit('move', direction);
  }

  endTurn(socket) {
    socket.emit('pass_turn');
  }

}
