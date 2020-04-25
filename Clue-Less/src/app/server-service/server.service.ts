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
   character; // game character selected in select-player menu

   /**************************************************************************************************
     variables that recieve updates from the server and send updates to subscribed frontend components
   **************************************************************************************************/
   gameIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   playerIdChange: Subject<string> = new Subject<string>();
   availableCharacters: BehaviorSubject<object> = new BehaviorSubject<object>(["Colonel Mustard", "Miss Scarlet", "Professor Plum", "Mr Green", "Mrs White", "Mrs Peacock"]);
   whosTurn: Subject<number> = new Subject<number>();
   positionChange: Subject<object> = new Subject<object>();
   gameState: Subject<object> = new Subject<object>();
   turnData: Subject<object> = new Subject<object>();

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
      this.updateGameStateJSON();
      this.updateTurn();

      // methods for new serverside infra which receive a signal
      this.updatePlayerState();
      this.updateGamestate();
      this.updateGameboard();
      this.updateChecklist();
      this.updateMoveOptions();
      this.updateCardList();
      this.updateMessagePanel();

      this.updatePosition();
   }

   // returns this client's socket connected to the server
   getSocket() {
      return this.socket;
   }


   /*******************************************************************************************************************
     METHODS THAT RECEIVE A SIGNAL FROM THE SERVER
   ********************************************************************************************************************/

   // TODO: add a handler for 'move_options'
   // TODO: the payload of this signal is {"move_options":<list of rooms>}
   // TODO: this occurs AFTER a signal call to the server to make_move

   // THIS IS A SPECIAL CASE SIGNAL
   // receives signal that game has >= 2 players and game can now begin
   isGameReady() {
      this.socket.on('game_is_ready', data => {
         // data will be empty, this signal just notifies the frontend that we can begin the game
         console.log("game is ready"); console.log(data);
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

   // updates the UI Game Board based on the gameState info from the server
   updateGameStateJSON() {
      this.socket.on('update_gameState', data => {
         /*
           data emitted from server is defined in the Backend
         */
         console.log(data);
         this.gameState.next(data);
      });
   }

   // receives updates from server about turn data
   updateTurn() {
      this.socket.on('turnUpdate', data => {
         /*
           data emitted from server is in the following form:
         {
            playerId: string, // of who's turn it is
            turn_status: string,
            move_options: []
         }
         */
         console.log(data);
         this.turnData.next(data);
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


   /*******************************************************************************************************************
     METHODS FOR NEW SERVERSIDE INFRASTRUCTURE THAT RECEIVE A SIGNAL FROM THE SERVER
   ********************************************************************************************************************/


   // Contains PLAYER SPECIFIC meta-information
   updatePlayerState() {
      this.socket.on('playerstate', data => {
         /*
           data emitted from server is in the following form:
         {
            playerId:<playerId of the player that has the current turn>
            suspect: <the suspect character that the player has chosen>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }

   // Contains GAME WIDE meta-information
   updateGamestate() {
      this.socket.on('gamestate', data => {
         /*
           data emitted from server is in the following form:
         {
            currentPlayerId:<playerId of the player that has the current turn>
            players: <list of players in the game>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }

   // Contains a top-down view of the Clueless board. All players can be seen on the board.
   updateGameboard() {
      this.socket.on('gameboard', data => {
         /*
           data emitted from server is in the following form:
         {
            location:<string of the room the player is currently located>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }

   /*
      Contains a UI window that contains the suspects, weapons and rooms
      that the Player has already seen through suggestions and the cards
      they were dealt at the beginning of the game. The point of this is
      to help the player to keep track of who didn’t commit the crime.
   */
   updateChecklist() {
      this.socket.on('checklist', data => {
         /*
           data emitted from server is in the following form:
         {
            suspects:<a list of suspects (strings) that are checked off in the list>
            weapons:<a list of weapons (strings) that are checked off in the list>
            rooms:<a list of rooms (strings) that are checked off in the list>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }

   // Buttons for the Player to move to on the Board. Displays only the valid spaces
   updateMoveOptions() {
      this.socket.on('move_options', data => {
         /*
           data emitted from server is in the following form:
         {
            choices: <a list of rooms (strings) that the player can move to.
                     IF THERE IS NO VALID MOVE, a singleton list containing “SKIP TURN” will be returned>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }

   // Contain the UI for all the cards the player might have.
   updateCardList() {
      this.socket.on('card_list', data => {
         /*
           data emitted from server is in the following form:
         {
            cardList: <list of cards (string) the player has>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }

   // Contains a window that displays whatever string the Backend sends to the player
   updateMessagePanel() {
      this.socket.on('message', data => {
         /*
           data emitted from server is in the following form:
         {
             message: <string>,
             color: <ie. “red”, “blue”, etc.>
         }
         */
         console.log(data);
         // TODO: implement use of data
      });
   }


   /*******************************************************************************************************************
     METHODS FOR NEW SERVERSIDE INFRASTRUCTURE THAT SEND A SIGNAL TO THE SERVER
   ********************************************************************************************************************/


   // Sends the player's choice of space to move to on the Board.
   sendMoveChoice(choice: string) {
         /*
         data emitted from frontend to server is in the following form:
         {
            choice: <a string of the player’s choice
                     (it is assumed that THIS MUST BE from the acceptable choices given back the Backend>
         }
         */
         console.log(choice);
         this.socket.emit('move_choice', {
            choice: choice
         });
   }

   // Send's the player's card choice
   sendCardChoice(choice: string) {

         /*
         data emitted from server is in the following form:
         {
            choice: <a string of the card that the Player clicked>
         }
         */
         console.log(choice);
         this.socket.emit('card_choice', {
            choice: choice
         });
   }


   /*******************************************************************************************************************
     METHODS THAT SEND A SIGNAL TO THE SERVER
   ********************************************************************************************************************/

   /**********************************************
     PREGAME SIGNALS
   **********************************************/
   // used when player clicks the Start Game button that is in the start-menu
   // intended to send signal to server to initiate transmission of data needed for player-select screen
   enteredPlayerSelect() {
      // note: playerId does not yet exist at this point
      this.socket.emit('entered_player_select',{});
   }

   // tells the server which suspect the user has selected
   selectCharacter(character: string) {
      this.character = character;

      /* data format:
         {
            playerId: string,
            character: string
         }
      */
      this.socket.emit('select_character', {
         character: character
      });
   }

   // used when player clicks the Enter Game button that is in the player-select menu
   // intended to send signal to server to initiate transmission of data needed for game-menu screen
   enteredGame() {
      // note: playerId does not yet exist at this point
      this.socket.emit('entered_game',{});
   }

   // tells server to start the game, and tell the backend to initialize gameState json
   startGame() {
      this.socket.emit('start_game',{});
   }

   /**********************************************
     GAME IN-PROGRESS SIGNALS
   **********************************************/
   // used when a player moves on the board
   makeMove(room: string) {
      this.socket.emit('move_choice', {
         choice: room
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
         suspect: suspect,
         weapon: weapon,
         room: room
      });
   }

   // TODO >>> THIS IS NEW <<<<
   // When a card is clicked on the UI, the Client sends this
   // signal to the Server. This happens regardless of the state of the game.
   // The Server may choose to ignore it, or take action.
   selectCard(choice: string) {
	   this.socket.emit('card_choice', {
		   choice: choice
	   });
   }


   /* // DEPRECATE - THIS IS CAPTURED IN move_choice
   // ends the current players turn and tells the server to increment the turn
   endTurn() {
      this.socket.emit('pass_turn',{});
   }
   */

	/* // DEPRECATE
   // possibly temporary/maybe reusable: emits the direction the block is moving
   move(direction: string) {

      this.socket.emit('move', {
         direction: direction
      });
   }
   */

   /**********************************************
     POST GAME SIGNALS
   **********************************************/
   // THIS IS A SPECIAL CASE SIGNAL
   // removes this client's socket from the server
   removeSocket() {
      this.socket.emit('disconnect',{});
      this.socket = null;
   }

}
