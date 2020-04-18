import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../environments/environment';
const env = environment;

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private socket; // client socket connected to the server
  playerId; // initialized once emitted from the server

  /**************************************************************************************************
    variables that recieve updates from the server and send updates to subscribed frontend components
  **************************************************************************************************/
  playerIdChange: Subject<string> = new Subject<string>();
  whosTurn: Subject<number> = new Subject<number>();
  positionChange: Subject<object> = new Subject<object>();

  constructor() { }

  // construtor for the socket
  // any method which receives a signal from the server must be listed here
  createSocket() {
    // create socket using server http address and port number
    this.socket = io(env.hostServer + ':' + env.serverPort, { forceNew: true });

    // add methods which trigger when a signal is emitted from the server
    this.getStartInfo();
    this.getWhosTurn();
    this.updatePosition();
    this.updateGameboard();
  }

  // returns this client's socket connected to the server
  getSocket() {
    return this.socket;
  }


  /**********************************************
    Methods that RECEIVE a signal from the server
  **********************************************/


  // receives player start info from server (currently just the player id)
  getStartInfo() {
    this.socket.on('startInfo', data => {
      /*
      data emitted from server is in the following form:
      {
        player: socket.playerId
      }
      */
      console.log(data);
      this.playerId = data.player; // store in serverService
      this.playerIdChange.next(data.player); // update frontend with playerId
    });
  }

  // temporary: updates frontend canvas with block position
  updatePosition() {
    this.socket.on('position', data => {
      /*
      data emitted from server is in the following form:
      {
        position: {
          x: number,
          y: number
        }
      }
      */
      console.log(data);
      let pos = data.position;
      this.positionChange.next({x: pos.x, y: pos.y, w: 10, h: 10});
    });
  }

  // updates the UI Game Board based on the gamestate info from the server
  updateGameboard() {
    this.socket.on('gamestate', data => {
      /*
        data emitted from server is defined in the Backend
      */
      console.log(data);
      /* TODO: >> NOT IMPLEMENTED << */
    });
  }

  // updates frontend with the updated turn value from the server
  getWhosTurn() {
    /*
      data emitted from server is in the following form:
      {
        turn: number
      }
      */
    this.socket.on('turnChange', data => {
      console.log(data);
      this.whosTurn.next(data.turn);
    });
  }


  /**********************************************
    Methods that SEND a signal to the server
  **********************************************/


  // used when player clicks the enterGame buttin that is in the player-select menu
  // intended to send signal to server to initiate transmission of data needed for game-menu screen
  enteredGame() {
    // note: playerId does not yet exist at this point
    this.socket.emit('entered_game');
  }

  // tells server to start the game, and tell the backend to initialize gameState json
  startGame() {
    this.socket.emit('start_game', {
		/* data format:
      {
			playerId: string
      }
		*/
      playerId: this.playerId
    });
  }

  // possibly temporary/maybe reusable: emits the direction the block is moving
  move(direction: string) {
    /* data format:
      {
        playerId: string,
        direction: string
      }
    */
    this.socket.emit('move', {
      playerId: this.playerId,
      direction: direction
    });
  }

  // tells the server the suggestion the player is making
  makeSuggestion(suspect: string, weapon: string, room: string) {
      /* data format:
          {
            playerId: string,
            suspect: string,
            weapon: string,
            room: string
          }
      */
      this.socket.emit('make_suggestion', {
        playerId: this.playerId,
        suspect: suspect,
        weapon: weapon,
        room: room
      });
  }

  // tells the server the accusation the player is making
  makeAccusation(suspect: string, weapon: string, room: string) {
    /* data format:
          {
            playerId: string,
            suspect: string,
            weapon: string,
            room: string
          }
        */
    this.socket.emit('make_accusation', {
      playerId: this.playerId,
      suspect: suspect,
      weapon: weapon,
      room: room
    });
  }

  // ends the current players turn and tells the server to increment the turn
  endTurn() {
    /* data format:
      {
        playerId: string
      }
    */
    this.socket.emit('pass_turn', {
      playerId: this.playerId
    });
  }

  // this function may not be used in the minimal increment
  // TODO: get clarity on purpose of makeMove and when it will be used
  makeMove(suspect: string, room: string) {
    /* data format:
      {
        playerId: string,
        suspect: string,
        room: string
      }
    */
    this.socket.emit('make_move', {
      playerId: this.playerId,
      suspect: suspect,
      room: room
    });
  }

  // this function may not be used in the minimal increment
  // tells the server which suspect the user has selected?
  // TODO: get clarity on when this would be called. It seems makeSuggestion and makeAccisation would already include a suspect
  selectCharacter(character: string) {
    /* data format:
      {
        playerId: string,
        suspect: string
      }
    */
    this.socket.emit('select_character', {
      playerId: this.playerId,
      character: character
    });
  }

  // removes this client's socket from the server
  removeSocket() {
    this.socket.emit('disconnect');
    this.socket = null;
  }

}
