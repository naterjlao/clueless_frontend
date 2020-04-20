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
      this.positionChange.next({x: pos.x, y: pos.y, w: 10, h: 10});
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
        character: string
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







/* TEMPORARY: for dev purposes - to delete later */
  getTestGameState() {
    let testGameState =
       JSON.parse(
          JSON.stringify(
             {
                "turn_status": "Awaiting Move",
                "turn_list": [
                   {
                      "card_seen:": [

                      ],
                      "suspect": null,
                      "user": "redBoi",
                      "card_hand": [
                         {
                            "item_type": "Room",
                            "item": "Ballroom"
                         },
                         {
                            "item_type": "Room",
                            "item": "Conservatory"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Mr Green"
                         },
                         {
                            "item_type": "Room",
                            "item": "Dining Room"
                         },
                         {
                            "item_type": "Room",
                            "item": "Study"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Knife"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Mrs Peacock"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Lead Pipe"
                         },
                         {
                            "item_type": "Room",
                            "item": "Hall"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Candlestick"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Professor Plum"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Colonel Mustard"
                         },
                         {
                            "item_type": "Room",
                            "item": "Library"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Rope"
                         },
                         {
                            "item_type": "Room",
                            "item": "Kitchen"
                         },
                         {
                            "item_type": "Room",
                            "item": "Lounge"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Revolver"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Miss Scarlet"
                         }
                      ]
                   }
                ],
                "game_winner": null,
                "player_messages": [

                ],
                "game": null,
                "win_hand": [
                   {
                      "item_type": "Suspect",
                      "item": "Mrs White"
                   },
                   {
                      "item_type": "Weapon",
                      "item": "Wrench"
                   },
                   {
                      "item_type": "Room",
                      "item": "Billiard Room"
                   }
                ],
                "suggestion_response": null,
                "players": [ {},
                   {
                      "card_seen:": [

                      ],
                      "suspect": null,
                      "user": "redBoi",
                      "card_hand": [
                         {
                            "item_type": "Room",
                            "item": "Ballroom"
                         },
                         {
                            "item_type": "Room",
                            "item": "Conservatory"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Mr Green"
                         },
                         {
                            "item_type": "Room",
                            "item": "Dining Room"
                         },
                         {
                            "item_type": "Room",
                            "item": "Study"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Knife"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Mrs Peacock"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Lead Pipe"
                         },
                         {
                            "item_type": "Room",
                            "item": "Hall"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Candlestick"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Professor Plum"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Colonel Mustard"
                         },
                         {
                            "item_type": "Room",
                            "item": "Library"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Rope"
                         },
                         {
                            "item_type": "Room",
                            "item": "Kitchen"
                         },
                         {
                            "item_type": "Room",
                            "item": "Lounge"
                         },
                         {
                            "item_type": "Weapon",
                            "item": "Revolver"
                         },
                         {
                            "item_type": "Suspect",
                            "item": "Miss Scarlet"
                         }
                      ]
                   }
                ],
                "game_active": true,
                "current_suggestion": null,
                "current_player": {
                   "card_seen:": [

                   ],
                   "suspect": null,
                   "user": "redBoi",
                   "card_hand": [
                      {
                         "item_type": "Room",
                         "item": "Ballroom"
                      },
                      {
                         "item_type": "Room",
                         "item": "Conservatory"
                      },
                      {
                         "item_type": "Suspect",
                         "item": "Mr Green"
                      },
                      {
                         "item_type": "Room",
                         "item": "Dining Room"
                      },
                      {
                         "item_type": "Room",
                         "item": "Study"
                      },
                      {
                         "item_type": "Weapon",
                         "item": "Knife"
                      },
                      {
                         "item_type": "Suspect",
                         "item": "Mrs Peacock"
                      },
                      {
                         "item_type": "Weapon",
                         "item": "Lead Pipe"
                      },
                      {
                         "item_type": "Room",
                         "item": "Hall"
                      },
                      {
                         "item_type": "Weapon",
                         "item": "Candlestick"
                      },
                      {
                         "item_type": "Suspect",
                         "item": "Professor Plum"
                      },
                      {
                         "item_type": "Suspect",
                         "item": "Colonel Mustard"
                      },
                      {
                         "item_type": "Room",
                         "item": "Library"
                      },
                      {
                         "item_type": "Weapon",
                         "item": "Rope"
                      },
                      {
                         "item_type": "Room",
                         "item": "Kitchen"
                      },
                      {
                         "item_type": "Room",
                         "item": "Lounge"
                      },
                      {
                         "item_type": "Weapon",
                         "item": "Revolver"
                      },
                      {
                         "item_type": "Suspect",
                         "item": "Miss Scarlet"
                      }
                   ]
                },
                "game_board": {
                   "study-hall Passage": {
                      "name": "study-hall Passage",
                      "connected": [
                         "Study",
                         "Hall"
                      ],
                      "suspects": [

                      ]
                   },
                   "Mrs White": {
                      "name": "Mrs White",
                      "connected": [
                         "ballroom-kitchen Passage"
                      ],
                      "suspects": [
                         "Mrs White"
                      ]
                   },
                   "ballroom-kitchen Passage": {
                      "name": "ballroom-kitchen Passage",
                      "connected": [
                         "Ballroom",
                         "Kitchen"
                      ],
                      "suspects": [

                      ]
                   },
                   "Conservatory": {
                      "name": "Conservatory",
                      "weapons": [
                         "Candlestick"
                      ],
                      "connected": [
                         "conservatory-ballroom Passage",
                         "library-conservatory Passage",
                         "Lounge"
                      ],
                      "suspects": [

                      ]
                   },
                   "Billiard Room": {
                      "name": "Billiard Room",
                      "weapons": [
                         "Knife"
                      ],
                      "connected": [
                         "hall-billiard Passage",
                         "library-billiard Passage",
                         "billiard-ballroom Passage",
                         "billiard-dining Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "Mr Green": {
                      "name": "Mr Green",
                      "connected": [
                         "conservatory-ballroom Passage"
                      ],
                      "suspects": [
                         "Mr Green"
                      ]
                   },
                   "study-library Passage": {
                      "name": "study-library Passage",
                      "connected": [
                         "Study",
                         "Library"
                      ],
                      "suspects": [

                      ]
                   },
                   "hall-lounge Passage": {
                      "name": "hall-lounge Passage",
                      "connected": [
                         "Hall",
                         "Lounge"
                      ],
                      "suspects": [

                      ]
                   },
                   "Miss Scarlet": {
                      "name": "Miss Scarlet",
                      "connected": [
                         "hall-lounge Passage"
                      ],
                      "suspects": [
                         "Miss Scarlet"
                      ]
                   },
                   "Ballroom": {
                      "name": "Ballroom",
                      "weapons": [
                         "Lead Pipe"
                      ],
                      "connected": [
                         "ballroom-kitchen Passage",
                         "conservatory-ballroom Passage",
                         "billiard-ballroom Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "dining-kitchen Passage": {
                      "name": "dining-kitchen Passage",
                      "connected": [
                         "Dining Room",
                         "Kitchen"
                      ],
                      "suspects": [

                      ]
                   },
                   "library-conservatory Passage": {
                      "name": "library-conservatory Passage",
                      "connected": [
                         "Library",
                         "Conservatory"
                      ],
                      "suspects": [

                      ]
                   },
                   "billiard-dining Passage": {
                      "name": "billiard-dining Passage",
                      "connected": [
                         "Billiard Room",
                         "Dining Room"
                      ],
                      "suspects": [

                      ]
                   },
                   "billiard-ballroom Passage": {
                      "name": "billiard-ballroom Passage",
                      "connected": [
                         "Billiard Room",
                         "Ballroom"
                      ],
                      "suspects": [

                      ]
                   },
                   "Library": {
                      "name": "Library",
                      "weapons": [
                         "Wrench"
                      ],
                      "connected": [
                         "study-library Passage",
                         "library-conservatory Passage",
                         "library-billiard Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "conservatory-ballroom Passage": {
                      "name": "conservatory-ballroom Passage",
                      "connected": [
                         "Conservatory",
                         "Ballroom"
                      ],
                      "suspects": [

                      ]
                   },
                   "Colonel Mustard": {
                      "name": "Colonel Mustard",
                      "connected": [
                         "lounge-dining Passage"
                      ],
                      "suspects": [
                         "Colonel Mustard"
                      ]
                   },
                   "library-billiard Passage": {
                      "name": "library-billiard Passage",
                      "connected": [
                         "Library",
                         "Billiard Room"
                      ],
                      "suspects": [

                      ]
                   },
                   "Professor Plum": {
                      "name": "Professor Plum",
                      "connected": [
                         "study-library Passage"
                      ],
                      "suspects": [
                         "Professor Plum"
                      ]
                   },
                   "Lounge": {
                      "name": "Lounge",
                      "weapons": [

                      ],
                      "connected": [
                         "Conservatory",
                         "hall-lounge Passage",
                         "lounge-dining Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "hall-billiard Passage": {
                      "name": "hall-billiard Passage",
                      "connected": [
                         "Hall",
                         "Billiard Room"
                      ],
                      "suspects": [

                      ]
                   },
                   "Study": {
                      "name": "Study",
                      "weapons": [
                         "Revolver"
                      ],
                      "connected": [
                         "Kitchen",
                         "study-library Passage",
                         "study-hall Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "Hall": {
                      "name": "Hall",
                      "weapons": [

                      ],
                      "connected": [
                         "study-hall Passage",
                         "hall-billiard Passage",
                         "hall-lounge Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "Mrs Peacock": {
                      "name": "Mrs Peacock",
                      "connected": [
                         "library-conservatory Passage"
                      ],
                      "suspects": [
                         "Mrs Peacock"
                      ]
                   },
                   "Dining Room": {
                      "name": "Dining Room",
                      "weapons": [

                      ],
                      "connected": [
                         "lounge-dining Passage",
                         "billiard-dining Passage",
                         "dining-kitchen Passage"
                      ],
                      "suspects": [

                      ]
                   },
                   "Kitchen": {
                      "name": "Kitchen",
                      "weapons": [
                         "Rope"
                      ],
                      "connected": [
                         "dining-kitchen Passage",
                         "ballroom-kitchen Passage",
                         "Study"
                      ],
                      "suspects": [

                      ]
                   },
                   "lounge-dining Passage": {
                      "name": "lounge-dining Passage",
                      "connected": [
                         "Lounge",
                         "Dining Room"
                      ],
                      "suspects": [

                      ]
                   }
                }
             }
          )
       );
    return testGameState;
  }

}
