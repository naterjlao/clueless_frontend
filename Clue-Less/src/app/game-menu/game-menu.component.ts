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
   testGameState; // ONLY USED FOR TESTING - TODO: remove later

   gameIsReady = false; gameIsReady_subscription;
   playerId; playerId_subscription;
   whosTurn; whosTurn_subscription;
   position; position_subscription;
   gameState; gameState_subscription;

   showGameBoard = false; //temp variable for dev use

   constructor(private serverSvc: ServerService) {
      this.socket = this.serverSvc.getSocket();

      /* subscriptions to Subjects from the serverService */
      this.gameIsReady_subscription = this.serverSvc.gameIsReady.subscribe({
         next: (gameIsReady) => { console.log("game is ready"); console.log(gameIsReady); this.gameIsReady = gameIsReady }
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
      this.gameState_subscription = this.serverSvc.gameState.subscribe({
         next: (gameState) => { this.gameState = gameState; }
      });
   }

   ngOnInit() {
      this.testGameState = this.serverSvc.getTestGameState(); // ONLY USED FOR TESTING - TODO: remove later
      console.log(this.testGameState);
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

   ngOnDestroy() { //prevent memory leak when component destroyed
      this.gameIsReady_subscription.unsubscribe();
      this.playerId_subscription.unsubscribe();
      this.whosTurn_subscription.unsubscribe();
      this.position_subscription.unsubscribe();
      this.gameState_subscription.unsubscribe();

      this.serverSvc.removeSocket();
   }

}
