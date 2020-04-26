import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
   selector: 'game-menu',
   templateUrl: './game-menu.component.html',
   styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit {

   socket: any;

   playerId; playerId_subscription;
   availableCharacters; availableCharacters_subscription;
   gamestate; gamestate_subscription;
   moveOptions; moveOptions_subscription;

   gameHasBegun = false;
   characterNames = ['Colonel Mustard', 'Miss Scarlet', 'Professor Plum',
   'Mr Green', 'Mrs White', 'Mrs Peacock']; // all possible character names
   charactersInGame = []; // holds all characters in the game that players have chosen

   constructor(private serverSvc: ServerService) {
      this.socket = this.serverSvc.getSocket();

      /* subscriptions to Subjects from the serverService */
      this.playerId_subscription = this.serverSvc.playerIdChange.subscribe({
         next: (playerId) => this.playerId = playerId
      });
      this.availableCharacters_subscription = this.serverSvc.availableCharacters.subscribe({
         next: (availChars) => { this.availableCharacters = availChars; this.charactersInGame = this.getCharactersInGame(availChars) }
      });
      this.gamestate_subscription = this.serverSvc.gamestate.subscribe({
         next: (gamestate) => { this.gamestate = gamestate; }
      });
      this.moveOptions_subscription = this.serverSvc.moveOptions.subscribe({
         next: (moveOptions) => { this.moveOptions = moveOptions; }
      });
   }

   ngOnInit() {
   }

   ngAfterViewInit() {
      this.serverSvc.enteredGame(); // notify server of client entering game-menu to trigger initialization communications
   }

   beginGame() {
      this.serverSvc.startGame();
      this.gameHasBegun = true;
   }

   makeMove(room: string) {
      this.serverSvc.sendMoveChoice(room);
   }

   endTurn() {
      this.serverSvc.endTurn();
   }

   getPlayerNum(playerId) {
      if(playerId === 'player0') {
         return 'Player 1';
      } else if(playerId === 'player1') {
         return 'Player 2';
      } else if(playerId === 'player2') {
         return 'Player 3';
      } else if(playerId === 'player3') {
         return 'Player 4';
      } else if(playerId === 'player4') {
         return 'Player 5';
      } else if(playerId === 'player5') {
         return 'Player 6';
      } else {
         // should never be more than 6 players, but this is reached if playerId is undefined
         return 'TIAAT';
      }
   }

   getCharactersInGame(availChars) {
      return this.characterNames.filter( (x) => !availChars.includes(x) );
   }

   disconnect() {
      this.serverSvc.removeSocket();
   }

   ngOnDestroy() { //prevent memory leak when component destroyed
      this.playerId_subscription.unsubscribe();
      this.gamestate_subscription.unsubscribe();
      this.moveOptions_subscription.unsubscribe();

      this.serverSvc.removeSocket();
   }

}
