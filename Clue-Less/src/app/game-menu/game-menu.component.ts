import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
   selector: 'game-menu',
   templateUrl: './game-menu.component.html',
   styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit {

   @ViewChild('game', { static: false }) private gameCanvas: ElementRef;

   private context: any;
   socket: any;

   gameIsReady; gameIsReady_subscription;
   playerId; playerId_subscription;
   whosTurn; whosTurn_subscription;
   position; position_subscription;
   availableCharacters; availableCharacters_subscription;
   gameState; gameState_subscription;

   showGameBoard = false; //temp variable for dev use
   characterNames = ['Colonel Mustard', 'Miss Scarlet', 'Professor Plum',
   'Mr Green', 'Mrs White', 'Mrs Peacock']; // all possible character names
   charactersInGame = []; // holds all characters in the game that players have chosen

   constructor(private serverSvc: ServerService) {
      this.socket = this.serverSvc.getSocket();

      /* subscriptions to Subjects from the serverService */
      this.gameIsReady_subscription = this.serverSvc.gameIsReady.subscribe({
         next: (gameIsReady) => { this.gameIsReady = gameIsReady; }
      });
      this.playerId_subscription = this.serverSvc.playerIdChange.subscribe({
         next: (playerId) => this.playerId = playerId
      });
      this.whosTurn_subscription = this.serverSvc.whosTurn.subscribe({
         next: (turn) => this.whosTurn = turn
      });
      this.position_subscription = this.serverSvc.positionChange.subscribe({
         next: (position) => { this.position = position; this.positionChange(this.position); }
      });
      this.availableCharacters_subscription = this.serverSvc.availableCharacters.subscribe({
         next: (availChars) => { this.availableCharacters = availChars; this.charactersInGame = this.getCharactersInGame(availChars) }
      });
      this.gameState_subscription = this.serverSvc.gameState.subscribe({
         next: (gameState) => { this.gameState = gameState; }
      });
   }

   ngOnInit() {
   }

   ngAfterViewInit() {
      this.context = this.gameCanvas.nativeElement.getContext('2d');
      this.serverSvc.enteredGame(); // notify server of client entering game-menu to trigger initialization communications
   }

   beginGame() {
      this.serverSvc.startGame();
   }

   positionChange(position) {
      if (position === {} || !this.gameCanvas || !this.context) return;

      this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x, position.y, position.w, position.h);
   }

   move(direction: string) {
      this.serverSvc.move(direction);
   }

   endTurn() {
      this.serverSvc.endTurn();
   }

   getPlayerNum(playerId) {
      if(playerId === 'player0') {
         return 'Player 1'
      } else if(playerId === 'player1') {
         return 'Player 2'
      } else if(playerId === 'player2') {
         return 'Player 3'
      } else if(playerId === 'player3') {
         return 'Player 4'
      } else if(playerId === 'player4') {
         return 'Player 5'
      } else if(playerId === 'player5') {
         return 'Player 6'
      } else {
         return 'You don\'t belong here'
      }
   }

   getCharactersInGame(availChars) {
      return this.characterNames.filter( (x) => !availChars.includes(x) );
   }

   disconnect() {
      this.serverSvc.removeSocket();
   }

   ngOnDestroy() { //prevent memory leak when component destroyed
      this.gameIsReady_subscription.unsubscribe();
      this.playerId_subscription.unsubscribe();
      this.whosTurn_subscription.unsubscribe();
      this.position_subscription.unsubscribe();
      this.gameState_subscription.unsubscribe();

      this.serverSvc.removeSocket();
   }

}
