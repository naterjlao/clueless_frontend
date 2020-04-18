import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit {

  @ViewChild('game', {static: false}) private gameCanvas: ElementRef;

  private context: any;
  testGameState; // ONLY USED FOR TESTING - TODO: remove later

  playerId; playerId_subscription;
  whosTurn; whosTurn_subscription;
  position; position_subscription;
  gameState; gameState_subscription;

  showGameBoard = false; //temp variable for dev use

  constructor(private serverSvc: ServerService) {
      /* subscriptions to Subjects from the serverService */
      this.playerId_subscription = this.serverSvc.playerIdChange.subscribe({
        next: (playerId) => this.playerId = playerId
      });
      this.whosTurn_subscription = this.serverSvc.whosTurn.subscribe({
        next: (turn) => this.whosTurn = turn
      });
      this.position_subscription = this.serverSvc.positionChange.subscribe({
        next: (position) => { this.position = position; this.positionChange(this.position); }
      });
      this.gameState_subscription = this.serverSvc.gameState.subscribe({
        next: (gameState) => { this.gameState = gameState; }
      });
    }

    ngOnInit() {
      this.testGameState = this.getTestGameState(); // ONLY USED FOR TESTING - TODO: remove later
      console.log(this.testGameState);
    }

    ngAfterViewInit() {
      this.context = this.gameCanvas.nativeElement.getContext('2d');
      this.serverSvc.enteredGame(); // notify server of client entering game-menu to trigger initialization communications
    }

    positionChange(position) {
      if(position === {} || !this.gameCanvas || !this.context) return;

      this.context.clearRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x,position.y,position.w,position.h);
    }

    move(direction: string) {
      this.serverSvc.move(direction);
    }

    endTurn() {
      this.serverSvc.endTurn();
    }

    ngOnDestroy() { //prevent memory leak when component destroyed
      this.playerId_subscription.unsubscribe();
      this.whosTurn_subscription.unsubscribe();
      this.position_subscription.unsubscribe();
      this.gameState_subscription.unsubscribe();

      this.serverSvc.removeSocket();
  }

  getTestGameState() {
    let testGameState =
    JSON.parse(
      JSON.stringify(
        {
          "turn_status":"Awaiting Move",
          "turn_list":[
             {
                "card_seen:":[

                ],
                "suspect":null,
                "user":"redBoi",
                "card_hand":[
                   {
                      "item_type":"Room",
                      "item":"Ballroom"
                   },
                   {
                      "item_type":"Room",
                      "item":"Conservatory"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Mr Green"
                   },
                   {
                      "item_type":"Room",
                      "item":"Dining Room"
                   },
                   {
                      "item_type":"Room",
                      "item":"Study"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Knife"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Mrs Peacock"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Lead Pipe"
                   },
                   {
                      "item_type":"Room",
                      "item":"Hall"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Candlestick"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Professor Plum"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Colonel Mustard"
                   },
                   {
                      "item_type":"Room",
                      "item":"Library"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Rope"
                   },
                   {
                      "item_type":"Room",
                      "item":"Kitchen"
                   },
                   {
                      "item_type":"Room",
                      "item":"Lounge"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Revolver"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Miss Scarlet"
                   }
                ]
             }
          ],
          "game_winner":null,
          "player_messages":[

          ],
          "game":null,
          "win_hand":[
             {
                "item_type":"Suspect",
                "item":"Mrs White"
             },
             {
                "item_type":"Weapon",
                "item":"Wrench"
             },
             {
                "item_type":"Room",
                "item":"Billiard Room"
             }
          ],
          "suggestion_response":null,
          "players":[
             {
                "card_seen:":[

                ],
                "suspect":null,
                "user":"redBoi",
                "card_hand":[
                   {
                      "item_type":"Room",
                      "item":"Ballroom"
                   },
                   {
                      "item_type":"Room",
                      "item":"Conservatory"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Mr Green"
                   },
                   {
                      "item_type":"Room",
                      "item":"Dining Room"
                   },
                   {
                      "item_type":"Room",
                      "item":"Study"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Knife"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Mrs Peacock"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Lead Pipe"
                   },
                   {
                      "item_type":"Room",
                      "item":"Hall"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Candlestick"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Professor Plum"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Colonel Mustard"
                   },
                   {
                      "item_type":"Room",
                      "item":"Library"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Rope"
                   },
                   {
                      "item_type":"Room",
                      "item":"Kitchen"
                   },
                   {
                      "item_type":"Room",
                      "item":"Lounge"
                   },
                   {
                      "item_type":"Weapon",
                      "item":"Revolver"
                   },
                   {
                      "item_type":"Suspect",
                      "item":"Miss Scarlet"
                   }
                ]
             }
          ],
          "game_active":true,
          "current_suggestion":null,
          "current_player":{
             "card_seen:":[

             ],
             "suspect":null,
             "user":"redBoi",
             "card_hand":[
                {
                   "item_type":"Room",
                   "item":"Ballroom"
                },
                {
                   "item_type":"Room",
                   "item":"Conservatory"
                },
                {
                   "item_type":"Suspect",
                   "item":"Mr Green"
                },
                {
                   "item_type":"Room",
                   "item":"Dining Room"
                },
                {
                   "item_type":"Room",
                   "item":"Study"
                },
                {
                   "item_type":"Weapon",
                   "item":"Knife"
                },
                {
                   "item_type":"Suspect",
                   "item":"Mrs Peacock"
                },
                {
                   "item_type":"Weapon",
                   "item":"Lead Pipe"
                },
                {
                   "item_type":"Room",
                   "item":"Hall"
                },
                {
                   "item_type":"Weapon",
                   "item":"Candlestick"
                },
                {
                   "item_type":"Suspect",
                   "item":"Professor Plum"
                },
                {
                   "item_type":"Suspect",
                   "item":"Colonel Mustard"
                },
                {
                   "item_type":"Room",
                   "item":"Library"
                },
                {
                   "item_type":"Weapon",
                   "item":"Rope"
                },
                {
                   "item_type":"Room",
                   "item":"Kitchen"
                },
                {
                   "item_type":"Room",
                   "item":"Lounge"
                },
                {
                   "item_type":"Weapon",
                   "item":"Revolver"
                },
                {
                   "item_type":"Suspect",
                   "item":"Miss Scarlet"
                }
             ]
          },
          "game_board":{
             "study-hall Passage":{
                "name":"study-hall Passage",
                "connected":[
                   "Study",
                   "Hall"
                ],
                "suspects":[

                ]
             },
             "Mrs White":{
                "name":"Mrs White",
                "connected":[
                   "ballroom-kitchen Passage"
                ],
                "suspects":[
                   "Mrs White"
                ]
             },
             "ballroom-kitchen Passage":{
                "name":"ballroom-kitchen Passage",
                "connected":[
                   "Ballroom",
                   "Kitchen"
                ],
                "suspects":[

                ]
             },
             "Conservatory":{
                "name":"Conservatory",
                "weapons":[
                   "Candlestick"
                ],
                "connected":[
                   "conservatory-ballroom Passage",
                   "library-conservatory Passage",
                   "Lounge"
                ],
                "suspects":[

                ]
             },
             "Billiard Room":{
                "name":"Billiard Room",
                "weapons":[
                   "Knife"
                ],
                "connected":[
                   "hall-billiard Passage",
                   "library-billiard Passage",
                   "billiard-ballroom Passage",
                   "billiard-dining Passage"
                ],
                "suspects":[

                ]
             },
             "Mr Green":{
                "name":"Mr Green",
                "connected":[
                   "conservatory-ballroom Passage"
                ],
                "suspects":[
                   "Mr Green"
                ]
             },
             "study-library Passage":{
                "name":"study-library Passage",
                "connected":[
                   "Study",
                   "Library"
                ],
                "suspects":[

                ]
             },
             "hall-lounge Passage":{
                "name":"hall-lounge Passage",
                "connected":[
                   "Hall",
                   "Lounge"
                ],
                "suspects":[

                ]
             },
             "Miss Scarlet":{
                "name":"Miss Scarlet",
                "connected":[
                   "hall-lounge Passage"
                ],
                "suspects":[
                   "Miss Scarlet"
                ]
             },
             "Ballroom":{
                "name":"Ballroom",
                "weapons":[
                   "Lead Pipe"
                ],
                "connected":[
                   "ballroom-kitchen Passage",
                   "conservatory-ballroom Passage",
                   "billiard-ballroom Passage"
                ],
                "suspects":[

                ]
             },
             "dining-kitchen Passage":{
                "name":"dining-kitchen Passage",
                "connected":[
                   "Dining Room",
                   "Kitchen"
                ],
                "suspects":[

                ]
             },
             "library-conservatory Passage":{
                "name":"library-conservatory Passage",
                "connected":[
                   "Library",
                   "Conservatory"
                ],
                "suspects":[

                ]
             },
             "billiard-dining Passage":{
                "name":"billiard-dining Passage",
                "connected":[
                   "Billiard Room",
                   "Dining Room"
                ],
                "suspects":[

                ]
             },
             "billiard-ballroom Passage":{
                "name":"billiard-ballroom Passage",
                "connected":[
                   "Billiard Room",
                   "Ballroom"
                ],
                "suspects":[

                ]
             },
             "Library":{
                "name":"Library",
                "weapons":[
                   "Wrench"
                ],
                "connected":[
                   "study-library Passage",
                   "library-conservatory Passage",
                   "library-billiard Passage"
                ],
                "suspects":[

                ]
             },
             "conservatory-ballroom Passage":{
                "name":"conservatory-ballroom Passage",
                "connected":[
                   "Conservatory",
                   "Ballroom"
                ],
                "suspects":[

                ]
             },
             "Colonel Mustard":{
                "name":"Colonel Mustard",
                "connected":[
                   "lounge-dining Passage"
                ],
                "suspects":[
                   "Colonel Mustard"
                ]
             },
             "library-billiard Passage":{
                "name":"library-billiard Passage",
                "connected":[
                   "Library",
                   "Billiard Room"
                ],
                "suspects":[

                ]
             },
             "Professor Plum":{
                "name":"Professor Plum",
                "connected":[
                   "study-library Passage"
                ],
                "suspects":[
                   "Professor Plum"
                ]
             },
             "Lounge":{
                "name":"Lounge",
                "weapons":[

                ],
                "connected":[
                   "Conservatory",
                   "hall-lounge Passage",
                   "lounge-dining Passage"
                ],
                "suspects":[

                ]
             },
             "hall-billiard Passage":{
                "name":"hall-billiard Passage",
                "connected":[
                   "Hall",
                   "Billiard Room"
                ],
                "suspects":[

                ]
             },
             "Study":{
                "name":"Study",
                "weapons":[
                   "Revolver"
                ],
                "connected":[
                   "Kitchen",
                   "study-library Passage",
                   "study-hall Passage"
                ],
                "suspects":[

                ]
             },
             "Hall":{
                "name":"Hall",
                "weapons":[

                ],
                "connected":[
                   "study-hall Passage",
                   "hall-billiard Passage",
                   "hall-lounge Passage"
                ],
                "suspects":[

                ]
             },
             "Mrs Peacock":{
                "name":"Mrs Peacock",
                "connected":[
                   "library-conservatory Passage"
                ],
                "suspects":[
                   "Mrs Peacock"
                ]
             },
             "Dining Room":{
                "name":"Dining Room",
                "weapons":[

                ],
                "connected":[
                   "lounge-dining Passage",
                   "billiard-dining Passage",
                   "dining-kitchen Passage"
                ],
                "suspects":[

                ]
             },
             "Kitchen":{
                "name":"Kitchen",
                "weapons":[
                   "Rope"
                ],
                "connected":[
                   "dining-kitchen Passage",
                   "ballroom-kitchen Passage",
                   "Study"
                ],
                "suspects":[

                ]
             },
             "lounge-dining Passage":{
                "name":"lounge-dining Passage",
                "connected":[
                   "Lounge",
                   "Dining Room"
                ],
                "suspects":[

                ]
             }
          }
        }
      )
    );
    return testGameState;
  }

}
