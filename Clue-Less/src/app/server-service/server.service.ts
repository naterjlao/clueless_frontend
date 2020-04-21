import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
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
   gameIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   playerIdChange: Subject<string> = new Subject<string>();
   availableCharacters: BehaviorSubject<object> = new BehaviorSubject<object>(["Colonel Mustard", "Miss Scarlet", "Professor Plum", "Mr Green", "Mrs White", "Mrs Peacock"]);
   whosTurn: Subject<number> = new Subject<number>();
   positionChange: Subject<object> = new Subject<object>();
   gameState: Subject<object> = new Subject<object>();

   constructor() { }

   // construtor for the socket
   // any method which receives a signal from the server must be listed here
   createSocket() {
      // create socket using server http address and port number
      this.socket = io(env.hostServer + ':' + env.serverPort, { forceNew: true });

      // add methods which trigger when a signal is emitted from the server
      this.isGameReady();
      this.getStartInfo();
      this.getAvailableCharacters();
      this.getWhosTurn();
      this.updatePosition();
      this.updateGameState();
   }

   // returns this client's socket connected to the server
   getSocket() {
      return this.socket;
   }


   /**********************************************
     Methods that RECEIVE a signal from the server
   **********************************************/

   // TODO: add a handler for 'move_options'
   // TODO: the payload of this signal is {"move_options":<list of rooms>}
   // TODO: this occurs AFTER a signal call to the server to make_move

   // receives signal that game has >= 2 players and game can now begin
   isGameReady() {
      this.socket.on('game_is_ready', data => {
         // data will be empty, this signal just notifies the frontend that we can begin the game
         console.log("game is ready");
         this.gameIsReady.next(true); // update frontend that game can begin
      });
   }

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

   getAvailableCharacters() {
      this.socket.on('available_characters', data => {
         /*
         data emitted from server is in the following form:
         {
           available_characters: <list of available character strings>
         }
         */
         console.log(data);
         this.availableCharacters.next(data.available_characters);
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
         this.positionChange.next({ x: pos.x, y: pos.y, w: 10, h: 10 });
      });
   }

   // updates the UI Game Board based on the gameState info from the server
   updateGameState() {
      this.socket.on('update_gameState', data => {
         /*
           data emitted from server is defined in the Backend
         */
         console.log(data);
         this.gameState.next(data);
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


   // used when player clicks the Start Game button that is in the start-menu
   // intended to send signal to server to initiate transmission of data needed for player-select screen
   enteredPlayerSelect() {
      // note: playerId does not yet exist at this point
      this.socket.emit('entered_player_select');
   }
   
   // tells the server which suspect the user has selected
   selectCharacter(character: string) {
      /* data format:
         {
            playerId: string,
            character: string
         }
      */
      this.socket.emit('select_character', {
         playerId: this.playerId,
         character: character
      });
   }
   
   // used when player clicks the Enter Game button that is in the player-select menu
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

   // used when a player moves on the board
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

   // removes this client's socket from the server
   removeSocket() {
      this.socket.emit('disconnect');
      this.socket = null;
   }

}
