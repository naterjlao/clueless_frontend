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
   gameHasBegun: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   playerIdChange: Subject<string> = new Subject<string>();
   availableCharacters: BehaviorSubject<object> = new BehaviorSubject<object>(["Colonel Mustard", "Miss Scarlet", "Professor Plum", "Mr Green", "Mrs White", "Mrs Peacock"]);
   playerstate: Subject<object> = new Subject<object>();
   gamestate: Subject<object> = new Subject<object>();
   gameboard: Subject<object> = new Subject<object>();
   moveOptions: Subject<object> = new Subject<object>();
   checklist: Subject<object> = new Subject<object>();
   cardList: Subject<object> = new Subject<object>();
   message: Subject<object> = new Subject<object>();

   constructor() { }

   // construtor for the socket
   // any method which receives a signal from the server must be listed here
   createSocket() {
      // create socket using server http address and port number
      this.socket = io(env.hostServer + ':' + env.serverPort, { forceNew: true });

      // add methods which trigger when a signal is emitted from the server
      this.updatePlayerState();
      this.updateGamestate();
      this.updateGameboard();
      this.updateMoveOptions();
      this.updateSuggestionOptions();
      this.updateAccusationOptions();
      this.updateChecklist();
      this.updateCardList();
      this.updateMessagePanel();
   }

   // returns this client's socket connected to the server
   getSocket() {
      return this.socket;
   }


   /*******************************************************************************************************************
     METHODS THAT RECEIVE A SIGNAL FROM THE SERVER
   ********************************************************************************************************************/

   /**********************************************
     PREGAME SIGNALS
   **********************************************/

   // Contains PLAYER SPECIFIC meta-information
   updatePlayerState() {
      this.socket.on('playerstate', data => {
         /*
           data emitted from server is in the following form:
         {
            playerId:<playerId of the player that has the current turn>
            suspect: <the suspect character that the player has chosen>
            isSuggestionValid: <TRUE if the player can make a suggestion at the game’s current state>
         }
         */
         console.log(data);
         this.playerId = data.playerId; // store in serverService
         this.playerIdChange.next(data.playerId); // update frontend with playerId
         this.playerstate.next(data);
      });
   }

   /**********************************************
     GAME IN-PROGRESS SIGNALS
   **********************************************/

   // Contains GAME WIDE meta-information
   updateGamestate() {
      this.socket.on('gamestate', data => {
         /*
           data emitted from server is in the following form:
         {
            currentPlayerId:<playerId of the player that has the current turn>
            turnStatus: <string of the status of the turn, pulled from backend’s gameState.turnStatus>
            suggestionCharacter: <character name of player that needs to respond to suggestion>
            availableCharacters: <list of characters that are available to be picked>
            characters_in_game: <list of string characters selected by all players in the game>
            game_has_begun: <boolean - self.state != STATE_INITIAL>
         }
         */
         console.log(data);
         this.gameHasBegun.next(data.game_has_begun);
         this.availableCharacters.next(data.availableCharacters);
         this.gamestate.next(data);
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
         this.gameboard.next(data);
      });
   }

   // Buttons for the Player to move to on the Board. Displays only the valid spaces
   updateMoveOptions() {
      this.socket.on('move_options', data => {
         /*
            data emitted from server is in the following form:
         [
            <a list of rooms (strings) that the player can move to.
            IF THERE IS NO VALID MOVE, a singleton list containing “SKIP TURN” will be returned>
         ]
         */
         console.log(data);
         this.moveOptions.next(data);
      });
   }

   // The backend will send back a list of available choices of suspects, rooms and weapons for the suggestion
   updateSuggestionOptions() {
      this.socket.on('suggestion_options', data => {
         /*
            data emitted from server is in the following form:
         {
            suspects:<a list of all suspects (strings)>
            weapons:<a list of all weapons (strings)>
            rooms:<a list of all rooms (strings)>

         }
         */
         console.log(data);
         // TODO: implement
      });
   }

   // The backend will send back a list of available choices of suspects, rooms and weapons for the accusation
   updateAccusationOptions() {
      this.socket.on('accusation_options', data => {
         /*
            data emitted from server is in the following form:
         {
            suspects:<a list of all suspects (strings)>
            weapons:<a list of all weapons (strings)>
            rooms:<a list of all rooms (strings)>

         }
         */
         console.log(data);
         // TODO: implement
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
         this.checklist.next(data);
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
         this.cardList.next(data.cardList);
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
         this.message.next(data);
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

   // frontend notifies the backend of the start of a suggestion
   sendSuggestionStart() {
      /*
         data emitted from server is in the following form:
         {
            <send an empty dict>
         }
      */
      console.log('suggestion_start emitted');
      this.socket.emit('suggestion_start', {});
   }

   // frontend notifies the backend of the start of a accusation
   sendAccusationStart() {
      /*
         data emitted from server is in the following form:
         {
            <send an empty dict>
         }
      */
      this.socket.emit('accusation_start', {});
   }

   // After the player has picked his/her combination, the Frontend must send the following information:
   sendSuggestionChoice(data) {
      /*
         data emitted from server is in the following form:
         {
            suspect:<the player’s choice of suspect>
            weapon:<the player’s choice of weapon>
            room:<the player’s choice of room>
         }
      */
      console.log(data);
      this.socket.emit('suggestion_choice', {
         suspect: data.suspect,
         weapon: data.weapon,
         room: data.room
      });
   }

   // After the player has picked his/her combination, the Frontend must send the following information:
   sendAccusationChoice(data) {
      /*
         data emitted from server is in the following form:
         {
            suspect:<the player’s choice of suspect>
            weapon:<the player’s choice of weapon>
            room:<the player’s choice of room>
         }
      */
      console.log(data);
      this.socket.emit('accusation_choice', {
         suspect: data.suspect,
         weapon: data.weapon,
         room: data.room
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

   /**********************************************
     POST GAME SIGNALS
   **********************************************/
   // THIS IS A SPECIAL CASE SIGNAL
   // removes this client's socket from the server
   removeSocket() {
      this.socket.emit('disconnect',{});
      this.socket = null;
   }


   /*******************************************************************************************************************
     STATIC METHODS - CALLED BY FRONTEND COMPONENTS
   ********************************************************************************************************************/

   getCharacter() {
      return this.character;
   }
}
